<template>
  <div id="app-container">
    <ImageManager :svg="svg" />
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

const data = {
  width: "92.08903633404721",
  height: "80.98663762677951",
  "data-cropw": "143.29385691159916",
  "data-croph": "126.01812469561821",
  "data-cropx": "20.733379364013672",
  "data-cropy": "0.29055595397950634",
  "data-crop-axis-x": "1.5560360127106736",
  "data-crop-axis-x": "1.5560360127106736",
  "data-rawurl":
    "https://editor.freepiklabs.com/api/image/serve?url=https%3A%2F%2Fimage002.freepik.com%2F85CDD5AAE329130D3B26ADC0B5AA2108%2Ffree-photo%2Fblonde-young-woman-holding-flowers-hand-shielding-her-eyes-from-sunlight_23-2148066820.jpg",
  "data-imagecropx": "0",
  "data-imagecropy": "0",
};

// Components
import DebugPanel from "./components/DebugPanel.vue";
import ImageManager from "./components/ImageManager.vue";

// Packages
import subjx from "subjx";
import "subjx/dist/style/subjx.css";

import SVG from "svg.js";

// Utils
import { dog } from "./utils/elements";
import {
  getCropExpandAxis,
  getExpandedSize,
  getLimits,
  getOffsets,
} from "./utils/crop-helpers";

export default {
  name: "App",

  components: {
    DebugPanel,
    ImageManager,
  },

  data: () => ({
    // DebugPanel
    // debugEntry: "",
    // debugStaticOutput: "",
    // mode: "Pre-crop",

    svg: {},

    // Crop
    // initSquareSize: 128,
    // target: [],
    // rectHandler: null,
    // cpRect: null,
    // xTarget: null,
    // xGhost: null,
    // modifiers: [],
    // selectedModifier: {},
  }),

  created() {
    // Init svg.js
    this.svg = SVG("app").size(480, 360);
  },

  mounted() {
    // // Set clip path and its subjx-mirror rectangle
    // const clippath = this.svg.clip();
    // clippath.rect(IMAGE_SQUARE.w * 0.5, IMAGE_SQUARE.h * 0.5);
    // this.cpRect = clippath.select("rect").members[0];
    // this.cpRect.attr({
    //   fill: "white",
    // });
    // // Set image
    // const image = this.svg.image(
    //   IMAGE_SQUARE.url,
    //   IMAGE_SQUARE.w * 0.5,
    //   IMAGE_SQUARE.h * 0.5
    // );
    // // Set shape
    // // const shape = this.svg.group();
    // // shape.node.innerHTML = dog;
    // // Set subjx rectangle handler
    // this.rectHandler = this.svg.rect(
    //   IMAGE_SQUARE.w * 0.5,
    //   IMAGE_SQUARE.h * 0.5
    // );
    // this.rectHandler.attr({
    //   fill: "none",
    //   stroke: "#ed1450",
    //   "stroke-width": "4px",
    // });
    // // Set a content group
    // const group = this.svg.group();
    // // Init subjx
    // const targetHandler = this.targetHandler;
    // const mirror = this.mirror;
    // const svg = this.svg;
    // this.xTarget = subjx(this.rectHandler.node).drag({
    //   snap: {
    //     x: 1,
    //     y: 1,
    //   },
    //   onMove({ dx, dy }) {
    //     // fires on moving
    //     targetHandler("onMove", { dx, dy });
    //     mirror("onMove");
    //   },
    //   onResize({ dx, dy }) {
    //     // fires on resizing
    //     targetHandler("onResize", { dx, dy });
    //     mirror("onResize");
    //   },
    //   onDrop() {
    //     // fires on drop
    //     targetHandler("onDrop");
    //     mirror("onDrop");
    //   },
    // });
    // // Get subjx modifier nodes and add events to know which one is used
    // this.modifiers = Array.from(
    //   document.querySelector(".sjx-svg-wrapper .sjx-svg-handles").childNodes
    // );
    // this.modifiers.forEach((m) => {
    //   m.addEventListener("mousedown", this.setSelectedModifier);
    //   m.addEventListener("mouseup", this.setSelectedModifier);
    // });
    // // Set ClipPath to image
    // image.attr({
    //   style: `clip-path: url(#${clippath.id()}); pointer-events: none;`,
    // });
    // // Add nodes to group
    // group.add(image);
    // group.add(this.rectHandler);
    // // Set target array
    // this.target.push(image);
  },

  methods: {
    /**
     * Debug
     */
    entry(val) {
      this.outputHTML.unshift(val);
    },

    /**
     * Target
     */
    // Crop and Resize
    targetHandler(event, options) {
      // Block target proportions on resizing
      if (["onResize"].includes(event)) {
        this.xTarget[0].options.proportions =
          this.selectedModifier.mode === "vertex";
      }

      // Check if rectangle handler is getting out of target
      const limits = getLimits(this.target[0].node, this.rectHandler.node);

      this.target.forEach((target) => {
        if (["onResize", "onDrop"].includes(event)) {
          // Get axis to move target when crop gets limits
          const axis = getCropExpandAxis(this.selectedModifier.name, limits);

          // Expand target if its visible area is smaller than subjx handler
          if (axis && this.selectedModifier.mode === "edge") {
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
            // Crop end
            if (this.selectedModifier.mode === "edge") {
              if (this.mode !== "Crop") {
                // Relocate target on finish
                if (limits.toLeft || limits.toRight) {
                  target.x(this.rectHandler.x());
                }

                if (limits.toTop || limits.toBottom) {
                  target.y(this.rectHandler.y());
                }
              }
            }

            // Resize end
            if (this.selectedModifier.mode === "vertex") {
              const { a, d } = target.transform();

              const { offsetTop, offsetLeft } = getOffsets(
                target.node,
                this.rectHandler.node
              );

              // Reset target matrix
              target.transform({
                a: 1,
                d: 1,
                e: 0,
                f: 0,
              });

              // Resize target
              target.size(target.width() * a, target.height() * d);

              // Relocate target
              target.x(
                offsetLeft > 0
                  ? this.rectHandler.x() - offsetLeft
                  : this.rectHandler.x()
              );
              target.y(
                offsetTop > 0
                  ? this.rectHandler.y() - offsetTop
                  : this.rectHandler.y()
              );
            }

            // Set attributes for dragging delta
            target.attr({ "data-x": target.x() });
            target.attr({ "data-y": target.y() });

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
      this.moveRawTarget(options, limits);
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

    // Expand
    expandTargetOnCrop(axis) {
      this.expandRawTargetOnCrop(axis);
    },

    expandRawTargetOnCrop(axis) {
      this.target.forEach((target) => {
        const { width, height } = getExpandedSize(
          target,
          this.rectHandler,
          axis
        );
        target.size(width, height);
      });
    },

    /**
     * ClipPath
     */
    mirror(event) {
      if (["onResize", "onDrop"].includes(event)) {
        this.cpRect.size(this.rectHandler.width(), this.rectHandler.height());
      }

      if (["onMove", "onResize"].includes(event)) {
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
      this.xGhost = subjx(ghost.node).drag({
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
      this.xGhost[0].disable();
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
  transform: translate(-50%, -50%) scale(2);
}
</style>
