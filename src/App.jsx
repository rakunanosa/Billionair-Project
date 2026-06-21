import TransactionForm from './components/TransactionForm'
import './App.css'

function App() {
  function handleAdd(tx) {
    console.log('追加:', tx)
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">Pocket Ledger</h1>
        <p className="app-subtitle">かんたん家計簿</p>
      </header>

      <main className="app-main">
        <TransactionForm onAdd={handleAdd} />
      </main>
    </div>
  )
}

export default App
