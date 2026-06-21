import * as XLSX from 'xlsx'

const GRAPH = 'https://graph.microsoft.com/v1.0'
const FILE = 'pocket-ledger.xlsx'
const SHEET = 'データ'
const HEADERS = ['日付', '種別', 'カテゴリ', '金額', 'メモ', '登録日時']

function authHeader(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function fileExists(token) {
  const res = await fetch(`${GRAPH}/me/drive/root:/${FILE}`, {
    headers: authHeader(token),
  })
  return res.ok
}

async function createFile(token) {
  const ws = XLSX.utils.aoa_to_sheet([HEADERS])
  ws['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 14 }, { wch: 12 }, { wch: 30 }, { wch: 20 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, SHEET)
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })

  const res = await fetch(`${GRAPH}/me/drive/root:/${FILE}:/content`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    body: new Uint8Array(buffer),
  })
  if (!res.ok) throw new Error('ファイル作成に失敗しました')
  await new Promise(r => setTimeout(r, 2000))
}

async function createSession(token) {
  const res = await fetch(`${GRAPH}/me/drive/root:/${FILE}:/workbook/createSession`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ persistChanges: true }),
  })
  if (!res.ok) throw new Error('セッション作成に失敗しました')
  const data = await res.json()
  return data.id
}

async function closeSession(token, sessionId) {
  await fetch(`${GRAPH}/me/drive/root:/${FILE}:/workbook/closeSession`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'workbook-session-id': sessionId, 'Content-Type': 'application/json' },
  })
}

async function getUsedRowCount(token, sessionId) {
  const res = await fetch(
    `${GRAPH}/me/drive/root:/${FILE}:/workbook/worksheets('${SHEET}')/usedRange?$select=rowCount`,
    { headers: { Authorization: `Bearer ${token}`, 'workbook-session-id': sessionId } }
  )
  if (!res.ok) return 1
  const data = await res.json()
  return data.rowCount ?? 1
}

async function appendRows(token, sessionId, transactions, startRow) {
  const values = transactions.map(tx => [
    tx.date,
    tx.type === 'income' ? '収入' : '支出',
    tx.category,
    tx.amount,
    tx.memo || '',
    new Date(tx.id).toLocaleString('ja-JP'),
  ])
  const endRow = startRow + values.length - 1
  const address = `A${startRow}:F${endRow}`

  const res = await fetch(
    `${GRAPH}/me/drive/root:/${FILE}:/workbook/worksheets('${SHEET}')/range(address='${address}')`,
    {
      method: 'PATCH',
      headers: { ...authHeader(token), 'workbook-session-id': sessionId },
      body: JSON.stringify({ values }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || '書き込みに失敗しました')
  }
}

export async function syncToOneDrive(token, transactions) {
  if (transactions.length === 0) return

  const exists = await fileExists(token)
  if (!exists) await createFile(token)

  const sessionId = await createSession(token)
  try {
    const rowCount = await getUsedRowCount(token, sessionId)
    const startRow = rowCount + 1
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id)
    await appendRows(token, sessionId, sorted, startRow)
  } finally {
    await closeSession(token, sessionId)
  }
}
