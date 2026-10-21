import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bus,
  MapPin,
  Search,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Info,
  Navigation,
  RotateCcw,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import BackButton from '../components/BackButton'
import ListingCard from '../components/ListingCard'
import {
  PUNE_AREAS,
  PUNE_LISTINGS,
  PMPML_CORRIDORS,
  handleImageError
} from '../data/puneData'

export default function TransportPage({
  selectedArea,
  onSelectArea,
  onSuggestCorrection
}) {
  const [searchParams] = useSearchParams()
  const urlQ = searchParams.get('q') || ''
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ)
  const [searchQuery, setSearchQuery] = useState(urlQ)

  // PMPML Bus Route Finder State
  const [pmpmlFrom, setPmpmlFrom] = useState('Swargate')
  const [pmpmlTo, setPmpmlTo] = useState('Shivajinagar')
  const [pmpmlSearchResult, setPmpmlSearchResult] = useState(null)
  const [pmpmlSearched, setPmpmlSearched] = useState(false)

  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ)
    setSearchQuery(urlQ)
  }

  // Handle PMPML Search
  const handlePmpmlSearch = (e) => {
    e.preventDefault()
    setPmpmlSearched(true)
    const match = PMPML_CORRIDORS.find(
      (c) =>
        (c.origin.toLowerCase().includes(pmpmlFrom.toLowerCase()) &&
          c.destination.toLowerCase().includes(pmpmlTo.toLowerCase())) ||
        (c.origin.toLowerCase().includes(pmpmlTo.toLowerCase()) &&
          c.destination.toLowerCase().includes(pmpmlFrom.toLowerCase()))
    )
    setPmpmlSearchResult(match || null)
  }

  // Filter Transport Listings
  const transportListings = useMemo(() => {
    return PUNE_LISTINGS.filter((item) => {
      if (item.category !== 'Transport') return false

      // Area match
      if (selectedArea !== 'All' && item.area !== selectedArea) return false

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchLocality = item.locality.toLowerCase().includes(q)
        const matchDesc = item.description.toLowerCase().includes(q)
        const matchArea = item.area.toLowerCase().includes(q)
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchTitle && !matchLocality && !matchDesc && !matchArea && !matchTags) {
          return false
        }
      }

      return true
    })
  }, [selectedArea, searchQuery])

  return (
    <div className="subpage transport-page">
      {/* Back to Home & Breadcrumb */}
      <BackButton label="Back to Home" pageName="Transport (Apli PMPML)" />

      {/* Page Header */}
      <div className="section-header subpage-header">
        <div className="section-header-eyebrow">PUNE PUBLIC TRANSIT</div>
        <h1 className="section-heading">Apli PMPML. Pune, connected.</h1>
        <p className="section-description">
          Explore student bus corridors, dedicated BRTS routes, interchange hubs, and suburban lines across Greater Pune.
        </p>
      </div>

      {/* Signature Apli PMPML Spotlight Showcase */}
      <section className="section-pmpml-spotlight" id="pmpml">
        <div className="pmpml-container-panel">
          {/* Top Two-Column Showcase */}
          <div className="pmpml-two-col">
            {/* Left Column */}
            <div className="pmpml-left-col">
              <div className="pmpml-eyebrow">
                <span className="pmpml-indicator-dot"></span>
                <span>PUNE PUBLIC TRANSPORT</span>
              </div>

              <h2 className="pmpml-heading">
                Pune, one bus ride away.
              </h2>

              <p className="pmpml-description">
                Find bus stops and explore the routes that help you navigate everyday life in Pune. From Swargate BRTS corridors to Deccan and Kothrud college lines.
              </p>

              <div className="pmpml-cta-group">
                <button
                  type="button"
                  className="btn-teal-primary"
                  onClick={() => {
                    const finder = document.getElementById('pmpml-finder-box')
                    if (finder) finder.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <Bus size={16} />
                  <span>Explore bus route finder</span>
                </button>

                <div className="pmpml-pass-tag">
                  <ShieldCheck size={14} className="teal-icon" />
                  <span>Student Pass (Form 16) guides available</span>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Photograph */}
            <div className="pmpml-right-col">
              <div className="pmpml-image-frame">
                <img
                  src="/assets/pmpml_bus.jpg"
                  alt="Pune PMPML Electric Bus at Bus Stop"
                  className="pmpml-photo"
                  loading="lazy"
                  onError={(e) =>
                    handleImageError(
                      e,
                      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
                    )
                  }
                />
                <div className="pmpml-image-overlay"></div>
                <div className="pmpml-image-label">
                  <span>PUNE • PUBLIC TRANSPORT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Form: Starting-point & Destination Route Finder */}
          <div className="pmpml-route-finder-box" id="pmpml-finder-box">
            <div className="finder-header">
              <div className="finder-title-row">
                <Navigation size={18} className="teal-icon" />
                <h3 className="finder-title">Find PMPML Bus Corridors</h3>
              </div>
              <span className="prototype-status-pill">
                Prototype Preview • Verified Student Corridors
              </span>
            </div>

            <form onSubmit={handlePmpmlSearch} className="finder-form">
              <div className="finder-inputs-row">
                <div className="finder-field">
                  <label className="field-label">From Stop / Area</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="input-icon" />
                    <select
                      className="finder-select"
                      value={pmpmlFrom}
                      onChange={(e) => setPmpmlFrom(e.target.value)}
                    >
                      <option value="Swargate">Swargate (BRTS Hub)</option>
                      <option value="Shivajinagar">Shivajinagar Station / COEP</option>
                      <option value="Deccan">Deccan Gymkhana / FC Road</option>
                      <option value="Kothrud">Kothrud Stand / Depot</option>
                      <option value="Hinjawadi">Hinjawadi Phase 1 / Phase 3</option>
                      <option value="Viman Nagar">Viman Nagar (Symbiosis)</option>
                      <option value="Hadapsar">Hadapsar Gadital</option>
                      <option value="Karve Nagar">Karve Nagar</option>
                      <option value="Wakad">Wakad Bridge</option>
                    </select>
                  </div>
                </div>

                <div className="finder-field">
                  <label className="field-label">To Stop / Area</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="input-icon" />
                    <select
                      className="finder-select"
                      value={pmpmlTo}
                      onChange={(e) => setPmpmlTo(e.target.value)}
                    >
                      <option value="Shivajinagar">Shivajinagar Station / COEP</option>
                      <option value="Swargate">Swargate (BRTS Hub)</option>
                      <option value="Deccan">Deccan Gymkhana / FC Road</option>
                      <option value="Kothrud">Kothrud Stand / Depot</option>
                      <option value="Hinjawadi">Hinjawadi Phase 1 / Phase 3</option>
                      <option value="Viman Nagar">Viman Nagar (Symbiosis)</option>
                      <option value="Hadapsar">Hadapsar Gadital</option>
                      <option value="Karve Nagar">Karve Nagar</option>
                      <option value="Wakad">Wakad Bridge</option>
                    </select>
                  </div>
                </div>

                <div className="finder-action-col">
                  <button type="submit" className="btn-teal-primary finder-btn">
                    <Search size={15} />
                    <span>Find Bus Routes</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Route Search Result or Prototype Notice */}
            {pmpmlSearched && (
              <div className="finder-result-panel">
                {pmpmlSearchResult ? (
                  <div className="route-match-card">
                    <div className="route-match-top">
                      <div className="route-badge-wrap">
                        <Bus size={18} className="teal-icon" />
                        <span className="route-number">{pmpmlSearchResult.routeNumber}</span>
                        <span className="route-type-pill">{pmpmlSearchResult.type}</span>
                      </div>
                      <span className="route-verified-badge">
                        <CheckCircle2 size={13} />
                        Verified Corridor
                      </span>
                    </div>

                    <h4 className="route-match-name">{pmpmlSearchResult.name}</h4>

                    <div className="route-details-row">
                      <div className="route-detail-item">
                        <Clock size={13} className="teal-icon" />
                        <span>Frequency: <strong>{pmpmlSearchResult.frequency}</strong></span>
                      </div>
                      <div className="route-detail-item">
                        <Clock size={13} className="teal-icon" />
                        <span>Operating Hours: <strong>{pmpmlSearchResult.timing}</strong></span>
                      </div>
                      <div className="route-detail-item">
                        <ShieldCheck size={13} className="teal-icon" />
                        <span>{pmpmlSearchResult.passValid}</span>
                      </div>
                    </div>

                    <div className="route-stops-line">
                      <span className="stops-label">Key Stops:</span>
                      <div className="stops-flow">
                        {pmpmlSearchResult.keyStops.map((stop, i) => (
                          <span key={stop} className="stop-pill">
                            {stop}
                            {i < pmpmlSearchResult.keyStops.length - 1 && ' →'}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="prototype-honest-notice">
                      <Info size={14} className="info-icon" />
                      <span>
                        <strong>Prototype Notice:</strong> This student project provides sample PMPML route guidance. Live GPS tracking and real-time bus schedules are not currently available. Route details and timings have not been independently verified.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="route-fallback-card">
                    <div className="fallback-header">
                      <Info size={16} className="teal-icon" />
                      <strong>Corridor Guide for {pmpmlFrom} ↔ {pmpmlTo}</strong>
                    </div>
                    <p className="fallback-text">
                      Direct scheduled bus information for this specific pair is currently being mapped by campus contributors. Most students take connecting services via <strong>Shivajinagar</strong> or <strong>Swargate</strong> BRTS interchange hubs.
                    </p>
                    <div className="prototype-honest-notice">
                      <Info size={14} className="info-icon" />
                      <span>
                        <strong>Prototype Notice:</strong> Live real-time PMPML tracking is not yet integrated. We never invent fake route numbers or live ETAs.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Transit Hubs & Corridors Directory */}
      <div className="listings-toolbar">
        <div className="toolbar-info">
          <span className="toolbar-count">
            Showing <strong>{transportListings.length}</strong> verified transit corridors in{' '}
            <strong>{selectedArea === 'All' ? 'Pune (All Areas)' : selectedArea}</strong>
          </span>

          {searchQuery && (
            <span className="search-filter-tag">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} aria-label="Clear filter">
                <X size={12} />
              </button>
            </span>
          )}

          {selectedArea !== 'All' && (
            <button
              className="reset-area-tag"
              onClick={() => onSelectArea('All')}
              title="Show all Pune areas"
            >
              Area: {selectedArea} <X size={11} />
            </button>
          )}
        </div>

        {/* Search Field */}
        <div className="subpage-search-wrap">
          <div className="search-input-box small">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-field"
              placeholder="Search bus stops, routes, depots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transit Area Chips */}
      <div className="map-area-chips" style={{ marginBottom: '24px' }}>
        <span className="map-chip-label">Filter Area:</span>
        {PUNE_AREAS.map((area) => (
          <button
            key={`trans-area-${area.id}`}
            type="button"
            className={`map-area-chip ${selectedArea === area.id ? 'is-active' : ''}`}
            onClick={() => onSelectArea(area.id)}
          >
            {area.name}
          </button>
        ))}
      </div>

      {/* Listings Cards Grid */}
      {transportListings.length > 0 ? (
        <div className="listings-grid">
          {transportListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSuggestCorrection={onSuggestCorrection}
            />
          ))}
        </div>
      ) : (
        <div className="empty-listings-state">
          <div className="empty-icon-box">
            <AlertCircle size={32} className="teal-icon" />
          </div>
          <h3 className="empty-heading">No transit stops found</h3>
          <p className="empty-text">
            We could not find any transit listings matching "<strong>{searchQuery}</strong>"{' '}
            {selectedArea !== 'All' ? `in ${selectedArea}` : 'in Pune'}.
          </p>
          <div className="empty-actions-row">
            <button
              type="button"
              className="btn-teal-primary"
              onClick={() => {
                setSearchQuery('')
                onSelectArea('All')
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
            <button
              type="button"
              className="btn-dark-secondary"
              onClick={() =>
                onSuggestCorrection(searchQuery, 'Transport', selectedArea === 'All' ? 'Swargate' : selectedArea)
              }
            >
              <MessageSquare size={14} />
              <span>Suggest a Route Correction</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
