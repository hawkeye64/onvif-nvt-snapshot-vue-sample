<template>
  <div class="row justify-between caption no-wrap">
    <div class="row inline widgets no-wrap">
      <!-- <span v-show="videoItem.type === 'onvif'" class="caption-control-item faa-parent animated-hover relative-position" @click="onActivate">
        <q-tooltip anchor="bottom middle" self="top middle">Activate</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class='fa fa-dot-circle-o' />
        </span>
      </span> -->
      <span class="caption-control-item faa-parent animated-hover relative-position" @click="onInfo">
        <q-tooltip anchor="bottom middle" self="top middle">Info</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-question" />
        </span>
      </span>

      <span v-show="hasPtz" class="caption-control-item faa-parent animated-hover relative-position" @click="onAddPreset">
        <q-tooltip anchor="bottom middle" self="top middle">Add Preset</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-plus" />
        </span>
      </span>

      <span v-show="hasPtz" class="caption-control-item faa-parent animated-hover relative-position" @click="onRemovePreset">
        <q-tooltip anchor="bottom middle" self="top middle">Remove Preset</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-minus" />
        </span>
      </span>

      <span v-show="hasPtz" class="caption-control-item faa-parent animated-hover relative-position">
        <q-tooltip anchor="bottom middle" self="top middle" v-show="!displayPresets">Presets</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-chevron-down" />
        </span>
        <q-popover ref="presetsPopover" v-model="displayPresets">
          <q-list item-separator link>
            <q-item v-for="(token, index) in presets" :key="index" @click="onPresetClicked(token), $refs.presetsPopover.close()">
              {{ index }}
            </q-item>
          </q-list>
        </q-popover>
      </span>

      <span v-show="hasPtz" class="caption-control-item faa-parent animated-hover relative-position" @click="onSetHomePosition">
        <q-tooltip anchor="bottom middle" self="top middle">Set Home Position</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-home" />
        </span>
      </span>

    </div>
    <div class="row inline title ellipsis text-bold text-faded">
      {{ cameraName }}
    </div>
    <div class="row inline widgets no-wrap">
      <span v-show="!minimized && !maximized" class="caption-control-item faa-parent animated-hover relative-position" @click="onMinimize">
        <q-tooltip anchor="bottom middle" self="top middle">Minimize window</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-compress" />
        </span>
      </span>
      <span v-show="maximized || minimized" class="caption-control-item faa-parent animated-hover relative-position" @click="onRestore">
        <q-tooltip v-show="!maximized" anchor="bottom middle" self="top middle">Restore window</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-circle-thin" />
        </span>
      </span>
      <span v-show="!maximized && !minimized" class="caption-control-item faa-parent animated-hover relative-position" @click="onMaximize">
        <q-tooltip anchor="bottom middle" self="top middle">Maximize window</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-expand" />
        </span>
      </span>
      <span v-show="!maximized" class="caption-control-item faa-parent animated-hover relative-position" @click="onClose">
        <q-tooltip anchor="bottom middle" self="top middle">Close window</q-tooltip>
        <span class="fa-sm faa-pulse text-faded">
          <i class="fa fa-close" />
        </span>
      </span>
    </div>

  </div>
</template>

<script>
  import {
    Dialog,
    QBtn,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QField,
    QIcon,
    QInput,
    QItem,
    QList,
    QPopover,
    QSelect,
    QTooltip,
    QTransition
  } from 'quasar'

  export default {
    name: 'onvif-window-caption',

    components: {
      QBtn,
      QCard,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QField,
      QIcon,
      QInput,
      QItem,
      QList,
      QPopover,
      QSelect,
      QTooltip,
      QTransition
    },

    props: {
      cameraName: {
        type: String,
        default: 'Unknown Camera',
        required: false
      },
      maximized: {
        type: Boolean,
        default: false,
        required: false
      },
      minimized: {
        type: Boolean,
        default: false,
        required: false
      },
      hasPtz: {
        type: Boolean,
        required: true
      },
      presets: {
        type: Object,
        required: true
      },
      deviceInfo: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        displayPresets: false
      }
    },

    mounted: function () {

    },

    beforeDestroy: function () {

    },

    watch: {

    },

    computed: {

    },

    methods: {
      onInfo: function () {
        this.$emit('deviceInfo')
      },

      onAddPreset: function () {
        this.$emit('addPreset')
      },

      onRemovePreset: function () {
        this.$emit('removePreset')
      },

      onSetHomePosition: function () {
        let self = this
        Dialog.create({
          title: 'Warning',
          message: `Permanently replace the Home Position for <strong>${this.cameraName}?</strong>`,
          buttons: [
            'No',
            {
              label: 'YES',
              handler: () => {
                self.$emit('setHomePosition')
              }
            }
          ]
        })
      },

      onPresetClicked: function (token) {
        this.$emit('gotoPreset', token)
      },

      onMinimize: function () {
        this.$emit('minimize')
      },

      onRestore: function () {
        this.$emit('restore')
      },

      onMaximize: function () {
        this.$emit('maximize')
      },

      onClose: function () {
        this.$emit('close')
      }
    }
}
</script>

<style scoped>
.fa-stack {
    width: 1.7em !important;
}

.caption {
    height: 32px;
    border-radius: 0px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-width: 1px;
    margin: 5px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    background-color: white;
}

.title {
  margin-left: 5px;
  vertical-align: middle;
  min-height: 100%;
  margin-top: 6px;
}

.widgets {
  margin-right: 5px;
}

.caption-control-item {
  cursor: pointer;
  position: relative;
  text-align: center;
  text-decoration: none;
  height: 24px;
  width: 24px;
  margin: 2px;
  margin-top: 4px;
  line-height: 24px;
  background-color: rgba(158, 158, 158, 0.25);
  border-radius: 50%;
  border-width: 1px;
  border-color: rgb(158, 158, 158);
  -webkit-transition-property: background-color, opacity, height, width;
  transition-property: background-color, opacity, height, width;
  -webkit-transition-duration: 100ms;
  transition-duration: 100ms;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}

.caption-control-item:hover {
  color: rgba(0,0,0,.55);
  background-color: yellow;

  outline-width: 2px;
  border-radius: 12px;
  -webkit-transition-property: background-color, opacity, height, width;
  transition-property: background-color, opacity, height, width;
  -webkit-transition-duration: 100ms;
  transition-duration: 100ms;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  /* transition: opacity 0.12s ease-in; */
}
</style>
