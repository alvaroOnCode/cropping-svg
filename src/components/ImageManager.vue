<template>
  <DebugPanel
    :entry="debugEntry"
    :staticOutput="debugStaticOutput"
    :show="true"
  />

  <div class="button-wrapper">
    <button class="flip-x" @click.prevent="flip('x')">Flip X</button>
    <button class="flip-y" @click.prevent="flip('y')">Flip Y</button>
  </div>
</template>

<script>
// Components
import DebugPanel from "./DebugPanel.vue";

// Data
import { IMG_DATA, CLIP_PATH_DATA } from "../data/elements-data.js";

// Packages
import subjx from "subjx";
import "subjx/dist/style/subjx.css";

export default {
  name: "ImageManager",

  components: {
    DebugPanel,
  },

  data: () => ({
    // DebugPanel
    debugEntry: "",
    debugStaticOutput: "",

    clipPathRect: {},
    mainHandler: {},
    targetsGroup: {},
    targets: [],

    currentAction: null,
    selectedModifier: {},

    deltas: null,
    offsets: null,

    flipCenter: {},
  }),

  props: {
    svg: {
      type: Object,
      default: () => ({}),
    },
  },

  async mounted() {
    this.init();

    await this.$nextTick();

    this.initSubJX(this.mainHandler, "main", "main-subjx");
  },

  methods: {
    init() {
      const contentGroup = this.svg.group();
      contentGroup.node.classList.add("content-group");

      this.targetsGroup = contentGroup.group();
      this.targetsGroup.node.classList.add("targets-group");

      this.mainHandler = this.svg.rect();

      this.mainHandler.attr({
        fill: "none",
        stroke: "#ed1450",
        "stroke-width": "1px",
      });

      const clippath = this.svg.clip();
      this.clipPathRect = clippath.rect();

      this.clipPathRect.attr({
        fill: "white",
      });

      Object.keys(CLIP_PATH_DATA).forEach((key) => {
        this.mainHandler.attr(key, CLIP_PATH_DATA[key]);
        this.clipPathRect.attr(key, CLIP_PATH_DATA[key]);
      });

      const image = this.svg.image();

      Object.keys(IMG_DATA).forEach((key) => {
        image.attr(key, IMG_DATA[key]);
      });

      image.style({
        "clip-path": `url(#${clippath.id()})`,
      });

      this.targetsGroup.add(image);
      contentGroup.add(this.mainHandler);

      this.targets.push(image);
    },

    initSubJX(handler, origin, cssClass) {
      const mirror = this.mirror;
      const targetsHandler = this.targetsHandler;

      const sjx = subjx(handler.node).drag({
        container: handler.node.closest("svg"),
        snap: {
          x: 1,
          y: 1,
          angle: 1,
        },
        onMove({ dx, dy }) {
          // fires on moving
          targetsHandler(origin, "onMove", { dx, dy }, handler);
        },
        onResize({ dx, dy }) {
          // fires on resizing
          targetsHandler(origin, "onResize", { dx, dy }, handler);
          mirror("onResize");
        },
        onRotate() {
          // fires on rotating
          targetsHandler(origin, "onRotate", null, handler);
        },
        onDrop() {
          // fires on drop
          targetsHandler(origin, "onDrop", null, handler);
          mirror("onDrop");

          this.deltas = null;
          this.offsets = null;
        },
      });

      sjx[0].storage.wrapper.classList.add(cssClass);
      this.setSubJxModifiers(`.${cssClass}`);
    },

    /**
     * Common
     */
    setSelectedModifier(e) {
      if (e.type === "mousedown" && e.target.classList.length > 0) {
        // TODO: Mind rotation handler...
        const name =
          e.target.classList.length > 1
            ? e.target.classList[1]
            : e.target.classList[0].split("sjx-svg-hdl-")[1];

        let mode;

        if (["tc", "bc", "ml", "mr"].includes(name)) {
          mode = "edge";
        } else if (["tl", "tr", "bl", "br"].includes(name)) {
          mode = "vertex";
        } else if (name === "rotator") {
          mode = "rotate";
        }

        const modifier = {
          mode,
          name,
          node: e.target,
        };

        this.selectedModifier = modifier;
      }
    },

    setSubJxModifiers(selector) {
      // Get modifier nodes and add events to know which one is used
      const modifiers = Array.from(
        document.querySelector(`${selector} .sjx-svg-handles`).childNodes
      );

      modifiers.forEach((m) => {
        if (m.tagName === "circle") {
          m.setAttribute("r", 2.5);
        }

        m.addEventListener("mousedown", this.setSelectedModifier);
        m.addEventListener("mouseup", this.setSelectedModifier);
      });

      //   this.$once("hook:beforeUnmount", () => {
      //     modifiers.forEach((m) => {
      //       m.removeEventListener("mousedown", this.setSelectedModifier);
      //       m.removeEventListener("mouseup", this.setSelectedModifier);
      //     });
      //   });
    },

    /**
     * Targets
     */
    targetsHandler(origin, event, options, handler) {
      //   console.log("targetsHandler:", origin, event, options, handler);

      if (!this.currentAction && event !== "onDrop") {
        this.currentAction = event;
      }

      const flipped = {
        x: this.targets[0].transform().a < 0,
        y: this.targets[0].transform().d < 0,
      };

      if (!this.offsets) {
        this.offsets = {
          x: this.mainHandler.x() - this.targets[0].x(),
          y: this.mainHandler.y() - this.targets[0].y(),
        };
      }

      this.targets.forEach((target) => {
        console.log("currentAction:", this.currentAction);

        if (event === "onMove") {
          this.deltas = options;
          this.targetsGroup.transform(handler.transform());
        }

        if (event === "onResize") {
          this.targetsGroup.transform(handler.transform());
        }

        if (event === "onRotate") {
          this.targetsGroup.transform(handler.transform());
        }

        if (event === "onDrop") {
          if (this.currentAction === "onMove") {
            if (flipped.x || flipped.y) {
              console.log("flipped:", this.deltas);

              let dmx = 0;
              let dmy = 0;

              if (flipped.x) {
                dmx = -this.deltas.dx;
              } else if (flipped.y) {
                dmx = this.deltas.dx;
              }

              if (flipped.y) {
                dmy = -this.deltas.dy;
              } else if (flipped.x) {
                dmy = this.deltas.dy;
              }

              target.dmove(dmx, dmy);
            } else {
              console.log("normal:", this.deltas);

              target.move(
                this.mainHandler.x() - this.offsets.x,
                this.mainHandler.y() - this.offsets.y
              );
            }
          }

          this.targetsGroup.transform(handler.transform());

          this.currentAction = null;
          this.selectedModifier = null;
        }
      });
    },

    flip(axis) {
      this.flipCenter = {
        x: this.mainHandler.x() + this.mainHandler.width() * 0.5,
        y: this.mainHandler.y() + this.mainHandler.height() * 0.5,
      };

      console.log("flipCenter:", this.flipCenter);

      this.targets[0].flip(axis, this.flipCenter[axis]);
    },

    /**
     * Mirror
     */
    mirror(event) {
      if (event === "onDrop") {
        this.clipPathRect.move(
          this.targets[0].x() + this.offsets.x,
          this.targets[0].y() + this.offsets.y
        );
      }
    },
  },
};
</script>


<style lang="scss">
.button-wrapper {
  bottom: 5rem;
  display: flex;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
}
</style>