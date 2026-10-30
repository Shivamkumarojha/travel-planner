import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Bed, Navigation, Sparkles } from 'lucide-react';
import ActivityCard from './ActivityCard';

export default function DayTimeline({ dayData, currency, onRegenerateDay }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenClick = async () => {
    setIsRegenerating(true);
    await onRegenerateDay(dayData.day);
    setIsRegenerating(false);
  };

  return (
    <div className="glass-panel" style={{
      marginBottom: '24px',
      overflow: 'hidden',
      borderLeft: '4px solid var(--accent-purple)'
    }}>
      {/* Day Header */}
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.02)'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--gradient-brand)',
            color: '#fff',
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.95rem'
          }}>
            DAY {dayData.day}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {dayData.theme}
            </h3>
            {dayData.date && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {dayData.date}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleRegenClick}
            disabled={isRegenerating}
            className="btn btn-secondary btn-sm"
            title="Refresh this specific day's activities"
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={isRegenerating ? 'pulse-glow' : ''} />
            <span>{isRegenerating ? 'Customizing...' : 'Regenerate Day'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* 3 Main Time Slot Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <ActivityCard timeSlot="morning" activity={dayData.morning} currency={currency} />
            <ActivityCard timeSlot="afternoon" activity={dayData.afternoon} currency={currency} />
            <ActivityCard timeSlot="evening" activity={dayData.evening} currency={currency} />
          </div>

          {/* Accommodation & Transport Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-subtle)'
          }}>
            {/* Stay */}
            {dayData.accommodation && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: 'var(--accent-purple-light)'
                }}>
                  <Bed size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Recommended Lodging
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0' }}>
                    {dayData.accommodation.name}
                  </p>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {dayData.accommodation.neighborhood ? `${dayData.accommodation.neighborhood} • ` : ''}
                    Est. {dayData.accommodation.cost_per_night} {currency}/night
                  </span>
                </div>
              </div>
            )}

            {/* Transit */}
            {dayData.transport && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: 'var(--accent-teal-light)'
                }}>
                  <Navigation size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Daily Transit Guidance
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0' }}>
                    {dayData.transport.mode}
                  </p>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Est. {dayData.transport.estimated_daily_cost} {currency}/day • {dayData.transport.tips || 'Optimal routes'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
