import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Compass, Calendar, DollarSign, MapPin, Search, Sparkles, Globe2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import TripCard from '../components/TripCard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await api.fetchTrips(user?.id);
      setTrips(data || []);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (confirm('Are you sure you want to remove this saved itinerary?')) {
      await api.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Quick stats calculation
  const totalTrips = trips.length;
  const totalDays = trips.reduce((acc, t) => acc + (t.duration_days || 0), 0);
  const uniqueDestinations = new Set(trips.map((t) => t.destination.split(',')[0].trim())).size;
  const totalBudget = trips.reduce((acc, t) => acc + (t.budget_total || 0), 0);

  const filteredTrips = trips.filter((t) =>
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>EXPLORER DASHBOARD</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Saved Adventures</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage, review, and customize your personalized travel itineraries.
          </p>
        </div>

        <Link to="/builder" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <Plus size={18} />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Stats Summary Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '36px'
      }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple-light)'
          }}>
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED TRIPS</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalTrips}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(20, 184, 166, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-teal-light)'
          }}>
            <Globe2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>CITIES EXPLORED</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{uniqueDestinations}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>DAYS PLANNED</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalDays} Days</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(236, 72, 153, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-pink)'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL BUDGET</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>${totalBudget}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '28px', maxWidth: '400px', position: 'relative' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Filter trips by city or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '44px' }}
        />
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p>Loading your saved itineraries...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 30px',
          textAlign: 'center',
          maxWidth: '550px',
          margin: '40px auto'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(168, 85, 247, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            color: 'var(--accent-purple-light)'
          }}>
            <Compass size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>No Trips Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.92rem' }}>
            {searchTerm
              ? `No itineraries matching "${searchTerm}". Try a different keyword.`
              : 'You have not created any trip plans yet. Use our AI builder to generate your first adventure!'}
          </p>
          <Link to="/builder" className="btn btn-primary">
            <Sparkles size={16} />
            <span>Generate First Trip</span>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
          ))}
        </div>
      )}
    </div>
  );
}
