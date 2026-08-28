import { useMealHistoryPublic } from '../../hooks/useMealHistoryPublic'
import HistoryNav from '../../components/HistoryNav'
import MealSummaryCard from '../../components/MealSummaryCard'
import { formatMonthYear, todayISO } from '../../utils/date'

const RECENT_WINDOW_DAYS = 30

function daysAgoISO(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return todayISO(d)
}

export default function MonthListView() {
  const { mealHistory, loading } = useMealHistoryPublic()

  const cutoff = daysAgoISO(RECENT_WINDOW_DAYS)
  const recent = mealHistory.filter(e => e.date && e.date >= cutoff)

  const byMonth = new Map()
  for (const entry of recent) {
    const key = entry.date.slice(0, 7) // YYYY-MM
    if (!byMonth.has(key)) byMonth.set(key, [])
    byMonth.get(key).push(entry)
  }
  const months = [...byMonth.keys()].sort().reverse()

  return (
    <div className="app">
      <header className="app-header"><h1>Meal History</h1></header>
      <HistoryNav />
      <main className="app-content view-padded">
        {loading && <p className="empty-note">Loading&hellip;</p>}
        {!loading && months.length === 0 && <p className="empty-note">No meals in the last {RECENT_WINDOW_DAYS} days.</p>}
        {months.map(key => {
          const [y, m] = key.split('-').map(Number)
          const entries = byMonth.get(key).sort((a, b) => (a.date < b.date ? 1 : -1))
          return (
            <div key={key} className="history-month-group">
              <h2>{formatMonthYear(y, m - 1)}</h2>
              {entries.map(entry => <MealSummaryCard key={entry.id} entry={entry} />)}
            </div>
          )
        })}
      </main>
    </div>
  )
}
