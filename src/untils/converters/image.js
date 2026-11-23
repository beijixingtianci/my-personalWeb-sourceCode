const MIME = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
}

export const imageExts = ['png', 'jpg', 'jpeg', 'webp']

export async function convertImage(file, targetExt) {
    const mime = MIME[targetExt]
    if (!mime) throw new Error('不支持的图片格式转换' + targetExt)

    const bitmap = await createImageBitmap(file) //原生API，解码图片数据 await异步等待
    const canvas = document.createElement('canvas') //创建画布
    canvas.width = bitmap.width //设置画布宽度
    canvas.height = bitmap.height //设置画布高度
    const ctx = canvas.getContext('2d') //获取画布上下文

    // jpg 不支持透明，先铺白底，否则透明区域会变黑
    if (targetExt === 'jpg' || targetExt === 'jpeg') {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.drawImage(bitmap, 0, 0) //绘制图片到画布上
    bitmap.close() //释放bitmap资源

    return await new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => blob ? resolve(blob) : reject(new Error('图片转换失败')),
            mime,
            0.92
        )
    })
}