import { ChildProcess, spawn } from 'child_process';
import { Locking, Semaphore } from '../helpers/semaphore';
import { once } from 'events';
import { fileExistsSync, folderExistsSync } from '../utilities/filesystem.sync';
import { deleteFile, fileExists } from '../utilities/filesystem';
import { File } from '../services/file_service';
import process from 'process';
import logger from '../utilities/logger';

enum DeviceStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export class CameraDriver {
  private static RESOURCE = new Semaphore('camera', 1);
  private static FILE_INDEX: number = 1;
  private static STATUS: DeviceStatus = DeviceStatus.INACTIVE;
  private static FOLDER_PATH = File.captureDir();
  private static STREAM_PROCESS: ChildProcess | null;
  private static STREAM_LOCK: Locking | null;
  public static TEST_FILE_PATH = process.cwd() + '/test-captures/capture.jpg';
  private static DEBUG_LOGGING = true;

  private static COMMANDS = {
    status: 'gphoto2 --auto-detect',

    get capture() {
      return `gphoto2 --capture-image-and-download --filename ${CameraDriver.FOLDER_PATH}/capture-${CameraDriver.FILE_INDEX}.jpg`;
    },

    get stream() {
      return `gphoto2 --capture-movie --stdout`;
    },

    get capture_test() {
      return `gphoto2 --capture-image-and-download --filename ${CameraDriver.TEST_FILE_PATH}`;
    },
  };

  // <<< GETTER SETTER >>> //

  /**
   * Set the working directory of the driver
   *
   * Capture files will be written in the given path
   * @throws Error if file not exists
   */
  static set set_path(path: string) {
    if (!path.endsWith('/')) {
      throw new Error(`argument path must be a folder path (ends with '/')`);
    }
    if (!folderExistsSync(path))
      throw new Error(
        `Cannot set path because the folder path ${path} does not exist`
      );
    this.FOLDER_PATH = path;
  }

  /**
   * Reset the index for captures filename
   *
   * ! Only use this where resetting session, otherwise the next captures may replace existing ones
   */
  static reset_index() {
    if (this.DEBUG_LOGGING)
      logger.trace('[Camera Driver] resetting file index');
    this.FILE_INDEX = 1;
  }

  // <<< OPERATIONS >>> //

  /**
   * Attempt to read the camera device
   *
   * Returns true if the device is read by GPhoto2
   * @returns {Promise<boolean>}
   */
  static async status(): Promise<boolean> {
    const lock = await this.RESOURCE.acquire();

    const process = spawn('bash', ['-c', this.COMMANDS.status]);
    let output = '';
    let result = false;

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      this.STATUS = DeviceStatus.INACTIVE;
      lock.release();
      throw new Error(`Error on checking device status : ${data}`);
    });

    process.on('close', () => {
      const lines = output.split('\n');

      // This is a very serious technical debt. If the running machine auto updates Gphoto2, any major changes may change how they printout the message
      // Currently the only solution is by process stdouts
      const detected = lines.some((line) => line.trim().includes('usb:'));
      result = detected;
    });

    await once(process, 'close');
    lock.release();
    if (result) this.STATUS = DeviceStatus.ACTIVE;
    return result;
  }

  /**
   * Trigger the camera to capture photo
   *
   * @returns {Promise<string>} path of the capture file
   */
  static async capture() {
    if (!this.STATUS) {
      console.log('status undefined');
      return new Error(
        'Device status on driver is still undetermined, please call status() to ensure device availability'
      );
    }
    // checks if there is any residue (captures from previous session) exists
    try {
      const checkPath = `${this.FOLDER_PATH}capture-${CameraDriver.FILE_INDEX}.jpg`;
      if (await fileExists(checkPath)) await deleteFile(checkPath);
    } catch (error) {
      throw error;
    }

    const lock = await this.RESOURCE.acquire();

    const bash = spawn(
      'bash',
      [
        '-c',
        `gphoto2 --capture-image-and-download --filename capture-${this.FILE_INDEX}.jpg --force-overwrite`,
      ],
      {
        env: { ELECTRON_RUN_AS_NODE: '1' },
        uid: process.getuid(),
        gid: process.getgid(),
        cwd: File.captureDir(),
      }
    );

    bash.on('error', (error) => {
      lock.release();
      throw new Error(`Cannot trigger capture to camera: ${error}`);
    });

    bash.stderr.on('data', (data) => {
      lock.release();
      throw new Error(`Cannot trigger capture to camera: ${data.toString()}`);
    });

    await once(bash, 'close');
    lock.release();
    this.FILE_INDEX++;

    return Promise.resolve(
      this.FOLDER_PATH + `capture-${this.FILE_INDEX - 1}.jpg`
    );
  }

  /**
   * Starts video stream and return callback with stream of blob chunks
   */
  static async start_stream(sendFrame: (chunk: Buffer) => void) {
    if (!this.STATUS)
      throw new Error(
        'Device status on driver is still undetermined, please call status() to ensure device availability'
      );

    if (!this.STREAM_LOCK) this.STREAM_LOCK = await this.RESOURCE.acquire();

    this.STREAM_PROCESS = spawn('bash', ['-c', this.COMMANDS.stream], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.STREAM_PROCESS.stderr?.on('error', (chunk) => {
      throw new Error(`starting stream process error ${chunk}`);
    });
    this.STREAM_PROCESS.stdout?.on('error', (err) => {
      throw new Error(`starting stream process error ${err.message}`);
    });

    this.STREAM_PROCESS.stdout?.on('data', sendFrame);

    return;
  }

  /**
   * Stops video stream
   */
  static async stop_stream() {
    if (this.STREAM_PROCESS) {
      try {
        this.STREAM_PROCESS.stdout?.removeAllListeners();
        this.STREAM_PROCESS.stdout?.destroy();
        this.STREAM_PROCESS.kill('SIGTERM'); // Signal to "terminate"
        await once(this.STREAM_PROCESS, 'exit');
        this.STREAM_PROCESS.unref();

        // This is an important thing to let the camera procecss stream deactivation
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        this.STREAM_LOCK?.release();
        this.STREAM_LOCK = null;
        this.STREAM_PROCESS = null;
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   * Utilize for checking camera functions
   * This will run capture test, stream test
   */
  static async checkup() {
    if (!this.STATUS)
      return new Error(
        'Device status on driver is still undetermined, please call status() to ensure device availability'
      );
    let safe = true;

    const lock = await this.RESOURCE.acquire();
    const capture = spawn('bash', ['-c', this.COMMANDS.capture_test]);

    capture.stderr.on('error', (data) => {
      safe = false;
      lock.release();
      throw new Error(`Error on capture checkup: ${data}`);
    });

    capture.on('error', (error) => {
      lock.release();
      throw new Error(`Error on capture checkup: ${error}`);
    });

    await once(capture, 'close');

    try {
      let exist = fileExistsSync(this.TEST_FILE_PATH);
      if (!exist) {
        safe = false;
        lock.release();
        throw new Error(
          `Capture checkup result failed, no capture result found after test`
        );
      }
    } catch (error) {
      lock.release();
      throw new Error(`Error reading checkup capture image: ${error}`);
    }

    lock.release();
    if (safe) return;
    else throw new Error('Checkup failed');
  }
}
