import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pocket-ledger-transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  function addTransaction(tx) {
    setTransactions(prev => [tx, ...prev])
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  return { transactions, addTransaction, deleteTransaction }
}
