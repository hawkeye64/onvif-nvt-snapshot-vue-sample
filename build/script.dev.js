process.env.NODE_ENV = 'development'

require('colors')

var
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  env = require('./env-utils'),
  config = require('../config'),
  opn = require('opn'),
  proxyMiddleware = require('http-proxy-middleware'),
  webpackConfig = require('./webpack.dev.conf'),
  app = express(),
  port = process.env.PORT || config.dev.port,
  uri = 'http://localhost:' + port,
  OnvifManager = require('onvif-nvt'),
  cameras = [],
  connectedCameras = {}

console.log(' Starting dev server with "' + (process.argv[2] || env.platform.theme).bold + '" theme...')
console.log(' Will listen at ' + uri.bold)
if (config.dev.openBrowser) {
  console.log(' Browser will open when build is ready.\n')
}

var compiler = webpack(webpackConfig)

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: function () { }
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy requests like API. See /config/index.js -> dev.proxyTable
// https://github.com/chimurai/http-proxy-middleware
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticsPath = path.posix.join(webpackConfig.output.publicPath, 'statics/')
app.use(staticsPath, express.static('./src/statics'))

// try to serve Cordova statics for Play App
app.use(express.static(env.platform.cordovaAssets))

server = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // open browser if set so in /config/index.js
  if (config.dev.openBrowser) {
    devMiddleware.waitUntilValid(function () {
      opn(uri)
    })
  }
})

const io = require('socket.io').listen(server)

io.on('connect', (client) => {
  console.log('client connected')

  client.on('error', () => {
    console.log('socket.io error')
  })

  client.on('disconnect', (client) => {
    console.log('client disconnected')
  })

  client.on('findOnvifCameras', () => {
    OnvifManager.add('discovery')
    OnvifManager.discovery.startProbe()
      .then(cameras => {
        client.emit('findOnvifCameras:result', cameras)
      })
      .catch(error => {
        client.emit('findOnvifCameras:error', error.message)
      })
  })

  client.on('connectCamera', (address, username, password) => {
    console.log('connectCamera', address, username, password)
    OnvifManager.connect(address, null, username, password)
      .then(results => {
        let camera = results
        // we will want the snapshot component
        camera.add('snapshot')
        connectedCameras[address] = camera
        client.emit('connectCamera:result', camera)
      })
      .catch(error => {
        client.emit('connectCamera:error', error.message)
      })
  })

  client.on('snapshoturi', (hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      camera.media.getSnapshotUri()
        .then(results => {
          client.emit('snapshoturi:result', results)
          resolve(results)
        })
        .catch(error => {
          console.error('snapshoturi error', error.message)
          client.emit('snapshoturi:error', error.message)
          resolve(error)
        })
    }
  })

  client.on('presets', (hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.getPresets()
          .then(results => {
            let response = results.data.GetPresetsResponse.Preset
            // make sure result is an array
            response = [].concat(response)
            let presets = {}
            // Put presets into something presentable
            // some cameras give a nice list. Other cameras give you 
            // an array with missing presets (so strip the empty ones).
            // I suppose they do this so you can put a preset into 
            // a particular location.
            response.forEach(preset => {
              if ('Name' in preset && '$' in preset && 'token' in preset.$) {
                presets[preset.Name] = preset.$.token;
              }
            })

            client.emit('presets:result', presets)
          })
          .catch(error => {
            console.error('presets error', error.message)
            client.emit('presets:error', error.message)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('presets error', message)
        client.emit('presets:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('presets error', message)
      client.emit('presets:error', message)
    }
  })

  client.on('setPreset', (hostname, presetName) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.setPreset(null, null, presetName)
          .then(results => {
            client.emit('setPreset:result', results)
          })
          .catch(error => {
            console.error('setPreset error', error.message)
            client.emit('setPreset:error', error.message)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('setPreset error', message)
        client.emit('setPreset:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('addPreset error', message)
      client.emit('addPreset:error', message)
    }
  })

  client.on('removePreset', (hostname, token) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.removePreset(null, token)
          .then(results => {
            client.emit('removePreset:result', results)
          })
          .catch(error => {
            console.error('removePreset error', error.message)
            client.emit('removePreset:error', error.message)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('removePreset error', message)
        client.emit('removePreset:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('removePreset error', message)
      client.emit('removePreset:error', message)
    }
  })

  client.on('gotoPreset', (hostname, token) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.gotoPreset(null, token)
          .then(results => {
            client.emit('gotoPreset:result', results)
          })
          .catch(error => {
            console.error('gotoPreset error', error.message)
            client.emit('gotoPreset:error', error.message)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('gotoPreset error', message)
        client.emit('gotoPreset:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('gotoPreset error', message)
      client.emit('gotoPreset:error', message)
    }
  })

  client.on('snapshot', (hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      camera.snapshot.getSnapshot()
        .then(results => {
          const prefix = 'data:' + results.mimeType + ';base64,'
          const base64Image = Buffer.from(results.image, 'binary').toString('base64')
          const data = {
            image: prefix + base64Image,
            mimeType: results.mimeType
          }
          client.emit('snapshot:result', data)
        })
        .catch(error => {
          console.error('snapshot error', error.message)
          client.emit('snapshot:error', error.message)
        })
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('snapshot error', message)
      client.emit('snapshot:error', message)
    }
  })

  client.on('moveContinuous', (params, hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        let velocity = {}
        velocity.x = params.x || 0
        velocity.y = params.y || 0
        velocity.zoom = params.zoom || 0

        camera.ptz.continuousMove(null, velocity)
          .then(results => {
            client.emit('continuousMove:result', results)
          })
          .catch(error => {
            console.error('continuousMove error', error.message)
            client.emit('continuousMove:error', error)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('moveContinuous error', message)
        client.emit('moveContinuous:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('moveContinuous error', message)
      client.emit('moveContinuous:error', message)
    }
  })

  client.on('moveStop', (params, hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.stop(null, true, true)
          .then(results => {
            client.emit('moveStop:result', results)
          })
          .catch(error => {
            console.error('moveStop error', error.message)
            client.emit('moveStop:error', error)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('moveStop error', message)
        client.emit('moveStop:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('moveContinuous error', message)
      client.emit('moveContinuous:error', message)
    }
  })

  client.on('gotoHomePosition', (hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.gotoHomePosition()
          .then(results => {
            client.emit('gotoHomePosition:result', results)
          })
          .catch(error => {
            console.error('gotoHomePosition error', error.message)
            client.emit('gotoHomePosition:error', error)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('gotoHomePosition error', message)
        client.emit('gotoHomePosition:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('gotoHomePosition error', message)
      client.emit('gotoHomePosition:error', message)
    }
  })

  client.on('setHomePosition', (hostname) => {
    if (hostname in connectedCameras) {
      let camera = connectedCameras[hostname]
      if (camera.ptz) {
        camera.ptz.setHomePosition()
          .then(results => {
            client.emit('setHomePosition:result', results)
          })
          .catch(error => {
            console.error('setHomePosition error', error.message)
            client.emit('setHomePosition:error', error)
          })
      }
      else {
        let message = new Error(`${hostname}' is not a PTZ device`)
        console.error('setHomePosition error', message)
        client.emit('setHomePosition:error', message)
      }
    }
    else {
      let message = new Error(`Host '${hostname}' not found`)
      console.error('setHomePosition error', message)
      client.emit('setHomePosition:error', message)
    }
  })
})

module.exports = server
