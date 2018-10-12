<template>
  <q-modal ref="onvifInfoModal" v-model="openOnvifInfoModal" position="top" @close="onClosed" style="min-width: 380px;">
    <q-card>
      <q-card-title>
        Information for <strong><i>{{ name }}</i></strong>
        <q-card-separator></q-card-separator>
      </q-card-title>
      <q-card-main>
        <q-field label="Manufacturer">
          <q-input v-model="deviceInfo.Manufacturer" readonly />
      </q-field>
        <q-field label="Model">
          <q-input v-model="deviceInfo.Model" readonly />
      </q-field>
        <q-field label="Firmware Version">
          <q-input v-model="deviceInfo.FirmwareVersion" readonly />
      </q-field>
        <q-field label="Serial Number">
          <q-input v-model="deviceInfo.SerialNumber" readonly />
      </q-field>
      </q-card-main>
    </q-card>
    <div class="pull-right" style="padding: 8px;">
      <q-btn @click="doClose()">Close</q-btn>
    </div>
  </q-modal>
</template>

<script>
  import {
    QBtn,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QField,
    QIcon,
    QInput,
    QModal,
    QSelect
  } from 'quasar'

  export default {

    components: {
      QBtn,
      QCard,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QField,
      QIcon,
      QInput,
      QModal,
      QSelect
    },

    props: {
      name: {
        type: String,
        required: true
      },
      deviceInfo: {
        type: Object,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      }
    },

    data () {
      return {
        openOnvifInfoModal: false
      }
    },

    mounted: function () {
      this.openOnvifInfoModal = this.visible
    },

    beforeDestroy: function () {

    },

    methods: {
      doClose: function () {
        // console.log('onvifInfoModal doClose')
        this.openOnvifInfoModal = false
        // console.log(this.$refs.onvifInfoModal)
        this.$refs.onvifInfoModal.close()
      },

      onClosed: function () {
        // console.log('onvifInfoModal - onClosed')
        this.$emit('closed')
      }
    },

    computed: {
    },

    watch: {
      visible: function (value) {
        // console.log('OnvifInfoModal - visible', value)
        this.openOnvifInfoModal = value
      },
      openOnvifInfoModal: function (value) {
        // console.log('openOnvifInfoModal changed', value)
        this.openOnvifInfoModal = value
      }
    }
  }
</script>

<style>

</style>
