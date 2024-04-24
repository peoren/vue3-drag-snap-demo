import { StyleObject } from '@/views/admin/system/lab-center/components/types'

export type CSSProperties = {
  [property: string]: string | number
}

export function cssObjectToString(cssObject: CSSProperties): string {
  return Object.keys(cssObject)
    .map(key => {
      // 将属性名从 camelCase 转换为 kebab-case
      const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      return `${kebabKey}: ${cssObject[key]};`
    })
    .join(' ')
}

export function stringToCssObject(cssString: string): CSSProperties {
  const cssObject: CSSProperties = {}
  const lines = cssString.split('\n') // 按行分割 CSS 字符串

  lines.forEach(line => {
    const [rawKey, value] = line.split(':') // 分割每行为键和值
    if (rawKey && value) {
      const key = rawKey.trim().replace(/-([a-z])/g, (match, char) => char.toUpperCase()) // 将 kebab-case 转换为 camelCase
      cssObject[key] = value.trim().replace(';', '') // 去除尾部的分号
    }
  })

  return cssObject
}

/**
 * @description 样式转换
 * @return {undefined} 描述返回值
 * @param StyleString
 */
export const translateStyle = (style: StyleObject) => {
  return {
    ...style,
    top: `${style.top}px`,
    left: `${style.left}px`,
    width: `${style.width}px`,
    height: `${style.height}px`,
    border: '1px solid #000',
    backgroundColor: style.backgroundColor
  }
}
