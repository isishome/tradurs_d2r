import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from 'src/boot/axios'
import { Socket } from 'socket.io-client'
import type { AxiosRequestConfig } from 'axios'
import type { User } from 'src/types/user'
import { defaultUser } from 'src/types/user'
import type { Page } from 'src/types/global'

export const useAccountStore = defineStore('account', () => {
  const signed = ref<boolean>(false)
  const info = reactive<User>(defaultUser())
  const messenger = ref<Socket>()
  const messagePage = reactive<Page>({
    rows: 20,
    over: false,
    more: false
  })

  const checkSign = (options?: AxiosRequestConfig) => {
    return new Promise<void>((resolve, reject) => {
      api
        .get('/account/signed', options)
        .then((response) => {
          Object.assign(info, response.data)
          signed.value = typeof response.data.id !== 'undefined'
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  }
  const signOut = (options?: AxiosRequestConfig) => {
    return new Promise<boolean>((resolve, reject) => {
      api
        .get('/account/signOut', options)
        .then(() => {
          signed.value = false
          Object.assign(info, defaultUser())
          messenger.value?.disconnect()
          messenger.value = undefined
          resolve(false)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  return {
    signed,
    info,
    messenger,
    messagePage,
    checkSign,
    signOut
  }
})
