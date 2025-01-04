import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { computed } from 'vue'
import { LocalStorage } from 'quasar'
import stringComparison from 'string-comparison'
import type { Label, HttpRequestStore } from 'src/types/global'
import type {
  MappingId,
  CategoryLabel,
  ItemTypeLabel,
  Modifier
} from 'src/types/item'
import { ModifierType, separator, midRate, skillPrefix } from 'src/types/item'
import { useGlobalStore } from './global-store'
import itemNames from 'src/assets/items/item-names.json'
import itemNameAffixes from 'src/assets/items/item-nameaffixes.json'
import itemModifiers from 'src/assets/items/item-modifiers.json'
import itemRunes from 'src/assets/items/item-runes.json'
import itemSkills from 'src/assets/items/item-skills.json'

type BaseData = {
  platforms: Label[]
  regions: Label[]
  classes: Label[]
  quality: Label[]
  category: Label[]
  qualityMappingCategory: MappingId[]
  weaponTypes: Label[]
  weapons: MappingId[]
  armorTypes: Label[]
  armor: MappingId[]
  charmTypes: MappingId[]
  runes: MappingId[]
  gems: MappingId[]
  runewords: MappingId[]
  runewordMappingWeapon: MappingId[]
  runewordMappingArmor: MappingId[]
  runewordMappingRune: MappingId[]
  uniques: MappingId[]
  setItems: MappingId[]
  misc: MappingId[]
  status: Label[]
}

const cos = stringComparison.cosine

