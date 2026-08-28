import { Link } from 'react-router-dom'
import { MEAL_TYPE_LABELS } from '../utils/constants'
import { formatDateShort } from '../utils/date'

// Compact, clickable preview of one meal history entry -- used in the
// recent list, month view, and day view. Tapping it opens the full-screen
// MealDetailView (larger photos, full per-kid detail).
export default function MealSummaryCard({ entry }) {
  return (
    <Link to={`/history/meal/${entry.id}`} className="card meal-summary-card">
      <div className="meal-summary-head">
        <strong>{MEAL_TYPE_LABELS[entry.mealType] || entry.mealType}</strong>
        <span className="meal-summary-date">{formatDateShort(entry.date)}</span>
      </div>
      <div className="meal-summary-photos">
        {(entry.orders || []).map(order => {
          const photo = entry.photos?.[order.kidId]
          return photo?.url ? (
            <img key={order.kidId} src={photo.url} alt="" className="meal-summary-thumb" />
          ) : (
            <span key={order.kidId} className="meal-summary-thumb meal-summary-thumb-empty">
              {order.kidName?.slice(0, 1).toUpperCase()}
            </span>
          )
        })}
      </div>
    </Link>
  )
}
