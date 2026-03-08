<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { QFile, useQuasar, LocalStorage } from 'quasar'
import { modifiers, nameAffixes, names } from 'src/domain/static/data'

import { useI18n } from 'vue-i18n'
import { useGlobalStore } from 'src/stores/global-store'
import { similarity, useItemAddStore } from 'src/stores/item-add-store'

import { createWorker, ImageLike } from 'tesseract.js'
import type {
  Modifier,
  DropBox,
  Item,
  Similarity,
  CropBox
} from 'src/types/item'
import {
  ModifierType,
  langStr,
  defaultItem,
  //lowRate,
  midRate,
  highRate
} from 'src/types/item'
import type Cropper from 'cropperjs'

type Names = Similarity & {
  id: number
}

interface IProps {
  loading?: boolean
  disable?: boolean
}

withDefaults(defineProps<IProps>(), {
  loading: false,
  disable: false
})

const prod = import.meta.env.PROD
const emit = defineEmits(['start', 'complete', 'failed'])

const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' })
const gs = useGlobalStore()
const ias = useItemAddStore()

const progress = ref<boolean>(false)
const fileRef = ref<QFile>()
const file = ref()
const dropArea = ref<HTMLDivElement>()
const dropBox = reactive<DropBox>({
  show: false,
  enter: 0
})
const cropImage = ref<HTMLImageElement>()
const cropBox = reactive<CropBox>({
  show: false,
  origin: undefined,
  loading: true
})
let cropper: Cropper
let image: HTMLImageElement

const beforeHide = () => {
  file.value = undefined
}

const scan = async (f: File) => {
  dropBox.show = false
  cropBox.origin = URL.createObjectURL(f)

  await nextTick()

  cropBox.show = true
}

const onShowCropBox = async () => {
  const Cropper = (await import('cropperjs')).default

  if (!Cropper || !cropImage.value) {
    cropBox.show = false
    dropBox.show = true

    return
  }

  if (cropper) cropper.destroy()

  cropper = new Cropper(cropImage.value, {
    container: cropImage.value.parentElement as HTMLElement
  })

  const selection = cropper.getCropperSelection()

  if (selection) {
    selection.initialAspectRatio =
      cropImage.value.width / cropImage.value.height
    selection.initialCoverage = 0.98
    selection.zoomable = false
  }

  cropBox.loading = false
}

const onBeforeHideCropBox = () => {
  if (cropBox.origin) URL.revokeObjectURL(cropBox.origin)
  cropBox.loading = true
  cropper.destroy()
  file.value = undefined
}

const onStartFilter = async () => {
  const selection = cropper.getCropperSelection()
  const cropperImage = cropper.getCropperImage()

  if (!selection || !cropperImage) return

  const image = await cropperImage.$ready()

  const imageRect = cropperImage.getBoundingClientRect()

  const scaleX = image.naturalWidth / imageRect.width
  const scaleY = image.naturalHeight / imageRect.height

  const realCanvas = await selection.$toCanvas({
    width: Math.round(selection.width * scaleX),
    height: Math.round(selection.height * scaleY)
  })

  realCanvas?.toBlob((blob) => {
    if (blob) {
      emit('start')
      filtering(blob)
    }

    cropBox.show = false
  })
}

const recognize = async (image: ImageLike, lang: string) => {
  const locale = lang === 'ko' ? 'kor' : 'eng'
  const appVersion = LocalStorage.getItem<string>('APP_VERSION')
  const cacheMethod =
    appVersion !== import.meta.env.VITE_APP_VERSION || !prod ? 'none' : 'write'
  const worker = await createWorker(locale, 1, {
    // workerPath:
    //   'https://cdn.jsdelivr.net/npm/tesseract.js@v5.1.0/dist/worker.min.js',
    // langPath: prod
    //   ? 'https://cdn.jsdelivr.net/gh/seraMint/tessdata/'
    //   : '/tessdata/best', //'https://cdn.jsdelivr.net/gh/seraMint/tessdata', //'https://tessdata.projectnaptha.com/4.0.0',
    // corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.1.0',
    cacheMethod
  })
  await worker.setParameters({
    preserve_interword_spaces: '1'
  })

  try {
    const {
      data: { blocks }
    } = await worker.recognize(image, undefined, {
      text: false,
      blocks: true
    })

    const cleanText =
      blocks?.[0]?.paragraphs
        .flatMap((p) => p.lines)
        .filter((l) => l.confidence > 50)
        .map((l) => l.text.replace(/\n+/g, '\n'))
        .join('') ?? ''

    console.log(cleanText)

    return cleanText
  } catch (e) {
    emit('failed', e)
    return ''
  } finally {
    await worker.terminate()
  }
}

