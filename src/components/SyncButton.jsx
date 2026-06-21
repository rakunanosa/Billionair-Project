import { useState } from 'react'
import { syncToOneDrive } from '../utils/graphApi'
import './SyncButton.css'

export default function SyncButton({ account, authReady, onLogin, onLogout, getToken, unsyncedTransactions, onSynced }) {
  const [status, setStatus] = useState('idle')

  async function handleSync() {
    setStatus('syncing')
    try {
      let currentAccount = account
      if (!currentAccount) {
        currentAccount = await onLogin()
      }
      const token = await getToken(currentAccount)
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
  const isSyncing = status === 'syncing'
  const allSynced = account && count === 0

  const label = isSyncing
    ? '同期中...'
    : account
      ? count > 0 ? `OneDriveに同期（${count}件）` : '同期済み ✓'
      : 'OneDriveに同期'

  return (
    <div className="sync-group">
      {status === 'done' && <span className="sync-status sync-status--done">完了 ✓</span>}
      {status === 'error' && <span className="sync-status sync-status--error">失敗 — 再試行してください</span>}

      <button
        className="sync-btn sync-btn--sync"
        onClick={handleSync}
        disabled={isSyncing || !authReady || allSynced}
      >
        {label}
      </button>

      {account && (
        <button className="sync-btn sync-btn--logout" onClick={onLogout} title="ログアウト">
          {account.name ?? account.username}
        </button>
      )}
    </div>
  )
}
