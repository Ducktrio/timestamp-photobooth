# Setups before running

Lift kernel apparmor restriction for sandboxing. This is very important especially when the machine is one a fresh session (after reboot or restart). This solve problem of sandboxing. Please note that this action can put your machine into an invulnerable state of security. We doing this assuming your machine will run as a kiosk.

```bash
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

Then run this script, it will disable Volume Monitor that blocking your camera access:

```bash
sudo chmod -x /usr/lib/gvfs/gvfs-gphoto2-volume-monitor
```

Our program requires an identification number to run sync with our backend server. An environment variable file is required under the file name '.timestamp.env'.

You must create a file named ".timestamp.env" in one of this directory:

```
$HOME/.timestamp.env
or
/opt/timestamp/.env
```

The safest one is using the first option. $HOME is supposed to be your home directory. If you are unfamiliar with Linux, you full path of home directory will look something like this:

```
/home/<YOUR_USER>/
```

where \<YOUR_USER\> is your PC user name. This is the directory where Downloads and Desktop, etc. is placed. You can run below script if you are unsure what you're doing:

```bash
cd ~
touch .timestamp.env
```

This will create the variable file in your home directory.

After you create you file (you can confirm by looking it with you graphical File Explorer), you can copy below into your ".timestamp.env":

```
BOOTH_TOKEN=<YOUR_BOOTH_ID>
BORDER_COLOR=<COLOR_IN_HEX>
```

Replace \<YOUR_BOOTH_ID\> with you booth identification number, and replace \<COLOR_IN_HEX\> as your color of choice in hexadecimal format (e.g. `#ffffff`, must be a valid format). The border color will be used as the color for creating guideline when taking pictures.

If you fail to setup you environment variables, the program will throw error when opened.

# Test your camera first

Run this bash script in terminal to read your camera

```bash
gphoto2 --auto-detect
```

You should see list of camera models if there's any that can be read. If you don't see any, please resolve issue regarding gphoto2.

If your camera model, this means your camera is usable. But you still need to check is functionality.

Run this bash script, it will test to capture file and download it to your current directory. If you unfamiliar with bash, proceed this first:

```bash
cd ~ && cd Downloads
```

What it does is changing your working directory to Downloads folder at HOME. This is equivalent to opening your File Explorer program and open Downloads folder in your home directory.

Then run this script:

```bash
gphoto2 --capture-image-and-download --filename ./test.jpg
```

This should trigger capture on your camera and save it in your Downloads folder. If everything runs smoothly, your camera should trigger and the capture file is in your Downloads folder under the name "test.jpg".

Next, we test for video stream:

```bash
gphoto2 --capture-movie --stdout
```

If everything run smoothly, your terminal should print out this continuous random characters, even characters that aren't recognize. This means you camera can send us video stream from its viewfinder.

## Troubleshoot

If you get error like this:

```bash
*** USB cannot be claimed ***
```

or similar, the camera may be already being used in other program. Try to close any other program that use it. A common program that uses it especially in GNOME desktop are Volume Monitor. Please run the bash script at the setup section.

If you face any problem regarding with Gphoto2, we cannot help any further but to start from above.
