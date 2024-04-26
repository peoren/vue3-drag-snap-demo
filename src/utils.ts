import {StyleObject} from "./types";
// @ts-ignore
import dayjs from 'dayjs'
import axios from 'axios'
import { saveAs } from 'file-saver'
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
 * @param style
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


/** 格式化时间 */
export const formatDateTime = (time: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) {
    return 'N/A'
  }
  // @ts-ignore
  const date = new Date(time)
  return dayjs(date).format(format)
}

/** 用 JS 获取全局 css 变量 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ''
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 用 JS 设置全局 CSS 变量 */
export const setCssVariableValue = (cssVariableName: string, cssVariableValue: string) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** 防抖，只有最后一次操作能被触发 */
export class Debounced {
  private timer: any
  /**
   * @param func 需要包装的函数
   * @param delay 延迟时间，单位ms
   */
  public use = (func: Function, delay = 200): Function => {
    return (...args: any) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }
}

/** 节流，返回函数连续调用时，间隔时间必须大于或等于 delay，func 才会执行 */
export class Throttle {
  private timer: any
  private resetTimer: any
  /**
   * @param func 需要包装的函数
   * @param delay 延迟时间，单位ms
   * @param immediate 是否默认执行一次(第一次不延迟)
   */
  public use = (func: Function, delay = 200, immediate = false): Function => {
    let flag = true
    let isImmediate = immediate
    return (...args: any) => {
      clearTimeout(this.resetTimer)
      if (isImmediate) {
        func.apply(this, args)
        isImmediate = false
        return
      }
      if (!flag) {
        return
      }
      flag = false
      this.timer = setTimeout(() => {
        func.apply(this, args)
        flag = true
        this.resetTimer = setTimeout(() => {
          isImmediate = immediate
        }, delay)
      }, delay)
    }
  }
}

/**
 * 获取本地静态图片地址（用于动态引入图片）
 * @param url 图片地址
 * @returns 可正常访问的图片地址
 */
export const getImgHref = (url: string) => {
  // @ts-ignore
  return new URL(`../assets/${url}`, import.meta.url).href
}

/**
 * 简化object属性，删除空值
 * @param obj 对象参数
 * @returns 简化后的对象
 */
// export const simplifyObject = (obj: Object): object => {
//   return Object.fromEntries(
//       Object.entries(obj)
//           .filter(([key, val]) => key && val !== null && typeof val !== 'undefined' && val !== '')
//           .map(([k, v]) => [k, v === Object(v) ? simplifyObject(v) : v])
//   )
// }

/**
 * JSON数据检查
 * @param json 字符串
 * @returns
 */
export const checkJSON = <T = object>(json: any): T | null => {
  let data = json
  if (typeof data === 'string') {
    try {
      data = JSON.parse(json)
    } catch (e) {
      return null
    }
  }
  if (data && typeof data === 'object') {
    return JSON.parse(JSON.stringify(data))
  } else {
    return null
  }
}

/**
 * 将数字转换为星期
 * @param day 数字
 * @return 星期汉字
 */
export function NumToWeek(day: number) {
  let result = ''
  if (day === 0) {
    return ''
  }
  if (isNaN(day)) {
    // 验证输入的字符是否为数字
    return ''
  }

  switch (day.toString()) {
    case '1':
      result = '一'
      break
    case '2':
      result = '二'
      break
    case '3':
      result = '三'
      break
    case '4':
      result = '四'
      break
    case '5':
      result = '五'
      break
    case '6':
      result = '六'
      break
    case '7':
      result = '天'
      break
  }
  return result
}

/**
 * 阿拉伯数字转换为简写汉字
 * @param num 阿拉伯数字
 * @return  汉字
 */
