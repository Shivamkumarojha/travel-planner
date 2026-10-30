import React from 'react';
import { Clock, MapPin, DollarSign, Lightbulb, Tag } from 'lucide-react';

export default function ActivityCard({ timeSlot, activity, currency = 'USD' }) {
  if (!activity) return null;

  const slotColors = {
    morning: { badge: 'badge-purple', label: 'Morning Session', iconColor: 'var(--accent-purple-light)' },
    afternoon: { badge: 'badge-teal', label: 'Afternoon Exploration', iconColor: 'var(--accent-teal-light)' },
    evening: { badge: 'badge-purple', label: 'Evening Experience', iconColor: '#fb7185' }
  };

  const slot = slotColors[timeSlot.toLowerCase()] || slotColors.morning;

  return (
    <div style={{
      background: 'rgba(14, 18, 32, 0.65)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      position: 'relative',
      transition: 'border-color 0.2s ease, transform 0.2s ease'
    }}>
      {/* Time Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span className={`badge ${slot.badge}`}>
          {slot.label}
        </span>
        {activity.category && (
          <span style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Tag size={12} />
            {activity.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '10px',
        lineHeight: 1.4
      }}>
        {activity.activity}
      </h4>

      {/* Meta Row: Location, Duration, Cost */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.86rem',
        color: 'var(--text-secondary)',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} color="var(--accent-teal)" />
          <span>{activity.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="var(--accent-purple-light)" />
          <span>{activity.duration}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={14} color="var(--accent-amber)" />
          <span>Est. {activity.cost} {currency}</span>
        </div>
      </div>

      {/* Pro Tips Box */}
      {activity.tips && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          borderLeft: '3px solid var(--accent-amber)',
          borderRadius: '4px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.84rem',
          color: '#fef3c7'
        }}>
          <Lightbulb size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, lineHeight: 1.45 }}>{activity.tips}</p>
        </div>
      )}
    </div>
  );
}
