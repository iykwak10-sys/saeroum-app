import React, { useEffect, useState } from 'react';
import RobloxCharacter from '../components/RobloxCharacter';
import { Topic } from '../data/mathData';

interface Props {
  topic: Topic;
  correct: number;
  total: number;
  answers: boolean[];
  xpGained: number;
  coinsGained: number;
  stars: number;
  avatarId: number;
  onPlayAgain: () => void;
  onBack: () => void;
}

export default function ResultScreen({
  topic, correct, total, answers, xpGained, coinsGained, stars, avatarId, onPlayAgain, onBack,
}: Props) {
  const score = Math.round((correct / total) * 100);
  const [displayScore, setDisplayScore] = useState(0);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    // Animate score
    let s = 0;
    const interval = setInterval(() => {
      s = Math.min(s + 2, score);
      setDisplayScore(s);
      if (s >= score) clearInterval(interval);
    }, 20);

    setTimeout(() => setShowRewards(true), 1200);
    return () => clearInterval(interval);
  }, [score]);

  const getMessage = () => {
    if (score === 100) return { text: '완벽해요! 🎯', color: '#ffd700', sub: '모든 문제를 맞혔어요! 천재인가요?!' };
    if (score >= 80) return { text: '훌륭해요! 🌟', color: '#00c851', sub: '정말 잘 했어요! 조금만 더 하면 만점!' };
    if (score >= 60) return { text: '잘 했어요! 👍', color: '#74b9ff', sub: '좋은 결과예요! 틀린 문제를 복습해봐요.' };
    if (score >= 40) return { text: '더 노력해요! 💪', color: '#ffd700', sub: '포기하지 마세요! 다시 도전해봐요.' };
    return { text: '다시 해봐요! 🔄', color: '#ff6b6b', sub: '괜찮아요! 연습이 필요할 뿐이에요.' };
  };

  const msg = getMessage();

  return (
    <div className="screen-layout" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Result Card */}
      <div style={{
        background: 'linear-gradient(135deg, #16213e, #0f3460)',
        border: `3px solid ${topic.color}55`,
        borderRadius: '20px',
        padding: '32px 24px',
        width: '100%',
        textAlign: 'center',
        boxShadow: `0 0 50px ${topic.glowColor}, 0 16px 40px rgba(0,0,0,0.5)`,
        animation: 'bounce-in 0.6s ease',
        marginBottom: '20px',
      }}>
        {/* Character */}
        <div style={{ marginBottom: '16px' }}>
          <RobloxCharacter avatarId={avatarId} size={90} animate />
        </div>

        {/* Message */}
        <div style={{
          fontFamily: 'var(--pixel-font)', fontSize: '18px',
          color: msg.color, textShadow: `0 0 20px ${msg.color}`,
          marginBottom: '8px',
        }}>{msg.text}</div>
        <p style={{
          fontFamily: 'var(--body-font)', fontSize: '14px',
          color: '#aaa', margin: '0 0 24px',
        }}>{msg.sub}</p>

        {/* Score circle */}
        <div style={{
          width: '130px', height: '130px',
          borderRadius: '50%',
          border: `6px solid ${topic.color}`,
          boxShadow: `0 0 30px ${topic.color}66`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          background: `radial-gradient(circle, ${topic.color}15 0%, transparent 70%)`,
        }}>
          <div style={{
            fontFamily: 'var(--pixel-font)', fontSize: '36px',
            color: msg.color, lineHeight: 1,
          }}>{displayScore}</div>
          <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '11px', color: '#666' }}>/ 100점</div>
        </div>

        {/* Stars */}
        <div style={{ fontSize: '40px', letterSpacing: '8px', marginBottom: '20px' }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{
              color: i <= stars ? '#ffd700' : '#2a2a4a',
              textShadow: i <= stars ? '0 0 15px #ffd700' : 'none',
              transition: `opacity 0.3s ${i * 0.2}s`,
            }}>★</span>
          ))}
        </div>

        {/* Correct count */}
        <div style={{
          display: 'flex', gap: '8px',
          justifyContent: 'center', marginBottom: '20px',
        }}>
          {answers.map((correct, i) => (
            <div key={i} style={{
              width: '28px', height: '28px',
              borderRadius: '6px',
              background: correct ? 'rgba(0,200,81,0.2)' : 'rgba(255,51,51,0.2)',
              border: `2px solid ${correct ? '#00c851' : '#ff3333'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--pixel-font)', fontSize: '11px',
              color: correct ? '#00c851' : '#ff6b6b',
            }}>
              {correct ? '✓' : '✗'}
            </div>
          ))}
        </div>

        {/* Rewards */}
        {showRewards && (
          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center',
            animation: 'bounce-in 0.5s ease',
          }}>
            <RewardBadge icon="⭐" label="XP" value={`+${xpGained}`} color="#ffd700" />
            <RewardBadge icon="💰" label="코인" value={`+${coinsGained}`} color="#ff8c00" />
            <RewardBadge icon="✅" label="정답" value={`${correct}/${total}`} color="#00c851" />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <button
          onClick={onPlayAgain}
          className="pixel-btn"
          style={{
            width: '100%', padding: '16px',
            background: `linear-gradient(180deg, ${topic.color}, ${topic.color}cc)`,
            color: '#fff', fontSize: '12px',
            fontFamily: 'var(--pixel-font)',
            border: `3px solid rgba(0,0,0,0.3)`,
          }}
        >🔄 다시 도전!</button>

        <button
          onClick={onBack}
          className="pixel-btn"
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(180deg, #444, #222)',
            color: '#fff', fontSize: '11px',
            fontFamily: 'var(--pixel-font)',
            border: '3px solid #111',
          }}
        >🏠 단원 목록으로</button>
      </div>
    </div>
  );
}

function RewardBadge({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: `${color}15`,
      border: `2px solid ${color}44`,
      borderRadius: '12px',
      padding: '12px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--pixel-font)', fontSize: '13px', color, margin: '4px 0' }}>{value}</div>
      <div style={{ fontFamily: 'var(--body-font)', fontSize: '11px', color: '#666' }}>{label}</div>
    </div>
  );
}
