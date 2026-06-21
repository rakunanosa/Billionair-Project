import './MonthNav.css'

export default function MonthNav({ month, onChange }) {
  const [year, mon] = month.split('-').map(Number)

  function shift(delta) {
    const d = new Date(year, mon - 1 + delta, 1)
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    onChange(next)
  }

  const isCurrentMonth = month === new Date().toISOString().slice(0, 7)

  return (
    <div className="month-nav">
      <button className="month-nav__arrow" onClick={() => shift(-1)} aria-label="前の月">‹</button>
      <div className="month-nav__center">
        <span className="month-nav__label">{year}年{mon}月</span>
        {!isCurrentMonth && (
          <button className="month-nav__today" onClick={() => onChange(new Date().toISOString().slice(0, 7))}>
            今月
          </button>
        )}
      </div>
      <button className="month-nav__arrow" onClick={() => shift(1)} aria-label="次の月">›</button>
    </div>
  )
}
