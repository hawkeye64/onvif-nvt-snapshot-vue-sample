<template>
  <q-modal ref="onvifRemovePresetModal" v-model="openOnvifRemovePresetModal" position="top" @close="onClosed">
    <q-card>
      <q-card-title>
        Remove Preset for '{{ name }}'
        <q-card-separator></q-card-separator>
      </q-card-title>
      <q-card-main>

        <q-select
          v-model="selectedPreset"
          :options="getOptions()"
          float-label="PTZ Presets"
          chips
          />

      </q-card-main>
    </q-card>
    <div class="pull-right" style="padding: 8px;">
      <q-btn @click="onCancel()">Cancel</q-btn>
      <q-btn :disabled="isDisabled" @click="onRemove()">Remove</q-btn>
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
        openOnvifRemovePresetModal: false,
        selectedPreset: ''
      }
    },

    mounted: function () {
      this.openOnvifRemovePresetModal = this.visible
    },

    beforeDestroy: function () {

    },

    methods: {
      doClose: function () {
        console.log('onvifRemovePresetModal doClose')
        this.openOnvifRemovePresetModal = false
        this.$refs.onvifRemovePresetModal.close()
      },

      // called when modal is closed
      onClosed: function () {
        console.log('onvifRemovePresetModal onClosed')
        this.$emit('closed')
      },

      onCancel: function () {
        this.doClose()
      },

      onRemove: function () {
        console.log('Selected Preset:', this.selectedPreset)
        this.$emit('removePreset', this.selectedPreset)
      },

      getOptions: function () {
        let options = []
        for (let key in this.presets) {
          let option = {
            label: key,
            value: this.presets[key]
          }
          options.push(option)
        }
        return options
      }
    },

    computed: {
      isDisabled: function () {
        return String(this.selectedPreset).length === 0
      }
    },

    watch: {
      visible: function (value) {
        console.log('onvifRemovePresetModal visible changed', value)
        this.openOnvifRemovePresetModal = value
      }
    }
  }
</script>

<style>

</style>
