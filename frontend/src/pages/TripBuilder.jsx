import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, Sparkles, ArrowRight, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StepWizard from '../components/StepWizard';
import LoadingSpinner from '../components/LoadingSpinner';

const POPULAR_DESTINATIONS = ['Paris, France', 'Tokyo, Japan', 'Rome, Italy', 'New York, USA', 'Bali, Indonesia', 'Barcelona, Spain'];

const TRAVEL_STYLES = [
  { id: 'Balanced', label: 'Balanced Pacing', desc: 'Mix of iconic landmarks & chill downtime' },
  { id: 'Backpacker', label: 'Backpacker / Budget', desc: 'Hostels, street food & public transit' },
  { id: 'Luxury', label: 'Luxury & Comfort', desc: 'High-end dining, private cabs & 5-star stays' },
  { id: 'Adventure', label: 'Adventure & Active', desc: 'Hiking, outdoor exploration & action' }
];

const AVAILABLE_INTERESTS = [
  'Historical Landmarks',
  'Local Gastronomy & Food',
  'Museums & Galleries',
  'Nature & Scenic Vistas',
  'Vibrant Nightlife',
  'Architecture & Heritage',
  'Boutique Shopping',
  'Coffee & Cafe Culture',
  'Hidden Local Gems'
];

export default function TripBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [destination, setDestination] = useState('Paris, France');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-04');
  const [budgetTotal, setBudgetTotal] = useState(1400);
  const [budgetCurrency, setBudgetCurrency] = useState('USD');
  const [groupSize, setGroupSize] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [interests, setInterests] = useState(['Historical Landmarks', 'Local Gastronomy & Food', 'Hidden Local Gems']);

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1) || 3;

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        destination,
        start_date: startDate,
        end_date: endDate,
        duration_days: durationDays,
        budget_total: Number(budgetTotal),
        budget_currency: budgetCurrency,
        group_size: Number(groupSize),
        travel_style: travelStyle,
        interests,
        user_id: user?.id || null
      };

      const itineraryData = await api.generateItinerary(payload);
      
      // Navigate to Itinerary View with the generated result
      navigate('/itinerary', {
        state: {
          itinerary: itineraryData,
          tripParams: payload
        }
      });
    } catch (err) {
      console.error('Error generating itinerary:', err);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner destination={destination} />;
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge badge-purple" style={{ marginBottom: '8px' }}>VOYAGE AI WIZARD</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Create Your Custom Itinerary</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Step-by-step intelligence planning tailored to your exact pacing and budget.
        </p>
      </div>

      <StepWizard currentStep={step} setStep={setStep} />

      <div className="glass-panel" style={{ padding: '36px', border: '1px solid var(--border-glow)' }}>
        {/* STEP 1: DESTINATION & DATES */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Where & When?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Choose your destination and preferred travel timeline.
            </p>

            <div className="form-group">
              <label className="form-label"><MapPin size={16} /> Destination City or Region</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Kyoto, Japan or Florence, Italy"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              {/* Quick destination chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setDestination(dest)}
                    style={{
                      background: destination === dest ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${destination === dest ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                      color: destination === dest ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label"><Calendar size={16} /> Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Calendar size={16} /> End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              fontSize: '0.88rem',
              color: 'var(--accent-teal-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={16} />
              <span>Trip Duration: <strong>{durationDays} Days</strong> planned</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!destination || !startDate || !endDate}
              >
                <span>Next: Budget & Group</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET & GROUP SIZE */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Budget & Group Size</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Set your target financial scope and number of travelers.
            </p>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label"><DollarSign size={16} /> Total Budget</label>
                <input
                  type="number"
                  className="form-control"
                  min="100"
                  step="50"
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-control"
                  value={budgetCurrency}
                  onChange={(e) => setBudgetCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Users size={16} /> Traveling Party</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {[
                  { size: 1, label: 'Solo Traveler' },
                  { size: 2, label: 'Couple (2)' },
                  { size: 4, label: 'Family / Small Group (4)' },
                  { size: 6, label: 'Large Group (6+)' }
                ].map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setGroupSize(item.size)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: groupSize === item.size ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${groupSize === item.size ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                      color: groupSize === item.size ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                <span>Next: Preferences</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TRAVEL STYLE & INTERESTS */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Travel Vibe & Interests</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select what makes your ideal trip truly extraordinary.
            </p>

            <div className="form-group">
              <label className="form-label">Travel Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {TRAVEL_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setTravelStyle(style.id)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: travelStyle === style.id ? 'rgba(168, 85, 247, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${travelStyle === style.id ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: travelStyle === style.id ? 'var(--accent-purple-light)' : 'var(--text-primary)', marginBottom: '4px' }}>
                      {style.label}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {style.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label"><Heart size={16} /> Key Interests (Pick 2 or more)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-full)',
                        background: isSelected ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${isSelected ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                        color: isSelected ? 'var(--accent-teal-light)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isSelected && <CheckCircle2 size={14} color="var(--accent-teal)" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
                <span>Review & Finalize</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & GENERATE */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Ready to Synthesize</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Verify your trip inputs before Google Gemini generates your day-by-day plan.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Destination</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-purple-light)' }}>{destination}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duration & Dates</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{durationDays} Days ({startDate} - {endDate})</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Budget</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-teal-light)' }}>{budgetTotal} {budgetCurrency}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pacing & Style</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{travelStyle} ({groupSize} Traveler{groupSize > 1 ? 's' : ''})</p>
                </div>
              </div>

              {interests.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Selected Interests
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {interests.map((int, i) => (
                      <span key={i} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{int}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(3)}>
                <ArrowLeft size={16} />
                <span>Adjust Settings</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerate}
                style={{ padding: '14px 32px', fontSize: '1.05rem' }}
              >
                <Sparkles size={18} />
                <span>Generate Itinerary Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
