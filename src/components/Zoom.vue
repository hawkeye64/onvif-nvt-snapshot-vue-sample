<template>
  <div id="zoom-controls">
    <div class="zoom-ctl-box">
      <div class="zoom-pad-box">
        <span class="left fa fa-search-minus" @mousedown.prevent="zoomOut" @mouseup.prevent="stop"></span>
        <span class="right fa fa-search-plus" @mousedown.prevent="zoomIn" @mouseup.prevent="stop"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'zoom',

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
      zoomOut: function () {
        let payload = {}
        payload.x = 0
        payload.y = 0
        payload.zoom = -0.5
        this.$q.events.$emit('moveContinuous', payload)
      },

      zoomIn: function () {
        let payload = {}
        payload.x = 0
        payload.y = 0
        payload.zoom = 0.5
        this.$q.events.$emit('moveContinuous', payload)
      },

      stop: function () {
        this.$q.events.$emit('moveStop')
      }
    }
}
</script>

<style scoped lang="less">
  #zoom-controls {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 80px;
    border-radius: 4px;
    height: 36px;
    z-index: 1001;
    font-size: 16px;
    background-color: rgba(192, 192, 192, 0.1 );
  }

  #zoom-controls div.zoom-ctl-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  #zoom-controls div.zoom-ctl-box div.zoom-pad-box {
    position: absolute;
    background-color: transparent;
    color: #000000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  #zoom-controls div.zoom-ctl-box div.zoom-pad-box:hover {
    transition: background-color .5s;
    background-color: rgba(192, 192, 192, 0.6 );
  }

  #zoom-controls div.zoom-ctl-box div.zoom-pad-box .left {
    position: absolute;
    left: 2px;
    top: 2px;
    width: 30px;
    height: 30px;
    margin: 2px;
    font-size: 28px;
    text-align: center;

    &:hover {
      color: #d9534f;
    }
    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    &:active {
      outline: none !important;
      box-shadow: none !important;
      color: lightskyblue; 
    }
    &[disabled] {
      color: darkgray;  
    }
  }

  #zoom-controls div.zoom-ctl-box div.zoom-pad-box .right {
    position: absolute;
    right: 2px;
    top: 2px;
    width: 30px;
    height: 30px;
    margin: 2px;
    font-size: 28px;
    text-align: center;

    &:hover {
      color: #d9534f;
    }
    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    &:active {
      outline: none !important;
      box-shadow: none !important;
      color: lightskyblue; 
    }
    &[disabled] {
      color: darkgray;  
    }
  }

  #zoom-controls div.zoom-ctl-box div.zoom-pad-box .slider {
    position: absolute;
    left: 17px;
    right: 17px;
    top: -5px;
    text-align: center;
  }
</style>
