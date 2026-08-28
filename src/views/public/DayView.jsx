import { Link, useParams } from 'react-router-dom'
import { useMealHistoryPublic } from '../../hooks/useMealHistoryPublic'
import HistoryNav from '../../components/HistoryNav'
import MealSummaryCard from '../../components/MealSummaryCard'
import { formatDateLong } from '../../utils/date'

export default function DayView() {
  const { date } = useParams()
  const { mealHistory, loading } = useMealHistoryPublic()
  const entries = mealHistory.filter(e => e.date === date)

  return (
    <div className="app">
      <header className="app-header"><h1>{formatDateLong(date)}</h1></header>
      <HistoryNav />
      <main className="app-content view-padded">
        {loading && <p className="empty-note">Loading&hellip;</p>}
        {!loading && entries.length === 0 && <p className="empty-note">No meals recorded for this day.</p>}
        {entries.map(entry => <MealSummaryCard key={entry.id} entry={entry} />)}
        <Link to="/history/calendar" className="btn-ghost btn-sm">← Back to calendar</Link>
      </main>
    </div>
  )
}
