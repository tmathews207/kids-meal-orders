import { useState } from 'react'
import { useData } from '../../context/DataContext'
import HistoryOrderSummary from '../../components/HistoryOrderSummary'
import PhotoUploader from '../../components/PhotoUploader'
import { MEAL_TYPE_LABELS } from '../../utils/constants'
import { CLOUDINARY_MEAL_FOLDER } from '../../cloudinaryConfig'
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
  const { mealHistory, saveParentNotes, saveMealPhoto, deleteMealHistoryEntry } = useData()

  const sorted = [...mealHistory].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))

  if (sorted.length === 0) {
    return (
      <div className="view-padded">
        <p className="empty-note">No served meals yet.</p>
      </div>
    )
  }

  function handleDeleteEntry(entry) {
    if (confirm(`Delete this ${MEAL_TYPE_LABELS[entry.mealType] || entry.mealType} entry from history? This can't be undone.`)) {
      deleteMealHistoryEntry(entry.id)
    }
  }

  return (
    <div className="view-padded">
      {sorted.map(entry => (
        <div key={entry.id} className="card history-entry">
          <div className="history-entry-head">
            <h3>{MEAL_TYPE_LABELS[entry.mealType]} — {formatDateLong(entry.date)}</h3>
            <button type="button" className="btn-ghost btn-sm btn-danger" onClick={() => handleDeleteEntry(entry)}>
              Delete Entry
            </button>
          </div>
          {(entry.orders || []).map(order => (
            <div key={order.kidId} className="history-order-block">
              <strong>{order.kidName}</strong>
              <HistoryOrderSummary order={order} />
              <div className="history-photo-tip">
                {entry.tips?.[order.kidId] && (
                  <span className="tag-ok">Tip: {entry.tips[order.kidId].value}%</span>
                )}
              </div>
              <PhotoUploader
                folder={CLOUDINARY_MEAL_FOLDER}
                photoUrl={entry.photos?.[order.kidId]?.url}
                onUploaded={photo => saveMealPhoto(entry.id, order.kidId, photo)}
                onRemove={() => saveMealPhoto(entry.id, order.kidId, null)}
                label="Add Photo"
                allowUrlInput
              />
            </div>
          ))}
          <NotesField entry={entry} saveParentNotes={saveParentNotes} />
        </div>
      ))}
    </div>
  )
}
