import React, { memo } from 'react';

interface Props {
  avatarId: number;
  size?: number;
  animate?: boolean;
}

const AVATARS = [
  { head: '#FFD700', body: '#FF0000', pants: '#0000FF', name: '레드 워리어' },
  { head: '#FFD700', body: '#00A2FF', pants: '#003380', name: '블루 나이트' },
  { head: '#FFD700', body: '#00C851', pants: '#006400', name: '그린 마법사' },
  { head: '#FFD700', body: '#9B59B6', pants: '#4A0080', name: '퍼플 닌자' },
  { head: '#FFD700', body: '#FF8C00', pants: '#8B4500', name: '오렌지 탐험가' },
  { head: '#FFD700', body: '#FF1493', pants: '#8B0045', name: '핑크 히어로' },
];

const RobloxCharacter = memo(function RobloxCharacter({ avatarId, size = 80, animate = false }: Props) {
  const av = AVATARS[avatarId % AVATARS.length];
  const scale = size / 80;

  return (
    <div style={{
      display: 'inline-block',
      animation: animate ? 'float 3s ease-in-out infinite' : 'none',
    }}>
      <svg width={80 * scale} height={100 * scale} viewBox="0 0 80 100">
        {/* Shadow */}
        <ellipse cx="40" cy="98" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        {/* Left leg */}
        <rect x="22" y="68" width="13" height="24" rx="3" fill={av.pants} />
        {/* Right leg */}
        <rect x="45" y="68" width="13" height="24" rx="3" fill={av.pants} />
        {/* Body */}
        <rect x="16" y="36" width="48" height="36" rx="4" fill={av.body} />
        {/* Left arm */}
        <rect x="4" y="38" width="12" height="28" rx="4" fill={av.body} />
        {/* Right arm */}
        <rect x="64" y="38" width="12" height="28" rx="4" fill={av.body} />
        {/* Neck */}
        <rect x="32" y="28" width="16" height="10" rx="2" fill={av.head} />
        {/* Head */}
        <rect x="16" y="4" width="48" height="28" rx="6" fill={av.head} />
        {/* Eyes */}
        <rect x="24" y="12" width="10" height="8" rx="2" fill="#1a1a1a" />
        <rect x="46" y="12" width="10" height="8" rx="2" fill="#1a1a1a" />
        {/* Eye shine */}
        <rect x="26" y="13" width="3" height="3" rx="1" fill="white" />
        <rect x="48" y="13" width="3" height="3" rx="1" fill="white" />
        {/* Smile */}
        <path d="M 28 24 Q 40 32 52 24" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Body detail - collar */}
        <rect x="32" y="36" width="16" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
        {/* Shoe left */}
        <rect x="20" y="89" width="17" height="7" rx="3" fill="#1a1a1a" />
        {/* Shoe right */}
        <rect x="43" y="89" width="17" height="7" rx="3" fill="#1a1a1a" />
      </svg>
    </div>
  );
});

export default RobloxCharacter;
export { AVATARS };
