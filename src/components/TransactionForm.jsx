import { useState } from 'react'
import './TransactionForm.css'

const CATEGORIES = {
  expense: ['食費', '外食費', '交通費', '住居費', '光熱費・水道', '医療費', '娯楽費', '衣服・美容', '通信費', '教育費', '日用品', 'その他'],
  income: ['給与', 'ボーナス', '副業', '投資', 'その他'],
}

const today = () => new Date().toISOString().slice(0, 10)

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [form, setForm] = useState({
    date: today(),
    category: CATEGORIES.expense[0],
    amount: '',
    memo: '',
  })

  function handleTypeChange(next) {
    setType(next)
    setForm(f => ({ ...f, category: CATEGORIES[next][0] }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return
    onAdd({ ...form, type, amount: Number(form.amount), id: Date.now() })
    setForm(f => ({ ...f, amount: '', memo: '' }))
  }

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <h2 className="tx-form__title">収支を追加</h2>

      <div className="tx-form__type-toggle">
        <button
          type="button"
          className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          支出
        </button>
        <button
          type="button"
          className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          収入
        </button>
      </div>

      <div className="tx-form__fields">
        <label className="field">
          <span>日付</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>カテゴリ</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES[type].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>金額（円）</span>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0"
            min="1"
            required
          />
        </label>

        <label className="field field--full">
          <span>メモ</span>
          <input
            type="text"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="任意"
            maxLength={100}
          />
        </label>
      </div>

      <button type="submit" className={`tx-form__submit ${type}`}>
        追加する
      </button>
    </form>
  )
}
