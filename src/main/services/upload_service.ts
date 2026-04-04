import axios from 'axios';
import path from 'path';

import { Worker } from 'worker_threads';

interface Video {
  id: string;
  url: string;
}
interface Image {
  id: string;
  url: string;
}

interface Page {
  id: string;
  images: Image[];
  video: Video;
}

class UploadService {
  private image_count: number;
  private page: Page | null;
  private API = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Token: process.env.BOOTH_TOKEN,
    },
  });

  constructor(image_count: number) {
    this.image_count = image_count;
    this.page = null;
  }

  /**
   * Request a page to backend service
   * @param {number} quantity - number of space to preserve for user to download (canvas + pictures, exclude video)
   */
  private async requestPage(quantity: number) {
    return await this.API.post('pages', {
      ImageCount: quantity,
    })
      .then((response) => {
        this.page = response.data.data as Page;
      })
      .catch((error) => {
        throw error;
      });
  }

  public async startUpload(imgSrc: string[] = [], videoSrc: string) {
    await this.requestPage(this.image_count);

    console.log(this.page);

    let results: any[] = [];
    let completed = 0;

    imgSrc.forEach((file, index) => {
      let uploadUrl = this.page?.images[index].url;
      const worker = new Worker(
        path.join(__dirname, '../workers/uploadWorker.js'),
        {
          workerData: {
            filePath: file,
            uploadUrl: uploadUrl,
            type: 'image',
          },
        }
      );

      worker.on('message', (message) => {
        results[index] = { file, ...message };
        completed++;

        if (completed === imgSrc.length)
          return new Promise((resolve) => resolve(results));
      });

      worker.on('error', (err) => {
        results[index] = { file, status: 'error', message: err.message };
        completed++;
        if (completed === imgSrc.length)
          return new Promise((resolve) => resolve(results));
      });

      worker.on('exit', (code) => {
        if (code !== 0) console.warn('Upload worker exited with code', code);
      });
    });

    const worker = new Worker(
      path.join(__dirname, '../workers/uploadWorker.js'),
      {
        workerData: {
          filePath: videoSrc,
          uploadUrl: this.page?.video.url,
          type: 'video',
        },
      }
    );

    worker.on('message', (message) => {
      results[results.length + 1] = { videoSrc, ...message };
      completed++;

      if (completed === videoSrc.length)
        return new Promise((resolve) => resolve(results));
    });

    worker.on('error', (err) => {
      console.error(`Uploading error in worker`, err);

      results[results.length + 1] = {
        videoSrc,
        status: 'error',
        message: err.message,
      };
      completed++;
      if (completed === videoSrc.length)
        return new Promise((resolve) => resolve(results));
    });

    worker.on('exit', (code) => {
      if (code !== 0) console.warn('Upload worker exited with code', code);
    });
  }

  /**
   * Return url of a publically hosted page for download
   */
  public getUrl() {
    return `${new String(process.env.API_URL).replace("/api", `/views/${this.page?.id}`)}`;

  }
}

export default UploadService;
