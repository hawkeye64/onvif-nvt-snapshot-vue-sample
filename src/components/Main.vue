<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >

    <div class="row justify-center">
      <q-card v-show="!maximized" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 relative-position" style="min-height: 300px;">
        <q-card-title class="center">
          <img src="statics/onvif.png" height="24px">
          <p>{{ getSelectionTitle() }}</p>
          <q-card-separator></q-card-separator>
        </q-card-title>
        <q-card-main>

          <q-transition appear enter="fadeIn" leave="fadeOut" >

            <div class="row justify-center" v-if="cameras !== null && cameras.length > 0">
              <div class="col">

                <q-select v-model="selectedHost" :options="selectOptions" float-label="Select Camera" :disabled="isCameraConnected" />
                <q-input v-model="username" float-label="User Name" :disabled="isCameraConnected" />
                <q-input v-model="userpass" type="password" float-label="Password" :disabled="isCameraConnected" />

                <q-btn v-if="!isCameraConnected" color="primary" @click="onConnectSelected" class="pull-right" :disabled="isConnectButtonDisabled()">
                  Connect
                </q-btn>
                <q-btn v-if="isCameraConnected" color="primary" @click="onDisconnect" class="pull-right" :disabled="isConnectButtonDisabled()">
                  Disconnect
                </q-btn>

              </div>
            </div>

          </q-transition>

          <q-inner-loading :visible="cameras === null">
            <q-spinner-gears size="50px" color="grey-6"></q-spinner-gears>
          </q-inner-loading>

        </q-card-main>
        <div class="row justify-center" v-if="cameras !== null && cameras.length === 0" style="padding-top: 15px;">
          <p class="red bg-warning" style="color: red; padding-left: 10px; padding-right: 10px;">No ONVIF-compliant cameras found!</p>
          <q-btn color="primary" @click="onRestart" class="pull-right">
            Restart
          </q-btn>
        </div>
      </q-card>
      <div v-if="snapshot && snapshot.image">
        <div id="connectedDevice" ref="connectedDevice" class="col-12 relative-position border">
          <onvif-window-caption :camera-name="deviceName" :maximized="maximized" :minimized="minimized" :hasPtz="hasPtz" :presets="presets" :deviceInfo="deviceInfo" @addPreset="onAddPresetModal" @removePreset="onRemovePresetModal" @deviceInfo="onDeviceInfoModal" @setHomePosition="setHomePosition" @gotoPreset="onGotoPreset" @minimize="onMinimize" @maximize="onMaximize" @restore="onRestore" @close="onClose"></onvif-window-caption>
          <q-slide-transition>
            <onvif-window v-show="!minimized" :snapshot="snapshot.image" :maximized="maximized" :hasPtz="hasPtz" :canPanTilt="canPanTilt"></onvif-window>
          </q-slide-transition>
        </div>
      </div>
    </div>

    <onvif-device-info-modal :name="deviceName" :deviceInfo="deviceInfo" :visible="onvifDeviceInfoModalVisible" @closed="onDeviceInfoModalClosed"/>
    <onvif-add-preset-modal :name="deviceName" :presets="presets" :visible="onvifAddPresetModalVisible" @closed="onAddPresetModalClosed" @addPreset="onAddPreset" />
    <onvif-remove-preset-modal :name="deviceName" :presets="presets" :visible="onvifRemovePresetModalVisible" @closed="onRemovePresetModalClosed" @removePreset="onRemovePreset" />

  </q-layout>
</template>

<script>
import io from 'socket.io-client'
import {
  AppFullscreen,
  QBtn,
  QCard,
  QCardMain,
  QCardSeparator,
  QCardTitle,
  QIcon,
  QInput,
  QInnerLoading,
  QLayout,
  QModal,
  QSelect,
  QSpinnerGears,
  QSlideTransition,
  QTransition,
  Toast
} from 'quasar'

