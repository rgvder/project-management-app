export type TChildComponentProps = {
  fill?: string
  size?: number
  height?: number
  width?: number
}

export type TModalProps = {
  isShowing: boolean
  hide: () => void
  action: string
}
