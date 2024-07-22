export type User = {
  id?: string
  battleTag?: string
  yolk: number
  temperature: number
  notifyNew: boolean
}

export const defaultUser = (): User => {
  return {
    id: undefined,
    battleTag: undefined,
    yolk: 0,
    temperature: 0,
    notifyNew: false
  }
}
