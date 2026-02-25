import itemSkills from 'src/assets/items/item-skills.json'
import itemModifiers from 'src/assets/items/item-modifiers.json'
import itemRunes from 'src/assets/items/item-runes.json'
import itemNames from 'src/assets/items/item-names.json'
import itemNameAffixes from 'src/assets/items/item-nameaffixes.json'

import type { Locale } from 'src/types/global'
import { skillPrefix } from 'src/types/item'

type StaticData = {
  value: string | number
  label: string
  key?: string
  id?: number
}

export let skills: StaticData[]
export let modifiers: StaticData[]
export let runes: StaticData[]
export let names: StaticData[]
export let nameAffixes: StaticData[]

const buildSkills = (locale: Locale) => {
  const map = new Map<
    string,
    { id: number; Key: string; koKR: string; enUS: string }
  >()

  for (const item of itemSkills) {
    const key = `${item.koKR}||${item.enUS}`

    if (!map.has(key)) map.set(key, item)
  }

  const skillData = Array.from(map.values()).map((s) => ({
    value: s.id,
    key: s.Key,
    label: s[locale].replace(/[%]{1,}/gi, '%')
  }))

  skillData.sort((a, b) => {
    const aHas = /^skillname/i.test(a.key) || /Name$/.test(a.key)
    const bHas = /^skillname/i.test(b.key) || /Name$/.test(b.key)

    if (aHas && !bHas) return -1
    if (!aHas && bHas) return 1

    return a.label.length - b.label.length
  })

  return skillData
}

const buildModifiers = (locale: Locale) => {
  const map = new Map<
    string,
    { id: number; Key: string; koKR: string; enUS: string }
  >()

  for (const item of itemModifiers) {
    const key = `${item.koKR}||${item.enUS}`

    if (!map.has(key)) map.set(key, item)
  }

  const skillModifiers = skills.map((s) => ({
    ...s,
    label:
      /^skillname/i.test(s.key ?? '') || /Name$/.test(s.key ?? '')
        ? `${skillPrefix[locale]}${s.label}`
        : s.label
  }))

  return [
    ...Array.from(map.values()).map((im) => ({
      value: im.id,
      label: im[locale].replace(/[%]{1,}/gi, '%')
    })),
    ...skillModifiers
  ]
}

const buildRunes = (locale: Locale) =>
  itemRunes.map((ir) => ({ value: ir.id, key: ir.Key, label: ir[locale] }))

const buildNames = (locale: Locale) =>
  itemNames.map((iname) => ({
    value: iname.Key,
    label: iname[locale],
    id: iname.id
  }))

const buildNameAffixes = (locale: Locale) =>
  itemNameAffixes.map((ina) => ({
    value: ina.Key,
    label: ina[locale],
    id: ina.id
  }))

export const init = (locale: Locale) => {
  skills = buildSkills(locale)
  modifiers = buildModifiers(locale)
  runes = buildRunes(locale)
  names = buildNames(locale)
  nameAffixes = buildNameAffixes(locale)
}
