# 🧑‍💻 Cropping SVG 🧑‍💻 [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## 🔖 Description

SVG elements cropping using subjx and svg.js.

## ⚙️ How To

ClipPath rectangle should have same size and position as image (or shape) subjx rectangle handler in order to manipulate the clip.

HTML scheme is as follows:

```html
<body>
  <div id="app">
    <svg width="1280" height="720">
      <!-- Defs -->
      <defs>
        <clipPath id="clippath">
          <rect id="clippath-rect" width="512" height="512" fill="white" />
        </clipPath>
      </defs>

      <!-- Image -->
      <g id="content-image">
        <!-- Target -->
        <image id="image" width="512" height="512" href="..." style="clip-path:url('#clippath')"></image>

        <!-- Ghost (Only in crop mode) -->
        <image id="ghost" width="512" height="512" href="..." opacity="0.5"></image>

        <!-- Handler -->
        <rect id="image-rect-handler" width="512" height="512" fill="none" stroke="#ed1450" stroke-width="4px" class="sjx-drag" />
      </g>

      <!-- or Shape
      <g id="content-shape">
        <!-- Target -->
        <g style="clip-path:url('#clippath')">
          <path>...</path>
        </g>

        <!-- Ghost (Only in crop mode) -->
        <g opacity="0.5">
          <path>...</path>
        </g>

        <!-- Handler -->
        <rect id="shape-rect-handler" width="512" height="512" fill="none" stroke="#ed1450" stroke-width="4px" class="sjx-drag" />
      </g> -->

      <!-- subjx elements -->
      <g class="sjx-svg-wrapper">...</g>
    </svg>
  </div>
</body>
```

Open project and run `yarn` and then `yarn dev`.

## 🌍 Languages

- 🇺🇸 English

## Powered by

[VueJS](https://vuejs.org/), [Vite](https://github.com/vitejs/vite), [subjx](https://github.com/nichollascarter/subjx) and [svg.js](https://svgjs.com/docs/2.7/).

## This README.md file looks pretty thanks to

[GitHub Markdown](https://guides.github.com/features/mastering-markdown/) \
[Emojipedia](https://emojipedia.org/)

## Credits

Dog and food picture by [Freepik](https://www.freepik.es/)