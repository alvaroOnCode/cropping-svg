# 🧑‍💻 Cropping SVG 🧑‍💻 [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## 🔖 Description

SVG elements cropping using subjx and svg.js.

## ⚙️ How To

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
        <image id="image" width="512" height="512" href="..." style="clip-path:url('#clippath')"></image>
        <rect id="image-rect-handler" width="512" height="512" fill="none" stroke="#ed1450" stroke-width="4px" class="sjx-drag" />
      </g>

      <!-- Shape -->
      <g id="content-shape">
        <g style="clip-path:url('#clippath')">
          <path>...</path>
        </g>
        <rect id="shape-rect-handler" width="512" height="512" fill="none" stroke="#ed1450" stroke-width="4px" class="sjx-drag" />
      </g>

      <!-- subjx elements -->
      <g class="sjx-svg-wrapper">...</g>
    </svg>
  </div>
</body>
```

## 🌍 Languages

- 🇺🇸 English

## Powered by

[VueJS](https://vuejs.org/), [Vite](https://github.com/vitejs/vite), [subjx](https://github.com/nichollascarter/subjx) and [svg.js](https://svgjs.com/docs/2.7/).

## This README.md file looks pretty thanks to

[GitHub Markdown](https://guides.github.com/features/mastering-markdown/) \
[Emojipedia](https://emojipedia.org/)

## Credits

Dog shape used in this lab repo is from Freepik.