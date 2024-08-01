import { i18n } from 'src/boot/i18n'
import { Notify } from 'quasar'
import { Manager } from 'socket.io-client'
import { useAccountStore } from 'src/stores/account-store'
import { useItemStore } from 'src/stores/item-store'

const prod = import.meta.env.PROD
const reconnectionAttempts = 3
let reconnectionCount = 0

export const initMessenger = async () => {
  const as = useAccountStore()
  const is = useItemStore()

  const manager = new Manager(import.meta.env.VITE_APP_SOCKET, {
    withCredentials: prod,
    transports: ['websocket'],
    reconnectionAttempts
  })

  as.messenger = manager.socket('/messenger')

  const reconnect = (message = i18n.global.t('socket.disconnect')) => {
    Notify.create({
      icon: 'warning',
      color: 'warning',
      textColor: 'dark',
      multiLine: true,
      message,
      timeout: 0,
      actions: [
        {
          dense: true,
          class: 'no-hover text-underline',
          label: i18n.global.t('btn.reConnect'),
          color: 'dark',
          handler: () => {
            reconnectionCount = 0
            as.messenger?.connect()
          }
        }
      ]
    })
  }

  as.messenger.on('connect', () => {
    as.messenger?.emit('join', as.info.id)
  })

  as.messenger.on('connect_error', () => {
    if (!!!as.signed) return

    reconnectionCount++
    if (reconnectionCount >= reconnectionAttempts) reconnect()
  })

  as.messenger.on('disconnect', () => {
    if (!!!as.signed) return
  })

  as.messenger.on('error', (data: string) => {
    Notify.create({
      icon: 'error',
      type: 'negative',
      message: i18n.global.t(`socket.${data}`)
    })
  })

  as.messenger.on(
    'updateBids',
    ({ itemId, completed }: { itemId: number; completed: boolean }) => {
      is.notify.queues.push({ itemId, completed })
      is.notify.request++
    }
  )

  as.messenger.on(
    'riseTemperature',
    ({
      bidId,
      itemId,
      temperature
    }: {
      bidId?: number
      itemId: number
      temperature: number
    }) => {
      as.checkSign().then(() => {
        is.notify.queues.push({ bidId, itemId, temperature })
        is.notify.request++
      })
    }
  )
}

export const sound = () => {
  const audio = new Audio('/sounds/notify.wav')
  audio.play()
}
