import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, MapPin, Calendar, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 10, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Voyage<span style={{ color: 'var(--accent-purple-light)' }}>AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{
            color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: location.pathname === '/' ? 600 : 500,
            fontSize: '0.95rem',
            transition: 'color 0.2s'
          }}>
            Overview
          </Link>

          <Link to="/builder" style={{
            color: location.pathname === '/builder' ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
            fontWeight: location.pathname === '/builder' ? 600 : 500,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={16} color="var(--accent-purple)" />
            AI Trip Builder
          </Link>

          <Link to="/dashboard" style={{
            color: location.pathname === '/dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: location.pathname === '/dashboard' ? 600 : 500,
            fontSize: '0.95rem'
          }}>
            My Trips
          </Link>
        </nav>

        {/* User Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.88rem'
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                title="Sign out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/auth" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/builder" className="btn btn-primary btn-sm">
                <PlusCircle size={15} />
                Plan Trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
