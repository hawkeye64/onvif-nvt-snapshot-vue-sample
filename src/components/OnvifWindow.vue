<template>
  <div v-if="snapshot" class="snapshot-container">
    <img :src="snapshot" class="snapshot" :style="cameraWrapperStyleObject()">
    <zoom v-show="hasPtz" :start="-100" :end="100" />
    <pan-tilt v-show="hasPtz" :canPanTilt="canPanTilt"/>
  </div>
</template>

<script>
  export default {
    name: 'onvif-window',

    components: {
      'pan-tilt': require('./PanTilt').default,
      'zoom': require('./Zoom').default
    },

    props: {
      snapshot: {
        type: String,
        required: true
      },
      hasPtz: {
        type: Boolean,
        required: true
      },
      canPanTilt: {
        type: Boolean,
        required: true
      },
      maximized: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    data () {
      return {
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
      cameraWrapperStyleObject: function () {
        if (!this.maximized) {
          return { width: '100%', height: 'auto', maxWidth: '900px' }
        }
        else {
          return { width: '100%', height: 'auto', maxWidth: '100vw' }
        }
      }
    }
}
</script>

<style scoped>
.snapshot-container {
  position: relative;
  background-color: silver;
  overflow: hidden;
}

.snapshot {
  display: block;
  width: 100%;
  height: auto;
  max-width:900px;
  text-align: center;
}

</style>