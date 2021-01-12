<template>
  <div v-if="show && env === 'development'" class="debugPanel">
    <div class="debugPanel_topBar">
      <span :class="{ active: active }" @click="active = !active"></span>
    </div>

    <div class="debugPanel_logs" :class="{ active: active }">
      <p v-html="staticOutput"></p>

      <div class="scroll">
        <p v-for="(p, i) in outputHTML" :key="i" v-html="p"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DebugPanel",

  props: {
    entry: {
      type: String,
      default: "",
    },

    staticOutput: {
      type: String,
      default: "Debug...",
    },

    show: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    active: false,
    outputHTML: [],
  }),

  computed: {
    env() {
      return process.env.NODE_ENV || "";
    },
  },

  watch: {
    entry(val) {
      this.addEntry(val);
    },

    staticOutput(val) {
      this.setStaticOutput(val);
    },
  },

  methods: {
    addEntry(val) {
      this.outputHTML.unshift(val);
    },

    setStaticOutput(val) {
      this.staticOutput = val;
    },
  },
};
</script>

<style lang="scss" scoped>
div.debugPanel {
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 0.35rem;
  box-shadow: 0 4px 1rem rgba(0, 0, 0, 0.35);
  color: greenyellow;
  height: 15vh;
  left: 50%;
  margin-top: 1rem;
  min-height: 128px;
  min-width: 640px;
  padding: 0 0.5rem;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 30vw;
  z-index: 30;

  & .debugPanel_topBar {
    height: 2rem;
    width: 100%;
    position: relative;

    & span {
      background-color: red;
      border-radius: 50%;
      height: 0.6rem;
      left: 0.5rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      transition: all 200ms;
      width: 0.6rem;

      &:hover {
        box-shadow: 0 0 0.25rem red;
      }

      &.active {
        background-color: greenyellow;

        &:hover {
          box-shadow: 0 0 0.35rem greenyellow;
        }
      }
    }
  }

  & .debugPanel_logs {
    height: calc(100% - 2.5rem);
    padding: 0 0.5rem;
    pointer-events: none;

    & .scroll {
      height: 90%;
      overflow-y: auto;
    }

    &.active {
      pointer-events: initial;
    }

    & p {
      font-size: 0.85rem;
      margin-bottom: 0.35rem;
    }
  }
}
</style>