const makePlainText = (str: string, addStr = '') => {
  return str
    .replace(new RegExp(`[^${langStr[gs.lang]} ${addStr}]+`, 'gi'), '')
    .replace(/\s{1,}/gi, ' ')
    .replace(/\%{1,}/gi, '%')
    .trim()
}

const distance = (a: string, b: string) => {
  return Math.abs(a.length - b.length)
}

const findModifier = (str: string): Modifier => {
  const strArray = str.split(/[\-ㅡ\(].(?!.*[0-9]).*/i)
  let plainStr = makePlainText(strArray[0], '\\+%')

  if (!!str && !!!plainStr) plainStr = makePlainText(str, '\\(\\)\\+%')

  const findTargets = modifiers
    .filter(
      (im) =>
        im.value !== 26333 &&
        !!plainStr &&
        similarity(
          plainStr,
          makePlainText(
            im.label.replace(/%d|%i|%s/gi, '').replace(/%\+d/gi, '+'),
            '\\+%'
          )
        ) > highRate
    )
    .map(
      (im) =>
        ({
          type: ModifierType.String,
          id: im.value,
          text: im.label,
          similarity: similarity(
            plainStr,
            makePlainText(
              im.label.replace(/%d|%i|%s/gi, '').replace(/%\+d/gi, '+'),
              '\\+%'
            )
          )
        } as Modifier)
    )

  findTargets.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))

  if (findTargets[0]) {
    findTargets[0].children = ias.findChildren(
      str,
      findTargets[0].text as string,
      findTargets[0].id
    )
    //delete findTargets[0].text
    //delete findTargets[0].similarity
  }

  return findTargets[0]
}

const filterNames = (
  str: string,
  withDistance?: boolean,
  customRate?: number
) => {
  const plainText = makePlainText(str)

  if (!!!plainText) return []

  const nameAffixesWithnames = [...nameAffixes, ...names]
    .filter(
      (name) =>
        !!plainText &&
        similarity(plainText, name.label.padEnd(plainText.length, 'X')) >
          (customRate ?? midRate)
    )
    .map((name) => ({
      id: name.id as number,
      Key: name.value,
      text: name.label,
      similarity: similarity(
        plainText,
        name.label.padEnd(plainText.length, 'X')
      ),
      distance: withDistance ? distance(plainText, name.label) : 0
    }))

  nameAffixesWithnames.sort(
    (a, b) =>
      (b.similarity ?? 0) - (a.similarity ?? 0) || a.distance - b.distance
  )

  return nameAffixesWithnames
}

