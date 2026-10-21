import { useLocation, useNavigate } from 'react-router-dom'
import { MapPin, X, Check } from 'lucide-react'
import { PUNE_AREAS } from '../data/puneData'

export default function AreaModal({ isOpen, onClose, selectedArea, onSelectArea }) {
  const location = useLocation()
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel area-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <MapPin className="teal-icon" size={20} />
            <h3 className="modal-title">Select Pune Neighbourhood</h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <p className="modal-subtext">
          Filter curated hostels, student messes, and bus lines by college area.
        </p>

        <div className="area-modal-grid">
          {PUNE_AREAS.map((area) => {
            const isSelected = selectedArea === area.id
            return (
              <button
                key={area.id}
                className={`modal-area-card ${isSelected ? 'is-selected-area' : ''}`}
                onClick={() => {
                  onSelectArea(area.id)
                  onClose()
                  if (location.pathname === '/') {
                    navigate('/stay')
                  }
                }}
              >
                <div className="modal-area-info">
                  <strong className="modal-area-name">{area.name}</strong>
                  <span className="modal-area-desc">{area.tagline}</span>
                </div>
                {isSelected && (
                  <div className="modal-area-check">
                    <Check size={15} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
