import { useData } from '../../context/DataContext'
import HistoryEntryCard from '../../components/HistoryEntryCard'
import { toMillis } from '../../utils/date'

export default function KidHistoryView({ kid }) {
  const { mealHistory } = useData()
  const sorted = mealHistory
    .filter(e => e.date)
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))

  return (
    <div className="app">
      <header className="app-header kid-header" style={{ background: kid.color }}>
        <h1>No meal right now</h1>
      </header>
      <main className="app-content view-padded">
        <p className="empty-note">Check back when a parent opens a new menu! Here&apos;s what you&apos;ve eaten so far:</p>
        {sorted.length === 0 && <p className="empty-note">No meals recorded yet.</p>}
        {sorted.map(entry => <HistoryEntryCard key={entry.id} entry={entry} />)}
      </main>
    </div>
  )
}
