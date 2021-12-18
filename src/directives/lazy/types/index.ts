import { DirectiveBinding } from 'vue/types/options'

export interface LazyOpts {
  loading?: string
  error?: string
}

export interface DirectiveBindingType extends DirectiveBinding {
  value: { src: string, loading?: string, error?: string } | string
}

export type DirectiveBindingElemType = HTMLImageElement | HTMLElement

export type ImageManagerOpts = {
  el: DirectiveBindingElemType
  src: string
  cache: Set<string>
  loading: string
  error: string
  isBackGround?: boolean
}