const findItemInfo = (
  str: string,
  names?: Array<Names>
): [Item, Array<Names>] | null => {
  const plainText = makePlainText(str)

  if (!!!plainText) return null

  const itemInfos: Array<Item> = []
  const nameInfos: Array<Names> = []

  // 1단계 : 기타, 세트, 고유, 룬어 아이템 검색
  if (!!!names || names.length === 0) {
    const funcs = [
      { name: 'misc', func: ias.misc },
      { name: 'unique', func: ias.uniques() },
      { name: 'set', func: ias.setItems() },
      { name: 'runewords', func: ias.runewords() }
    ]

    funcs.forEach((f) => {
      itemInfos.push(
        ...f.func
          .filter(
            (v) =>
              !!plainText && similarity(plainText, v.label as string) > highRate
          )
          .map(
            (v) =>
              ({
                quality: f.name !== 'misc' ? f.name : 'normal',
                category: f.name === 'misc' ? f.name : v.category,
                itemType: v.itemType,
                classType: v.classType,
                detailType: !['misc', 'runewords'].includes(f.name)
                  ? v.detailType
                  : undefined,
                item: v.value,
                imageType: !['misc', 'runewords'].includes(f.name)
                  ? v.imageType
                  : undefined,
                similarity: similarity(plainText, v.label as string)
              } as Item)
          )
      )
    })
  }

  // 2단계 : 1단계 정보를 찾지 못한 경우 이름 검색 + 무기, 방어구 검색
  if (itemInfos.length === 0) {
    const checkDetailTypes = filterNames(plainText)

    if (checkDetailTypes.map((fn) => fn.id).includes(30000)) return null

    if (checkDetailTypes.length > 0) {
      const findWP = ias
        .weapons()
        .find((w) => w.value === checkDetailTypes[0]?.Key)

      const findAM = ias
        .armor()
        .find((a) => a.value === checkDetailTypes[0]?.Key)

      if (findWP || findAM) {
        itemInfos.push({
          category: findWP ? 'weapons' : 'armor',
          itemType: findWP?.itemType ?? findAM?.itemType,
          classType: findWP?.classType ?? findAM?.classType,
          detailType: findWP?.value ?? findAM?.value,
          imageType: findWP?.imageType ?? findAM?.imageType
        } as Item)
      } else {
        const findCategory = ias
          .category()
          .filter(
            (c) =>
              !!plainText && similarity(plainText, c.label as string) > highRate
          )

        itemInfos.push({
          category: findCategory[0]?.value
        } as Item)
      }
    }

    // 이름 검색
    for (const pt of plainText.split(' ')) {
      const fn = filterNames(pt, true, 0.4)
      if (fn.length > 0) nameInfos.push(fn[0])
    }
  }

  itemInfos.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))

  return !!itemInfos[0] || nameInfos.length > 0
    ? [itemInfos[0], nameInfos]
    : null
}

const analyze = (text: string) => {
  // init item object
  const item: Item = defaultItem()

  // split carrage return
  let itemInfoArray = text
    .replace(
      new RegExp(
        `[^${langStr[gs.lang]}0-9%\\-\\(\\)\\[\\]\\/\\+\\*\\n ]`,
        'gi'
      ),
      ''
    )
    .split(/\n/gi)
    .map((iia) => iia.replace(/\*/gi, '+').replace(/\s+/g, ' ').trim())

  // find item info
  const names: Array<Names> = []
  for (let i = 0; i < itemInfoArray.length; i++) {
    const itemInfo = findItemInfo(itemInfoArray[i], names)

    if (itemInfo) {
      if (!!itemInfo[0]?.category) {
        if (names.length > 0) {
          names.splice(2, names.length)
          item.quality = item.quality ?? 'rare'
          item.names = names.map((n) => n.id)
        } else item.quality = item.quality ?? 'normal'

        Object.assign(item, itemInfo[0])
        itemInfoArray = itemInfoArray.slice(i + 2)
        break
      } else if (!!itemInfo[0]?.quality) Object.assign(item, itemInfo[0])

      names.push(...itemInfo[1])
    }
  }

  // find item modifiers
  for (const bf of itemInfoArray) {
    const findMFs = findModifier(bf)
    if (findMFs) {
      findMFs.order = item.modifiers.length
      item.modifiers.push(findMFs)
    }
  }

  item.ethereal = item.modifiers.some((m) =>
    [22745, 23049].includes(m.id as number)
  )
  item.socket =
    item.modifiers.find((m) => [3453, 23049].includes(m.id as number))
      ?.children?.[0]?.value ?? 0

  emit('complete', { item, data: image.src })
}

const filtering = (f: Blob) => {
  progress.value = true
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: false })
  const fr = new FileReader()
  fr.readAsDataURL(f)

  fr.onload = () => {
    image = new Image()
    image.src = fr.result as string
    image.onload = () => {
      const scale = Math.round((700 / image.width) * 1000) / 1000
      canvas.width = image.width * scale
      canvas.height = image.height * scale

      if (!ctx) {
        progress.value = false
        return
      }

      ctx.filter =
        'brightness(120%) contrast(200%) saturate(300%) sepia(100%) invert(100%) url(#svgThreshold)'
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      recognize(canvas, gs.lang)
        .then((text) => {
          analyze(text)
        })
        .catch((e) => {
          emit('failed', e)
        })
        .finally(() => {
          progress.value = false
        })
    }
  }
}

const click = () => {
  if ($q.platform.is.mobile) fileRef.value?.pickFiles()
  else dropBox.show = true
}

const fileCheckAndScanStart = (f?: File) => {
  if (f && f.type.indexOf('image') !== -1) scan(f)
  else {
    $q.notify({
      icon: 'error',
      color: 'negative',
      classes: '',
      message: t('analyze.notImageFormat')
    })
  }
}

