# onvif-nvt-snapshot-vue-sample

Welcome to the [onvif-nvt](https://github.com/hawkeye64/onvif-nvt) sample project for `snapshots` using [Vue 2.5](https://vuejs.org/) and [Quasar 0.14.7](http://quasar-framework.org/)

You can find document for the `onvif-nvt` package [here](https://hawkeye64.github.io/onvif-nvt/)

This is a good project for anyone interested in programming ONVIF-compliant cameras. However, in an unconventional way, the server code was written into the `build/script.dev.js` because it was *quick and dirty*. The application uses sockets to communicate ONVIF commands with the client.

This sample application will not run properly if you do not any ONVIF-compliant cameras on your network. If you don't know if you have an ONVIF-compliant camera, you can verify it [here](https://www.onvif.org/conformant-products/). Occassionally, some cameras need a firmware upgrade to support ONVIF (depending on age), in which case, refer to your camera manufacturer's website and support information for your particular camera.

## Installation and Running
To install, run `npm install`.
If you have an ONVIF-compliant camera, you can start the app with `npm run dev`. A web browser at port `8080` will automatically be started.

## Operations Supported
1. Discovery
2. Device Information
3. Snapshot
4. Pan / Tilt / Zoom (PTZ)
5. GotoHomePosition / SetHomePosition
6. GotoPreset / SetPreset / RemovePreset

