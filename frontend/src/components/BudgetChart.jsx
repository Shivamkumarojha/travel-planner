import React from 'react';
import { DollarSign, PieChart, ShieldCheck, Home, Utensils, Ticket, Train } from 'lucide-react';

export default function BudgetChart({ breakdown, totalBudget, currency = 'USD' }) {
  if (!breakdown) return null;

  const total = breakdown.total_estimated || totalBudget || 1000;

  const categories = [
    {
      name: 'Lodging / Stays',
      amount: breakdown.accommodation_total || 0,
      color: '#a855f7',
      icon: Home
    },
    {
      name: 'Attractions & Tours',
      amount: breakdown.activities_total || 0,
      color: '#14b8a6',
      icon: Ticket
    },
    {
      name: 'Dining & Food',
      amount: breakdown.food_dining_total || 0,
      color: '#f59e0b',
      icon: Utensils
    },
    {
      name: 'Local Transport',
      amount: breakdown.transport_total || 0,
      color: '#06b6d4',
      icon: Train
    },
    {
      name: 'Buffer / Contingency',
      amount: breakdown.misc_contingency || 0,
      color: '#ec4899',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '6px' }}>FINANCIAL BLUEPRINT</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Budget Allocation & Expenditure Estimate
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Spend</span>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-teal-light)' }}>
            {total} {currency}
          </h4>
        </div>
      </div>

      {/* Multi-Segment Proportion Bar */}
      <div style={{
        height: '14px',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.05)',
        marginBottom: '24px'
      }}>
        {categories.map((cat, i) => {
          const pct = Math.max(0, Math.min(100, (cat.amount / total) * 100));
          return (
            <div
              key={i}
              style={{
                width: `${pct}%`,
                background: cat.color,
                transition: 'width 0.4s ease'
              }}
              title={`${cat.name}: ${cat.amount} ${currency} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Category breakdown cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      }}>
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const pct = Math.round((cat.amount / total) * 100) || 0;
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(14, 18, 32, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: cat.color,
                flexShrink: 0
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {cat.name}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {cat.amount} {currency}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
