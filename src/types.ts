export interface StyleObject {
  top: number
  left: number
  width: number
  height: number

  [key: string]: any
}

export interface StyleString {
  top: string
  left: string
  width: string
  height: string

  [key: string]: string
}

export interface DomObject {
  id: string
  tagName: string
  className: string
  style?: StyleObject
  cssText: string

  [key: string]: any
}
