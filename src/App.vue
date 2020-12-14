<template>
  <div id="app-container">
    <!-- Debug -->
    <div class="debugPanel">
      <div class="debugPanel_topBar">
        <span :class="{ active: active }" @click="active = !active"></span>

        <button :class="{ 'crop-mode': mode === 'Crop' }" @click="switchMode">
          {{ mode }}
        </button>
      </div>

      <div class="debugPanel_logs" :class="{ active: active }">
        <p v-for="(p, i) in outputHTML" :key="i" v-html="p"></p>
      </div>
    </div>
  </div>
</template>

<script>
// Constants
const IMAGE_SQUARE = {
  url:
    "https://image.freepik.com/foto-gratis/close-up-persona-poniendo-setas-frasco-vidrio_23-2148738068.jpg",
  w: 626,
  h: 626,
};
const IMAGE_RECT = {
  url:
    "https://image.freepik.com/free-photo/it-specialist-checking-code-computer-dark-office-night_1098-18699.jpg",
  w: 626,
  h: 417,
};

// Packages
import subjx from "subjx";
import "subjx/dist/style/subjx.css";

import SVG from "svg.js";

// Utils
import { dog } from "./utils/elements";
import { getExpandedSize, getLimits, getCropExpandAxis } from "./utils/crop-helpers";

