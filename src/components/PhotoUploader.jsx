import { useState } from 'react'
import { compressImage } from '../utils/image'
import { uploadToCloudinary } from '../utils/cloudinary'

// Generic photo capture/upload button used for both library-item photos
// (parent) and meal photos (kid). Caller decides the Cloudinary folder and
// what to do with the resulting { url, publicId }. `capture` forces the
// camera (used for the kid meal-photo screen); omit it to let the browser's
// normal file picker offer the photo library too. `allowUrlInput` adds a
// fallback for pasting an already-hosted (e.g. Cloudinary) image URL.
export default function PhotoUploader({ folder, photoUrl, onUploaded, onRemove, label = 'Add Photo', capture, allowUrlInput }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlMode, setUrlMode] = useState(false)
  const [urlValue, setUrlValue] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const blob = await compressImage(file)
      const data = await uploadToCloudinary(blob, folder)
      onUploaded({ url: data.secure_url, publicId: data.public_id })
    } catch (err) {
      console.error('Photo upload failed:', err)
      setError('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleUseUrl() {
    if (!urlValue.trim()) return
    onUploaded({ url: urlValue.trim(), publicId: '' })
    setUrlValue('')
    setUrlMode(false)
  }

  return (
    <div className="photo-uploader">
      <div className="photo-uploader-row">
        {photoUrl ? (
          <div className="photo-thumb-wrap">
            <img src={photoUrl} alt="" className="photo-thumb" />
            {onRemove && (
              <button type="button" className="photo-remove" onClick={onRemove} title="Remove photo">
                &#x2715;
              </button>
            )}
          </div>
        ) : (
          <div className="photo-thumb photo-thumb-empty" aria-hidden="true" />
        )}
        <label className={`btn-ghost btn-sm photo-btn${uploading ? ' disabled' : ''}`}>
          {uploading ? 'Uploading…' : photoUrl ? 'Change Photo' : label}
          <input
            type="file"
            accept="image/*"
            capture={capture}
            onChange={handleFile}
            disabled={uploading}
            hidden
          />
        </label>
        {allowUrlInput && !urlMode && (
          <button type="button" className="btn-ghost btn-sm" onClick={() => setUrlMode(true)}>
            Paste URL
          </button>
        )}
      </div>
      {allowUrlInput && urlMode && (
        <div className="photo-url-row">
          <input
            type="url"
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            placeholder="https://res.cloudinary.com/…"
          />
          <button type="button" className="btn-ghost btn-sm" onClick={handleUseUrl} disabled={!urlValue.trim()}>
            Use
          </button>
          <button type="button" className="btn-ghost btn-sm" onClick={() => { setUrlMode(false); setUrlValue('') }}>
            Cancel
          </button>
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
