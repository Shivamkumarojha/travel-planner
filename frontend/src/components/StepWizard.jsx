import React from 'react';
import { MapPin, DollarSign, Heart, CheckCircle2 } from 'lucide-react';

export default function StepWizard({ currentStep, setStep }) {
  const steps = [
    { num: 1, label: 'Destination', icon: MapPin },
    { num: 2, label: 'Budget & Size', icon: DollarSign },
    { num: 3, label: 'Preferences', icon: Heart },
    { num: 4, label: 'AI Review', icon: CheckCircle2 }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      margin: '0 auto 40px auto',
      maxWidth: '650px',
      padding: '0 20px'
    }}>
      {/* Background connector bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50px',
        right: '50px',
        height: '2px',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1
      }}>
        <div style={{
          height: '100%',
          width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          background: 'var(--gradient-brand)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {steps.map((s) => {
        const Icon = s.icon;
        const isActive = currentStep === s.num;
        const isPassed = currentStep > s.num;

        return (
          <div
            key={s.num}
            onClick={() => isPassed && setStep(s.num)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              cursor: isPassed ? 'pointer' : 'default'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive
                ? 'var(--accent-purple)'
                : isPassed
                ? 'var(--accent-teal)'
                : 'var(--bg-secondary)',
              border: `2px solid ${isActive ? 'var(--accent-purple-light)' : isPassed ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
              color: '#ffffff',
              boxShadow: isActive ? '0 0 15px rgba(168, 85, 247, 0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <Icon size={18} />
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              marginTop: '8px',
              color: isActive ? 'var(--text-primary)' : isPassed ? 'var(--text-secondary)' : 'var(--text-muted)'
            }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
