
import React, { useState } from 'react';
import snapshot from '../data/portfolioSnapshot.json';

interface Props {
  onBack: () => void;
}

export default function PortfolioScreen({ onBack }: Props) {
  const { summary, holdings } = snapshot;
  const [filter, setFilter] = useState('all');

  const filteredHoldings = filter === 'all' 
    ? holdings 
    : holdings.filter(h => (filter === 'plus' ? h.total_change >= 0 : h.total_change < 0));

  return (
    <div className="screen-layout" style={{ 
      padding: '24px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      background: 'linear-gradient(180deg, #0a0e17 0%, #16213e 100%)',
      minHeight: '100vh',
      color: '#e0e0e0',
      fontFamily: 'var(--body-font)' 
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--pixel-font)', fontSize: '24px', color: '#ffd700', margin: 0 }}>
            📊 Raphael Asset Dashboard
          </h1>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Real-time Market Data via KIS-Agent v3.0</p>
        </div>
        <button onClick={onBack} className="pixel-btn" style={{ 
          padding: '10px 20px', 
          background: '#e94560', 
          border: 'none', 
          fontSize: '12px',
          cursor: 'pointer' 
        }}>EXIT</button>
      </div>

      {/* Hero Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <SummaryCard 
          label="오늘의 손익" 
          value={`${summary.total_day_change > 0 ? '+' : ''}${summary.total_day_change.toLocaleString()}원`}
          sub="Daily P&L"
          color={summary.total_day_change >= 0 ? '#00c851' : '#ff4b2b'}
        />
        <SummaryCard 
          label="총 보유 종목" 
          value={`${holdings.length}개`}
          sub="Active Holdings"
          color="#ffd700"
        />
        <SummaryCard 
          label="계즈 상태" 
          value="실전 투자"
          sub="REAL-TIME CONNECTED"
          color="#a0c4ff"
        />
      </div>

      {/* Filtering */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {['all', 'plus', 'minus'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid #333',
              background: filter === f ? '#ffd700' : 'transparent',
              color: filter === f ? '#000' : '#888',
              fontSize: '11px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {f === 'all' ? '전체' : f === 'plus' ? '상승' : '하락'}
          </button>
        ))}
      </div>

      {/* Main Table Container */}
      <div style={{ 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#888', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px' }}>Ticker & Name</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>1D Change</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Quantity</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Daily P&L</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.map((h, i) => (
              <tr key={h.ticker} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600 }}>{h.name}</div>
                  <div style={{ fontSize: '11px', color: '#555', fontFamily: 'monospace' }}>{h.ticker}</div>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 500 }}>
                  {h.current_price.toLocaleString()}
                </td>
                <td style={{ 
                  padding: '16px 20px', 
                  textAlign: 'right', 
                  color: h.day_change >= 0 ? '#00c851' : '#ff4b2b',
                  fontWeight: 600
                }}>
                  {h.day_change > 0 ? '+' : ''}{h.day_change.toLocaleString()}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', color: '#888' }}>
                  {h.quantity}
                </td>
                <td style={{ 
                  padding: '16px 20px', 
                  textAlign: 'right', 
                  color: h.total_change >= 0 ? '#00c851' : '#ff4b2b',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  {h.total_change > 0 ? '+' : ''}{h.total_change.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: '#444' }}>
        Last updated: {new Date().toLocaleTimeString()} | Source: KIS OpenAPI REAL
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      <div style={{ fontSize: '28px', color: color, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '10px', color: '#444' }}>{sub}</div>
    </div>
  );
}
