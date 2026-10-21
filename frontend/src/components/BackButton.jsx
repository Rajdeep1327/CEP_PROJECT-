import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function BackButton({ label = 'Back to Home', pageName }) {
  return (
    <div className="subpage-nav-bar">
      <Link to="/" className="btn-back-home" title="Return to CitySurvival Pune Home">
        <ArrowLeft size={16} />
        <span>{label}</span>
      </Link>
      {pageName && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-item">
            <Home size={13} />
            <span>Home</span>
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{pageName}</span>
        </nav>
      )}
    </div>
  )
}
