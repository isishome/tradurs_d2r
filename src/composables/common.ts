import { copyToClipboard, Notify } from 'quasar'
import { i18n } from 'src/boot/i18n'

export const clipboard = (text: string, msg: string) => {
  if (!text || text.trim() === '') return

  copyToClipboard(text)
    .then(() => {
      Notify.create({
        message: i18n.global.t('messages.clipboard', { t: msg })
      })
    })
    .catch(() => {
      // fail
    })
}

export const positive = (msg: string) => {
  Notify.create({
    color: 'positive',
    message: msg
  })
}

export const negative = (msg: string) => {
  Notify.create({
    color: 'negative',
    message: msg
  })
}

export const notify = (msg: string) => {
  Notify.create({
    color: 'blue-grey-3',
    textColor: 'dark-page',
    message: msg
  })
}

// sleep
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
