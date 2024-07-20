export enum Lang {
  KO = 'ko',
  EN = 'en'
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
