import HistoryOrderSummary from './HistoryOrderSummary'
import { MEAL_TYPE_LABELS } from '../utils/constants'
import { formatDateLong } from '../utils/date'

export default function HistoryEntryCard({ entry }) {
  return (
    <div className="card history-entry">
      <h3>{MEAL_TYPE_LABELS[entry.mealType] || entry.mealType} — {formatDateLong(entry.date)}</h3>
      {(entry.orders || []).map(order => (
        <div key={order.kidId} className="history-order-block">
          <strong>{order.kidName}</strong>
          <HistoryOrderSummary order={order} />
          <div className="history-photo-tip">
            {entry.photos?.[order.kidId]?.url && (
              <img src={entry.photos[order.kidId].url} alt={`${order.kidName}'s meal`} className="history-photo-thumb" />
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
