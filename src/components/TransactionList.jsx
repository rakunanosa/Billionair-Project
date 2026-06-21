import './TransactionList.css'

const fmt = new Intl.NumberFormat('ja-JP')

export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p className="tx-list__empty">まだ記録がありません</p>
  }

  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') acc.income += tx.amount
      else acc.expense += tx.amount
      return acc
    },
    { income: 0, expense: 0 }
  )

  return (
    <div className="tx-list">
      <div className="tx-list__summary">
        <div className="summary-item income">
          <span className="summary-label">収入合計</span>
          <span className="summary-amount">¥{fmt.format(totals.income)}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item expense">
          <span className="summary-label">支出合計</span>
          <span className="summary-amount">¥{fmt.format(totals.expense)}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item balance">
          <span className="summary-label">収支</span>
          <span className={`summary-amount ${totals.income - totals.expense >= 0 ? 'positive' : 'negative'}`}>
            ¥{fmt.format(totals.income - totals.expense)}
          </span>
        </div>
      </div>

      <ul className="tx-list__items">
        {transactions.map(tx => (
          <li key={tx.id} className={`tx-item ${tx.type}`}>
            <div className="tx-item__left">
              <span className="tx-item__date">{tx.date}</span>
              <span className="tx-item__category">{tx.category}</span>
              {tx.memo && <span className="tx-item__memo">{tx.memo}</span>}
            </div>
            <div className="tx-item__right">
              <span className="tx-item__amount">
                {tx.type === 'expense' ? '−' : '+'}¥{fmt.format(tx.amount)}
              </span>
              <button
                className="tx-item__delete"
                onClick={() => onDelete(tx.id)}
                aria-label="削除"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
