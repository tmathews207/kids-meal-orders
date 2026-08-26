import { Link, useParams } from 'react-router-dom'
import { useMealHistoryPublic } from '../../hooks/useMealHistoryPublic'
import HistoryNav from '../../components/HistoryNav'
import { monthGrid, todayISO } from '../../utils/date'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MonthTile({ year, monthIdx, datesWithMeals, today }) {
  const cells = monthGrid(year, monthIdx)
  const isoFor = day => `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <div className="calendar-tile">
      <h4>{MONTH_NAMES[monthIdx]}</h4>
      <div className="calendar-tile-weekdays">
        {WEEKDAY_INITIALS.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className="calendar-tile-grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const iso = isoFor(day)
          const todayClass = iso === today ? ' is-today' : ''
          return datesWithMeals.has(iso) ? (
            <Link key={i} to={`/history/day/${iso}`} className={`calendar-day has-meal${todayClass}`}>{day}</Link>
          ) : (
            <span key={i} className={`calendar-day${todayClass}`}>{day}</span>
          )
        })}
      </div>
    </div>
  )
}

export default function CalendarView() {
  const params = useParams()
  const year = Number(params.year) || new Date().getFullYear()
  const { mealHistory, loading } = useMealHistoryPublic()
  const datesWithMeals = new Set(mealHistory.map(e => e.date).filter(Boolean))
  const today = todayISO()

  return (
    <div className="app">
      <header className="app-header"><h1>Meal History</h1></header>
      <HistoryNav />
      <main className="app-content view-padded">
        <div className="calendar-year-nav">
          <Link to={`/history/calendar/${year - 1}`} className="btn-ghost btn-sm">← {year - 1}</Link>
          <strong>{year}</strong>
          <Link to={`/history/calendar/${year + 1}`} className="btn-ghost btn-sm">{year + 1} →</Link>
        </div>
        {loading && <p className="empty-note">Loading&hellip;</p>}
        <div className="calendar-grid">
          {MONTH_NAMES.map((_, idx) => (
            <MonthTile key={idx} year={year} monthIdx={idx} datesWithMeals={datesWithMeals} today={today} />
          ))}
        </div>
      </main>
    </div>
  )
}
