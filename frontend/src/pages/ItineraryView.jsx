import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Compass,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import DayTimeline from '../components/DayTimeline';
import BudgetChart from '../components/BudgetChart';

export default function ItineraryView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data from previous step or sample fallback
  const initialItinerary = location.state?.itinerary || null;
  const tripParams = location.state?.tripParams || {};
  const tripRecord = location.state?.tripRecord || null;

  const [itinerary, setItinerary] = useState(initialItinerary);
  const [isSaved, setIsSaved] = useState(Boolean(tripRecord));
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fallback if accessed directly without state
  if (!itinerary) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <Compass size={40} color="var(--accent-purple-light)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>No Itinerary Loaded</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Please build a new trip or select a saved trip from your dashboard.
          </p>
          <Link to="/builder" className="btn btn-primary">
            Build Itinerary
          </Link>
        </div>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveTrip = async () => {
    setSaveLoading(true);
    try {
      const record = {
        user_id: user?.id || null,
        destination: itinerary.destination,
        start_date: tripParams.start_date || itinerary.days[0]?.date || '2025-06-01',
        end_date: tripParams.end_date || itinerary.days[itinerary.days.length - 1]?.date || '2025-06-04',
        duration_days: itinerary.days.length,
        budget_total: tripParams.budget_total || itinerary.total_estimated_cost || 1200,
        budget_currency: tripParams.budget_currency || itinerary.currency || 'USD',
        group_size: tripParams.group_size || 1,
        travel_style: tripParams.travel_style || 'Balanced',
        interests: tripParams.interests || [],
        itinerary: itinerary
      };

      await api.saveTrip(record);
      setIsSaved(true);
      showToast('Trip saved successfully to your Dashboard!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save trip.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRegenerateDay = async (dayNumber) => {
    const feedback = prompt('Any specific vibe or change for this day? (e.g. "More foodie stops", "Less walking", "Hidden art gems")') || 'Make it extra exciting';
    try {
      const refreshedDay = await api.regenerateDay({
        destination: itinerary.destination,
        day_number: dayNumber,
        date: itinerary.days.find((d) => d.day === dayNumber)?.date,
        user_feedback: feedback
      });

      // Update state
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((d) => (d.day === dayNumber ? refreshedDay : d))
      }));
      showToast(`Day ${dayNumber} customized successfully!`);
    } catch (err) {
      console.error('Regenerate day error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Itinerary link copied to clipboard!');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'rgba(20, 184, 166, 0.95)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 100,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print Itinerary">
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>

          <button onClick={handleShare} className="btn btn-secondary btn-sm" title="Share Itinerary">
            <Share2 size={16} />
            <span>Share</span>
          </button>

          <button
            onClick={handleSaveTrip}
            disabled={saveLoading || isSaved}
            className={isSaved ? 'btn btn-teal btn-sm' : 'btn btn-primary btn-sm'}
          >
            {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
            <span>{isSaved ? 'Saved to Dashboard' : saveLoading ? 'Saving...' : 'Save Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Panel */}
      <div className="glass-panel" style={{
        padding: '36px',
        marginBottom: '32px',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-purple">{itinerary.country || 'International'}</span>
              <span className="badge badge-teal">{itinerary.days.length} Days Itinerary</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {itinerary.destination}
            </h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Total</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-teal-light)' }}>
              {itinerary.total_estimated_cost} {itinerary.currency || 'USD'}
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '850px', marginBottom: '24px' }}>
          {itinerary.summary}
        </p>

        {/* Highlights Tags */}
        {itinerary.highlights && itinerary.highlights.length > 0 && (
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Key Journey Highlights
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {itinerary.highlights.map((h, i) => (
                <div key={i} style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={14} color="var(--accent-purple-light)" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Financial & Budget Breakdown */}
      <BudgetChart
        breakdown={itinerary.budget_breakdown}
        totalBudget={itinerary.total_estimated_cost}
        currency={itinerary.currency}
      />

      {/* Day by Day Timeline Sections */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '6px' }}>CHRONOLOGICAL SCHEDULE</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Day-by-Day Experience</h2>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Click any day to toggle view • Click "Regenerate Day" to refine
          </span>
        </div>

        {itinerary.days.map((day) => (
          <DayTimeline
            key={day.day}
            dayData={day}
            currency={itinerary.currency}
            onRegenerateDay={handleRegenerateDay}
          />
        ))}
      </div>
    </div>
  );
}
