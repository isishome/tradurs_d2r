import { Lang } from './global'
import type { Label } from './global'
import { User } from './user'
import { i18n } from 'src/boot/i18n'

export enum ModifierType {
  String = 'string',
  Decimal = 'decimal',
  Integer = 'integer',
  Connect = 'connect'
}

export enum BaseType {
  Default = 'default',
  Filter = 'filter'
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
  winAmount?: number
}

export type Bid = {
  id?: number
  itemId?: number
  amount: number
  user?: User
  regDate?: string
  won: boolean
  rate?: number
}

export type Modifier = Similarity & {
  order: number
  itemId?: number
  type?: ModifierType
  signed?: boolean
  id?: number
  value?: number
  children?: Array<Modifier>
}

export type Item = Similarity & {
  region?: string
  ladder: boolean
  hardcore: boolean
  ethereal: boolean | null
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
  statusCode?: string
  favorite: boolean
  rate?: number
  loading: boolean
}

export type ModifierGroup = {
  value?: number
  groups: Array<Modifier>
}

export type Filter = Item & {
  mine?: string
  modifierGroups?: Array<ModifierGroup>
}

export const allLabel = (): Label => {
  return {
    value: 'all',
    label: i18n.global.t('global.all')
  }
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
    statusCode: undefined,
    favorite: false,
    rate: undefined,
    loading: false
  }
}

export const defaultPrice = (): Price => {
  return {
    item_id: undefined,
    category: undefined,
    item: undefined,
    unitAmount: 1,
    startAmount: 1,
    instantAmount: undefined,
    winAmount: undefined
  }
}

export const defaultBid = (): Bid => {
  return {
    id: undefined,
    itemId: undefined,
    amount: 1,
    user: undefined,
    regDate: undefined,
    won: false
  }
}

export const defaultFilter = (): Filter => {
  return {
    ...defaultItem(),
    region: 'all',
    ethereal: null,
    quality: 'all',
    statusCode: 'all',
    mine: undefined,
    modifierGroups: []
  }
}

export const separator = /\-%d|%\+d|%d|%i|%s/gi
export const lowRate = 0.5
export const midRate = 0.6
export const highRate = 0.7
