import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import BackButton from '../components/BackButton'
import { PUNE_AREAS, FEEDBACK_API_URL } from '../data/puneData'

export default function FeedbackPage() {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || 'Stay'
  const initialPlace = searchParams.get('place') || ''
  const initialAreaParam = searchParams.get('area')
  const initialArea = initialAreaParam && initialAreaParam !== 'All' ? initialAreaParam : 'Deccan'

  const [feedbackCategory, setFeedbackCategory] = useState(initialCat)
  const [feedbackArea, setFeedbackArea] = useState(initialArea)
  const [feedbackPlaceName, setFeedbackPlaceName] = useState(initialPlace)
  const [feedbackDetails, setFeedbackDetails] = useState('')
  const [feedbackStudentName, setFeedbackStudentName] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)

  const handleResetForm = () => {
    setFeedbackSubmitted(false)
    setFeedbackPlaceName('')
    setFeedbackDetails('')
    setFeedbackStudentName('')
    setFeedbackError('')
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
            ? 'The server rejected the form. Please check that every field is filled and the details are at least 5 characters long.'
            : `The server could not accept your feedback (error ${response.status}). Please try again later.`
        )
        return
      }

      setFeedbackSubmitted(true)
    } catch {
      setFeedbackError(
        'Could not reach the server. Make sure the backend is running at http://127.0.0.1:8000 or the Render service is online.'
      )
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  return (
    <div className="subpage feedback-page">
      {/* Back to Home & Breadcrumb */}
      <BackButton label="Back to Home" pageName="Community Feedback" />

      {/* Page Header */}
      <div className="section-header subpage-header">
        <div className="section-header-eyebrow">COMMUNITY INTEGRITY & CORRECTIONS</div>
        <h1 className="section-heading">Help Pune students navigate better</h1>
        <p className="section-description">
          Know an updated rent price, an affordable student tiffin, a closed mess, or a changed bus timing in Pune? Submit it here to protect fellow newcomers.
        </p>
      </div>

      <div className="feedback-page-layout">
        {/* Main Form Container */}
        <div className="feedback-page-container">
          <div className="feedback-card-header">
            <div className="modal-title-wrap">
              <MessageSquare className="teal-icon" size={22} />
              <h2 className="modal-title">
                {feedbackPlaceName ? `Suggest Correction for ${feedbackPlaceName}` : 'Submit Correction or New Listing'}
              </h2>
            </div>
            <span className="prototype-status-pill">FastAPI Connected</span>
          </div>

          {feedbackSubmitted ? (
            <div className="feedback-success-state">
              <div className="success-icon-box">
                <CheckCircle2 size={48} className="teal-icon" />
              </div>
              <h3 className="success-heading">Thank you for helping Pune students!</h3>
              <p className="success-message">
                Your submission for <strong>"{feedbackPlaceName || 'Pune CitySurvival'}"</strong> in{' '}
                <strong>{feedbackArea}</strong> has been transmitted to the server.
              </p>
              <div className="success-prototype-notice">
                <Info size={16} className="teal-icon" />
                <span>
                  <strong>Prototype Status:</strong> Your submission was recorded by the backend service. It will be reviewed by campus leads before publication to ensure quality.
                </span>
              </div>
              <div className="feedback-success-actions">
                <button
                  type="button"
                  className="btn-teal-primary"
                  onClick={handleResetForm}
                >
                  <RotateCcw size={15} />
                  <span>Submit Another Note</span>
                </button>
                <Link to="/" className="btn-dark-secondary">
                  <span>Return to Home</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <p className="modal-subtext">
                All submissions are free and anonymous unless you choose to provide your name or college.
              </p>

              {feedbackError && (
                <div className="form-error-alert">
                  <AlertCircle size={16} />
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
                  rows={5}
                  placeholder="Explain what needs updating (e.g. monthly rent updated to ₹6,500, new Sunday dinner hours, changed warden contact, or altered bus stop)..."
                  value={feedbackDetails}
                  onChange={(e) => setFeedbackDetails(e.target.value)}
                  required
                ></textarea>
                <span className="field-hint">Minimum 5 characters required by server.</span>
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
                  onClick={handleResetForm}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="btn-teal-primary"
                  disabled={feedbackSubmitting}
                >
                  <span>{feedbackSubmitting ? 'Transmitting to Server...' : 'Submit to Community'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Side Info Panel */}
        <div className="feedback-sidebar">
          <div className="feedback-info-card">
            <div className="info-card-header">
              <ShieldCheck size={20} className="teal-icon" />
              <h4>Community Verification Policy</h4>
            </div>
            <p className="info-card-text">
              We never charge students or hostels for listing entries. Every update submitted is verified against current college semester rates.
            </p>
            <ul className="info-checklist">
              <li>Verified room rents without broker commission</li>
              <li>Hygienic mess timings and Sunday feast schedules</li>
              <li>Active PMPML student bus pass guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
