import { useState } from 'react'
import { compressImage } from '../utils/image'
import { uploadToCloudinary } from '../utils/cloudinary'

// Generic photo capture/upload button used for both library-item photos
// (parent) and meal photos (kid). Caller decides the Cloudinary folder and
// what to do with the resulting { url, publicId }.
export default function PhotoUploader({ folder, photoUrl, onUploaded, onRemove, label = 'Add Photo', capture }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div className="photo-uploader">
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
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
