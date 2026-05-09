export interface ChangeImageConfig {
  src?: string
  base64Url?: string
  width?: number | string
  height?: number | string
  quality?: number
  type?: string
  callback?: ((base64: string) => void) | null
}

export interface ImageToBase64Params {
  src: string
  width?: number | string
  height?: number | string
  quality?: number
  type?: string
  decompression?: boolean
  callback?: (base64: string) => void
}

export interface PhotoCompressParams {
  base64Url: string
  width?: number | string
  height?: number | string
  quality?: number
  type?: string
  callback?: (base64: string) => void
}

/**
 * 图片 URL → Base64 / Base64 压缩工具
 * Image URL → Base64 / Base64 compression utility
 */
export class ChangeImage {
  private width: number | string
  private height: number | string
  private callback: ((base64: string) => void) | null
  private quality: number
  private type: string

  constructor(config: ChangeImageConfig = {}) {
    this.width = config.width || ''
    this.height = config.height || ''
    this.callback = config.callback || null
    this.quality = config.quality ?? 0.8
    this.type = config.type || 'image/jpeg'
  }

  /**
   * 将图片 URL 转换为 Base64
   */
  imageUrlToBase64(params: ImageToBase64Params = { src: '' }): void {
    const { src, width, height, callback, quality, type, decompression } = params
    if (!src) return

    const w = width || this.width
    const h = height || this.height
    const q = quality ?? this.quality
    const t = type || this.type
    const shouldCompress = decompression ?? false

    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = src

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = (w || image.width) as number
      canvas.height = (h || image.height) as number
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      const base64Url = canvas.toDataURL(t, q)
      if (shouldCompress) {
        this.photoCompress({ base64Url, width: w, height: h, callback, quality: q, type: t })
      } else {
        const cb = callback || this.callback
        if (typeof cb === 'function') cb(base64Url)
      }
    }

    image.onerror = () => {
      console.error('ChangeImage: 图片加载失败，请检查 URL 或跨域设置', src)
    }
  }

  /**
   * 压缩已有 Base64 图片
   */
  photoCompress(params: PhotoCompressParams = { base64Url: '' }): void {
    const { base64Url, width, height, callback, quality, type } = params
    if (!base64Url) return

    const w = width || this.width
    const h = height || this.height
    const q = quality ?? this.quality
    const t = type || this.type

    const img = new Image()
    img.src = base64Url

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = (w || img.width) as number
      canvas.height = (h || img.height) as number
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const base64 = canvas.toDataURL(t, q)
      const cb = callback || this.callback
      if (typeof cb === 'function') cb(base64)
    }

    img.onerror = () => {
      console.error('ChangeImage: Base64 图片加载失败')
    }
  }
}

export default ChangeImage
