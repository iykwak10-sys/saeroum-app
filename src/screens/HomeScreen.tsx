import React, { useState } from 'react';
import RobloxCharacter, { AVATARS } from '../components/RobloxCharacter';

interface Props {
  onStart: (name: string, avatarId: number) => void;
  savedName?: string;
  savedAvatarId?: number;
}

export default function HomeScreen({ onStart, savedName = '', savedAvatarId = 0 }: Props) {
  const [name, setName] = useState(savedName);
  const [avatarId, setAvatarId] = useState(savedAvatarId);
  const [shake, setShake] = useState(false);

  const handleStart = () => {
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onStart(name.trim(), avatarId);
  };

  return (
    <div className="screen-layout-center">
      {/* Title Card */}
      <div style={{
        background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
        border: '3px solid #00a2ff',
        borderRadius: '16px',
        padding: '40px 32px',
        maxWidth: '480px', width: '100%',
        boxShadow: '0 0 40px rgba(0,162,255,0.3), 0 8px 32px rgba(0,0,0,0.5)',
        animation: 'bounce-in 0.6s ease',
        textAlign: 'center',
      }}>
        {/* Logo / Title */}
        <div style={{
          fontFamily: 'var(--pixel-font)',
          fontSize: '11px',
          color: '#ffd700',
          textShadow: '0 0 10px #ffd700',
          letterSpacing: '2px',
          marginBottom: '4px',
        }}>
          ⚡ SAEROUM QUEST ⚡
        </div>
        <h1 style={{
          fontFamily: 'var(--pixel-font)',
          fontSize: '16px',
          color: '#ffffff',
          textShadow: '3px 3px 0px #ff0000',
          lineHeight: 1.6,
          marginBottom: '8px',
        }}>
          새롬중학교<br />
          <span style={{ color: '#00a2ff' }}>학습 어드벤처</span>
        </h1>
        <div style={{
          fontSize: '13px', color: '#a0a0c0',
          fontFamily: 'var(--body-font)',
          marginBottom: '24px',
        }}>
          🏫 세종시 새롬중학교 1학년 · 2026 교육과정
        </div>

        {/* Character Selection */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--pixel-font)', fontSize: '9px',
            color: '#ffd700', marginBottom: '16px',
          }}>
            캐릭터 선택
          </div>
          <div style={{
            display: 'flex', gap: '12px',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {AVATARS.map((av, i) => (
              <div
                key={i}
                onClick={() => setAvatarId(i)}
                style={{
                  cursor: 'pointer',
                  background: avatarId === i
                    ? 'rgba(0,162,255,0.25)'
                    : 'rgba(255,255,255,0.05)',
                  border: `3px solid ${avatarId === i ? '#00a2ff' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  padding: '10px 8px 6px',
                  transition: 'all 0.2s ease',
                  transform: avatarId === i ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: avatarId === i ? '0 0 15px rgba(0,162,255,0.5)' : 'none',
                }}
              >
                <RobloxCharacter avatarId={i} size={56} animate={avatarId === i} />
                <div style={{
                  fontFamily: 'var(--pixel-font)', fontSize: '7px',
                  color: avatarId === i ? '#00a2ff' : '#666',
                  marginTop: '6px', whiteSpace: 'nowrap',
                }}>
                  {av.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--pixel-font)', fontSize: '9px',
            color: '#ffd700', marginBottom: '10px', textAlign: 'left',
          }}>
            플레이어 이름
          </div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="이름을 입력하세요..."
            maxLength={10}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: `2px solid ${shake ? '#ff3333' : 'rgba(0,162,255,0.4)'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontFamily: 'var(--body-font)',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
              animation: shake ? 'shake 0.5s ease' : 'none',
            }}
          />
          {shake && (
            <div style={{ color: '#ff3333', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--body-font)' }}>
              ⚠️ 이름을 입력해주세요!
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="pixel-btn"
          style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(180deg, #ff3333, #cc0000)',
            color: 'white',
            fontSize: '13px', fontFamily: 'var(--pixel-font)',
            border: '3px solid #880000',
          }}
        >
          🎮 게임 시작!
        </button>

        {/* Subject preview */}
        <div style={{
          display: 'flex', gap: '12px',
          marginTop: '24px', justifyContent: 'center',
        }}>
          {[
            { icon: '📐', label: '수학', color: '#ff6b6b', topics: '5단원' },
            { icon: '📖', label: '영어', color: '#74b9ff', topics: '5단원' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.05)',
              border: `2px solid ${s.color}44`,
              borderRadius: '10px',
              padding: '10px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px' }}>{s.icon}</div>
              <div style={{
                fontFamily: 'var(--pixel-font)', fontSize: '9px',
                color: s.color, marginTop: '4px',
              }}>{s.label}</div>
              <div style={{
                fontSize: '11px', color: '#666',
                fontFamily: 'var(--body-font)', marginTop: '2px',
              }}>{s.topics}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        fontFamily: 'var(--pixel-font)',
        fontSize: '8px',
        color: '#333',
        textAlign: 'center',
        lineHeight: 2,
      }}>
        ✨ XP 시스템 · 퀴즈 · 진행도 추적 ✨<br />
        <span style={{ color: '#1a1a3a' }}>v1.0.0 · 2026 개정교육과정</span>
      </div>
    </div>
  );
}
