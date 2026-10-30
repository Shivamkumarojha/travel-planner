import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Trash2, ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate('/itinerary', { state: { itinerary: trip.itinerary, tripRecord: trip } });
  };

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.25s, border-color 0.25s'
    }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
              {trip.travel_style || 'Balanced'}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {trip.destination}
            </h3>
          </div>
          
          <button
            onClick={() => onDelete(trip.id)}
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: 'none',
              color: '#fb7185',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Delete saved trip"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Dates & duration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <Calendar size={15} color="var(--accent-teal)" />
            <span>{trip.start_date} to {trip.end_date} ({trip.duration_days} Days)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <DollarSign size={15} color="var(--accent-amber)" />
            <span>Budget: {trip.budget_total} {trip.budget_currency || 'USD'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <Users size={15} color="var(--accent-purple-light)" />
            <span>{trip.group_size} Traveler{trip.group_size > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Interests Pills */}
        {trip.interests && trip.interests.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {trip.interests.slice(0, 3).map((item, idx) => (
              <span key={idx} style={{
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}>
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <button
        onClick={handleOpen}
        className="btn btn-secondary btn-block"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: 600
        }}
      >
        <span>View Full Itinerary</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
