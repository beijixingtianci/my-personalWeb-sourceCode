export async function convertJsonToCsv(file) {
  const text = await file.text()
  let rows
  try {
    rows = JSON.parse(text)
  } catch {
    throw new Error('这不是合法的 JSON 文件')
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('JSON 需要是对象数组，例如 [{"name":"A","age":1}]')
  }

  const headers = Object.keys(rows[0])
  const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"'
  const lines = [
    headers.map(esc).join(','),
    ...rows.map(row => headers.map(h => esc(row[h])).join(','))
  ]

  // \ufeff 是 BOM，让 Excel 打开 CSV 时中文不乱码
  return new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
}
