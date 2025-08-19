# Introduction

Timestamp photobooth is an flexible, manageable and easy to use photobooth software. It is a ready to use kiosk app running in Ubuntu-based machines. It is designed to be used in events like weddings, parties, conferences, etc. It allows users to take photos, print them and share them by QR scan to download from a hosted page.

This repo maintain the software of the photo booth app. Developed with Electron, enable us to distribute as AppImage executable ready to run as desktop app. The whole system of Timestamp is supported by a backend server and an admin panel, maintained in different repo. To make this work, the app must be configured with the server URL. The app will connect to the backend server to upload photos and retrieve settings.

# Features

Features that timestamp provide limited to the whole function with backend and admin panel:

- Multiple booth profile managed from admin
- Manage theme and frames from admin
- Customize color theme
- Share photos by QR scan, link to a hosted page
- Stop-motion video, records frames throughout capturing session.
- Add and customize photo filters from admin.

# Platform and Dependencies

Timestamp Photobooth are consists of the photobooth app, web-based admin panel, and a backend server. This table provide information about the desktop app:

| Component                                    | Versions               | Description                                                                         |
| -------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| Ubuntu                                       | Tested on 24.04.02 LTS | For running the kiosk app                                                           |
| [gphoto2](https://github.com/gphoto/gphoto2) | 2.5.32                 | Open-source program for controlling DSLR based on its open source library libgphoto |

The current release only supports Ubuntu or any Debian distro that supports running AppImage.

# Setup and Running

Refer to [this setup markdown file](/SETUP.md) for detailed instructions on how to set up the Timestamp Photobooth app, including installation of dependencies, configuration, and running the app.

# Post Notes

This project is mainly a project work for our client. We did not plan to make this an open contribution project, but we did make it open source and allow everyone to use it under our license and the clients approval. We may wish to make this project open for contribution in the future, but we are not sure yet. If you want to contribute, please contact us first.
