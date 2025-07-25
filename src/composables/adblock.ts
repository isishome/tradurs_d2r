import { Notify, QNotifyAction } from 'quasar'
import { i18n } from 'src/boot/i18n'

const prod: boolean = import.meta.env.PROD

export function useAdBlock() {
  const check = ({ actions }: { actions?: Array<QNotifyAction> }) => {
    if (Math.random() > 0.8 && prod && !process.env.SERVER) {
      fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
        .then(() => {
          //
        })
        .catch(() => {
          Notify.create({
            progress: true,
            icon: 'warning',
            color: 'warning',
            textColor: 'dark',
            multiLine: true,
            message: i18n.global.t('adblock.title'),
            caption: i18n.global.t('adblock.contents'),
            actions
          })
        })
    }
  }

  return { check }
}
