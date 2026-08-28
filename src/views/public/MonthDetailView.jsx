import { Link, useParams } from 'react-router-dom'
import { useMealHistoryPublic } from '../../hooks/useMealHistoryPublic'
import HistoryNav from '../../components/HistoryNav'
import MealSummaryCard from '../../components/MealSummaryCard'
import { formatMonthYear } from '../../utils/date'

export default function MonthDetailView() {
  const { year, month } = useParams()
  const { mealHistory, loading } = useMealHistoryPublic()
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  const entries = mealHistory
    .filter(e => e.date?.startsWith(prefix))
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="app">
      <header className="app-header"><h1>{formatMonthYear(Number(year), Number(month) - 1)}</h1></header>
      <HistoryNav />
      <main className="app-content view-padded">
        {loading && <p className="empty-note">Loading&hellip;</p>}
        {!loading && entries.length === 0 && <p className="empty-note">No meals recorded this month.</p>}
        {entries.map(entry => <MealSummaryCard key={entry.id} entry={entry} />)}
        <Link to={`/history/calendar/${year}`} className="btn-ghost btn-sm">← Back to calendar</Link>
      </main>
    </div>
  )
}
