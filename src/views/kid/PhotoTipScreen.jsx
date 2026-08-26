import { useState } from 'react'
import { useData } from '../../context/DataContext'
import PhotoUploader from '../../components/PhotoUploader'
import TipSelector from '../../components/TipSelector'
import { CLOUDINARY_MEAL_FOLDER } from '../../cloudinaryConfig'

export default function PhotoTipScreen({ menu, kid }) {
  const { saveMealPhoto, saveMealTip } = useData()
  const [photo, setPhoto] = useState(null)
  const [tip, setTip] = useState(null)
  const [saving, setSaving] = useState(false)
  const photosEnabled = kid.photosEnabled !== false

  async function handleSubmit() {
    setSaving(true)
    try {
      if (photo) await saveMealPhoto(menu.id, kid.id, { ...photo, uploadedAt: new Date().toISOString() })
      await saveMealTip(menu.id, kid.id, { type: 'percent', value: tip })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header kid-header" style={{ background: kid.color }}>
        <h1>How was it?</h1>
      </header>
      <main className="app-content view-padded status-screen">
        <div className="status-emoji">📸</div>
        {photosEnabled ? (
          <>
            <h3>Take a picture of your meal</h3>
            <PhotoUploader
              folder={CLOUDINARY_MEAL_FOLDER}
              photoUrl={photo?.url}
              onUploaded={setPhoto}
              onRemove={() => setPhoto(null)}
              label="Take Photo"
              capture="environment"
            />
          </>
        ) : (
          <p className="empty-note">Photos are turned off right now.</p>
        )}

        <h3>Tip the chef</h3>
        <TipSelector value={tip} onChange={setTip} />

        <button type="button" className="btn-primary btn-submit" disabled={tip === null || saving} onClick={handleSubmit}>
          {saving ? 'Saving…' : 'Submit'}
        </button>
      </main>
    </div>
  )
}
