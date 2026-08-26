import { useState } from 'react'
import { useData } from '../../context/DataContext'

const COLORS = ['#E85D2C', '#3B82C4', '#4CAF7D', '#B565D8', '#E0A72E']

export default function KidsView() {
  const { kids, addKid, updateKid, removeKid } = useData()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim() || !username.trim() || pin.length !== 4) return
    await addKid({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      pin,
      color: COLORS[kids.length % COLORS.length],
      photosEnabled: true,
    })
    setName('')
    setUsername('')
    setPin('')
  }

  return (
    <div className="view-padded">
      <form className="card form-card" onSubmit={handleAdd}>
        <h2>Add Kid</h2>
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ava" />
        </label>
        <label className="field">
          <span>Username (what they tap to log in)</span>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. ava" />
        </label>
        <label className="field">
          <span>4-digit PIN</span>
          <input
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric"
            placeholder="1234"
          />
        </label>
        <button className="btn-primary" type="submit" disabled={!name.trim() || !username.trim() || pin.length !== 4}>
          Add Kid
        </button>
      </form>

      <div className="kids-list">
        {kids.map(kid => (
          <div key={kid.id} className="card kid-row">
            <span className="kid-avatar" style={{ background: kid.color }}>
              {kid.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="kid-row-fields">
              <input value={kid.name} onChange={e => updateKid(kid.id, { name: e.target.value })} />
              <div className="kid-row-sub">
                <input
                  value={kid.username}
                  onChange={e => updateKid(kid.id, { username: e.target.value.toLowerCase() })}
                  placeholder="username"
                />
                <input
                  value={kid.pin}
                  onChange={e => updateKid(kid.id, { pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  inputMode="numeric"
                  placeholder="PIN"
                  className="kid-pin-input"
                />
              </div>
            </div>
            <label className="photo-toggle">
              <span>Photos</span>
              <span className="switch">
                <input
                  type="checkbox"
                  checked={kid.photosEnabled !== false}
                  onChange={e => updateKid(kid.id, { photosEnabled: e.target.checked })}
                />
                <span className="switch-track" />
              </span>
            </label>
            <button
              type="button"
              className="btn-ghost btn-sm btn-danger"
              onClick={() => {
                if (confirm(`Remove ${kid.name}?`)) removeKid(kid.id)
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
