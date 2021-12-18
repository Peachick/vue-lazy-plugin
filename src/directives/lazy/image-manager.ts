import { ImageManagerOpts, DirectiveBindingElemType } from './types'

export enum IMAGE_STATUS {
  LOADING,
  LOADED,
  ERROR,
}

let uid = 1

class ImageManager {
  src: string
  el: DirectiveBindingElemType
  loading: string
  error: string
  status: IMAGE_STATUS
  uid!: number
  cache!: Set<string>
  isBackGround: boolean

  constructor(opts: ImageManagerOpts) {
    this.src = opts.src
    this.el = opts.el
    this.cache = opts.cache
    this.loading = opts.loading
    this.error = opts.error
    this.isBackGround = opts.isBackGround || false
    this.uid = uid++

    this.status = IMAGE_STATUS.LOADING
    this.render(this.loading)
  }

  render(src: string) {
    if (this.isBackGround) {
      this.el.style.backgroundImage = `url(${src})`
      return
    }
    this.el.setAttribute('src', src)
  }

  load(next?: Function) {
    if (this.status > IMAGE_STATUS.LOADING) return
    if (this.cache.has(this.src)) {
      this.render(this.src)
      this.status = IMAGE_STATUS.LOADED
      return
    }
    this.renderSrc(next)
  }

  update(src: string) {
    if (src !== this.src) {
      this.src = src
      this.status = IMAGE_STATUS.LOADING
    }
  }

  renderSrc(next?: Function) {
    loadImage(this.src)
      .then(() => {
        this.status = IMAGE_STATUS.LOADED
        this.render(this.src)
        this.cache.add(this.src)
        next && next()
      })
      .catch((e) => {
        this.status = IMAGE_STATUS.ERROR
        this.render(this.error)
        this.cache.add(this.error)
        console.warn(`v-lazy:load img ${this.src} failed, ${e.message}.`)
        next && next()
      })
  }
}

function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve(true)
      img.onload = null
    }

    img.onerror = (err) => {
      reject(err)
      img.onerror = null
    }

    img.src = src
  })
}

export { ImageManager }