export function NumToSimplifiedChinese(num: number) {
  if (num === 0) {
    return '零'
  }

  // 字符处理完毕后开始转换，采用前后两部分分别转换
  const part = String(num).split('.')
  let newchar = ''
  // 小数点前进行转化
  for (let i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      // alert('位数过大，无法计算')
      return ''
    } // 若数量超过拾亿单位，提示
    let tmpnewchar = ''
    const perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = `零${tmpnewchar}`
        break
      case '1':
        tmpnewchar = `一${tmpnewchar}`
        break
      case '2':
        tmpnewchar = `二${tmpnewchar}`
        break
      case '3':
        tmpnewchar = `三${tmpnewchar}`
        break
      case '4':
        tmpnewchar = `四${tmpnewchar}`
        break
      case '5':
        tmpnewchar = `五${tmpnewchar}`
        break
      case '6':
        tmpnewchar = `六${tmpnewchar}`
        break
      case '7':
        tmpnewchar = `七${tmpnewchar}`
        break
      case '8':
        tmpnewchar = `八${tmpnewchar}`
        break
      case '9':
        tmpnewchar = `九${tmpnewchar}`
        break
    }
    switch (part[0].length - i - 1) {
      case 0:
        break
      case 1:
        if (perchar !== '0') tmpnewchar = `${tmpnewchar}十`
        break
      case 2:
        if (perchar !== '0') tmpnewchar = `${tmpnewchar}百`
        break
      case 3:
        if (perchar !== '0') tmpnewchar = `${tmpnewchar}千`
        break
      case 4:
        tmpnewchar = `${tmpnewchar}万`
        break
      case 5:
        if (perchar !== '0') tmpnewchar = `${tmpnewchar}十`
        break
      case 6:
        if (perchar !== '0') tmpnewchar = `${tmpnewchar}百`
        break
      case 7:
        if (perchar !== '0') tmpnewchar = `${tmpnewchar}千`
        break
      case 8:
        tmpnewchar = `${tmpnewchar}亿`
        break
      case 9:
        tmpnewchar = `${tmpnewchar}十`
        break
    }
    newchar = tmpnewchar + newchar
  }
  // 替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search('零零') !== -1 || newchar.search('零亿') !== -1 || newchar.search('亿万') !== -1 || newchar.search('零万') !== -1) {
    newchar = newchar.replace('零亿', '亿')
    newchar = newchar.replace('亿万', '亿')
    newchar = newchar.replace('零万', '万')
    newchar = newchar.replace('零零', '零')
  }
  // 替换以“一十”开头的，为“十”
  if (newchar.indexOf('一十') === 0) {
    newchar = newchar.substr(1)
  }
  // 替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') === newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1)
  }
  return newchar
}

/**
 * 下载文件
 * @param url 文件地址
 * @param name 文件名
 */
export const downloadUrl = (url: string, name: string) => {
  const downUrl = url.indexOf('//') === 0 ? window.location.protocol + url : url
  const a = document.createElement('a')
  const downName = downUrl.split('/').pop()
  const type = downName?.split('.').pop()
  // 资源同域默认该窗口打开，不同域新窗口打开
  const origin = window.location.origin
  // 判断地址是否带协议，带协议可能跨域
  const check = downUrl.indexOf('http') === 0
  // 带协议则比较origin是否一致，不一致则在新窗口打开，防止文件变成直接打开而不是下载
  if ((check && downUrl.indexOf(origin) !== 0) || type === 'pdf') {
    a.target = '_blank'
  }
  a.href = downUrl
  a.download = name || downName || ''
  a.click()
}

/**
 * 下载文件（通过url获取文件流方式下载）
 * @param fileName 文件名称
 * @param url 文件url地址
 */
export const downloadFileByAxios = (fileName: string, url: string) => {
  // 分割地址字符串
  const fileArr = url.split('://')?.pop()?.split('/') || []
  // 去掉服务器ip及端口
  fileArr.shift()

  // 返回axios请求
  // @ts-ignore
  return new Promise(resolve => {
    axios
        .get(fileArr.join('/'), { responseType: 'blob' })
        .then(res => {
          // 保存文件流
          saveAs(new Blob([res.data]), fileName)
          resolve(true)
        })
        .catch(() => {
          // 创建xhr请求
          const xhr = new XMLHttpRequest()
          // 设置get请求及其请求参数
          xhr.open('GET', url, true)
          // 设置响应类型
          xhr.responseType = 'blob'
          // 请求完成回调
          xhr.onload = function () {
            // 获取响应数据
            const blob = xhr.response
            // 获取navigator
            const nav = window.navigator as any
            // windowd对象包含msSaveOrOpenBlob方法
            if (nav.msSaveOrOpenBlob) {
              // IE导出
              nav.msSaveOrOpenBlob(blob, fileName)
              resolve(true)
            } else {
              // 创建a标签
              const a = document.createElement('a')
              // 设置下载的文件名称
              a.download = fileName
              // 设置下载地址
              a.href = URL.createObjectURL(blob)
              // 创建鼠标事件（兼容ie）
              const evt = document.createEvent('MouseEvents')
              // 下载
              evt.initEvent('click', true, true)
              a.dispatchEvent(evt)
              resolve(true)
            }
          }
          // 发送请求
          xhr.send()
        })
  })
}

/**
 * 过滤html中的style
 * @param html html字符串
 * @return 过滤后的字符串
 */
export const filterHtmlStyleStr = (html: string) => {
  const reg = /style\s*?=\s*?(['"])[\s\S]*?\1/
  return html ? html.replace(reg, '') : ''
}
/**
 * @description 通过地址获文件名称
 * @return {string}
 * @param url
 */
export const getFileNameFromUrl = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1)
}
/**
 * @description 解析url参数
 * @return {Record<string, string>}
 * @param url
 */
export const parseUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {}

  const queryString = url.split('?')[1]
  if (queryString) {
    const keyValuePairs = queryString.split('&')
    keyValuePairs.forEach(keyValue => {
      const [key, value] = keyValue.split('=')
      params[key] = decodeURIComponent(value)
    })
  }

  return params
}
export function checkInput(target: HTMLElement | SVGElement) {
  const tagName = target.tagName.toLowerCase()

  return (target as HTMLElement).isContentEditable || tagName === 'input' || tagName === 'textarea'
}
