import { useState } from 'react'
import { syncToOneDrive } from '../utils/graphApi'
import './SyncButton.css'

export default function SyncButton({ account, authReady, onLogin, onLogout, getToken, unsyncedTransactions, onSynced }) {
  const [status, setStatus] = useState('idle')

  if (!authReady) {
    return (
      <button className="sync-btn sync-btn--login" disabled>
        読み込み中...
      </button>
    )
  }

  if (!account) {
    return (
      <button className="sync-btn sync-btn--login" onClick={onLogin}>
        Microsoftでログイン
      </button>
    )
  }

  async function handleSync() {
    if (unsyncedTransactions.length === 0) return
    setStatus('syncing')
    try {
      const token = await getToken()
      await syncToOneDrive(token, unsyncedTransactions)
      onSynced(unsyncedTransactions.map(tx => tx.id))
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      console.error(e)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const count = unsyncedTransactions.length

  return (
    <div className="sync-group">
      {status === 'idle' && count > 0 && (
        <button className="sync-btn sync-btn--sync" onClick={handleSync}>
          Excelに同期（{count}件）
        </button>
      )}
      {status === 'idle' && count === 0 && (
        <span className="sync-status sync-status--done">同期済み ✓</span>
      )}
      {status === 'syncing' && <span className="sync-status sync-status--syncing">同期中...</span>}
      {status === 'done' && <span className="sync-status sync-status--done">完了 ✓</span>}
      {status === 'error' && <span className="sync-status sync-status--error">失敗 — 再試行してください</span>}
      <button className="sync-btn sync-btn--logout" onClick={onLogout} title="ログアウト">
        {account.name ?? account.username}
      </button>
    </div>
  )
}