export const useItemAddStore = defineStore('item-add', () => {
  const gs = useGlobalStore()
  const base: HttpRequestStore<BaseData> = {
    request: 0,
    loading: false,
    data: {
      platforms: [],
      regions: [],
      classes: [],
      quality: [],
      category: [],
      qualityMappingCategory: [],
      weaponTypes: [],
      weapons: [],
      armorTypes: [],
      armor: [],
      charmTypes: [],
      runes: [],
      gems: [],
      runewords: [],
      runewordMappingWeapon: [],
      runewordMappingArmor: [],
      runewordMappingRune: [],
      uniques: [],
      setItems: [],
      misc: [],
      status: []
    }
  }

  const modifiers = computed(() =>
    itemModifiers.map((im) => ({
      value: im.id,
      label: im[gs.locale].replace(/[%]{1,}/gi, '%')
    }))
  )
  const skills = computed(() =>
    itemSkills.map((s) => ({
      value: s.id,
      label: `${
        s.Key.indexOf('skillname') !== -1 ? skillPrefix[gs.lang] : ''
      }${s[gs.locale].replace(/[%]{1,}/gi, '%')}`
    }))
  )
  const names = computed(() =>
    itemNames.map((ins) => ({
      value: ins.Key,
      label: ins[gs.locale],
      id: ins.id
    }))
  )
  const nameAffixes = computed(() =>
    itemNameAffixes.map((ina) => ({
      value: ina.Key,
      label: ina[gs.locale],
      id: ina.id
    }))
  )

  const platforms = computed(() => base.data.platforms)
  const regions = computed(() => base.data.regions)
  const ethereal = computed(() => ({
    value: 22745,
    label: modifiers.value.find((m) => m.value === 22745)?.label
  }))
  const socket = computed(() => ({
    value: 3453,
    label: modifiers.value.find((m) => m.value === 3453)?.label
  }))

  const classes = computed(() => (qualityId?: string, categoryId?: string) => {
    if (categoryId === 'weapons') {
      return qualityId === 'runewords'
        ? base.data.classes.filter((c) =>
            [
              ...new Set(
                base.data.runewordMappingWeapon
                  .filter((rmw) => !!rmw.mappingId4)
                  .map((rmw) => rmw.mappingId4)
              )
            ].includes(c.value as string)
          )
        : base.data.classes.filter((c) =>
            [
              ...new Set(
                base.data.weapons
                  .filter((w) => !!w.mappingId4)
                  .map((w) => w.mappingId4)
              )
            ].includes(c.value as string)
          )
    } else if (categoryId === 'armor') {
      return qualityId === 'runewords'
        ? base.data.classes.filter((c) =>
            [
              ...new Set(
                base.data.runewordMappingArmor
                  .filter((rma) => !!rma.mappingId3)
                  .map((rma) => rma.mappingId3)
              )
            ].includes(c.value as string)
          )
        : base.data.classes.filter((c) =>
            [
              ...new Set(
                base.data.armor
                  .filter((a) => !!a.mappingId3)
                  .map((a) => a.mappingId3)
              )
            ].includes(c.value as string)
          )
    } else return base.data.classes
  })
  const quality = computed(() => base.data.quality)
  const category = computed(
    () =>
      (qualityId?: string): Array<CategoryLabel> =>
        qualityId
          ? base.data.category.filter((c) =>
              base.data.qualityMappingCategory
                .filter((qmc) => qmc.mappingId1 === qualityId)
                .map((qmc) => qmc.mappingId2)
                .includes(c.value as string)
            )
          : base.data.category
  )
  const weaponTypes = computed(() => base.data.weaponTypes)

  const weapons = computed(
    () =>
      (weaponType?: string, classType?: string): Array<ItemTypeLabel> =>
        weaponType
          ? [
              ...new Set(
                base.data.weapons.filter((w) =>
                  ['mele', 'miss'].includes(weaponType)
                    ? w.mappingId3 === weaponType
                    : !!classType
                    ? w.mappingId4 === classType
                    : w.mappingId2 === weaponType ||
                      (!!!w.mappingId2 && !!!w.mappingId3 && !!!w.mappingId4)
                )
              )
            ].map((w) => ({
              value: w.mappingId1,
              label:
                nameAffixes.value.find((na) => na.value === w.mappingId1)
                  ?.label ??
                names.value.find((n) => n.value === w.mappingId1)?.label ??
                '',
              itemType: w.mappingId2,
              distanceType: w.mappingId3,
              classType: w.mappingId4,
              imageType: w.mappingId5
            }))
          : base.data.weapons.map((w) => ({
              value: w.mappingId1,
              label:
                nameAffixes.value.find((na) => na.value === w.mappingId1)
                  ?.label ??
                names.value.find((n) => n.value === w.mappingId1)?.label ??
                '',
              itemType: w.mappingId2,
              distanceType: w.mappingId3,
              classType: w.mappingId4,
              imageType: w.mappingId5
            }))
  )
  const armorTypes = computed(
    () => (quality?: string) =>
      quality === 'runewords'
        ? base.data.armorTypes.filter((at) =>
            [
              'clas',
              ...new Set(
                base.data.runewordMappingArmor
                  .filter((rma) => !!rma.mappingId2)
                  .map((rma) => rma.mappingId2)
              )
            ].includes(at.value as string)
          )
        : base.data.armorTypes
  )
  const armor = computed(
    () =>
      (armorType?: string, classType?: string): Array<ItemTypeLabel> =>
        armorType
          ? [
              ...new Set(
                base.data.armor.filter((a) =>
                  !!classType
                    ? a.mappingId3 === classType
                    : a.mappingId2 === armorType ||
                      (!!!a.mappingId2 && !!!a.mappingId3)
                )
              )
            ].map((a) => ({
              value: a.mappingId1,
              label:
                nameAffixes.value.find((na) => na.value === a.mappingId1)
                  ?.label ??
                names.value.find((n) => n.value === a.mappingId1)?.label ??
                '',
              itemType: a.mappingId2,
              classType: a.mappingId3,
              imageType: a.mappingId4
            }))
          : base.data.armor.map((a) => ({
              value: a.mappingId1,
              label:
                nameAffixes.value.find((na) => na.value === a.mappingId1)
                  ?.label ??
                names.value.find((n) => n.value === a.mappingId1)?.label ??
                '',
              itemType: a.mappingId2,
              classType: a.mappingId3,
              imageType: a.mappingId4
            }))
  )

  const charmTypes = computed(() =>
    base.data.charmTypes.map((ct) => ({
      value: ct.mappingId1,
      label: names.value.find((n) => n.value === ct.mappingId1)?.label ?? ''
    }))
  )

  const runes = computed(
    () =>
      base.data.runes.map((r) => ({
        value: r.mappingId1,
        label:
          itemRunes.find((ir) => ir.id === r.mappingId1)?.[gs.locale] ?? '',
        detailType: r.mappingId1
      })) as Array<ItemTypeLabel>
  )

  const gems = computed(
    () =>
      base.data.gems.map((g) => ({
        value: g.mappingId1,
        label:
          nameAffixes.value.find((na) => na.id === g.mappingId1)?.label ??
          names.value.find((n) => n.id === g.mappingId1)?.label ??
          ''
      })) as Array<ItemTypeLabel>
  )

  const runewords = computed(
    () =>
      (
        weaponType?: string,
        armorType?: string,
        classType?: string
      ): Array<ItemTypeLabel> =>
        [
          ...new Set(
            base.data.runewords.filter((rw) =>
              !!weaponType
                ? base.data.runewordMappingWeapon
                    .filter((rmw) =>
                      ['mele', 'miss'].includes(weaponType)
                        ? (rmw.mappingId3 = weaponType)
                        : !!classType
                        ? rmw.mappingId4 === classType
                        : rmw.mappingId2 === weaponType ||
                          (!!!rmw.mappingId2 &&
                            !!!rmw.mappingId3 &&
                            !!!rmw.mappingId4)
                    )
                    .map((rmw) => rmw.mappingId1)
                    .includes(rw.mappingId1)
                : !!armorType
                ? base.data.runewordMappingArmor
                    .filter((rma) =>
                      !!classType
                        ? rma.mappingId3 === classType
                        : rma.mappingId2 === armorType ||
                          (!!!rma.mappingId2 && !!!rma.mappingId3)
                    )
                    .map((rma) => rma.mappingId1)
                    .includes(rw.mappingId1)
                : !!rw.mappingId1
            )
          )
        ].map((rw) => ({
          value: rw.mappingId1,
          label:
            itemRunes.find((ir) => ir.id === rw.mappingId1)?.[gs.locale] ?? ''
        }))
  )

  const runewordsRecipes = computed(
    () => (item: number) =>
      base.data.runewordMappingRune.filter((rmr) => rmr.mappingId1 === item)
  )

  const uniques = computed(
    () => (category?: string) =>
      base.data.uniques
        .filter((u) => u.mappingId2 === (category ?? u.mappingId2))
        .map((u) => ({
          value: u.mappingId1,
          label:
            nameAffixes.value.find((na) => na.id === u.mappingId1)?.label ??
            names.value.find((n) => n.id === u.mappingId1)?.label,
          category: u.mappingId2,
          itemType: u.mappingId11 ?? u.mappingId3 ?? u.mappingId7,
          detailType: u.mappingId4 ?? u.mappingId8,
          classType: u.mappingId5 ?? u.mappingId9,
          imageType: u.mappingId6 ?? u.mappingId10
        })) as Array<ItemTypeLabel>
  )

  const setItems = computed(
    () => (category?: string) =>
      base.data.setItems
        .filter((s) => s.mappingId2 === (category ?? s.mappingId2))
        .map((s) => ({
          value: s.mappingId1,
          label:
            nameAffixes.value.find((na) => na.id === s.mappingId1)?.label ??
            names.value.find((n) => n.id === s.mappingId1)?.label,
          category: s.mappingId2,
          itemType: s.mappingId3 ?? s.mappingId7,
          detailType: s.mappingId4 ?? s.mappingId8,
          classType: s.mappingId5 ?? s.mappingId9,
          imageType: s.mappingId6 ?? s.mappingId10
        })) as Array<ItemTypeLabel>
  )

  const misc = computed(
    () =>
      base.data.misc.map((m) => ({
        value: m.mappingId1,
        label:
          modifiers.value.find((mf) => mf.value === m.mappingId1)?.label ??
          nameAffixes.value.find((na) => na.id === m.mappingId1)?.label ??
          names.value.find((n) => n.id === m.mappingId1)?.label
      })) as Array<ItemTypeLabel>
  )

  const status = computed(
    () => (code?: string) =>
      code ? base.data.status.filter((s) => s.value === code) : base.data.status
  )

  const removeMatchWords = (str: string, targetStr?: string) => {
    if (!!!targetStr) return str

    let plainStr = str.replace(/[0-9%\+\-]/gi, '').replace(/[ ]{1,}/gi, ' ')
    const plainTargetStr = targetStr
      .replace(separator, '')
      .replace(/[%]{1,}/gi, '')
      .replace(/[ ]{1,}/gi, ' ')
    plainTargetStr.split(' ').forEach((s) => {
      plainStr = plainStr.replace(s, '')
    })

    return plainStr.trim()
  }

  const findModifierOrSkill = (
    str: string,
    targetId?: number,
    targetStr?: string
  ) => {
    if (!!!str) return []

    const plainStr = removeMatchWords(str, targetStr)

    const findMSs = [...skills.value, ...modifiers.value]
      .filter(
        (ims) =>
          ims.value !== (targetId ?? '') &&
          !!str &&
          cos.similarity(plainStr, ims.label) > midRate
      )
      .map((ims) => ({
        type: ModifierType.String,
        id: ims.value,
        similarity: cos.similarity(plainStr, ims.label)
      }))

    findMSs.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))

    return findMSs
  }

  const findChildren = (
    str: string,
    targetStr: string,
    targetId?: number
  ): Array<Modifier> => {
    const children: Array<Modifier> = []
    const numberStr = str.match(/[+-]?[0-9]+/gi)
    const matchTargetStr = targetStr.match(separator)

    let numberCnt = 0
    matchTargetStr?.forEach((mts, i) => {
      if (mts === '%s') {
        const modifierOrSkill = findModifierOrSkill(str, targetId, targetStr)

        children.push({
          order: i,
          type: ModifierType.String,
          value: modifierOrSkill[0]?.id
        })
      } else {
        let value = undefined
        const isNum = !isNaN(Number(numberStr?.[numberCnt]))
        if (isNum) {
          value = Number(numberStr?.[numberCnt])
          numberCnt++
        } else value = 0
        children.push({
          order: i,
          type: mts === '%i' ? ModifierType.Integer : ModifierType.Decimal,
          signed: ['%+d', '-%d'].includes(mts),
          value
        })
      }
    })

    const modifierOrSkill2 =
      str.split(/[\-ㅡ\(].(?!.*[0-9]).*/i).length > 1
        ? findModifierOrSkill(str.split(/[\-\ㅡ\(]/i)[1], targetId)
        : []

    children.push({
      order: children.length,
      type: ModifierType.Connect,
      value: ![targetId, ...children.map((c) => c.value)].includes(
        modifierOrSkill2[0]?.id
      )
        ? modifierOrSkill2[0]?.id
        : undefined
    })

    return children
  }

  const getBase = () => {
    return new Promise<void>((resolve, reject) => {
      const error: unknown = null
      const data = LocalStorage.getItem<string>('base') ?? ''
      if (!!data && base.request === 0) {
        base.request++
        base.data = JSON.parse(data)
        //Object.assign(base.data, JSON.parse(data))
        resolve()
      } else if (base.request === 0) {
        base.request++
        base.loading = true
        api
          .get<BaseData>('/d2/item/base')
          .then((response) => {
            if (response?.data) {
              LocalStorage.setItem('base', JSON.stringify(response.data))
              base.data = response.data
              //Object.assign(base.data, response.data)
              // base.data.platforms.push(...response.data.platforms)
              // base.data.regions.push(...response.data.regions)
              // base.data.classes.push(...response.data.classes)
              // base.data.quality.push(...response.data.quality)
              // base.data.category.push(...response.data.category)
              // base.data.qualityMappingCategory.push(
              //   ...response.data.qualityMappingCategory
              // )
              // base.data.weaponTypes.push(...response.data.weaponTypes)
              // base.data.weapons.push(...response.data.weapons)
              // base.data.armorTypes.push(...response.data.armorTypes)
              // base.data.armor.push(...response.data.armor)
              // base.data.charmTypes.push(...response.data.charmTypes)
              // base.data.runes.push(...response.data.runes)
              // base.data.gems.push(...response.data.gems)
              // base.data.runewords.push(...response.data.runewords)
              // base.data.runewordMappingWeapon.push(
              //   ...response.data.runewordMappingWeapon
              // )
              // base.data.runewordMappingArmor.push(
              //   ...response.data.runewordMappingArmor
              // )
              // base.data.runewordMappingRune.push(
              //   ...response.data.runewordMappingRune
              // )
              // base.data.uniques.push(...response.data.uniques)
              // base.data.setItems.push(...response.data.setItems)
              // base.data.misc.push(...response.data.misc)
              // base.data.status.push(...response.data.status)
            }
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => {
            base.loading = false

            if (error) reject()
            else resolve()
          })
      } else resolve()
    })
  }

  return {
    base,
    modifiers,
    skills,
    names,
    nameAffixes,
    platforms,
    regions,
    ethereal,
    socket,
    classes,
    quality,
    category,
    weaponTypes,
    weapons,
    armorTypes,
    armor,
    charmTypes,
    runes,
    gems,
    runewords,
    runewordsRecipes,
    uniques,
    setItems,
    misc,
    status,
    getBase,
    findChildren
  }
})
