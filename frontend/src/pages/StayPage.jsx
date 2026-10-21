import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Home,
  Search,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  Info
} from 'lucide-react'
import BackButton from '../components/BackButton'
import StayListingCard from '../components/StayListingCard'
import {
  PUNE_AREAS,
  PUNE_LISTINGS,
  getMapEmbedUrl,
  getExternalMapUrl
} from '../data/puneData'

export default function StayPage({
  selectedArea,
  onSelectArea,
  onSuggestCorrection
}) {
  const [searchParams] = useSearchParams()
  const urlQ = searchParams.get('q') || ''
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ)
  const [searchQuery, setSearchQuery] = useState(urlQ)
  const [verifiedFilterOnly, setVerifiedFilterOnly] = useState(false)

  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ)
    setSearchQuery(urlQ)
  }

  // Filter Stay Listings
  const stayListings = useMemo(() => {
    return PUNE_LISTINGS.filter((item) => {
      if (item.category !== 'Stay') return false

      // Area match
      if (selectedArea !== 'All' && item.area !== selectedArea) return false

      // Verified filter
      if (verifiedFilterOnly && !item.verified) return false

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
  }, [selectedArea, verifiedFilterOnly, searchQuery])

  return (
    <div className="subpage stay-page">
      {/* Back to Home & Breadcrumb */}
      <BackButton label="Back to Home" pageName="Stay (Accommodation)" />

      {/* Page Header */}
      <div className="section-header subpage-header">
        <div className="section-header-eyebrow">PUNE STUDENT ACCOMMODATION</div>
        <h1 className="section-heading">Find your place in Pune</h1>
        <p className="section-description">
          Verified hostels, PGs, and student flat shares near COEP, Fergusson, MIT WPU, Cummins, and Symbiosis.
        </p>
      </div>

      {/* Embedded Google Map for Stay */}
      <div className="category-map-card stay-map-card">
        <div className="map-card-header">
          <div className="map-card-heading-group">
            <div className="map-icon-badge">
              <Home size={20} />
            </div>
            <div>
              <h3 className="map-card-title">Explore Stays Nearby</h3>
              <p className="map-card-subtitle">
                Hostels, PGs, and student rooms in{' '}
                <span className="map-area-highlight">
                  {selectedArea === 'All' ? 'Greater Pune' : selectedArea}
                </span>
              </p>
            </div>
          </div>
          <div className="map-actions-group">
            <a
              href={getExternalMapUrl('Stay', selectedArea)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-open-maps"
              title="Open in Google Maps"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Area Quick Switcher */}
        <div className="map-area-chips">
          <span className="map-chip-label">Filter Area:</span>
          {PUNE_AREAS.map((area) => (
            <button
              key={`stay-area-${area.id}`}
              type="button"
              className={`map-area-chip ${selectedArea === area.id ? 'is-active' : ''}`}
              onClick={() => onSelectArea(area.id)}
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* Responsive Google Maps Iframe */}
        <div className="map-iframe-container">
          <iframe
            key={`stay-map-${selectedArea}`}
            src={getMapEmbedUrl('Stay', selectedArea)}
            title={`Google Maps - Student Hostels, PGs and Rooms in ${selectedArea === 'All' ? 'Pune' : selectedArea}`}
            className="embedded-map-iframe"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Disclaimer Notice */}
        <div className="map-disclaimer">
          <Info size={14} className="map-disclaimer-icon" />
          <span>
            <strong>Location Exploration:</strong> Live map search provided by Google Maps for spatial reference. Places and listings shown on Google Maps have not been independently verified or audited by CitySurvival.
          </span>
        </div>
      </div>

      {/* Section directly BELOW the map: "Find Your Perfect PG or Hostel" */}
      <section className="stay-directory-section" aria-labelledby="stay-directory-heading">
        <div className="section-header stay-directory-header">
          <div className="section-header-eyebrow">ACCOMMODATION DIRECTORY</div>
          <h2 id="stay-directory-heading" className="section-heading">
            Find Your Perfect PG or Hostel
          </h2>
          <p className="section-description">
            Compare stays, explore rent, and find your next home in Pune.
          </p>
        </div>

        {/* Data Integrity / Sample Dataset Notice */}
        <div className="stay-data-integrity-banner">
          <div className="banner-icon-col">
            <Info size={18} className="teal-icon" />
          </div>
          <div className="banner-content">
            <h4 className="banner-title">Data Accuracy & Verification Notice</h4>
            <p className="banner-text">
              All accommodation entries below are part of an identified <strong>demonstration dataset</strong> designed for Pune students. Live Google Places API integration can be connected via a secure backend to provide real-time verified business locations. Rent and deposit figures must always be verified directly with landlords or hostel wardens; unconfirmed rates are explicitly listed as &ldquo;Contact for rent&rdquo;.
            </p>
          </div>
        </div>

        {/* Stay Directory Toolbar */}
        <div className="listings-toolbar">
          <div className="toolbar-info">
            <span className="toolbar-count">
              Showing <strong>{stayListings.length}</strong> accommodation options in{' '}
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
                placeholder="Search stays by name, locality, amenities..."
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

        {/* Sub Filters Row: Verified Only toggle */}
        <div className="sub-filters-bar">
          <button
            type="button"
            className={`verified-filter-btn ${verifiedFilterOnly ? 'is-verified-active' : ''}`}
            onClick={() => setVerifiedFilterOnly(!verifiedFilterOnly)}
          >
            <ShieldCheck size={14} />
            <span>Verified Only</span>
            {verifiedFilterOnly && <Check size={13} />}
          </button>

          <span className="sub-filter-hint">
            Filtering verified student accommodations audited by the community.
          </span>
        </div>

        {/* Listings Cards Grid */}
        {stayListings.length > 0 ? (
          <div className="stay-listings-grid">
            {stayListings.map((listing) => (
              <StayListingCard
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
            <h3 className="empty-heading">No stays found</h3>
            <p className="empty-text">
              We could not find any accommodation listings matching &ldquo;<strong>{searchQuery}</strong>&rdquo;{' '}
              {selectedArea !== 'All' ? `in ${selectedArea}` : 'in Pune'}.
            </p>
            <div className="empty-actions-row">
              <button
                type="button"
                className="btn-teal-primary"
                onClick={() => {
                  setSearchQuery('')
                  onSelectArea('All')
                  setVerifiedFilterOnly(false)
                }}
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
              <button
                type="button"
                className="btn-dark-secondary"
                onClick={() =>
                  onSuggestCorrection(searchQuery, 'Stay', selectedArea === 'All' ? 'Deccan' : selectedArea)
                }
              >
                <MessageSquare size={14} />
                <span>Recommend a Stay</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
