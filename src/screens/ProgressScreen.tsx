import React from 'react';
import { ProgressState } from '../hooks/useProgress';
import { mathTopics } from '../data/mathData';
import { englishTopics } from '../data/englishData';
import RobloxCharacter from '../components/RobloxCharacter';

interface Props {
  progress: ProgressState;
  onBack: () => void;
  onReset: () => void;
  xpForNextLevel: (level: number) => number;
  currentLevelXP: (xp: number) => number;
}

export default function ProgressScreen({ progress, onBack, onReset, xpForNextLevel, currentLevelXP }: Props) {
  const { player, topics, recentActivity } = progress;
  const xpP = currentLevelXP(player.xp);
  const xpN = xpForNextLevel(player.level);
  const [confirmReset, setConfirmReset] = React.useState(false);

  const mathCompleted = mathTopics.filter(t => (topics[t.id]?.stars ?? 0) >= 1).length;
  const engCompleted = englishTopics.filter(t => (topics[t.id]?.stars ?? 0) >= 1).length;
  const totalStars = [...mathTopics, ...englishTopics].reduce((acc, t) => acc + (topics[t.id]?.stars ?? 0), 0);
  const maxStars = (mathTopics.length + englishTopics.length) * 3;

  return (
    <div className="screen-layout">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={onBack} className="pixel-btn pixel-btn-back">← 뒤로</button>
        <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '14px', color: '#9b59b6', textShadow: '0 0 10px #9b59b6' }}>
          📊 나의 진행도
        </div>
      </div>

      {/* Player Card */}
      <div style={{
        background: 'linear-gradient(135deg, #16213e, #0f3460)',
        border: '3px solid #9b59b644',
        borderRadius: '16px', padding: '24px',
        marginBottom: '20px',
        display: 'flex', gap: '20px', alignItems: 'center',
        boxShadow: '0 0 30px rgba(155,89,182,0.2)',
      }}>
        <RobloxCharacter avatarId={player.avatarId} size={80} animate />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>
            {player.name}
          </div>
          <div style={{
            display: 'inline-block',
            background: '#ffd700', color: '#000',
            fontFamily: 'var(--pixel-font)', fontSize: '9px',
            padding: '3px 10px', borderRadius: '4px',
            marginBottom: '12px',
          }}>Level {player.level} 탐험가</div>

          {/* XP Bar */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '8px', color: '#aaa' }}>경험치 (XP)</span>
              <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '8px', color: '#ffd700' }}>{xpP} / {xpN}</span>
            </div>
            <div className="bar-track-xp" style={{ height: '12px', borderRadius: '6px' }}>
              <div style={{
                height: '100%', width: `${(xpP / xpN) * 100}%`,
                background: 'linear-gradient(90deg, #9b59b6, #ffd700)',
                borderRadius: '6px', transition: 'width 0.8s ease',
                boxShadow: '0 0 8px rgba(155,89,182,0.5)',
              }} />
            </div>
          </div>

          <div style={{ fontFamily: 'var(--body-font)', fontSize: '12px', color: '#666' }}>
            총 XP: {player.xp} | 가입: {new Date(player.joinDate).toLocaleDateString('ko-KR')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { icon: '💰', label: '보유 코인', value: player.coins.toLocaleString(), color: '#ffd700' },
          { icon: '✅', label: '총 정답 수', value: player.totalCorrect.toLocaleString(), color: '#00c851' },
          { icon: '⭐', label: '획득 별', value: `${totalStars} / ${maxStars}`, color: '#ffd700' },
          { icon: '📚', label: '클리어 단원', value: `${mathCompleted + engCompleted} / ${mathTopics.length + englishTopics.length}`, color: '#74b9ff' },
        ].map(s => (
          <div key={s.label} className="card-panel" style={{ border: `2px solid ${s.color}33`, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px' }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '14px', color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--body-font)', fontSize: '12px', color: '#666' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Math Progress */}
      <SubjectProgress
        title="📐 수학 단원"
        topics={mathTopics}
        topicProgress={topics}
        color="#ff6b6b"
        done={mathCompleted}
      />

      {/* English Progress */}
      <SubjectProgress
        title="📖 영어 단원"
        topics={englishTopics}
        topicProgress={topics}
        color="#74b9ff"
        done={engCompleted}
      />

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '10px', color: '#ffd700', marginBottom: '12px' }}>
            ⚡ 최근 학습 기록
          </div>
          <div className="activity-list">
            {recentActivity.slice(0, 8).map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 16px',
                borderBottom: i < recentActivity.slice(0, 8).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: a.subject === '수학' ? '#ff6b6b22' : '#74b9ff22',
                    border: `1px solid ${a.subject === '수학' ? '#ff6b6b44' : '#74b9ff44'}`,
                    color: a.subject === '수학' ? '#ff6b6b' : '#74b9ff',
                    fontSize: '9px', fontFamily: 'var(--pixel-font)',
                    padding: '2px 6px', borderRadius: '3px',
                  }}>{a.subject}</span>
                  <span style={{ fontFamily: 'var(--body-font)', fontSize: '13px', color: '#bbb' }}>{a.topicName}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--pixel-font)', fontSize: '12px',
                    color: a.score >= 80 ? '#00c851' : a.score >= 60 ? '#ffd700' : '#ff6b6b',
                  }}>{a.score}점</div>
                  <div style={{ fontFamily: 'var(--body-font)', fontSize: '10px', color: '#444', marginTop: '2px' }}>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset button */}
      <div style={{ marginBottom: '40px' }}>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={{
              width: '100%', padding: '12px',
              background: 'transparent',
              border: '2px solid #ff333344',
              borderRadius: '10px', cursor: 'pointer',
              color: '#ff333388',
              fontFamily: 'var(--body-font)', fontSize: '13px',
            }}
          >🗑️ 진행도 초기화</button>
        ) : (
          <div style={{
            background: 'rgba(255,51,51,0.1)',
            border: '2px solid #ff333344',
            borderRadius: '12px', padding: '16px',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--body-font)', fontSize: '14px', color: '#ff6b6b', marginBottom: '12px' }}>
              ⚠️ 정말 초기화할까요? 모든 진행도가 사라져요!
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { onReset(); setConfirmReset(false); }}
                className="pixel-btn"
                style={{
                  flex: 1, padding: '12px',
                  background: 'linear-gradient(180deg, #ff3333, #cc0000)',
                  color: '#fff', fontSize: '10px',
                  fontFamily: 'var(--pixel-font)', border: '3px solid #880000',
                }}
              >초기화</button>
              <button
                onClick={() => setConfirmReset(false)}
                className="pixel-btn"
                style={{
                  flex: 1, padding: '12px',
                  background: 'linear-gradient(180deg, #444, #222)',
                  color: '#fff', fontSize: '10px',
                  fontFamily: 'var(--pixel-font)', border: '3px solid #111',
                }}
              >취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectProgress({ title, topics, topicProgress, color, done }: {
  title: string;
  topics: typeof mathTopics;
  topicProgress: Record<string, any>;
  color: string;
  done: number;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '10px', color: '#ffd700' }}>{title}</div>
        <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '9px', color }}>{done}/{topics.length} 클리어</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {topics.map(t => {
          const tp = topicProgress[t.id];
          const stars = tp?.stars ?? 0;
          const best = tp?.bestScore ?? 0;
          const attempts = tp?.attempts ?? 0;
          return (
            <div key={t.id} style={{
              background: 'rgba(22,33,62,0.7)',
              border: `2px solid ${stars > 0 ? t.color + '44' : '#1a1a3e'}`,
              borderRadius: '10px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{ fontSize: '20px' }}>{t.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--body-font)', fontSize: '13px', fontWeight: '700', color: stars > 0 ? '#fff' : '#555' }}>
                  {t.name}
                </div>
                {attempts > 0 && (
                  <div style={{ fontFamily: 'var(--body-font)', fontSize: '11px', color: '#666', marginTop: '2px' }}>
                    {attempts}회 도전 · 최고 {best}점
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3].map(i => (
                  <span key={i} style={{ color: i <= stars ? '#ffd700' : '#2a2a4a', fontSize: '16px' }}>★</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