export default {
  name: 'index',
  components: {
    QBtn,
    QCard,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QIcon,
    QInput,
    QInnerLoading,
    QLayout,
    QModal,
    QSelect,
    QSpinnerGears,
    QSlideTransition,
    QTransition,
    'onvif-window': require('./OnvifWindow').default,
    'onvif-window-caption': require('./OnvifWindowCaption').default,
    'onvif-add-preset-modal': require('./OnvifAddPresetModal').default,
    'onvif-remove-preset-modal': require('./OnvifRemovePresetModal').default,
    'onvif-device-info-modal': require('./OnvifDeviceInfoModal').default
  },

  data () {
    return {
      socket: null,
      cameras: null,
      selectedCamera: null,
      selectedHost: -1,
      isCameraConnected: false,
      deviceName: 'Unknown Camera',
      deviceInfo: {},
      presets: {},
      hasPtz: true,
      canPanTilt: true,
      maximized: false,
      minimized: false,
      snapshotUri: '',
      username: '',
      userpass: '',
      showSpinner: true,
      snapshot: null,
      onvifDeviceInfoModalVisible: false,
      onvifAddPresetModalVisible: false,
      onvifRemovePresetModalVisible: false
    }
  },

  mounted: function () {
    this.$q.events.$on('device:snapshot', this.getSnapshot)
    this.$q.events.$on('moveContinuous', this.moveContinuous)
    this.$q.events.$on('moveStop', this.moveStop)
    this.$q.events.$on('gotoHomePosition', this.gotoHomePosition)

    this.socket = io('http://localhost:8080')
    const self = this

    this.socket.on('connect', () => {
      console.log('Connected from server with ID:', self.socket.id)
      self.findOnvifCameras()
    })

    this.socket.on('error', () => {
      console.log('test')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    this.socket.on('findOnvifCameras:result', (results) => {
      console.log('Onvif Cameras found', results)
      self.cameras = results
    })

    this.socket.on('findOnvifCameras:error', (results) => {
      console.error('Onvif Cameras error', results)
      self.showError(results)
    })

    this.socket.on('connectCamera:result', (results) => {
      console.log('Onvif Camera connected', results)
      self.showSpinner = false
      self.selectedCamera = results
      self.deviceInfo = self.selectedCamera.deviceInformation
      self.deviceName = self.selectedCamera.deviceInformation.Name
      self.hasPtz = self.selectedCamera.ptz !== null
      self.isCameraConnected = true
      self.$q.events.$emit('device:snapshot')
      this.socket.emit('presets', this.selectedCamera.address)
    })

    this.socket.on('connectCamera:error', (results) => {
      console.log('Onvif Camera connection error', results)
      self.showSpinner = false
      self.showError(results)
    })

    this.socket.on('snapshot:result', (results) => {
      // console.log('Onvif Camera snapshot', results)
      if (self.isCameraConnected) {
        self.snapshot = results
        // get another snapshot
        self.$q.events.$emit('device:snapshot')
      }
    })

    this.socket.on('snapshot:error', (results) => {
      console.error('Onvif Camera snapshot error', results)
      self.showError(results)
      if (self.isCameraConnected) {
        // don't stop because we got one error, try to carry on
        self.$q.events.$emit('device:snapshot')
      }
    })

    this.socket.on('presets:result', (results) => {
      // console.log('Onvif Camera presets', results)
      if (self.isCameraConnected) {
        self.presets = results
      }
    })

    this.socket.on('presets:error', (results) => {
      console.error('Onvif Camera presets error', results)
      self.showError(results)
    })

    this.socket.on('setPreset:result', (results) => {
      // console.log('Onvif Camera setPreset', results)
      if (self.isCameraConnected) {
        // get updated presets
        this.socket.emit('presets', this.selectedCamera.address)
        this.onvifAddPresetModalVisible = false
      }
    })

    this.socket.on('setPreset:error', (results) => {
      console.error('Onvif Camera setPreset error', results)
      self.showError(results)
    })

    this.socket.on('removePreset:result', (results) => {
      // console.log('Onvif Camera removePreset', results)
      if (self.isCameraConnected) {
        // get updated presets
        this.socket.emit('presets', this.selectedCamera.address)
        this.onvifRemovePresetModalVisible = false
      }
    })

    this.socket.on('removePreset:error', (results) => {
      console.error('Onvif Camera removePreset error', results)
      self.showError(results)
    })

    this.socket.on('moveContinuous:result', (results) => {
      // console.log('Onvif Camera moveContinuous', results)
      if (self.isCameraConnected) {
        // do nothing
      }
    })

    this.socket.on('moveContinuous:error', (results) => {
      console.error('Onvif Camera presets error', results)
      self.showError(results)
    })

    this.socket.on('stop:result', (results) => {
      // console.log('Onvif Camera stop', results)
      if (self.isCameraConnected) {
        // do nothing
      }
    })

    this.socket.on('stop:error', (results) => {
      console.error('Onvif Camera stop error', results)
      self.showError(results)
    })

    this.socket.on('setHomePosition:result', (results) => {
      // console.log('Onvif Camera setHomePosition', results)
      let self = this
      if (self.isCameraConnected) {
        Toast.create.positive({
          html: `The Home Position for ${self.deviceName} has been updated`,
          icon: 'info outline',
          timeout: 3000
        })
      }
    })

    this.socket.on('setHomePosition:error', (results) => {
      console.error('Onvif Camera setHomePosition error', results)
      self.showError(results)
    })
  },

  watch: {
  },

  computed: {
    showModal: function () {
      return this.camera === null
    },

    selectOptions: function () {
      let options = []
      if (this.cameras) {
        for (let i = 0; i < this.cameras.length; ++i) {
          let option = {}
          if ('name' in this.cameras[i]) {
            option.label = this.cameras[i].address + ' (' + this.cameras[i].name + ')'
          }
          else {
            option.label = this.cameras[i].address
          }
          option.value = i
          options.push(option)
        }
      }
      return options
    }
  },

  methods: {
    getSelectionTitle: function () {
      if (this.cameras) {
        return 'Select an ONVIF Camera'
      }
      else {
        return 'Locating ONVIF Cameras'
      }
    },

    showError: function (message) {
      Toast.create.negative({
        html: message,
        icon: 'error',
        timeout: 2500
      })
    },

    findOnvifCameras: function () {
      this.socket.emit('findOnvifCameras')
    },

    onConnectSelected: function () {
      console.log('onConnectSelected clicked')
      let address = this.cameras[this.selectedHost].address
      this.socket.emit('connectCamera', address, this.username, this.userpass)
      this.showSpinner = true
    },

    onDisconnect: function () {
      this.isCameraConnected = false
      this.selectedCamera = null
      this.deviceName = 'Unknown Camera'
      this.deviceInfo = {}
      this.presets = {}
      this.snapshot = null
      this.snapshotUri = ''
      this.hasPtz = false
      this.canPanTilt = false
    },

    onRestart: function () {
      this.onDisconnect()
      this.cameras = null
      this.findOnvifCameras()
    },

    isConnectButtonDisabled: function () {
      if (this.selectedHost === -1) {
        return true
      }
      if (this.username === '') {
        return true
      }
      if (this.userpass === '') {
        return true
      }
      return false
    },

    parseScopes: function () {
      let scopes = this.scopes
      if (scopes.length === 0) {
        return
      }
      // use the scopes to get at the device name
      scopes.forEach(scope => {
        console.log(scope)
        let self = this
        let scopeItem = scope.scopeItem
        if (scopeItem.indexOf('onvif://www.onvif.org/name/') === 0) {
          self.deviceName = scopeItem.split('/').pop()
          self.deviceName = self.deviceName.replace(/_/g, ' ')
        }
      })
    },

    getSnapshot: function () {
      this.socket.emit('snapshot', this.selectedCamera.address)
    },

    moveContinuous: function (params = {}) {
      this.socket.emit('moveContinuous', params, this.selectedCamera.address)
    },

    moveStop: function (params = {}) {
      this.socket.emit('moveStop', params, this.selectedCamera.address)
    },

    gotoHomePosition: function () {
      this.socket.emit('gotoHomePosition', this.selectedCamera.address)
    },

    setHomePosition: function () {
      this.socket.emit('setHomePosition', this.selectedCamera.address)
    },

    onDeviceInfoModal: function () {
      this.onvifDeviceInfoModalVisible = true
    },

    onDeviceInfoModalClosed: function () {
      console.log('onDeviceInfoModalClosed')
      this.onvifDeviceInfoModalVisible = false
    },

    onAddPresetModal: function (item) {
      this.itemData = item
      this.onvifAddPresetModalVisible = true
    },

    onAddPresetModalClosed: function () {
      // console.log('onAddPresetModalClosed')
      this.onvifAddPresetModalVisible = false
    },

    onRemovePresetModal: function () {
      this.onvifRemovePresetModalVisible = true
    },

    onRemovePresetModalClosed: function () {
      // console.log('onRemovePresetModalClosed')
      this.onvifRemovePresetModalVisible = false
    },

    onAddPreset: function (presetName) {
      this.socket.emit('setPreset', this.selectedCamera.address, presetName)
    },

    onRemovePreset: function (token) {
      this.socket.emit('removePreset', this.selectedCamera.address, token)
    },

    onGotoPreset: function (token) {
      this.socket.emit('gotoPreset', this.selectedCamera.address, token)
    },

    onMinimize: function () {
      this.minimized = true
    },

    onMaximize: function () {
      this.maximized = true
      AppFullscreen.request()
    },

    onRestore: function () {
      this.minimized = false
      this.maximized = false
      if (AppFullscreen.isActive()) {
        AppFullscreen.exit()
      }
    },

    onClose: function () {
      this.onDisconnect()
    }
  },

  beforeDestroy: function () {
    this.$q.events.$off('device:snapshot')
    this.$q.events.$off('moveContinuous')
    this.$q.events.$off('moveStop')
    this.$q.events.$off('gotoHomePosition')
  }
}
</script>

<style scoped>
.border {
  border-width: 1px;
  border-color: silver;
  border-style: solid;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin: 7px;
}

.center {
  line-height: 40px;
  height: 40px;
  text-align: center;
}

.center p {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
}
</style>
