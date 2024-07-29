export enum Lang {
  KO = 'ko',
  EN = 'en'
}

export type Meta = {
  title: string
  description: string
  keywords: string
}

export type Label = {
  value: string | number
  label: string
  lang?: string
}

export type HttpRequestStore<T> = {
  request: number
  loading: boolean
  data: T
}

export type Page = {
  rows: number
  over: boolean
  more: boolean
}

export type Size = {
  width: number
  height: number
}

type AdsensePosition = {
  timeStamp: number
  adKey: number
}

export type Adsense = {
  reloadAdKey: number
  timeLimit: number
  top: AdsensePosition
  bottom: AdsensePosition
  left: AdsensePosition
  right: AdsensePosition
}
