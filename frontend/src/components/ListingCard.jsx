import { Home, Utensils, Bus, MapPin, Clock, MessageSquare, CheckCircle2, Info } from 'lucide-react'

export default function ListingCard({ listing, onSuggestCorrection }) {
  return (
    <article className="listing-card">
      <div className="listing-card-header">
        <div className="listing-type-badge">
          {listing.category === 'Stay' && <Home size={12} />}
          {listing.category === 'Food' && <Utensils size={12} />}
          {listing.category === 'Transport' && <Bus size={12} />}
          <span>{listing.category}</span>
          <span className="area-divider">•</span>
          <span className="listing-area-badge">{listing.area}</span>
        </div>

        <div className="listing-verification">
          {listing.verified ? (
            <span className="badge-verified" title="Checked by Pune Student Community">
              <CheckCircle2 size={12} />
              {listing.verificationLabel}
            </span>
          ) : (
            <span className="badge-unverified" title="Student tip pending community audit">
              <Info size={12} />
              {listing.verificationLabel}
            </span>
          )}
        </div>
      </div>

      <h3 className="listing-title">{listing.title}</h3>

      <div className="listing-location">
        <MapPin size={13} className="teal-pin" />
        <span>{listing.locality}</span>
      </div>

      <div className="listing-pricing">
        <span className="price-tag">{listing.price}</span>
        <span className="price-detail">{listing.priceNote}</span>
      </div>

      <p className="listing-desc">{listing.description}</p>

      <div className="listing-tags">
        {listing.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>

      <div className="listing-footer">
        <div className="timestamp-group">
          <Clock size={12} />
          <span>{listing.lastUpdated}</span>
        </div>

        <button
          className="btn-suggest-correction"
          onClick={() =>
            onSuggestCorrection(listing.title, listing.category, listing.area)
          }
          title="Report changed rent, closed mess, or altered timing"
        >
          <MessageSquare size={13} />
          <span>Suggest Correction</span>
        </button>
      </div>
    </article>
  )
}
