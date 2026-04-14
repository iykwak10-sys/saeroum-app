import React, { useState, useEffect, useCallback, memo } from 'react';
import { Topic, Question } from '../data/mathData';

interface Props {
  topic: Topic;
  subject: 'math' | 'english';
  onFinish: (correct: number, total: number, answers: boolean[]) => void;
  onBack: () => void;
}

const QUESTION_TIME = 20;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen({ topic, subject, onFinish, onBack }: Props) {
  const [questions] = useState<Question[]>(() => shuffle(topic.questions).slice(0, 10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [showXP, setShowXP] = useState<number | null>(null);
  const [animOption, setAnimOption] = useState<number | null>(null);

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const handleTimeout = useCallback(() => {
    setAnswered(true);
    setSelected(-1);
    setAnswers(prev => [...prev, false]);
    setStreak(0);
  }, []);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setAnimOption(idx);
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === currentQ.answer;
    setAnswers(prev => [...prev, isCorrect]);

    if (isCorrect) {
      const xp = 10 + streak * 2;
      setShowXP(xp);
      setStreak(s => s + 1);
      setTimeout(() => setShowXP(null), 1500);
    } else {
      setStreak(0);
    }
    setTimeout(() => setAnimOption(null), 300);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      const correct = [...answers].filter(Boolean).length;
      onFinish(correct, questions.length, answers);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const correctSoFar = answers.filter(Boolean).length;

  return (
    <div className="screen-layout" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '16px',
      }}>
        <button onClick={onBack} className="pixel-btn pixel-btn-back" style={{ padding: '8px 12px', fontSize: '9px', border: '2px solid #111' }}>✕</button>

        {/* Topic name */}
        <div style={{
          fontFamily: 'var(--pixel-font)', fontSize: '10px',
          color: topic.color, flex: 1,
        }}>{topic.emoji} {topic.name}</div>

        {/* Score */}
        <div style={{
          background: 'rgba(22,33,62,0.9)',
          border: '2px solid #1a1a3e',
          borderRadius: '8px',
          padding: '6px 12px',
          fontFamily: 'var(--pixel-font)', fontSize: '10px',
          color: '#00c851',
          flexShrink: 0,
        }}>✅ {correctSoFar}</div>

        {/* Streak */}
        {streak >= 2 && (
          <div style={{
            background: 'rgba(255,100,0,0.2)',
            border: '2px solid #ff8c00',
            borderRadius: '8px',
            padding: '6px 10px',
            fontFamily: 'var(--pixel-font)', fontSize: '9px',
            color: '#ff8c00', flexShrink: 0,
            animation: 'pulse-glow 1s infinite',
          }}>🔥 {streak}연속</div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '8px', color: '#555' }}>
            문제 {currentIdx + 1} / {questions.length}
          </span>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: '8px', color: topic.color }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: `linear-gradient(90deg, ${topic.color}, #ffd700)`,
            borderRadius: '4px', transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Timer */}
      <TimerBar key={currentIdx} onTimeout={handleTimeout} answered={answered} />

      {/* Question Card */}
      <div style={{
        background: 'linear-gradient(135deg, #16213e, #0f3460)',
        border: `3px solid ${topic.color}44`,
        borderRadius: '16px',
        padding: '24px 20px',
        marginBottom: '20px',
        boxShadow: `0 0 30px ${topic.glowColor}, 0 8px 20px rgba(0,0,0,0.4)`,
        position: 'relative',
        flex: 'none',
      }}>
        {/* XP Popup */}
        {showXP !== null && (
          <div style={{
            position: 'absolute', top: '-10px', right: '20px',
            fontFamily: 'var(--pixel-font)', fontSize: '16px',
            color: '#ffd700', textShadow: '0 0 10px #ffd700',
            animation: 'xp-gain 1.5s ease forwards',
            pointerEvents: 'none', zIndex: 10,
          }}>+{showXP} XP ⭐</div>
        )}

        {/* Difficulty badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{
            background: currentQ.difficulty === 'easy' ? '#00c85122' :
                       currentQ.difficulty === 'medium' ? '#ffd70022' : '#ff333322',
            border: `1px solid ${currentQ.difficulty === 'easy' ? '#00c851' :
                                 currentQ.difficulty === 'medium' ? '#ffd700' : '#ff3333'}44`,
            color: currentQ.difficulty === 'easy' ? '#00c851' :
                   currentQ.difficulty === 'medium' ? '#ffd700' : '#ff3333',
            fontFamily: 'var(--pixel-font)', fontSize: '8px',
            padding: '3px 8px', borderRadius: '4px',
          }}>
            {currentQ.difficulty === 'easy' ? '⭐ 쉬움' :
             currentQ.difficulty === 'medium' ? '⭐⭐ 보통' : '⭐⭐⭐ 어려움'}
          </span>
        </div>

        <p style={{
          fontFamily: 'var(--body-font)', fontSize: '18px',
          fontWeight: '700', color: '#ffffff',
          lineHeight: 1.6, margin: 0,
        }}>
          Q{currentIdx + 1}. {currentQ.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {currentQ.options.map((opt, i) => {
          const isCorrect = i === currentQ.answer;
          const isSelected = selected === i;
          const isTimeout = answered && selected === -1;

          let bg = 'rgba(22,33,62,0.9)';
          let border = '2px solid rgba(255,255,255,0.08)';
          let textColor = '#ccc';

          if (answered) {
            if (isCorrect) {
              bg = 'rgba(0,200,81,0.2)';
              border = '2px solid #00c851';
              textColor = '#00c851';
            } else if (isSelected && !isCorrect) {
              bg = 'rgba(255,51,51,0.2)';
              border = '2px solid #ff3333';
              textColor = '#ff6b6b';
            }
          } else if (animOption === i) {
            bg = `${topic.color}22`;
            border = `2px solid ${topic.color}`;
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              style={{
                background: bg, border, borderRadius: '12px',
                padding: '16px 20px',
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'all 0.2s ease',
                transform: animOption === i ? 'scale(0.98)' : 'scale(1)',
                animation: answered && isTimeout && isCorrect ? 'correct-flash 0.5s ease' : 'none',
              }}
              onMouseEnter={e => {
                if (!answered) {
                  (e.currentTarget as HTMLElement).style.background = `${topic.color}15`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${topic.color}66`;
                }
              }}
              onMouseLeave={e => {
                if (!answered) {
                  (e.currentTarget as HTMLElement).style.background = bg;
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
            >
              {/* Option label */}
              <div style={{
                width: '32px', height: '32px',
                background: answered && isCorrect ? '#00c85133' :
                            answered && isSelected && !isCorrect ? '#ff333333' :
                            'rgba(255,255,255,0.08)',
                border: `2px solid ${answered && isCorrect ? '#00c851' :
                                     answered && isSelected && !isCorrect ? '#ff3333' :
                                     'rgba(255,255,255,0.15)'}`,
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--pixel-font)', fontSize: '10px',
                color: textColor,
                flexShrink: 0,
              }}>
                {answered && isCorrect ? '✓' :
                 answered && isSelected && !isCorrect ? '✗' :
                 ['A', 'B', 'C', 'D'][i]}
              </div>
              <span style={{
                fontFamily: 'var(--body-font)', fontSize: '15px',
                fontWeight: answered && (isCorrect || isSelected) ? '700' : '400',
                color: textColor,
                lineHeight: 1.4,
              }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {answered && (
        <div style={{ animation: 'slide-in 0.3s ease' }}>
          <div style={{
            background: selected === currentQ.answer
              ? 'rgba(0,200,81,0.1)'
              : 'rgba(255,51,51,0.1)',
            border: `2px solid ${selected === currentQ.answer ? '#00c85144' : '#ff333344'}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--pixel-font)', fontSize: '10px',
              color: selected === currentQ.answer ? '#00c851' : '#ff6b6b',
              marginBottom: '8px',
            }}>
              {selected === -1 ? '⏰ 시간 초과!' :
               selected === currentQ.answer ? '🎉 정답이에요!' : '❌ 틀렸어요!'}
            </div>
            <p style={{
              fontFamily: 'var(--body-font)', fontSize: '13px',
              color: '#ccc', margin: 0, lineHeight: 1.6,
            }}>{currentQ.explanation}</p>
          </div>

          <button
            onClick={handleNext}
            className="pixel-btn"
            style={{
              width: '100%', padding: '16px',
              background: currentIdx + 1 >= questions.length
                ? 'linear-gradient(180deg, #ffd700, #cc9900)'
                : `linear-gradient(180deg, ${topic.color}, ${topic.color}cc)`,
              color: currentIdx + 1 >= questions.length ? '#000' : '#fff',
              fontSize: '12px', fontFamily: 'var(--pixel-font)',
              border: `3px solid rgba(0,0,0,0.3)`,
            }}
          >
            {currentIdx + 1 >= questions.length ? '🏆 결과 보기!' : '다음 문제 ▶'}
          </button>
        </div>
      )}
    </div>
  );
}

const TimerBar = memo(function TimerBar({
  onTimeout, answered,
}: { onTimeout: () => void; answered: boolean }) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) { onTimeout(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered, onTimeout]);

  const timePercent = (timeLeft / QUESTION_TIME) * 100;
  const timeColor = timeLeft > 10 ? '#00c851' : timeLeft > 5 ? '#ffd700' : '#ff3333';

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontFamily: 'var(--pixel-font)', fontSize: '20px',
          color: timeColor, transition: 'color 0.3s',
          minWidth: '28px', textAlign: 'right',
        }}>{timeLeft}</span>
        <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${timePercent}%`,
            background: `linear-gradient(90deg, ${timeColor}, ${timeColor}88)`,
            borderRadius: '5px',
            transition: 'width 1s linear, background 0.3s',
            boxShadow: `0 0 6px ${timeColor}66`,
          }} />
        </div>
      </div>
    </div>
  );
});
