# mapping-image-multi-function

一个帮助前端快速开发的小工具 — 图片 URL 转 Base64 编码 + Base64 编码体积压缩。

A small browser utility for converting image URLs to Base64 and compressing existing Base64 images.

## 安装 / Installation

```bash
npm install mapping-image-multi-function
```

或者直接在浏览器中作为 ES module 引入：

```html
<script type="module">
  import ChangeImage from './mapping-image-multi-function/index.js'
</script>
```

## 快速开始 / Quick Start

```js
import ChangeImage from 'mapping-image-multi-function'

const ci = new ChangeImage({ quality: 0.8, type: 'image/jpeg' })

// 图片 URL → Base64
ci.imageUrlToBase64({
  src: 'https://example.com/photo.jpg',
  width: 400,
  callback: (base64) => {
    document.querySelector('img').src = base64
  }
})

// Base64 压缩
ci.photoCompress({
  base64Url: 'data:image/jpeg;base64,/9j/4AAQ...',
  quality: 0.5,
  callback: (compressed) => {
    console.log(compressed)
  }
})
```

## API

### `new ChangeImage(config?)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | string | `''` | 图片 URL |
| `base64Url` | string | `''` | Base64 编码字符串 |
| `width` | number/string | `''` | 输出宽度，空字符串表示使用原图尺寸 |
| `height` | number/string | `''` | 输出高度 |
| `quality` | number | `0.8` | 输出质量 0–1，仅对 `image/jpeg` / `image/webp` 有效 |
| `type` | string | `'image/jpeg'` | 输出 MIME 类型 |
| `callback` | function | `null` | 默认回调函数 |

### `.imageUrlToBase64(params)`

加载指定 URL 的图片，绘制到 Canvas 后输出 Base64。

| 参数 | 类型 | 说明 |
|------|------|------|
| `src` | string | **必填** 图片地址（需支持跨域） |
| `width` | number | 输出宽度 |
| `height` | number | 输出高度 |
| `quality` | number | 输出质量 |
| `type` | string | 输出类型 |
| `decompression` | boolean | 设为 `true` 时，Base64 结果会继续传入 `photoCompress` 压缩 |
| `callback` | function | 接收生成的 Base64 字符串 |

### `.photoCompress(params)`

对已有 Base64 图片重新绘制并压缩输出。

| 参数 | 类型 | 说明 |
|------|------|------|
| `base64Url` | string | **必填** 需压缩的 Base64 图片 |
| `width` | number | 输出宽度 |
| `height` | number | 输出高度 |
| `quality` | number | 输出质量，值越小体积越小但越模糊 |
| `type` | string | 输出类型 |
| `callback` | function | 接收压缩后的 Base64 字符串 |

## 工作原理 / How It Works

使用浏览器 Canvas API — 将图片绘制到 `<canvas>` 上，再通过 `canvas.toDataURL(type, quality)` 输出指定格式和质量的 Base64 编码。

注意：图片跨域需要服务端返回 `Access-Control-Allow-Origin` 头，否则会失败。压缩时建议使用 `image/jpeg` 类型，因为 PNG 压缩后的 Base64 可能比原图更大。

## License

MIT
