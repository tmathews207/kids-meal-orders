import { useState } from 'react'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

export default function PinPad({ length = 4, onComplete, error }) {
  const [pin, setPin] = useState('')

  function press(key) {
    if (key === '') return
    if (key === 'del') {
      setPin(p => p.slice(0, -1))
      return
    }
    if (pin.length >= length) return
    const next = pin + key
    setPin(next)
    if (next.length === length) {
      onComplete(next)
      setTimeout(() => setPin(''), 300)
    }
  }

  return (
    <div className="pin-pad">
      <div className="pin-dots">
        {Array.from({ length }).map((_, i) => (
          <span key={i} className={`pin-dot${i < pin.length ? ' filled' : ''}`} />
        ))}
      </div>
      {error && <p className="pin-error">{error}</p>}
      <div className="pin-keys">
        {KEYS.map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              type="button"
              key={i}
              className="pin-key"
              onClick={() => press(k)}
            >
              {k === 'del' ? '⌫' : k}
            </button>
          )
        )}
      </div>
    </div>
  )
}
