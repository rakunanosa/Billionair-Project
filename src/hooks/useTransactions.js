import { useState, useEffect } from 'react'

const TX_KEY = 'pocket-ledger-transactions'
const SYNCED_KEY = 'pocket-ledger-synced'

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(TX_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [syncedIds, setSyncedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(SYNCED_KEY)
      return new Set(JSON.parse(saved) || [])
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(SYNCED_KEY, JSON.stringify([...syncedIds]))
  }, [syncedIds])

  function addTransaction(tx) {
    setTransactions(prev => [tx, ...prev])
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
    setSyncedIds(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  function markSynced(ids) {
    setSyncedIds(prev => new Set([...prev, ...ids]))
  }

  const unsyncedTransactions = transactions.filter(tx => !syncedIds.has(tx.id))

  return { transactions, addTransaction, deleteTransaction, unsyncedTransactions, markSynced }
}
