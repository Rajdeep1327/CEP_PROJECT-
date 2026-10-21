import {
  Building2,
  MapPin,
  Utensils,
  Bed,
  Phone,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Info,
  Clock
} from 'lucide-react'

export default function StayListingCard({ listing, onSuggestCorrection }) {
  // Construct targeted Google Maps URL for this specific PG/hostel & address
  // Prefers verified place URL or place ID when available; otherwise creates a search URL using the specific PG name and full address.
  const googleMapsUrl =
    listing.placeUrl ||
    (listing.placeId
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${listing.title}, ${listing.address || listing.locality}, Pune, Maharashtra`
        )}&query_place_id=${listing.placeId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${listing.title}, ${listing.address || listing.locality}, Pune, Maharashtra`
        )}`)

  return (
    <article className="stay-listing-card">
      {/* Top Header: Category, Area & Verification Badge */}
      <div className="stay-card-header">
        <div className="stay-type-badge">
          <Building2 size={13} className="teal-icon" />
          <span>PG / HOSTEL</span>
          <span className="area-divider">•</span>
          <span className="stay-area-badge">{listing.area}</span>
        </div>

        <div className="stay-verification">
          {listing.verified ? (
            <span className="badge-verified" title="Audited by Pune Student Community">
              <CheckCircle2 size={12} />
              <span>{listing.verificationLabel || 'Community Verified'}</span>
            </span>
          ) : (
            <span className="badge-unverified" title="Student tip pending manual audit">
              <Info size={12} />
              <span>{listing.verificationLabel || 'Demo Sample — Unconfirmed'}</span>
            </span>
          )}
        </div>
      </div>

      {/* PG or Hostel Name */}
      <h3 className="stay-card-title">{listing.title}</h3>

      {/* Full Address & Locality */}
      <div className="stay-card-location">
        <MapPin size={14} className="teal-pin" />
        <div className="stay-location-text">
          <span className="stay-full-address">{listing.address || listing.locality}</span>
          {listing.locality && listing.address && (
            <span className="stay-locality-note">Locality: {listing.locality}</span>
          )}
        </div>
      </div>

      {/* Core Specs Grid: Rent, Deposit, Room Type, Food Availability */}
      <div className="stay-specs-grid">
        {/* Monthly Rent in INR */}
        <div className="stay-spec-box rent-box">
          <span className="spec-label">Monthly Rent</span>
          <div className="spec-value-row">
            <span className={`spec-value ${listing.rent === 'Contact for rent' ? 'contact-rent' : 'rent-price'}`}>
              {listing.rent || listing.price || 'Contact for rent'}
            </span>
            {listing.isRentVerified && (
              <span className="verified-pill" title="Rent rate confirmed">Verified</span>
            )}
          </div>
          {listing.priceNote && (
            <span className="spec-subtext">{listing.priceNote}</span>
          )}
        </div>

        {/* Security Deposit */}
        <div className="stay-spec-box">
          <span className="spec-label">Security Deposit</span>
          <span className="spec-value">
            {listing.securityDeposit || 'Contact property'}
          </span>
          {listing.isDepositVerified && (
            <span className="spec-subtext confirmed-text">✓ Deposit confirmed</span>
          )}
        </div>

        {/* Room Type */}
        <div className="stay-spec-box">
          <span className="spec-label">Room Type</span>
          <div className="spec-icon-value">
            <Bed size={13} className="teal-icon" />
            <span className="spec-value">{listing.roomType || 'Shared & Private Available'}</span>
          </div>
        </div>

        {/* Food Availability */}
        <div className="stay-spec-box">
          <span className="spec-label">Food & Meals</span>
          <div className="spec-icon-value">
            <Utensils size={13} className="teal-icon" />
            <span className="spec-value">{listing.foodAvailability || 'Contact for details'}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <p className="stay-card-desc">{listing.description}</p>
      )}

      {/* Verified Amenities */}
      {listing.amenities && listing.amenities.length > 0 && (
        <div className="stay-amenities-group">
          <span className="amenities-label">Amenities:</span>
          <div className="amenities-chips">
            {listing.amenities.map((amenity) => (
              <span key={amenity} className="amenity-pill">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Public Contact Number Section */}
      <div className="stay-contact-row">
        <Phone size={13} className="teal-icon" />
        <span className="contact-label">Contact:</span>
        {listing.contactNumber && !listing.contactNumber.toLowerCase().includes('not publicly') ? (
          <a
            href={`tel:${listing.contactNumber.replace(/[^0-9+]/g, '')}`}
            className="contact-value-link"
            title="Call verified reception desk"
          >
            {listing.contactNumber}
          </a>
        ) : (
          <span className="contact-unlisted-note">
            {listing.contactNumber || 'Not publicly listed (Visit in person)'}
          </span>
        )}
      </div>

      {/* Footer Actions: View on Google Maps Button & Suggest Correction */}
      <div className="stay-card-footer">
        <div className="timestamp-group">
          <Clock size={12} />
          <span>{listing.lastUpdated || 'Demonstration sample'}</span>
        </div>

        <div className="stay-actions-buttons">
          {/* Specific PG Google Maps Button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-gmaps"
            title={`Open ${listing.title} on Google Maps`}
          >
            <ExternalLink size={13} />
            <span>View on Google Maps</span>
          </a>

          {/* Suggest Correction Button */}
          {onSuggestCorrection && (
            <button
              type="button"
              className="btn-stay-correction"
              onClick={() =>
                onSuggestCorrection(listing.title, 'Stay', listing.area)
              }
              title="Report changed rent, closed mess, or altered timing"
            >
              <MessageSquare size={13} />
              <span>Suggest Correction</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
