import { TIP_PERCENTS } from '../utils/constants'

export default function TipSelector({ value, onChange }) {
  return (
    <div className="tip-selector">
      {TIP_PERCENTS.map(pct => (
        <button
          type="button"
          key={pct}
          className={`tip-btn${value === pct ? ' selected' : ''}`}
          onClick={() => onChange(pct)}
        >
          {pct}%
        </button>
      ))}
    </div>
  )
}
