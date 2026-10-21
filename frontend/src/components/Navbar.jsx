import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Compass,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Home,
  Utensils,
  Bus,
  MessageSquare,
  ArrowRight
} from 'lucide-react'

export default function Navbar({ selectedArea, onOpenAreaModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Custom CitySurvival Logo Mark */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="brand-logo-mark">
            <Compass className="brand-icon" size={19} />
          </div>
          <div className="brand-text">
            <span className="brand-title">CitySurvival</span>
            <span className="brand-tagline">Pune Student Edition</span>
          </div>
        </Link>

        {/* Location Badge */}
        <div className="header-location-pill">
          <span className="pulse-indicator"></span>
          <span className="location-name">PUNE</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/stay"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Stay</span>
          </NavLink>
          <NavLink
            to="/food"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Food</span>
          </NavLink>
          <NavLink
            to="/transport"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Transport</span>
          </NavLink>
          <NavLink
            to="/feedback"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Feedback</span>
          </NavLink>
        </nav>

        {/* Header Action: Choose Area & Mobile Toggle */}
        <div className="nav-actions">
          <button
            className="btn-header-area"
            onClick={onOpenAreaModal}
            title="Filter Pune by neighbourhood"
          >
            <MapPin size={14} className="teal-pin" />
            <span className="btn-header-area-text">
              {selectedArea === 'All' ? 'Choose area' : selectedArea}
            </span>
            <ChevronDown size={14} className="chevron" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span>Home (Overview)</span>
              <ArrowRight size={16} />
            </NavLink>

            <NavLink
              to="/stay"
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span>Hostels & PGs (Stay)</span>
              <Home size={16} />
            </NavLink>

            <NavLink
              to="/food"
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span>Everyday Food & Mess</span>
              <Utensils size={16} />
            </NavLink>

            <NavLink
              to="/transport"
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span>Transport</span>
              <Bus size={16} />
            </NavLink>

            <NavLink
              to="/feedback"
              className={({ isActive }) => `mobile-link highlight-action ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span>Community Feedback & Corrections</span>
              <MessageSquare size={16} />
            </NavLink>
          </div>

          <div className="mobile-drawer-footer">
            <button
              className="mobile-area-btn"
              onClick={() => {
                closeMobileMenu()
                onOpenAreaModal()
              }}
            >
              <MapPin size={16} />
              <span>Selected Area: <strong>{selectedArea}</strong></span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
