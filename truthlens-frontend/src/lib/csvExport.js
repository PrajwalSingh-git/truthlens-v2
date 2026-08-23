/**
 * Client-side CSV export. History is already fetched into the page, so
 * there's no need for a dedicated backend endpoint — this just formats
 * what's already in memory and triggers a browser download.
 */
function csvEscape(value) {
  const str = String(value ?? '')
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportHistoryToCsv(items, filename = 'truthlens-history.csv') {
  const headers = ['Title', 'Credibility', 'Date']
  const rows = items.map((item) => [
    item.title || item.input,
    Math.round(item.credibility),
    new Date(item.created_at).toISOString(),
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
