# 🧑‍💻 Cropping SVG 🧑‍💻 [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## 🔖 Description

SVG elements cropping using subjx and svg.js.

## ⚙️ How To

Open project and run `yarn` and then `yarn dev`.

## 📜 Scheme

HTML scheme is as follows:

```html
<body>
  <div id="app">
    <svg width="1280" height="720">
      <!-- Defs -->
      <defs>
        <clipPath id="clippath-image">
          <rect id="clippath-rect" width="w1" height="h1" fill="white" />
        </clipPath>

        <clipPath id="clippath-shape">
          ...
        </clipPath>
      </defs>

      <!-- Image -->
      <g id="content-image">
        <!-- Target -->
        <image id="image" width="w2" height="h2" href="..." style="clip-path:url('#clippath-image')"></image>

        <!-- Ghost (Only in crop mode) -->
        <image id="image-ghost" width="w2" height="h2" href="..." opacity="0.5"></image>

        <!-- ClipPath Handler -->
        <rect id="image-rect-handler" width="w1" height="h1" fill="none" stroke-width="4px" class="sjx-drag" />

        <!-- Ghost Handler (Only in crop mode) -->
        <rect id="ghost-rect-handler" width="w2" height="h2" fill="none" stroke-width="4px" class="sjx-drag" />
      </g>

      <!-- or Shape (Comming soon) -->
      <g id="content-shape">
        <!-- Target | width: w4 and height: h4 -->
        <g id="shape" style="clip-path:url('#clippath-shape')">
          <path>...</path>
        </g>

        <!-- Ghost (Only in crop mode) | width: w4 and height: h4 -->
        <g id="shape-ghost" opacity="0.5">
          <path>...</path>
        </g>

        <!-- ClipPath Handler -->
        <rect id="shape-rect-handler" width="w3" height="h3" fill="none" stroke-width="4px" class="sjx-drag" />

        <!-- Ghost Handler (Only in crop mode) -->
        <rect id="ghost-rect-handler" width="w4" height="h4" fill="none" stroke-width="4px" class="sjx-drag" />
      </g>

      <!-- subjx elements -->
      <g class="sjx-svg-wrapper">...</g>
    </svg>
  </div>
</body>
```

#### Pre-crop

  - Image.onMove: `#image-rect-handler` => `#image` and `#clippath-rect`.

  - Image.onResize: `#image-rect-handler` => `#image` and `#clippath-rect`.

#### Crop mode:
  
  - Image.onResize: `#image-rect-handler` => `#image`, `#image-ghost` and `#clippath-rect`.

  - Ghost.onMove (*): `#ghost-rect-handler` => `#image` and `#image-ghost`.

  - Ghost.onResize (*): `#ghost-rect-handler` => `#image` and `#image-ghost`.

(*) Events enabled under `#clippath-rect` restrictions: `width`, `height`, `pos-x` and `pos-y`.

## 🗺️ Roadmap

  - To mind flip.

  - To mind rotation.

## 🌍 Languages

- 🇺🇸 English

## Powered by

[VueJS](https://vuejs.org/), [Vite](https://github.com/vitejs/vite), [subjx](https://github.com/nichollascarter/subjx) and [svg.js](https://svgjs.com/docs/2.7/).

## This README.md file looks pretty thanks to

[GitHub Markdown](https://guides.github.com/features/mastering-markdown/) \
[Emojipedia](https://emojipedia.org/)

## Credits

Dog SVG in `./src/utils/elements.js` and pictures by [Freepik](https://www.freepik.es/)