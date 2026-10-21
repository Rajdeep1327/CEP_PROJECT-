import { Link, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Footer({ onSelectArea }) {
  const navigate = useNavigate()

  const handleAreaClick = (areaName) => {
    onSelectArea(areaName)
    navigate('/stay')
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo">
              <div className="brand-logo-mark">
                <Compass className="brand-icon" size={17} />
              </div>
              <div className="brand-text">
                <span className="brand-title">CitySurvival</span>
                <span className="brand-tagline">Pune Edition</span>
              </div>
            </Link>
            <p className="footer-desc">
              The modern student city discovery companion for Pune. Finding safe shelter, affordable thalis, and daily PMPML transit for newcomers.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Essentials</h4>
            <Link to="/stay">Hostels & PGs (Stay)</Link>
            <Link to="/food">Student Meals & Thalis (Food)</Link>
            <Link to="/transport">Transport (Apli PMPML)</Link>
            <Link to="/">Home (Overview)</Link>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Key Areas</h4>
            <button type="button" onClick={() => handleAreaClick('Deccan')}>Deccan / FC Road</button>
            <button type="button" onClick={() => handleAreaClick('Kothrud')}>Kothrud</button>
            <button type="button" onClick={() => handleAreaClick('Shivajinagar')}>Shivajinagar</button>
            <button type="button" onClick={() => handleAreaClick('Viman Nagar')}>Viman Nagar</button>
            <button type="button" onClick={() => handleAreaClick('Hinjawadi')}>Hinjawadi</button>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Community</h4>
            <Link to="/feedback">Suggest Correction</Link>
            <Link to="/feedback">Report Discrepancy</Link>
            <Link to="/feedback">Community Verification</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CitySurvival Pune. Built for students, powered by local community knowledge.</p>
          <div className="footer-status-pill">
            <span className="pulse-indicator"></span>
            <span>Active City: <strong>Pune, Maharashtra</strong></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
