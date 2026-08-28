import HistoryOrderSummary from './HistoryOrderSummary'
import { MEAL_TYPE_LABELS } from '../utils/constants'
import { formatDateLong } from '../utils/date'

// Full detail rendering of one meal history entry -- all kids' orders,
// photos, and tips. `large` renders bigger photos, for the full-screen
// meal detail page; omit it for a smaller inline card.
export default function HistoryEntryCard({ entry, large }) {
  return (
    <div className="card history-entry">
      <h3>{MEAL_TYPE_LABELS[entry.mealType] || entry.mealType} — {formatDateLong(entry.date)}</h3>
      {(entry.orders || []).map(order => (
        <div key={order.kidId} className="history-order-block">
          <strong>{order.kidName}</strong>
          <HistoryOrderSummary order={order} />
          <div className="history-photo-tip">
            {entry.photos?.[order.kidId]?.url && (
              <img
                src={entry.photos[order.kidId].url}
                alt={`${order.kidName}'s meal`}
                className={large ? 'history-photo-large' : 'history-photo-thumb'}
              />
            )}
            {entry.tips?.[order.kidId] && (
              <span className="tag-ok">Tip: {entry.tips[order.kidId].value}%</span>
            )}
          </div>
        </div>
      ))}
      {entry.parentNotes && <p className="history-notes">&ldquo;{entry.parentNotes}&rdquo;</p>}
    </div>
  )
}
