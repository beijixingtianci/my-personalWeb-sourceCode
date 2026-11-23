import { convertImage, imageExts } from './image.js'
import { convertJsonToCsv } from './data.js'

// 后缀 → 可以转成哪些格式
export const targets = {
  png:  ['png', 'jpg', 'webp'],
  jpg:  ['png', 'jpg', 'webp'],
  jpeg: ['png', 'jpg', 'webp'],
  webp: ['png', 'jpg', 'webp'],
  json: ['csv']
}

export function getTargets(ext) {
  return targets[ext] || []
}

export async function runConvert(file, ext, targetExt) {
  if (imageExts.includes(ext)) {
    return convertImage(file, targetExt)
  }
  if (ext === 'json' && targetExt === 'csv') {
    return convertJsonToCsv(file)
  }
  throw new Error('暂不支持 .' + ext + ' 格式')
}
