<template></template>

<script>
// Packages
import subjx from 'subjx';
import 'subjx/dist/style/subjx.css';

import SVG from 'svg.js';

// Utils
import { dog } from './utils/elements';
import { calcImageSize, checkLimits } from './utils/helpers'

export default {
  name: 'App',

  data: () => ({
    image: null,
    rectHandler: null,
    cpRect: null,
    xElem: null,
    modifiers: [],
    selectedModifier: null
  }),

  created() {
    this.svg = SVG('app').size(1280, 720);
  },
  
  mounted() {
    // Set image
    this.image = this.svg.group();
    this.image.node.innerHTML = dog;
    
    // Set rect handler
    this.rectHandler = this.svg.rect(512, 512);
    this.rectHandler.attr({
      fill: 'none',
      stroke:"#ed1450",
      "stroke-width":"4px"
    });
    
    // Set clip path
    const clippath = this.svg.clip();
    clippath.rect(512, 512);
    this.cpRect = clippath.select('rect');
    this.cpRect.attr({
      fill: 'white'
    });
    
    // Set image clip path
    this.image.style('clip-path', `url(#${clippath.id()})`);

    // Init subjx
    const imageHandler = this.imageHandler;
    const mirror = this.mirror;
    const svg = this.svg;

    subjx(this.rectHandler.node).drag({
      onMove() {
        // fires on moving
        imageHandler();
        mirror('onMove');
      },
      onResize() {
        // fires on resizing
        imageHandler();
        mirror('onResize');
      },
      onDrop() {
        // fires on drop
        imageHandler();
        mirror('onDrop');
      },
    });

    // Get subjx modifier nodes and add events to know which one is used
    this.modifiers = Array.from(document.querySelector('.sjx-svg-wrapper .sjx-svg-handles').childNodes);

    this.modifiers.forEach((m) => {
      m.addEventListener('mousedown', this.setSelectedModifier);
      m.addEventListener('mouseup', this.setSelectedModifier);
    });
  },

  methods: {
    imageHandler() {
      const limits = checkLimits(this.image.node, this.rectHandler.node);

      // Crop
      if (this.selectedModifier.mode === 'crop') {
        // Expand image
        let dir;

        if (
          (this.selectedModifier.name === 'tc' && limits.toTop) ||
          (this.selectedModifier.name === 'bc' && limits.toBottom)
        ) {
          dir = 'v';
        }

        if (
          (this.selectedModifier.name === 'ml' && limits.toLeft) ||
          (this.selectedModifier.name === 'mr' && limits.toRight)
        ) {
          dir = 'h';
        }

        if (dir) {
          const size = calcImageSize(this.image, this.rectHandler, dir);
          this.image.size(size.w, size.h);
        }
      }
    },

    mirror(event) {
      this.cpRect.size(this.rectHandler.width(), this.rectHandler.height());

      if (['onMove', 'onDrop'].includes(event)) {
        this.cpRect.attr({
          transform: this.rectHandler.attr().transform,
          x: this.rectHandler.attr().x,
          y: this.rectHandler.attr().y,
        });
      }

      if (event === 'onResize') {
        this.cpRect.attr({
          transform: this.rectHandler.attr().transform
        });
      }
    },

    setSelectedModifier(e) {
      if (e.type === 'mousedown') {
        const name = e.target.classList.length > 1
          ? e.target.classList[1]
          : e.target.classList[0].split('sjx-svg-hdl-')[1];

        const mode = ['tc', 'bc', 'ml', 'mr'].includes(name) ? 'crop' : 'resize';

        const modifier = {
          mode,
          name,
          node: e.target,
        };

        this.selectedModifier = modifier;

        console.log("selectedModifier:", this.selectedModifier);
      } else {
        this.selectedModifier = {};
      }
    }
  }
}
</script>

<style lang="scss">
svg {
  border: 2px solid #0af;
}
</style>
