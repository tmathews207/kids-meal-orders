import { useState } from 'react'
import { useData } from '../../context/DataContext'
import HistoryOrderSummary from '../../components/HistoryOrderSummary'
import { MEAL_TYPE_LABELS } from '../../utils/constants'
import { formatDateLong, toMillis } from '../../utils/date'

function NotesField({ entry, saveParentNotes }) {
  const [notes, setNotes] = useState(entry.parentNotes || '')
  const [dirty, setDirty] = useState(false)
  return (
    <div className="notes-field">
      <textarea
        value={notes}
        onChange={e => { setNotes(e.target.value); setDirty(true) }}
        placeholder="Add a note about this meal…"
        rows={2}
      />
      {dirty && (
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => { saveParentNotes(entry.id, notes); setDirty(false) }}
        >
          Save Note
        </button>
      )}
    </div>
  )
}

export default function HistoryEditView() {
  const { mealHistory, saveParentNotes } = useData()

  const sorted = [...mealHistory].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))

  if (sorted.length === 0) {
    return (
      <div className="view-padded">
        <p className="empty-note">No served meals yet.</p>
      </div>
    )
  }

  return (
    <div className="view-padded">
      {sorted.map(entry => (
        <div key={entry.id} className="card history-entry">
          <h3>{MEAL_TYPE_LABELS[entry.mealType]} — {formatDateLong(entry.date)}</h3>
          {(entry.orders || []).map(order => (
            <div key={order.kidId} className="history-order-block">
              <strong>{order.kidName}</strong>
              <HistoryOrderSummary order={order} />
              <div className="history-photo-tip">
                {entry.photos?.[order.kidId]?.url && (
                  <img src={entry.photos[order.kidId].url} alt="" className="history-photo-thumb" />
                )}
                {entry.tips?.[order.kidId] && (
                  <span className="tag-ok">Tip: {entry.tips[order.kidId].value}%</span>
                )}
              </div>
            </div>
          ))}
          <NotesField entry={entry} saveParentNotes={saveParentNotes} />
        </div>
      ))}
    </div>
  )
}
