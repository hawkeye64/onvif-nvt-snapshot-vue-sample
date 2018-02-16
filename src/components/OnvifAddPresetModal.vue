<template>
  <q-modal ref="onvifAddPresetModal" v-model="openOnvifAddPresetModal" position="top" @close="onClosed">
    <q-card>
      <q-card-title>
        Add Preset for '{{ name }}'
        <q-card-separator></q-card-separator>
      </q-card-title>
      <q-card-main>

        <div class="row justify-center">
          <div class="col">
            <q-field :error="presetHasError" :error-label="presetErrorLabel">
              <q-input v-model="presetName" float-label="Preset Name" focus />
            </q-field>
          </div>
        </div>

      </q-card-main>
    </q-card>
    <div class="pull-right" style="padding: 8px;">
      <q-btn @click="onCancel()">Cancel</q-btn>
      <q-btn :disabled="isDisabled" @click="onSave()">Save</q-btn>
    </div>
  </q-modal>
</template>

<script>
  const _ = require('lodash')
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
      presets: {
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
        openOnvifAddPresetModal: false,
        presetHasError: false,
        presetErrorLabel: '',
        presetName: ''
      }
    },

    mounted: function () {
      this.openOnvifAddPresetModal = this.visible
    },

    beforeDestroy: function () {

    },

    methods: {
      doClose: function () {
        console.log('onvifAddPresetModal doClose')
        this.openOnvifAddPresetModal = false
        this.$refs.onvifAddPresetModal.close()
      },

      // called when modal is closed
      onClosed: function () {
        console.log('onvifAddPresetModal onClosed')
        this.$emit('closed')
      },

      onCancel: function () {
        this.doClose()
      },

      onSave: function () {
        // let self = this

        // trim the preset name of unwanted surrounding whitespace
        this.presetName = _.trim(this.presetName)

        if (this.presetName.length === 0) {
          this.presetErrorLabel = 'Preset name cannot be empty'
          this.presetHasError = true
          return
        }
        // check if the camera already has a preset with this name
        for (let key in this.presets) {
          console.log('Preset Key:', key)
          if (key === this.presetName) {
            console.log('Key Found!', this.presetName)
            this.presetErrorLabel = 'Preset name already exists'
            this.presetHasError = true
            return
          }
        }
        // the above code passed, save the preset
        this.$emit('addPreset', this.presetName)
      }
    },

    computed: {
      isDisabled: function () {
        return (this.presetName.length <= 0)
      }
    },

    watch: {
      visible: function (value) {
        console.log('onvifAddPresetModal visible changed', value)
        this.openOnvifAddPresetModal = value
      },
      presetName: function (/* value */) {
        this.presetErrorLabel = ''
        this.presetHasError = false
      }
    }
  }
</script>

<style>

</style>
