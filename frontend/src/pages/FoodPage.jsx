import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Utensils,
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
import ListingCard from '../components/ListingCard'
import {
  PUNE_AREAS,
  PUNE_LISTINGS,
  getMapEmbedUrl,
  getExternalMapUrl
} from '../data/puneData'

export default function FoodPage({
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

  // Filter Food Listings
  const foodListings = useMemo(() => {
    return PUNE_LISTINGS.filter((item) => {
      if (item.category !== 'Food') return false

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
    <div className="subpage food-page">
      {/* Back to Home & Breadcrumb */}
      <BackButton label="Back to Home" pageName="Food (Messes & Dining)" />

      {/* Page Header */}
      <div className="section-header subpage-header">
        <div className="section-header-eyebrow">PUNE STUDENT MESSES & DINING</div>
        <h1 className="section-heading">Eat well for less in Pune</h1>
        <p className="section-description">
          Wholesome Maharashtrian khanawals, student thalis, unlimited rotis, and monthly tiffin services on a college budget.
        </p>
      </div>

      {/* Embedded Google Map for Food */}
      <div className="category-map-card food-map-card">
        <div className="map-card-header">
          <div className="map-card-heading-group">
            <div className="map-icon-badge">
              <Utensils size={20} />
            </div>
            <div>
              <h3 className="map-card-title">Find Affordable Food Nearby</h3>
              <p className="map-card-subtitle">
                Student messes, tiffin services, and budget food in{' '}
                <span className="map-area-highlight">
                  {selectedArea === 'All' ? 'Greater Pune' : selectedArea}
                </span>
              </p>
            </div>
          </div>
          <div className="map-actions-group">
            <a
              href={getExternalMapUrl('Food', selectedArea)}
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
              key={`food-area-${area.id}`}
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
            key={`food-map-${selectedArea}`}
            src={getMapEmbedUrl('Food', selectedArea)}
            title={`Google Maps - Student Messes, Tiffins and Budget Food in ${selectedArea === 'All' ? 'Pune' : selectedArea}`}
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

      {/* Food Directory & Toolbar */}
      <div className="listings-toolbar">
        <div className="toolbar-info">
          <span className="toolbar-count">
            Showing <strong>{foodListings.length}</strong> food options in{' '}
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
              placeholder="Search messes, khanawals, thalis..."
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
          Transparent verification: Look for the Community Verified tag on verified student hubs.
        </span>
      </div>

      {/* Listings Cards Grid */}
      {foodListings.length > 0 ? (
        <div className="listings-grid">
          {foodListings.map((listing) => (
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
          <h3 className="empty-heading">No food listings found</h3>
          <p className="empty-text">
            We could not find any mess or dining listings matching "<strong>{searchQuery}</strong>"{' '}
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
                onSuggestCorrection(searchQuery, 'Food', selectedArea === 'All' ? 'Deccan' : selectedArea)
              }
            >
              <MessageSquare size={14} />
              <span>Recommend a Mess</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