export default {
  name: "App",

  data: () => ({
    // DebugPanel
    active: false,
    outputHTML: [],
    mode: "Pre-crop",

    // Crop
    initSquareSize: 128,
    target: [],
    rectHandler: null,
    cpRect: null,
    xElem: null,
    modifiers: [],
    selectedModifier: {},
  }),

  created() {
    // Init svg.js
    this.svg = SVG("app").size(720, 512);
  },

  mounted() {
    // Debug Panel
    this.separator();
    this.outputHTML.unshift("Debug...");

    // Set clip path and its subjx-mirror rectangle
    const clippath = this.svg.clip();
    clippath.rect(IMAGE_SQUARE.w * 0.5, IMAGE_SQUARE.h * 0.5);
    this.cpRect = clippath.select("rect").members[0];
    this.cpRect.attr({
      fill: "white",
    });

    // Set image
    const image = this.svg.image(
      IMAGE_SQUARE.url,
      IMAGE_SQUARE.w * 0.5,
      IMAGE_SQUARE.h * 0.5
    );

    // Set shape
    // const shape = this.svg.group();
    // shape.node.innerHTML = dog;

    // Set subjx rectangle handler
    this.rectHandler = this.svg.rect(
      IMAGE_SQUARE.w * 0.5,
      IMAGE_SQUARE.h * 0.5
    );
    this.rectHandler.attr({
      fill: "none",
      stroke: "#ed1450",
      "stroke-width": "4px",
    });

    // Set a content group
    const group = this.svg.group();

    // Init subjx
    const targetHandler = this.targetHandler;
    const mirror = this.mirror;
    const svg = this.svg;

    this.xElem = subjx(this.rectHandler.node).drag({
      onMove({ clientX, clientY, dx, dy, transform }) {
        // fires on moving
        targetHandler("onMove", { clientX, clientY, dx, dy, transform });
        mirror("onMove");
      },
      onResize({ clientX, clientY, dx, dy, width, height }) {
        // fires on resizing
        targetHandler("onResize", { clientX, clientY, dx, dy, width, height });
        mirror("onResize");
      },
      onDrop({ clientX, clientY }) {
        // fires on drop
        targetHandler("onDrop", { clientX, clientY });
        mirror("onDrop");
      },
    });

    // Get subjx modifier nodes and add events to know which one is used
    this.modifiers = Array.from(
      document.querySelector(".sjx-svg-wrapper .sjx-svg-handles").childNodes
    );

    this.modifiers.forEach((m) => {
      m.addEventListener("mousedown", this.setSelectedModifier);
      m.addEventListener("mouseup", this.setSelectedModifier);
    });

    // Set ClipPath to image
    image.attr({
      style: `clip-path: url(#${clippath.id()}); pointer-events: none;`,
    });

    // Add nodes to group
    group.add(image);
    group.add(this.rectHandler);

    // Set target array
    this.target.push(image);
  },

  methods: {
    /**
     * Debug
     */
    entry(val) {
      this.outputHTML.unshift(val);
    },
    separator() {
      this.outputHTML.unshift("- - - - -");
    },

    /**
     * Target
     */
    // Crop and Resize
    targetHandler(event, options) {
      const limits = getLimits(this.target[0].node, this.rectHandler.node);

      this.target.forEach((target) => {
        if (["onResize", "onDrop"].includes(event)) {
          // this.entry(
          //   `${event} | ${this.selectedModifier.mode} | ${this.selectedModifier.name} | dx: ${options.dx} | dy: ${options.dy} | width: ${options.width} | height: ${options.height}`
          // );

          // Get axis to move target when crop gets limits
          const axis = getCropExpandAxis(this.selectedModifier.name, limits);

          // Expand target if its visible area is smaller than subjx handler
          if (this.selectedModifier.mode === "edge") {
            this.expandTargetOnCrop(axis);
          }

          // Event onResize (crop or resize)
          if (event === "onResize") {
            // Crop
            if (this.selectedModifier.mode === "edge") {
              // Move target only to keep it inside subjx handler
              if (axis && this.mode !== "Crop") {
                this.moveTarget(options, limits);
              }
            }

            // Resize
            if (this.selectedModifier.mode === "vertex") {
              // ⚠️ Fix scales < 0
              const { a, d, e, f } = this.rectHandler.transform();

              target.transform({
                a,
                d,
                e,
                f,
              });
            }
          }

          // Event onDrop
          if (["onDrop"].includes(event)) {
            if (this.selectedModifier.mode === "vertex") {
              const { a, d, e, f } = target.transform();

              // Reset matrix
              target.transform({
                a: 1,
                d: 1,
                e: 0,
                f: 0,
              });

              // Scale target
              target.size(target.width() * a, target.height().d);
            }

            if (this.mode !== "Crop") {
              // Relocate target on finish
              if (limits.toLeft || limits.toRight) {
                target.attr({
                  x: this.rectHandler.attr().x,
                });
              }

              if (limits.toTop || limits.toBottom) {
                target.attr({
                  y: this.rectHandler.attr().y,
                });
              }
            }

            // Set attributes for dragging delta
            target.attr({ "data-x": target.attr().x });
            target.attr({ "data-y": target.attr().y });

            // Reset info object on finish
            this.selectedModifier = {};
          }
        }

        // Event onMove
        if (["onMove"].includes(event)) {
          if (this.mode !== "Crop") {
            // Drag target
            target.move(
              (target.attr("data-x") || 0) + options.dx,
              (target.attr("data-y") || 0) + options.dy
            );
          }
        }
      });
    },

    // Move
    moveTarget(options, limits) {
      const hasDistortion =
        this.target[0].attr("data-distort-x") ||
        this.target[0].attr("data-distort-y");

      if (hasDistortion) {
        this.moveDistortedTarget();
      } else {
        this.moveRawTarget(options, limits);
      }
    },

    moveRawTarget(options, limits) {
      this.target.forEach((target) => {
        // Top
        if (this.selectedModifier.name === "tc" && limits.toTop) {
          target.y((this.rectHandler.y() || 0) - options.dy);
        }

        // Left
        if (this.selectedModifier.name === "ml" && limits.toLeft) {
          target.x((this.rectHandler.x() || 0) - options.dx);
        }
      });
    },

    moveDistortedTarget() {
      // ⚠️ TODO
    },

    // Expand
    expandTargetOnCrop(axis) {
      const hasDistortion =
        this.target[0].attr("data-distort-x") ||
        this.target[0].attr("data-distort-y");

      if (hasDistortion) {
        this.expandDistortedTargetOnCrop();
      } else {
        this.expandRawTargetOnCrop(axis);
      }
    },

    expandDistortedTargetOnCrop() {
      // ⚠️ Fix
      const { a, d, e, f } = this.rectHandler.transform();

      this.target.forEach((target) => {
        target.transform({
          a: target.attr("data-distort-x") * a,
          d: target.attr("data-distort-y") * d,
        });
      });
    },

    expandRawTargetOnCrop(axis) {
      this.target.forEach((target) => {
        const { w, h } = getExpandedSize(target, this.rectHandler, axis);
        target.size(w, h);
      });
    },

    /**
     * ClipPath
     */
    mirror(event) {
      if (["onResize", "onDrop"].includes(event)) {
        this.cpRect.size(this.rectHandler.width(), this.rectHandler.height());
      }

      if (event === "onResize") {
        this.cpRect.attr({
          transform: this.rectHandler.attr().transform,
        });
      }

      if (["onMove"].includes(event)) {
        this.cpRect.attr({
          transform: this.rectHandler.attr().transform,
        });
      }

      if (["onDrop"].includes(event)) {
        this.cpRect.attr({
          transform: this.rectHandler.attr().transform,
          x: this.rectHandler.attr().x,
          y: this.rectHandler.attr().y,
        });
      }
    },

    /**
     * Ghost image
     */
    initGhostImage() {
      const ghost = this.target[0].clone();
      ghost.opacity(0.5);
      ghost.attr({
        style: "pointer-events: none;",
      });

      this.target.push(ghost);

      // ⚠️ Fix: subjx fails for some reason
      subjx(ghost.node).drag({
        onMove({ clientX, clientY, dx, dy, transform }) {
          // fires on moving
        },
        onResize({ clientX, clientY, dx, dy, width, height }) {
          // fires on resizing
        },
        onDrop({ clientX, clientY }) {
          // fires on drop
        },
      });
    },

    endGhostImage() {
      this.target[1].remove();
      this.target.pop();
    },

    /**
     * Object manager
     */
    setSelectedModifier(e) {
      if (e.type === "mousedown") {
        const name =
          e.target.classList.length > 1
            ? e.target.classList[1]
            : e.target.classList[0].split("sjx-svg-hdl-")[1];

        const mode = ["tc", "bc", "ml", "mr"].includes(name)
          ? "edge"
          : "vertex";

        const modifier = {
          mode,
          name,
          node: e.target,
        };

        this.selectedModifier = modifier;
      }
    },

    switchMode() {
      this.mode = this.mode !== "Crop" ? "Crop" : "Pre-crop";

      if (this.mode === "Crop") {
        this.initGhostImage();
      } else {
        this.endGhostImage();
      }
    },
  },
};
</script>

<style lang="scss">
svg {
  border: 2px solid #0af;
  left: 50%;
  padding: 1rem;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

div#app-container {
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
    text-align: initial;
    top: 0;
    transform: translateX(-50%);
    width: 35vw;
    z-index: 30;

    & .debugPanel_topBar {
      height: 2rem;
      width: 100%;
      position: relative;

      & span {
        background-color: red;
        border-radius: 50%;
        cursor: pointer;
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

      & button {
        background-color: cyan;
        border: none;
        border-radius: 16px;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;
        font-size: 0.65rem;
        font-weight: bold;
        left: 1.8rem;
        outline: none;
        padding: 0.25rem 0.65rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &.crop-mode {
          background-color: yellowgreen;
        }
      }
    }

    & .debugPanel_logs {
      height: calc(100% - 2.5rem);
      padding: 0 0.5rem;
      pointer-events: none;
      overflow-y: auto;

      &.active {
        pointer-events: initial;
      }

      & p {
        font-size: 0.85rem;
        margin-bottom: 0.35rem;
      }
    }
  }
}
</style>
