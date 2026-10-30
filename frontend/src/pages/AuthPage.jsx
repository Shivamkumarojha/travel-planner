import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    continueAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        border: '1px solid var(--border-glow)'
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--gradient-brand)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Compass size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isSignUp ? 'Start saving and customizing your AI itineraries' : 'Sign in to access your planned travels'}
          </p>
        </div>

        {/* Demo Fast Track Pill */}
        <button
          onClick={handleGuestLogin}
          type="button"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(20, 184, 166, 0.12)',
            border: '1px dashed var(--accent-teal)',
            color: 'var(--accent-teal-light)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={16} />
          <span>Continue as Demo Guest (Instant)</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '18px 0',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span>OR SIGN IN WITH EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {errorMsg && (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.88rem',
            marginBottom: '20px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label className="form-label"><User size={15} /> Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Alex Morgan"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label"><Mail size={15} /> Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="alex@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><Lock size={15} /> Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            <span>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-purple-light)',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
