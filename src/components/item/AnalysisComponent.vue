<script setup lang="ts">
import { reactive, ref } from 'vue'
import { QFile, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import stringComparison from 'string-comparison'
import { createWorker, ImageLike } from 'tesseract.js'
import { useGlobalStore } from 'src/stores/global-store'
import { useItemAddStore } from 'src/stores/item-add-store'
import type { Modifier, DropBox, Item, Similarity } from 'src/types/item'
import {
  ModifierType,
  langStr,
  defaultItem,
  lowRate,
  midRate,
  highRate
} from 'src/types/item'

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
const emit = defineEmits(['start', 'end', 'failed'])

const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' })
const gs = useGlobalStore()
const ias = useItemAddStore()

const cos = stringComparison.cosine

const progress = ref<boolean>(false)
const fileRef = ref<QFile>()
const file = ref()

const beforeHide = () => {
  file.value = undefined
}

const scan = (f: File) => {
  dropBox.show = false
  emit('start')

  filtering(f)
}

const recognize = async (image: ImageLike, lang: string) => {
  const locale = lang === 'ko' ? ['kor', 'kodia'] : 'eng'
  //const worker = await createWorker(locale)
  const worker = await createWorker(locale, 1, {
    workerPath:
      'https://cdn.jsdelivr.net/npm/tesseract.js@v5.1.0/dist/worker.min.js',
    langPath: prod
      ? 'https://cdn.jsdelivr.net/gh/seraMint/tessdata/'
      : '/tessdata/best', //'https://cdn.jsdelivr.net/gh/seraMint/tessdata', //'https://tessdata.projectnaptha.com/4.0.0',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.1.0',
    cacheMethod: prod ? 'write' : 'none'
  })
  await worker.setParameters({
    preserve_interword_spaces: '1'
  })

  try {
    const {
      data: { text }
    } = await worker.recognize(image)
    return text
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

// const distance = (a: string, b: string) => {
//   return Math.abs(a.length - b.length)
// }

const findModifier = (str: string): Modifier => {
  const strArray = str.split(/[\-ㅡ\(].(?!.*[0-9]).*/i)
  let plainStr = makePlainText(strArray[0], '\\+%')

  if (!!str && !!!plainStr) plainStr = makePlainText(str, '\\(\\)\\+%')

  const findTargets = [...ias.modifiers, ...ias.skills]
    .filter(
      (im) =>
        im.value !== 26333 &&
        !!plainStr &&
        cos.similarity(
          plainStr,
          makePlainText(
            im.label.replace(/%d|%i|%s/gi, '').replace(/%\+d/gi, '+'),
            '\\+%'
          )
        ) > lowRate
    )
    .map(
      (im) =>
        ({
          type: ModifierType.String,
          id: im.value,
          text: im.label,
          similarity: cos.similarity(
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
    delete findTargets[0].text
    delete findTargets[0].similarity
  }

  return findTargets[0]
}

const filterNames = (str: string) => {
  const plainText = makePlainText(str)

  if (!!!plainText) return []

  const names = [...ias.nameAffixes, ...ias.names]
    .filter(
      (name) => !!plainText && cos.similarity(plainText, name.label) > midRate
    )
    .map((name) => ({
      id: name.id,
      Key: name.value,
      text: name.label,
      similarity: cos.similarity(plainText, name.label)
    }))

  names.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))

  return names
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
              !!plainText &&
              cos.similarity(plainText, v.label as string) > highRate
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
                similarity: cos.similarity(plainText, v.label as string)
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
              !!plainText &&
              cos.similarity(plainText, c.label as string) > highRate
          )

        itemInfos.push({
          category: findCategory[0]?.value
        } as Item)
      }

      // 이름 검색
      for (const pt of plainText.split(' ')) {
        const fn = filterNames(pt)
        if (fn.length > 0) nameInfos.push(fn[0])
      }
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
    .map((iia) => iia.replace(/\*/gi, '+').trim())
    .filter(
      (iia) =>
        (iia.match(/[\s]{1}/gi)?.length ?? 0) <=
        (iia.match(/[^\s]{1}/gi)?.length ?? 0)
    )

  //console.log(itemInfoArray.join('\n'))

  // find item info
  const names: Array<Names> = []
  for (let i = 0; i < itemInfoArray.length; i++) {
    const itemInfo = findItemInfo(itemInfoArray[i], names)

    if (itemInfo) {
      if (!!itemInfo[0].category) {
        if (names.length > 0) {
          names.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
          names.splice(2, names.length)
          item.quality = item.quality ?? 'rare'
          item.names = names.map((n) => n.id)
        } else item.quality = item.quality ?? 'normal'

        Object.assign(item, itemInfo[0])
        itemInfoArray = itemInfoArray.slice(i + 2)
        break
      } else if (!!itemInfo[0].quality) Object.assign(item, itemInfo[0])

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

  emit('end', item)
}

const filtering = (f: File) => {
  progress.value = true
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: false })
  const fr = new FileReader()
  fr.readAsDataURL(f)

  fr.onload = () => {
    const image = new Image()
    image.src = fr.result as string
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      if (ctx) {
        ctx.filter =
          'brightness(120%) contrast(200%) saturate(300%) sepia(100%) invert(100%) url(#svgThreshold)'
        ctx.drawImage(image, 0, 0)

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
      } else progress.value = false
    }
  }
}

const click = () => {
  if ($q.platform.is.mobile) fileRef.value?.pickFiles()
  else dropBox.show = true
}

const dropArea = ref<HTMLDivElement>()
const dropBox = reactive<DropBox>({
  show: false,
  enter: 0
})

const fileCheckAndScanStart = (f?: File) => {
  if (f && f.type.indexOf('image') !== -1) scan(f)
  else {
    $q.notify({
      icon: 'img:/images/icons/alert.svg',
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
        <q-card-section class="fit">
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
  border-radius: 0;
  cursor: pointer;
  word-break: break-all;
  letter-spacing: 2px;

  &.enter {
    background-color: var(--q-dark-page);
  }
}
</style>
