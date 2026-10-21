import { useState } from 'react'
import { MessageSquare, X, CheckCircle2, AlertCircle, ArrowRight, Info } from 'lucide-react'
import { PUNE_AREAS, FEEDBACK_API_URL } from '../data/puneData'

export default function FeedbackModal({ isOpen, onClose, initialData = {} }) {
  const [prevInitialData, setPrevInitialData] = useState(initialData)
  const [feedbackCategory, setFeedbackCategory] = useState(initialData.category || 'Stay')
  const [feedbackArea, setFeedbackArea] = useState(initialData.area && initialData.area !== 'All' ? initialData.area : 'Deccan')
  const [feedbackPlaceName, setFeedbackPlaceName] = useState(initialData.placeName || '')
  const [feedbackDetails, setFeedbackDetails] = useState(initialData.details || '')
  const [feedbackStudentName, setFeedbackStudentName] = useState(initialData.studentName || '')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData)
    setFeedbackCategory(initialData.category || 'Stay')
    setFeedbackArea(initialData.area && initialData.area !== 'All' ? initialData.area : 'Deccan')
    setFeedbackPlaceName(initialData.placeName || '')
    setFeedbackDetails(initialData.details || '')
    setFeedbackStudentName(initialData.studentName || '')
    setFeedbackError('')
    setFeedbackSubmitted(false)
  }

  if (!isOpen) return null

  const handleClose = () => {
    if (feedbackSubmitting) return
    onClose()
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackPlaceName('')
      setFeedbackDetails('')
      setFeedbackStudentName('')
      setFeedbackError('')
    }, 200)
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (feedbackSubmitting) return

    const placeName = feedbackPlaceName.trim()
    const details = feedbackDetails.trim()
    const studentName = feedbackStudentName.trim()

    if (!placeName || !details) {
      setFeedbackError('Please enter the place or route name and your correction details.')
      return
    }

    const payload = {
      category: feedbackCategory,
      area: feedbackArea,
      place_name: placeName,
      details: details
    }
    if (studentName) payload.student_name = studentName

    setFeedbackError('')
    setFeedbackSubmitting(true)

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        setFeedbackError(
          response.status === 422
            ? 'The server rejected the form. Please check that every field is filled and the details are long enough.'
            : `The server could not accept your feedback (error ${response.status}). Please try again later.`
        )
        return
      }

      setFeedbackSubmitted(true)
    } catch {
      setFeedbackError(
        'Could not reach the server. Make sure the backend is running at http://127.0.0.1:8000 and try again.'
      )
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-panel feedback-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <MessageSquare className="teal-icon" size={20} />
            <h3 className="modal-title">
              {feedbackPlaceName ? 'Suggest a Correction' : 'Help Improve Pune Guide'}
            </h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {feedbackSubmitted ? (
          <div className="feedback-success-state">
            <div className="success-icon-box">
              <CheckCircle2 size={44} className="teal-icon" />
            </div>
            <h4 className="success-heading">Thank you for helping Pune students!</h4>
            <p className="success-message">
              Your suggestion for <strong>"{feedbackPlaceName || 'Pune CitySurvival'}"</strong> has been received.
            </p>
            <div className="success-prototype-notice">
              <Info size={15} className="teal-icon" />
              <span>
                Note: Your submission was received by the prototype server. It will be reviewed before any listing changes. Nothing is published automatically.
              </span>
            </div>
            <button
              className="btn-teal-primary full-width"
              onClick={handleClose}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <p className="modal-subtext">
              Know an updated rent price, an affordable student tiffin, or a changed bus timing in Pune? Let fellow students know.
            </p>

            {feedbackError && (
              <div className="form-error-alert">
                <AlertCircle size={15} />
                <span>{feedbackError}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                >
                  <option value="Stay">Stay (Hostel / PG / Room)</option>
                  <option value="Food">Food (Thali / Mess / Snack)</option>
                  <option value="Transport">Transport (PMPML Bus / Route)</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Area in Pune *</label>
                <select
                  className="form-input"
                  value={feedbackArea}
                  onChange={(e) => setFeedbackArea(e.target.value)}
                >
                  {PUNE_AREAS.filter((a) => a.id !== 'All').map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Place or Route Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Janata Bhojanalaya or PMPML Route 24"
                value={feedbackPlaceName}
                onChange={(e) => setFeedbackPlaceName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Details / Correction Notes *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Explain what needs updating (e.g. monthly rent updated to ₹6,500, new Sunday dinner hours, or changed bus stop)..."
                value={feedbackDetails}
                onChange={(e) => setFeedbackDetails(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Your Name or College (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rohan, 2nd Year COEP"
                value={feedbackStudentName}
                onChange={(e) => setFeedbackStudentName(e.target.value)}
              />
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-dark-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn-teal-primary" disabled={feedbackSubmitting}>
                <span>{feedbackSubmitting ? 'Submitting...' : 'Submit to Community'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
