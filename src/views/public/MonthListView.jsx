import { useMealHistoryPublic } from '../../hooks/useMealHistoryPublic'
import HistoryNav from '../../components/HistoryNav'
import HistoryEntryCard from '../../components/HistoryEntryCard'
import { formatMonthYear } from '../../utils/date'

export default function MonthListView() {
  const { mealHistory, loading } = useMealHistoryPublic()

  const byMonth = new Map()
  for (const entry of mealHistory) {
    if (!entry.date) continue
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
        {!loading && months.length === 0 && <p className="empty-note">No meals recorded yet.</p>}
        {months.map(key => {
          const [y, m] = key.split('-').map(Number)
          const entries = byMonth.get(key).sort((a, b) => (a.date < b.date ? 1 : -1))
          return (
            <div key={key} className="history-month-group">
              <h2>{formatMonthYear(y, m - 1)}</h2>
              {entries.map(entry => <HistoryEntryCard key={entry.id} entry={entry} />)}
            </div>
          )
        })}
      </main>
    </div>
  )
}
