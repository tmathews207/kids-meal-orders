import { useState } from 'react'
import { useData } from '../../context/DataContext'
import PhotoUploader from '../../components/PhotoUploader'
import { ITEM_CATEGORIES, ITEM_CATEGORY_LABELS } from '../../utils/constants'
import { CLOUDINARY_LIBRARY_FOLDER } from '../../cloudinaryConfig'

export default function LibraryView() {
  const { libraryItems, addLibraryItem, updateLibraryItem, removeLibraryItem } = useData()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('entree')
  const [photo, setPhoto] = useState(null)

  function reset() {
    setName('')
    setCategory('entree')
    setPhoto(null)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    await addLibraryItem({
      name: name.trim(),
      category,
      photoUrl: photo?.url || '',
      photoPublicId: photo?.publicId || '',
    })
    reset()
  }

  const byCategory = ITEM_CATEGORIES.map(cat => ({
    cat,
    items: libraryItems.filter(i => i.category === cat),
  }))

  return (
    <div className="view-padded">
      <form className="card form-card" onSubmit={handleAdd}>
        <h2>Add Item</h2>
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chicken Nuggets" />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {ITEM_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{ITEM_CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Photo</span>
          <PhotoUploader
            folder={CLOUDINARY_LIBRARY_FOLDER}
            photoUrl={photo?.url}
            onUploaded={setPhoto}
            onRemove={() => setPhoto(null)}
            allowUrlInput
          />
        </label>
        <button className="btn-primary" type="submit" disabled={!name.trim()}>Add to Library</button>
      </form>

      {byCategory.map(({ cat, items }) =>
        items.length === 0 ? null : (
          <div key={cat} className="library-group">
            <h3>{ITEM_CATEGORY_LABELS[cat]}</h3>
            <div className="library-list">
              {items.map(item => (
                <div key={item.id} className="library-row card">
                  <div className="library-row-top">
                    <input
                      className="library-row-name"
                      value={item.name}
                      onChange={e => updateLibraryItem(item.id, { name: e.target.value })}
                    />
                    <select
                      value={item.category}
                      onChange={e => updateLibraryItem(item.id, { category: e.target.value })}
                    >
                      {ITEM_CATEGORIES.map(c => (
                        <option key={c} value={c}>{ITEM_CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-ghost btn-sm btn-danger"
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from the library?`)) removeLibraryItem(item.id)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <PhotoUploader
                    folder={CLOUDINARY_LIBRARY_FOLDER}
                    photoUrl={item.photoUrl}
                    onUploaded={({ url, publicId }) => updateLibraryItem(item.id, { photoUrl: url, photoPublicId: publicId })}
                    onRemove={() => updateLibraryItem(item.id, { photoUrl: '', photoPublicId: '' })}
                    allowUrlInput
                  />
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}
