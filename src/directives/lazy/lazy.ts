import { DirectiveBindingType, LazyOpts, DirectiveBindingElemType } from './types'
import { ImageManager, IMAGE_STATUS } from './image-manager'

// 可以默认一张图片
import { defaultImage } from './default-data'

const DEFAULT_URL = defaultImage

class Lazy {
  cache: Set<string> = new Set()
  managerQueue: Array<ImageManager> = []
  observer!: IntersectionObserver
  loading!: string
  error!: string
  supportObserver: boolean = ('IntersectionObserver' in window)

  constructor(options: LazyOpts) {
    this.loading = options.loading || DEFAULT_URL
    this.error = options.error || DEFAULT_URL
    this.init()
  }

  add(el: DirectiveBindingElemType, binding: DirectiveBindingType) {
    let src, error, loading
    const isBackGround = (binding.arg && binding.arg.toLocaleUpperCase() === 'BACKGROUNDIMAGE') as boolean
    if (typeof binding.value === 'object') {
      src = binding.value.src || ''
      error = binding.value.error
      loading = binding.value.loading
    } else {
      src = binding.value || ''
    }
    const manager = new ImageManager({
      el,
      src,
      cache: this.cache,
      loading: loading || this.loading,
      error: error || this.error,
      isBackGround
    })

    this.managerQueue.push(manager)

    if (this.supportObserver) {
      this.observer.observe(el)
    } else {
      const screenHeight: number = document.documentElement.clientHeight
      setTimeout(() => this.doScrollCallback(screenHeight))
    }
  }

  update(el: HTMLImageElement, binding: DirectiveBindingType) {
    const src = binding.value as string
    const [manager] = this.managerQueue.filter((m) => m.el == el)
    if (manager) {
      manager.update(src)
    }
  }

  init() {
    if (this.supportObserver) {
      this.initInterSectionObserver()
    } else {
      this.initScrollListener()
    }
  }

  initInterSectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const manager = this.managerQueue.find((manager) => manager.el === entry.target)
          if (manager) {
            if (manager.status > IMAGE_STATUS.LOADING) {
              this.removeManager(manager)
              return
            }
            manager.load()
          }
        }
      })
    }, { rootMargin: '0px', threshold: 0.2})
  }

  initScrollListener() {
    const screenHeight: number = document.documentElement.clientHeight
    window.addEventListener('scroll', () => {
      this.doScrollCallback(screenHeight)
    })
  }

  doScrollCallback(screenHeight: number) {
    this.managerQueue.forEach((manager) => {
      const rest = manager.el.getBoundingClientRect()
      if (manager.status > IMAGE_STATUS.LOADING) {
        this.removeManager(manager)
        return
      }
      
      if (rest.top >= 0 && rest.top <= screenHeight - 100) {
        manager.load()
      }
    })
  }

  removeManager(manager: ImageManager) {
    const findIndex = this.managerQueue.map((m) => m.uid).indexOf(manager.uid)
    if (findIndex > -1) {
      this.managerQueue.splice(findIndex, 1)
    }
    if (this.observer) {
      this.observer.unobserve(manager.el)
    }
  }
}

export default {
  install(Vue: any, options: LazyOpts = {}) {
    const lazy = new Lazy(options)
    Vue.directive('lazy', {
      bind: lazy.add.bind(lazy),
      update: lazy.update.bind(lazy)
    })
  }
}