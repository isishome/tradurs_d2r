export type User = {
  id?: string
  avatar?: number
  battleTag?: string
  yolk: number
  temperature: number
  online: boolean
  owner: boolean
}

export const defaultUser = (): User => {
  return {
    id: undefined,
    avatar: undefined,
    battleTag: undefined,
    yolk: 0,
    temperature: 0,
    online: false,
    owner: false
  }
}
