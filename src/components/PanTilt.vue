<template>
  <div id="ptz-controls">
    <div class="ptz-ctl-box">
      <div class="ptz-pad-box">
        <div>
          <button
            class="pan-tilt--north-west"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('NW')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button><!--
        --><button
            class="pan-tilt--north"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('N')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button><!--
        --><button
            class="pan-tilt--north-east"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('NE')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button>
        </div>
        <div>
          <button
            class="pan-tilt--west"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('W')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button><!--
        --><button
            class="pan-tilt--home"
            :disabled="!canPanTilt"
            @click.prevent="command('home')"
          >
              <div><i class="fa fa-fw fa-home"></i></div>
          </button><!--
        --><button
            class="pan-tilt--east"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('E')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button>
        </div>
        <div>
          <button
            class="pan-tilt--south-west"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('SW')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button><!--
        --><button
            class="pan-tilt--south"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('S')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button><!--
        --><button
            class="pan-tilt--south-east"
            :disabled="!canPanTilt"
            @mousedown.prevent="command('SE')"
            @mouseup.prevent="command('stop')"
            >
              <div><i class="fa fa-fw fa-play"></i></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pan-tilt',

    props: {
      canPanTilt: {
        type: Boolean,
        required: true
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
      command: function (direction) {
        // console.log('PanTilt::command', direction)

        if (direction === 'stop') {
          this.$q.events.$emit('moveStop')
        }
        else if (direction === 'N') {
          let payload = {}
          payload.x = 0
          payload.y = 0.5
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'NE') {
          let payload = {}
          payload.x = 0.5
          payload.y = 0.5
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'E') {
          let payload = {}
          payload.x = 0.5
          payload.y = 0
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'SE') {
          let payload = {}
          payload.x = 0.5
          payload.y = -0.5
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'S') {
          let payload = {}
          payload.x = 0
          payload.y = -0.5
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'SW') {
          let payload = {}
          payload.x = -0.5
          payload.y = -0.5
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'W') {
          let payload = {}
          payload.x = -0.5
          payload.y = 0
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'NW') {
          let payload = {}
          payload.x = -0.5
          payload.y = 0.5
          payload.zoom = 0
          this.$q.events.$emit('moveContinuous', payload)
        }
        else if (direction === 'home') {
          this.$q.events.$emit('gotoHomePosition')
        }
        else {
          console.error('PanTilt::command - unknown command:', direction)
        }
      }
    }
  }
</script>

<style scoped lang="less">
    button {
    background-color: rgba(192, 192, 192, 0.1 );
    color: rgba(0, 0, 0, 0.4 );
  }

  #ptz-controls {
    position: absolute;
    left: 2px;
    bottom: 2px;
    border-radius: 4px;
    width: 150px;
    height: 150px;
    z-index: 1001;
    background-color: rgba(192, 192, 192, 0.1 );
  }

  #ptz-controls div.ptz-ctl-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  #ptz-controls div.ptz-ctl-box div.ptz-pad-box {
    position: absolute;
    /* background-color: #ffffff; */
    background-color: transparent;
    color: #000000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  #ptz-controls div.ptz-ctl-box div.ptz-pad-box:hover {
    transition: background-color .5s;
    background-color: rgba(192, 192, 192, 0.6 );
  }

  @media only screen and (max-width: 500px) {
    #ptz-controls {
      width: 66px;
      height: 66px;
    }
  }

  .pan-tilt--north-west {
    width: 50px;
    height: 50px;
    border-top-left-radius: 4px;
    border-top: 1px solid rgba(64,64,64,0.5);
    border-right: 0;
    border-bottom: 0;
    border-left: 1px solid rgba(64,64,64,0.5);

    div {
      background-color: transparent;
      transform: rotate(225deg);

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--north {
    width: 50px;
    height: 50px;
    border-top: 1px solid rgba(64,64,64,0.5);
    border-right: 0;
    border-bottom: 0;
    border-left: 0;

    div {
      background-color: transparent;
      transform: rotate(270deg);

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--north-east {
    width: 50px;
    height: 50px;
    border-top-right-radius: 4px;
    border-top: 1px solid rgba(64,64,64,0.5);
    border-right: 1px solid rgba(64,64,64,0.5);
    border-bottom: 0;
    border-left: 0;
    
    div {
      background-color: transparent;
      transform: rotate(315deg);

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--west {
    width: 50px;
    height: 50px;
    border-top: 0;
    border-right: 0;
    border-bottom: 0;
    border-left: 1px solid black;

    div {
      background-color: transparent;
      transform: rotate(180deg);

      i {
        font-size: 20px;
      }
    }
    
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

  .pan-tilt--home {
    width: 50px;
    height: 50px;
    border-top: 0;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;

    div {
      background-color: transparent;

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--east {
    width: 50px;
    height: 50px;
    border-top: 0;
    border-right: 1px solid rgba(64,64,64,0.5);
    border-bottom: 0;
    border-left: 0;

    div {
      background-color: transparent;

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--south-west {
    width: 50px;
    height: 50px;
    border-bottom-left-radius: 4px;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(64,64,64,0.5);
    border-left: 1px solid rgba(64,64,64,0.5);

    div {
      background-color: transparent;
      transform: rotate(135deg);

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--south {
    width: 50px;
    height: 50px;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(64,64,64,0.5);
    border-left: 0;
    

    div {
      background-color: transparent;
      transform: rotate(90deg);

      i {
        font-size: 20px;
      }
    }

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

  .pan-tilt--south-east {
    width: 50px;
    height: 50px;
    border-bottom-right-radius: 4px;
    border-top: 0;
    border-right: 1px solid rgba(64,64,64,0.5);
    border-bottom: 1px solid rgba(64,64,64,0.5);
    border-left: 0;

    div {
      background-color: transparent;
      transform: rotate(45deg);

      i {
        font-size: 20px;
      }
    }

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

  @media only screen and (max-width: 500px) {
    .pan-tilt--north-west {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--north {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--north-east {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--west {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--home {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--east {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--south-west {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--south {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
    .pan-tilt--south-east {
      width: 22px;
      height: 22px;
      div {
        i {
          font-size: 12px;
        }
      }
    }
  }
</style>
