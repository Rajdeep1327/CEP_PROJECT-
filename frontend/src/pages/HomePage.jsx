import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search,
  MapPin,
  Compass,
  X,
  Check,
  CheckCheck,
  ShieldCheck,
  MessageSquare,
  Info
} from 'lucide-react'
import {
  PUNE_AREAS,
  ESSENTIAL_SERVICES,
  handleImageError
} from '../data/puneData'

export default function HomePage({ selectedArea, onSelectArea, onOpenAreaModal }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const essentialsRef = useRef(null)
  const areasRef = useRef(null)

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    const q = searchQuery.trim().toLowerCase()
    if (!q) return

    // Smart routing based on query keywords
    if (q.includes('bus') || q.includes('pmpml') || q.includes('route') || q.includes('transit') || q.includes('stop')) {
      navigate(`/transport?q=${encodeURIComponent(searchQuery)}`)
    } else if (q.includes('food') || q.includes('mess') || q.includes('thali') || q.includes('tiffin') || q.includes('eat') || q.includes('bhojanalaya')) {
      navigate(`/food?q=${encodeURIComponent(searchQuery)}`)
    } else {
      // Default to stay if hostel/pg/room or general
      navigate(`/stay?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleAreaTileClick = (areaId) => {
    onSelectArea(areaId)
    // Seamlessly navigate to Stay or Food with this area active
    navigate('/stay')
  }

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-grid-card">
          {/* Left Content Side */}
          <div className="hero-left-col">
            <div className="hero-eyebrow">
              <span className="eyebrow-accent"></span>
              <span>YOUR CITY, MADE EASIER</span>
            </div>

            <h1 className="hero-heading">
              New to <span className="teal-highlight">Pune?</span> Start here.
            </h1>

            <p className="hero-supporting-text">
              Find your place, eat well for less, and get around with Apli PMPML.
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hero-search-bar">
              <div className="search-input-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-field"
                  placeholder="Search stays, food or bus routes across Pune..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <button type="submit" className="search-action-btn">
                <span>Search</span>
              </button>
            </form>

            {/* Two Prominent Action Buttons */}
            <div className="hero-buttons-row">
              <button
                type="button"
                className="btn-teal-primary"
                onClick={onOpenAreaModal}
              >
                <MapPin size={16} />
                <span>Choose your area</span>
              </button>

              <button
                type="button"
                className="btn-dark-secondary"
                onClick={() => {
                  if (essentialsRef.current) {
                    essentialsRef.current.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <Compass size={16} />
                <span>Explore essentials</span>
              </button>
            </div>

            {/* Quick Area Shortcuts */}
            <div className="hero-quick-areas">
              <span className="quick-label">Key Pune hubs:</span>
              {['FC Road / Deccan', 'Kothrud', 'Viman Nagar', 'Shivajinagar'].map((areaLabel) => (
                <button
                  key={areaLabel}
                  type="button"
                  className="quick-chip"
                  onClick={() => {
                    let area = 'Shivajinagar'
                    if (areaLabel.includes('Deccan')) area = 'Deccan'
                    else if (areaLabel.includes('Kothrud')) area = 'Kothrud'
                    else if (areaLabel.includes('Viman')) area = 'Viman Nagar'
                    onSelectArea(area)
                    navigate('/stay')
                  }}
                >
                  {areaLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: High-Quality Photograph Panel */}
          <div className="hero-right-col">
            <div className="hero-image-panel">
              <img
                src="/assets/pune_hero.jpg"
                alt="Pune student campus and city life"
                className="hero-photo"
                loading="eager"
                onError={(e) =>
                  handleImageError(
                    e,
                    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
                  )
                }
              />
              <div className="hero-image-gradient-overlay"></div>

              {/* Small Floating Location Label */}
              <div className="hero-floating-location-label">
                <MapPin size={12} className="teal-pin" />
                <span>PUNE, MAHARASHTRA</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="hero-floating-badge">
                <div className="badge-dot"></div>
                <div className="badge-text-group">
                  <span className="badge-title">Oxford of the East</span>
                  <span className="badge-subtitle">Over 400,000 students call Pune home</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION A: ESSENTIAL SERVICES — 3 CLICKABLE SIGNATURE CARDS */}
      <section className="section-essentials" id="essentials" ref={essentialsRef}>
        <div className="section-header">
          <div className="section-header-eyebrow">ESSENTIAL SERVICES</div>
          <h2 className="section-heading">Your Pune essentials</h2>
          <p className="section-description">
            Explore dedicated guides for student living. Tap any service card to navigate directly.
          </p>
        </div>

        <div className="essentials-grid">
          {ESSENTIAL_SERVICES.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.id}
                to={card.path}
                className="essential-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card-image-box">
                  <img
                    src={card.image}
                    alt={card.heading}
                    className="card-image"
                    loading="lazy"
                    onError={(e) => handleImageError(e, card.fallbackImage)}
                  />
                  <div className="card-image-gradient"></div>
                  <span className="card-pill-label">{card.label}</span>
                </div>

                <div className="card-body">
                  <div className="card-title-row">
                    <div className="card-icon-wrap">
                      <Icon size={18} className="teal-icon" />
                    </div>
                    <h3 className="card-heading">{card.heading}</h3>
                  </div>

                  <p className="card-text">{card.description}</p>

                  <div className="card-action-row">
                    <span className="card-action-label">{card.action}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. SECTION B: EXPLORE PUNE BY AREA */}
      <section className="section-areas" id="areas" ref={areasRef}>
        <div className="section-header">
          <div className="section-header-eyebrow">NEIGHBOURHOOD GUIDE</div>
          <h2 className="section-heading">Find your corner of Pune</h2>
          <p className="section-description">
            Tap any neighbourhood to view verified student stays, local meals, and direct transit corridors.
          </p>
        </div>

        <div className="areas-chip-grid">
          {PUNE_AREAS.map((area) => {
            const isSelected = selectedArea === area.id
            return (
              <button
                key={area.id}
                type="button"
                className={`area-tile ${isSelected ? 'area-tile-active' : ''}`}
                onClick={() => handleAreaTileClick(area.id)}
                aria-pressed={isSelected}
              >
                <div className="area-tile-top">
                  <MapPin size={14} className={isSelected ? 'area-icon-active' : 'area-icon'} />
                  <span className="area-name">{area.name}</span>
                  {isSelected && <Check size={14} className="area-check" />}
                </div>
                <span className="area-tagline">{area.tagline}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 4. SECTION C: COMMUNITY TRUST */}
      <section className="section-trust" id="community">
        <div className="trust-panel">
          <div className="section-header">
            <div className="section-header-eyebrow">STUDENT INTEGRITY STANDARD</div>
            <h2 className="section-heading">Built around local knowledge</h2>
            <p className="section-description">
              Student-sourced data, transparent verification, and zero broker commissions.
            </p>
          </div>

          <div className="trust-cards-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <CheckCheck size={22} className="teal-icon" />
              </div>
              <div className="trust-card-status">COMMUNITY-POWERED</div>
              <h3 className="trust-card-title">Shared by Local People</h3>
              <p className="trust-card-text">
                Information contributed directly by Pune students and local residents. Real insights on warden rules, mess hygiene, and actual room conditions.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <ShieldCheck size={22} className="teal-icon" />
              </div>
              <div className="trust-card-status">TRANSPARENT AUDIT</div>
              <h3 className="trust-card-title">Know the Source</h3>
              <p className="trust-card-text">
                Transparent verification tags distinguish student-submitted tips from community-audited listings where rent prices and contacts were manually confirmed.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <MessageSquare size={22} className="teal-icon" />
              </div>
              <div className="trust-card-status">OPEN CORRECTIONS</div>
              <h3 className="trust-card-title">Help Improve Pune</h3>
              <p className="trust-card-text">
                Notice a closed dining mess, increased room rent, or altered bus route? Use the quick correction form to keep campus newcomers informed and protected.
              </p>
              <button
                type="button"
                className="trust-action-btn"
                onClick={() => navigate('/feedback')}
              >
                <span>Submit a correction →</span>
              </button>
            </div>
          </div>

          {/* Transparency Banner */}
          <div className="trust-transparency-banner">
            <div className="banner-icon">
              <Info size={20} className="teal-icon" />
            </div>
            <div className="banner-body">
              <strong>Clarity & Verification Guarantee:</strong> Listings shown in this preview are curated student sample recommendations for Pune college hubs. In production, community student leads audit listings with receipts before granting the verified status tag.
            </div>
            <button
              type="button"
              className="banner-btn"
              onClick={() => navigate('/feedback')}
            >
              Feedback
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
