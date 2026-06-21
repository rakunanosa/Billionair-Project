import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import { useTransactions } from './hooks/useTransactions'
import './App.css'

function App() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions()

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">Pocket Ledger</h1>
        <p className="app-subtitle">かんたん家計簿</p>
      </header>

      <main className="app-main">
        <TransactionForm onAdd={addTransaction} />
        <div className="app-section-gap" />
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </main>
    </div>
  )
}

export default App
