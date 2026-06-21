import { useState } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import MonthNav from './components/MonthNav'
import SyncButton from './components/SyncButton'
import { useTransactions } from './hooks/useTransactions'
import { useAuth } from './hooks/useAuth'
import { exportToExcel } from './utils/exportExcel'
import './App.css'

function App() {
  const { transactions, addTransaction, deleteTransaction, unsyncedTransactions, markSynced } = useTransactions()
  const { account, login, logout, getToken } = useAuth()
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const filtered = transactions.filter(tx => tx.date.startsWith(month))

  return (
    <div className="app-layout">
      <header className="app-header">
        <div>
          <h1 className="app-title">Pocket Ledger</h1>
          <p className="app-subtitle">かんたん家計簿</p>
        </div>
        <div className="app-header__actions">
          {filtered.length > 0 && (
            <button className="export-btn" onClick={() => exportToExcel(filtered, month)}>
              Excelで出力
            </button>
          )}
          <SyncButton
            account={account}
            onLogin={login}
            onLogout={logout}
            getToken={getToken}
            unsyncedTransactions={unsyncedTransactions}
            onSynced={markSynced}
          />
        </div>
      </header>

      <main className="app-main">
        <TransactionForm onAdd={addTransaction} />
        <div className="app-section-gap" />
        <MonthNav month={month} onChange={setMonth} />
        <div className="app-section-gap" />
        <TransactionList transactions={filtered} onDelete={deleteTransaction} />
      </main>
    </div>
  )
}

export default App
