import type { QSsrContext } from '@quasar/app-vite'
import { Cookies } from 'quasar'

export const cookies = {
  obj: Cookies,
  create: (ssrContext?: QSsrContext | null) => {
    cookies.obj = import.meta.env.SSR ? Cookies.parseSSR(ssrContext) : Cookies
  }
}

type CookieOptions = {
  /**
   * Cookie expires detail; If specified as Number, then the unit is days; If specified as String, it can either be raw stringified date or in Xd Xh Xm Xs format (see examples)
   */
  expires?: number | string | Date
  /**
   * Cookie path
   */
  path?: string
  /**
   * Cookie domain
   */
  domain?: string
  /**
   * SameSite cookie option
   */
  sameSite?: 'Lax' | 'Strict' | 'None'
  /**
   * Is cookie Http Only?
   */
  httpOnly?: boolean
  /**
   * Is cookie secure? (https only)
   */
  secure?: boolean
  /**
   * Raw string for other cookie options; To be used as a last resort for possible newer props that are currently not yet implemented in Quasar
   */
  other?: string
}

export const useCookies = () => {
  const get = (name: string) => {
    return cookies.obj.get(name)
  }

  const set = (name: string, value: string, options?: CookieOptions) => {
    const cookieOptions = {
      ...options,
      path: '/',
      sameSite: 'Strict' as 'Lax' | 'Strict' | 'None',
      secure: true
    }

    cookies.obj.set(name, value, cookieOptions)
  }

  const remove = (name: string) => {
    cookies.obj.remove(name, { path: '/' })
  }

  const has = (name: string) => {
    return cookies.obj.has(name)
  }

  return { get, set, has, remove }
}
