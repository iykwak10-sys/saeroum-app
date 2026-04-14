import { useState, useEffect } from 'react';

export interface TopicProgress {
  topicId: string;
  subject: 'math' | 'english';
  bestScore: number;       // 0~100
  attempts: number;
  stars: number;           // 0~3
  lastPlayed: string;
  correctCount: number;
  totalAnswered: number;
}

export interface PlayerProfile {
  name: string;
  avatarId: number;        // 0~5
  xp: number;
  level: number;
  coins: number;
  streak: number;
  totalCorrect: number;
  topicsCompleted: number;
  joinDate: string;
}

export interface ProgressState {
  player: PlayerProfile;
  topics: Record<string, TopicProgress>;
  recentActivity: { subject: string; topicName: string; score: number; date: string }[];
}

const DEFAULT_PLAYER: PlayerProfile = {
  name: '',
  avatarId: 0,
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  totalCorrect: 0,
  topicsCompleted: 0,
  joinDate: new Date().toISOString(),
};

const STORAGE_KEY = 'saeroum_progress_v2';

function calcLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function calcStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { player: DEFAULT_PLAYER, topics: {}, recentActivity: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const setPlayerName = (name: string, avatarId: number) => {
    setProgress(prev => ({
      ...prev,
      player: { ...prev.player, name, avatarId },
    }));
  };

  const recordQuizResult = (
    topicId: string,
    topicName: string,
    subject: 'math' | 'english',
    correct: number,
    total: number
  ) => {
    const score = Math.round((correct / total) * 100);
    const xpGained = correct * 10 + (score === 100 ? 20 : 0);
    const coinsGained = correct * 5;
    const stars = calcStars(score);

    setProgress(prev => {
      const existing = prev.topics[topicId];
      const isFirstComplete = !existing || existing.bestScore < 50;
      const newXP = prev.player.xp + xpGained;

      const updatedTopic: TopicProgress = {
        topicId,
        subject,
        bestScore: Math.max(score, existing?.bestScore ?? 0),
        attempts: (existing?.attempts ?? 0) + 1,
        stars: Math.max(stars, existing?.stars ?? 0),
        lastPlayed: new Date().toISOString(),
        correctCount: (existing?.correctCount ?? 0) + correct,
        totalAnswered: (existing?.totalAnswered ?? 0) + total,
      };

      const activity = {
        subject: subject === 'math' ? '수학' : '영어',
        topicName,
        score,
        date: new Date().toLocaleString('ko-KR'),
      };

      return {
        ...prev,
        player: {
          ...prev.player,
          xp: newXP,
          level: calcLevel(newXP),
          coins: prev.player.coins + coinsGained,
          totalCorrect: prev.player.totalCorrect + correct,
          topicsCompleted: prev.player.topicsCompleted + (isFirstComplete ? 1 : 0),
        },
        topics: { ...prev.topics, [topicId]: updatedTopic },
        recentActivity: [activity, ...prev.recentActivity].slice(0, 20),
      };
    });

    return { xpGained, coinsGained, stars, score };
  };

  const resetProgress = () => {
    const reset: ProgressState = {
      player: { ...DEFAULT_PLAYER, name: progress.player.name, avatarId: progress.player.avatarId },
      topics: {},
      recentActivity: [],
    };
    setProgress(reset);
  };

  const xpForNextLevel = (level: number) => level * 100;
  const currentLevelXP = (xp: number) => xp % 100;

  return {
    progress,
    setPlayerName,
    recordQuizResult,
    resetProgress,
    xpForNextLevel,
    currentLevelXP,
  };
}