const drop = (event: DragEvent) => {
  event.preventDefault()
  fileCheckAndScanStart(event.dataTransfer?.files[0])
}

const paste = (event: ClipboardEvent) => {
  event.preventDefault()
  fileCheckAndScanStart(event.clipboardData?.files[0])
}

const showDropBox = () => {
  dropArea.value?.addEventListener('drop', drop)
  document.body.addEventListener('paste', paste)
}

const beforeHideDropBox = () => {
  dropArea.value?.removeEventListener('drop', drop)
  document.body.removeEventListener('paste', paste)
}
</script>

<template>
  <div class="wrap-analysis">
    <svg xmlns="http://www.w3.org/2000/svg">
      <filter id="svgThreshold">
        <feColorMatrix
          type="matrix"
          values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues=" 0 0 0 0 0 0 0 1 1 1" />
          <feFuncG type="discrete" tableValues=" 0 0 0 0 0 0 0 1 1 1" />
          <feFuncB type="discrete" tableValues=" 0 0 0 0 0 0 0 1 1 1" />
        </feComponentTransfer>
      </filter>
    </svg>
    <q-btn
      aria-label="Tradurs Analyze Button"
      :label="t('btn.analyze')"
      color="indigo"
      @click="click"
    />
    <q-file
      v-show="false"
      ref="fileRef"
      outlined
      v-model="file"
      accept="image/*"
      @update:model-value="scan"
    />
    <q-dialog
      v-model="dropBox.show"
      @show="showDropBox"
      @before-hide="beforeHideDropBox"
    >
      <q-card flat bordered class="drop-area-wrap">
        <q-card-section class="fit q-pa-lg">
          <div
            ref="dropArea"
            class="drop-area fit column justify-center items-center text-h5 q-pa-md"
            :class="{ enter: dropBox.enter > 0 }"
            @dragenter.prevent="dropBox.enter++"
            @dragleave.prevent="dropBox.enter--"
            @dragover.prevent
            @click="fileRef?.pickFiles"
          >
            <div
              class="col column justify-center items-center q-gutter-y-sm text-uppercase"
            >
              <q-icon name="image" size="50px" />
              <div>{{ t('analyze.dragAndDrop') }}</div>
              <div class="row q-gutter-x-sm items-baseline">
                <div>{{ t('analyze.or') }}</div>
                <div class="text-primary text-underline">
                  {{ t('analyze.browse') }}
                </div>
              </div>
            </div>
            <div class="col-3 row items-center text-caption">
              {{ t('analyze.dragMessage') }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="cropBox.show"
      @show="onShowCropBox"
      @before-hide="onBeforeHideCropBox"
    >
      <q-card flat bordered class="column no-wrap crop-wrap">
        <q-card-section class="col row justify-center items-center">
          <img ref="cropImage" :src="cropBox.origin" />
          <q-inner-loading :showing="cropBox.loading">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            @click="onStartFilter"
            aria-label="Tradurs Continue Button"
            color="primary"
            text-color="dark"
            :label="t('btn.continue')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog persistent v-model="progress" @before-hide="beforeHide">
      <q-card
        flat
        bordered
        style="height: 200px; max-height: 50vh; width: 400px; max-width: 50vw"
      >
        <q-card-section class="fit row justify-center items-center">
          <div class="text-h6 row items-center q-gutter-sm">
            <div>{{ t('analyze.analyzingImage') }}</div>
            <q-spinner-dots size="sm" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.wrap-analysis {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  vertical-align: middle;

  &:deep(svg) {
    display: none;
  }
}

.drop-area-wrap {
  width: 600px;
  height: 400px;
  max-width: 80vw;
  max-height: 50vh;
}

.drop-area {
  border: dashed 4px var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  word-break: break-all;
  letter-spacing: 2px;

  &.enter {
    background-color: var(--q-dark-page);
  }
}

.crop-wrap {
  width: 700px;
  max-width: 90vw;
  height: 800px !important;
  max-height: 80vh !important;

  & img {
    max-width: 100%;
    max-height: 100%;
    visibility: hidden;
  }

  &:deep(cropper-canvas) {
    width: 100%;
    height: 100%;
  }
}
</style>
