import { useEffect, useState } from 'react'
import { toMillis, formatCountdown } from '../utils/date'

export default function CountdownTimer({ closeAt, size = 'normal' }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = toMillis(closeAt) - now
  const urgent = remaining > 0 && remaining < 5 * 60 * 1000

  return (
    <div className={`countdown${size === 'large' ? ' countdown-large' : ''}${urgent ? ' countdown-urgent' : ''}`}>
      <span className="countdown-label">Time left to order</span>
      <span className="countdown-value">{formatCountdown(remaining)}</span>
    </div>
  )
}
