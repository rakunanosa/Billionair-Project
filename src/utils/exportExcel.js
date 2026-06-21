import * as XLSX from 'xlsx'

export function exportToExcel(transactions) {
  const rows = transactions.map(tx => ({
    日付: tx.date,
    種別: tx.type === 'income' ? '収入' : '支出',
    カテゴリ: tx.category,
    金額: tx.amount,
    メモ: tx.memo || '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  ws['!cols'] = [
    { wch: 12 },
    { wch: 8 },
    { wch: 14 },
    { wch: 12 },
    { wch: 30 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '家計簿')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `pocket-ledger-${date}.xlsx`)
}
