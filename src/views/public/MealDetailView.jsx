import { useNavigate, useParams } from 'react-router-dom'
import { useMealHistoryPublic } from '../../hooks/useMealHistoryPublic'
import HistoryEntryCard from '../../components/HistoryEntryCard'

export default function MealDetailView() {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const { mealHistory, loading } = useMealHistoryPublic()
  const entry = mealHistory.find(e => e.id === menuId)

  return (
    <div className="app">
      <header className="app-header">
        <button type="button" className="header-back" onClick={() => navigate(-1)} aria-label="Back">←</button>
        <h1>Meal</h1>
      </header>
      <main className="app-content view-padded">
        {loading && <p className="empty-note">Loading&hellip;</p>}
        {!loading && !entry && <p className="empty-note">This meal couldn&apos;t be found.</p>}
        {entry && <HistoryEntryCard entry={entry} large />}
      </main>
    </div>
  )
}
