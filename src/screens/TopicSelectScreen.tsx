import React from 'react';
import { Topic } from '../data/mathData';
import { TopicProgress } from '../hooks/useProgress';

interface Props {
  subject: 'math' | 'english';
  topics: Topic[];
  topicProgress: Record<string, TopicProgress>;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
}

export default function TopicSelectScreen({ subject, topics, topicProgress, onSelectTopic, onBack }: Props) {
  const isMath = subject === 'math';

  return (
    <div className="screen-layout">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '28px',
      }}>
        <button onClick={onBack} className="pixel-btn pixel-btn-back">← 뒤로</button>
        <div>
          <div style={{
            fontFamily: 'var(--pixel-font)', fontSize: '16px',
            color: isMath ? '#ff6b6b' : '#74b9ff',
            textShadow: `0 0 10px ${isMath ? '#ff6b6b' : '#74b9ff'}`,
          }}>
            {isMath ? '📐 수학' : '📖 영어'}
          </div>
          <div style={{ fontFamily: 'var(--body-font)', fontSize: '12px', color: '#666', marginTop: '2px' }}>
            단원을 선택해 퀴즈를 시작하세요!
          </div>
        </div>
      </div>

      {/* Topic List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {topics.map((topic, idx) => {
          const tp = topicProgress[topic.id];
          const stars = tp?.stars ?? 0;
          const bestScore = tp?.bestScore ?? 0;
          const attempts = tp?.attempts ?? 0;
          const isNew = attempts === 0;

          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              style={{
                background: `linear-gradient(135deg, rgba(22,33,62,0.95), rgba(15,52,96,0.85))`,
                border: `3px solid ${topic.color}44`,
                borderRadius: '14px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: `0 4px 0 ${topic.color}22`,
                animation: `slide-in 0.4s ease ${idx * 0.08}s both`,
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)';
                (e.currentTarget as HTMLElement).style.borderColor = `${topic.color}99`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 0 ${topic.color}44, 0 0 20px ${topic.color}22`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.borderColor = `${topic.color}44`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 0 ${topic.color}22`;
              }}
            >
              {/* Glow bg */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '100px', height: '100%',
                background: `radial-gradient(circle at right, ${topic.color}11 0%, transparent 70%)`,
              }} />

              {/* Icon */}
              <div style={{
                width: '60px', height: '60px',
                background: `${topic.color}22`,
                border: `2px solid ${topic.color}44`,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', flexShrink: 0,
              }}>
                {topic.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--pixel-font)', fontSize: '12px',
                    color: topic.color,
                  }}>{topic.name}</span>
                  {isNew && (
                    <span style={{
                      background: '#ff3333', color: '#fff',
                      fontFamily: 'var(--pixel-font)', fontSize: '7px',
                      padding: '2px 6px', borderRadius: '3px',
                    }}>NEW</span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--body-font)', fontSize: '12px',
                  color: '#888', marginBottom: '10px',
                }}>{topic.description}</div>

                {/* Stars + score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '16px', lineHeight: 1 }}>
                    {[1, 2, 3].map(i => (
                      <span key={i} style={{ color: i <= stars ? '#ffd700' : '#2a2a4a', fontSize: '18px' }}>★</span>
                    ))}
                  </div>
                  {attempts > 0 && (
                    <>
                      <span style={{
                        fontFamily: 'var(--pixel-font)', fontSize: '9px',
                        color: bestScore >= 80 ? '#00c851' : bestScore >= 60 ? '#ffd700' : '#ff6b6b',
                      }}>최고 {bestScore}점</span>
                      <span style={{
                        fontFamily: 'var(--body-font)', fontSize: '11px', color: '#555',
                      }}>{attempts}회 도전</span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div style={{
                fontFamily: 'var(--pixel-font)', fontSize: '14px',
                color: `${topic.color}88`, flexShrink: 0,
              }}>▶</div>
            </button>
          );
        })}
      </div>

      {/* Total progress bar */}
      <div style={{
        marginTop: '28px',
        background: 'rgba(22,33,62,0.8)',
        border: '2px solid #1a1a3e',
        borderRadius: '12px',
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '9px', color: '#888' }}>
            {isMath ? '수학' : '영어'} 전체 진행도
          </span>
          <span style={{
            fontFamily: 'var(--pixel-font)', fontSize: '9px',
            color: isMath ? '#ff6b6b' : '#74b9ff',
          }}>
            {topics.filter(t => (topicProgress[t.id]?.stars ?? 0) > 0).length}/{topics.length} 단원 클리어
          </span>
        </div>
        <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(topics.filter(t => (topicProgress[t.id]?.stars ?? 0) > 0).length / topics.length) * 100}%`,
            background: isMath
              ? 'linear-gradient(90deg, #ff6b6b, #ffd700)'
              : 'linear-gradient(90deg, #74b9ff, #a29bfe)',
            borderRadius: '6px',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
