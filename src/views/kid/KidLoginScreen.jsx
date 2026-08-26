import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useKidAuth } from '../../context/KidAuthContext'
import PinPad from '../../components/PinPad'

export default function KidLoginScreen() {
  const { kids } = useData()
  const { logInAsKid } = useKidAuth()
  const [picked, setPicked] = useState(null)
  const [error, setError] = useState('')

  function checkPin(pin) {
    if (picked.pin === pin) {
      logInAsKid(picked.id)
    } else {
      setError('Wrong PIN, try again.')
      setPicked(p => ({ ...p }))
    }
  }

  if (!picked) {
    return (
      <div className="app">
        <div className="role-select">
          <h1>Who are you?</h1>
          {kids.length === 0 && <p className="empty-note">No kid profiles yet — ask a parent to add one.</p>}
          {kids.map(kid => (
            <button
              key={kid.id}
              className="role-card"
              style={{ borderColor: kid.color }}
              onClick={() => { setPicked(kid); setError('') }}
            >
              <span className="kid-avatar" style={{ background: kid.color }}>
                {kid.name.slice(0, 1).toUpperCase()}
              </span>
              <span>{kid.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="role-select">
        <h1>Hi {picked.name}! Enter your PIN</h1>
        <PinPad onComplete={checkPin} error={error} />
        <button type="button" className="btn-ghost btn-sm" onClick={() => setPicked(null)}>
          Not me
        </button>
      </div>
    </div>
  )
}
