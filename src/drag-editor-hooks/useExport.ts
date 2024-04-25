import { DomObject } from '@/views/admin/system/lab-center/components/types'
import { saveAs } from 'file-saver' // 将cubes转换为json格式，并存为文件，用file-save包下载
// 将cubes转换为json格式，并存为文件，用file-save包下载
const exportJson = (cubes: DomObject[]) => {
  // 将数组转换为JSON字符串
  const jsonString = JSON.stringify(cubes)

  // 创建一个Blob对象，类型为application/json
  const blob = new Blob([jsonString], { type: 'application/json' })

  // 使用FileSaver保存文件
  saveAs(blob, 'cubes.json')
}

/**
 * 从指定的URL读取JSON文件。
 *
 * @param {string} fileUrl - JSON文件的URL。
 * @return {Promise<object>} 解析后的JSON对象。
 */
async function readJsonFile(fileUrl: string) {
  try {
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error('读取JSON文件失败。')
    }
    const json = await response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}

const importJson = async (url: string = 'src/views/admin/system/lab-center/components/jsonFile/cubes.json') => {
  const json = await readJsonFile(url)

  return json
}
const useExport = () => {
  return {
    exportJson,
    importJson
  }
}
export default useExport
