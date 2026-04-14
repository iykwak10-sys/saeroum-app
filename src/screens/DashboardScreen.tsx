import React from 'react';
import RobloxCharacter from '../components/RobloxCharacter';
import { ProgressState } from '../hooks/useProgress';
import { mathTopics } from '../data/mathData';
import { englishTopics } from '../data/englishData';

interface Props {
  progress: ProgressState;
  onSelectSubject: (subject: 'math' | 'english') => void;
  onViewProgress: () => void;
  onViewPortfolio: () => void;
  xpForNextLevel: (level: number) => number;
  currentLevelXP: (xp: number) => number;
}

export default function DashboardScreen({
  progress, onSelectSubject, onViewProgress, onViewPortfolio, xpForNextLevel, currentLevelXP,
}: Props) {
  const { player, topics, recentActivity } = progress;
  const xpProgress = currentLevelXP(player.xp);
  const xpNeeded = xpForNextLevel(player.level);
  const xpPercent = (xpProgress / xpNeeded) * 100;

  const mathDone = mathTopics.filter(t => topics[t.id]?.stars > 0).length;
  const engDone = englishTopics.filter(t => topics[t.id]?.stars > 0).length;
  const totalTopics = mathTopics.length + englishTopics.length;
  const totalDone = mathDone + engDone;

  return (
    <div className="screen-layout">
      {/* Top HUD */}
      <div style={{
        background: 'linear-gradient(135deg, #16213e, #0f3460)',
        border: '2px solid #0f3460',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <RobloxCharacter avatarId={player.avatarId} size={70} animate />
        </div>

        {/* Player Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{
              fontFamily: 'var(--pixel-font)', fontSize: '13px', color: '#fff',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{player.name}</span>
            <span style={{
              background: '#ffd700', color: '#000',
              fontFamily: 'var(--pixel-font)', fontSize: '8px',
              padding: '3px 8px', borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}>Lv.{player.level}</span>
          </div>

          {/* XP Bar */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '7px', color: '#a0c4ff' }}>EXP</span>
              <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '7px', color: '#a0c4ff' }}>{xpProgress}/{xpNeeded}</span>
            </div>
            <div className="bar-track-xp">
              <div style={{
                height: '100%',
                width: `${xpPercent}%`,
                background: 'linear-gradient(90deg, #00c851, #ffd700)',
                borderRadius: '5px',
                transition: 'width 0.8s ease',
                boxShadow: '0 0 6px rgba(0,200,81,0.5)',
              }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { icon: '💰', val: player.coins, label: '코인' },
              { icon: '✅', val: player.totalCorrect, label: '정답' },
              { icon: '📚', val: `${totalDone}/${totalTopics}`, label: '단원' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '9px', color: '#ffd700' }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--body-font)', fontSize: '10px', color: '#666' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div style={{ marginBottom: '20px' }}>
        <SectionTitle>📖 과목 선택</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <SubjectCard
            icon="📐"
            title="수학"
            subtitle="소인수분해·일차방정식 외"
            color="#ff6b6b"
            done={mathDone}
            total={mathTopics.length}
            onClick={() => onSelectSubject('math')}
          />
          <SubjectCard
            icon="📖"
            title="영어"
            subtitle="문법·어휘·현재진행형 외"
            color="#74b9ff"
            done={engDone}
            total={englishTopics.length}
            onClick={() => onSelectSubject('english')}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ marginBottom: '20px' }}>
        <SectionTitle>🏆 단원별 현황</SectionTitle>
        <div className="card-panel" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {[...mathTopics, ...englishTopics].map(t => {
            const tp = topics[t.id];
            const stars = tp?.stars ?? 0;
            return (
              <div key={t.id} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{t.emoji}</div>
                <div style={{ fontSize: '13px', lineHeight: 1 }}>
                  {[1, 2, 3].map(i => (
                    <span key={i} style={{ color: i <= stars ? '#ffd700' : '#333', fontSize: '10px' }}>★</span>
                  ))}
                </div>
                <div style={{
                  fontFamily: 'var(--body-font)', fontSize: '9px',
                  color: '#666', marginTop: '2px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{t.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionTitle>⚡ 최근 활동</SectionTitle>
          <div className="activity-list">
            {recentActivity.slice(0, 5).map((a, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div>
                  <span style={{
                    background: a.subject === '수학' ? '#ff6b6b22' : '#74b9ff22',
                    border: `1px solid ${a.subject === '수학' ? '#ff6b6b44' : '#74b9ff44'}`,
                    color: a.subject === '수학' ? '#ff6b6b' : '#74b9ff',
                    fontSize: '10px', fontFamily: 'var(--pixel-font)',
                    padding: '2px 6px', borderRadius: '4px', marginRight: '8px',
                  }}>{a.subject}</span>
                  <span style={{ fontFamily: 'var(--body-font)', fontSize: '13px', color: '#ccc' }}>
                    {a.topicName}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--pixel-font)', fontSize: '11px',
                  color: a.score >= 80 ? '#00c851' : a.score >= 60 ? '#ffd700' : '#ff6b6b',
                }}>
                  {a.score}점
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Button */}
      
      <button
        onClick={onViewPortfolio}
        className="pixel-btn"
        style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(180deg, #f1c40f, #f39c12)',
          color: '#000', fontSize: '11px',
          fontFamily: 'var(--pixel-font)',
          border: '3px solid #d35400',
          marginBottom: '10px'
        }}
      >
        💰 실시간 포트폴리오 대시보드
      </button>
      <button
        onClick={onViewProgress}
        className="pixel-btn"
        style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(180deg, #9b59b6, #7d3c98)',
          color: 'white', fontSize: '11px',
          fontFamily: 'var(--pixel-font)',
          border: '3px solid #5b2c6f',
        }}
      >
        📊 진행도 상세 보기
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--pixel-font)', fontSize: '10px',
      color: '#ffd700', marginBottom: '12px',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      {children}
    </div>
  );
}

function SubjectCard({
  icon, title, subtitle, color, done, total, onClick
}: {
  icon: string; title: string; subtitle: string;
  color: string; done: number; total: number;
  onClick: () => void;
}) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,52,96,0.8))',
        border: `3px solid ${color}55`,
        borderRadius: '14px',
        padding: '20px 16px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        boxShadow: `0 4px 0 ${color}33`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 0 ${color}55, 0 0 20px ${color}33`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 0 ${color}33`;
      }}
    >
      <div style={{ fontSize: '40px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '13px', color }}>{title}</div>
      <div style={{ fontFamily: 'var(--body-font)', fontSize: '11px', color: '#888', lineHeight: 1.4 }}>
        {subtitle}
      </div>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '7px', color: '#666' }}>진행도</span>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '7px', color }}>{done}/{total}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
        </div>
      </div>
    </button>
  );
}
