import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, MapPin, CheckCircle2 } from 'lucide-react';

export default function LoadingSpinner({ destination }) {
  const messages = [
    `Connecting with AI intelligence engine...`,
    `Analyzing top attractions & hidden gems in ${destination || 'your destination'}...`,
    `Curating morning, afternoon & evening pacing...`,
    `Balancing daily budget allocation & neighborhood stays...`,
    `Finalizing personalized recommendations & local tips...`
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="glass-panel" style={{
      maxWidth: '600px',
      margin: '60px auto',
      padding: '50px 30px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border-glow)'
    }}>
      {/* Pulsing icon core */}
      <div style={{
        position: 'relative',
        width: '90px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'var(--gradient-brand)',
          opacity: 0.25,
          animation: 'pulseGlow 2s infinite ease-in-out'
        }} />
        <div style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Sparkles size={32} color="#ffffff" />
        </div>
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
        Generating Your Dream Itinerary
      </h3>

      <p style={{
        color: 'var(--accent-teal-light)',
        fontSize: '0.95rem',
        fontWeight: 500,
        minHeight: '26px',
        transition: 'all 0.3s'
      }}>
        {messages[currentIdx]}
      </p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
        {messages.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              background: i === currentIdx ? 'var(--accent-purple-light)' : 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
