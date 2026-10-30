import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Shield, Clock, DollarSign, MapPin, ArrowRight, Check, HeartHandshake } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '80px 0 100px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          {/* Top Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 'var(--radius-full)', marginBottom: '24px' }}>
            <Sparkles size={16} color="var(--accent-purple-light)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-purple-light)', letterSpacing: '0.5px' }}>
              POWERED BY GEMINI 1.5 & FASTAPI
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            maxWidth: '900px',
            margin: '0 auto 24px auto'
          }}>
            Your Entire Vacation Planned in <span style={{
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>30 Seconds</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6
          }}>
            Tell VoyageAI where you want to go, your budget, and travel preferences. Get a curated day-by-day itinerary with verified attractions, authentic food, and transit estimates.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/builder" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              <span>Build My Itinerary Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              <span>Explore Sample Trips</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '850px',
            margin: '70px auto 0 auto'
          }}>
            {[
              { val: '10,000+', label: 'Itineraries Crafted' },
              { val: '120+', label: 'Countries Supported' },
              { val: '< 30s', label: 'Average Generation' },
              { val: '100%', label: 'Budget Synchronized' }
            ].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {stat.val}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ padding: '80px 0', background: 'rgba(0, 0, 0, 0.25)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
            <span className="badge badge-purple" style={{ marginBottom: '10px' }}>WHY VOYAGE AI</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Engineered for Seamless Journeys</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: Clock,
                title: 'Structured Day Timelines',
                desc: 'Balanced morning, afternoon, and evening blocks optimized for geographic proximity to prevent traveler fatigue.',
                color: 'var(--accent-purple)'
              },
              {
                icon: DollarSign,
                title: 'Smart Budget Allocation',
                desc: 'Automatic breakdown of lodging, dining, museum admissions, and daily public transit to ensure zero surprise costs.',
                color: 'var(--accent-teal)'
              },
              {
                icon: Sparkles,
                title: '1-Click Single Day Regeneration',
                desc: 'Want more adventure on Day 3? Request real-time re-rolls of specific days without rewriting your entire trip.',
                color: 'var(--accent-amber)'
              }
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="glass-panel" style={{ padding: '32px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `rgba(${f.color === 'var(--accent-purple)' ? '168, 85, 247' : f.color === 'var(--accent-teal)' ? '20, 184, 166' : '245, 158, 11'}, 0.15)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: f.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA Banner */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '60px 30px',
            maxWidth: '850px',
            margin: '0 auto',
            border: '1px solid var(--border-glow)'
          }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>Ready to Plan Your Next Adventure?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 30px auto' }}>
              No credit card required. Generate personalized itineraries in seconds and export them for your travels.
            </p>
            <Link to="/builder" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1.1rem' }}>
              Launch Trip Builder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
