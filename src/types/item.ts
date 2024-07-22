import { Lang } from './global'
import type { Label } from './global'
import { User } from './user'

export enum ModifierType {
  String = 'string',
  Decimal = 'decimal',
  Integer = 'integer',
  Connect = 'connect'
}

type LangString = Record<Lang, string>
type SkillPrefix = Record<Lang, string>
type RandImage = Record<string, number>

export const langStr: LangString = {
  ko: '가-힣',
  en: 'a-zA-Z'
}

export const skillPrefix: SkillPrefix = {
  ko: '+%d ',
  en: '+%d to '
}

export const randImage: RandImage = {
  rings: 5,
  amulets: 3,
  jewels: 6,
  charms: 3
}

export type Similarity = {
  similarity?: number
  text?: string
}

export type DropBox = {
  show: boolean
  enter: number
}

export type MappingId = {
  mappingId1: string | number
  mappingId2: string
  mappingId3?: string
  mappingId4?: string
  mappingId5?: string
  mappingId6?: string
  mappingId7?: string
  mappingId8?: string
  mappingId9?: string
  mappingId10?: string
  mappingId11?: string
}

export type CategoryLabel = ItemTypeLabel & {
  currency?: boolean
}

export type ItemTypeLabel = Label & {
  category?: string
  itemType?: string
  distanceType?: string
  classType?: string
  detailType?: string
  imageType?: string
}

export type Price = {
  item_id?: number
  category?: string
  item?: number
  unitAmount: number
  startAmount: number
  instantAmount?: number
}

export type Bid = {
  id?: number
  item_id?: number
  amount: number
  user: User
}

export type Modifier = Similarity & {
  order: number
  item_id?: number
  type: ModifierType
  signed?: boolean
  id?: number
  value?: number
  children?: Array<Modifier>
}

export type Item = Similarity & {
  region?: string
  ladder: boolean
  hardcore: boolean
  ethereal: boolean
  socket: number
  id?: number
  name?: string
  names: Array<number>
  quality?: string
  category?: string
  itemType?: string
  classType?: string
  detailType?: string
  item?: number
  imageType?: string
  imageId?: number
  quantity: number
  modifiers: Array<Modifier>
  price: Price
  user?: User
  regDate?: string
  startDate?: string
  progressTime?: number
  addProgressTime?: number
  show: boolean
}

export const defaultItem = (): Item => {
  return {
    region: undefined,
    ladder: true,
    hardcore: false,
    ethereal: false,
    socket: 0,
    id: undefined,
    name: undefined,
    names: [],
    quality: undefined,
    category: undefined,
    itemType: undefined,
    classType: undefined,
    detailType: undefined,
    item: undefined,
    imageType: undefined,
    imageId: undefined,
    quantity: 1,
    modifiers: [],
    price: defaultPrice(),
    user: undefined,
    regDate: undefined,
    startDate: undefined,
    progressTime: 60,
    addProgressTime: 0,
    show: false
  }
}

export const defaultPrice = (): Price => {
  return {
    item_id: undefined,
    category: 'runes',
    item: 10906,
    unitAmount: 1,
    startAmount: 1,
    instantAmount: undefined
  }
}

export const separator = /\-%d|%\+d|%d|%i|%s/gi
export const lowRate = 0.5
export const midRate = 0.6
export const highRate = 0.7
