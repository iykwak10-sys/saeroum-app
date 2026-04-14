import React, { useState, lazy, Suspense } from 'react';
import StarBackground from './components/StarBackground';
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const TopicSelectScreen = lazy(() => import('./screens/TopicSelectScreen'));
const QuizScreen = lazy(() => import('./screens/QuizScreen'));
const ResultScreen = lazy(() => import('./screens/ResultScreen'));
const ProgressScreen = lazy(() => import('./screens/ProgressScreen'));
const PortfolioScreen = lazy(() => import('./screens/PortfolioScreen'));
import { useProgress } from './hooks/useProgress';
import { mathTopics } from './data/mathData';
import { englishTopics } from './data/englishData';
import type { Topic } from './data/mathData';

type Screen =
  | 'home'
  | 'dashboard'
  | 'topic-select'
  | 'quiz'
  | 'result'
  | 'progress' | 'portfolio';

interface QuizResult {
  correct: number;
  total: number;
  answers: boolean[];
  xpGained: number;
  coinsGained: number;
  stars: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [subject, setSubject] = useState<'math' | 'english'>('math');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const { progress, setPlayerName, recordQuizResult, resetProgress, xpForNextLevel, currentLevelXP } = useProgress();

  const handleStart = (name: string, avatarId: number) => {
    setPlayerName(name, avatarId);
    setScreen('dashboard');
  };

  const handleSelectSubject = (s: 'math' | 'english') => {
    setSubject(s);
    setScreen('topic-select');
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setScreen('quiz');
  };

  const handleQuizFinish = (correct: number, total: number, answers: boolean[]) => {
    if (!selectedTopic) return;
    const result = recordQuizResult(
      selectedTopic.id,
      selectedTopic.name,
      subject,
      correct,
      total
    );
    setQuizResult({ correct, total, answers, ...result });
    setScreen('result');
  };

  const handlePlayAgain = () => {
    setQuizResult(null);
    setScreen('quiz');
  };

  const handleBackToTopics = () => {
    setQuizResult(null);
    setScreen('topic-select');
  };

  const topics = subject === 'math' ? mathTopics : englishTopics;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <StarBackground />
      <Suspense fallback={null}>

      {screen === 'home' && (
        <HomeScreen
          onStart={handleStart}
          savedName={progress.player.name}
          savedAvatarId={progress.player.avatarId}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardScreen
          progress={progress}
          onSelectSubject={handleSelectSubject}
          onViewProgress={() => setScreen('progress')}
          onViewPortfolio={() => setScreen('portfolio')}
          xpForNextLevel={xpForNextLevel}
          currentLevelXP={currentLevelXP}
        />
      )}

      {screen === 'topic-select' && (
        <TopicSelectScreen
          subject={subject}
          topics={topics}
          topicProgress={progress.topics}
          onSelectTopic={handleSelectTopic}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'quiz' && selectedTopic && (
        <QuizScreen
          topic={selectedTopic}
          subject={subject}
          onFinish={handleQuizFinish}
          onBack={() => setScreen('topic-select')}
        />
      )}

      {screen === 'result' && selectedTopic && quizResult && (
        <ResultScreen
          topic={selectedTopic}
          correct={quizResult.correct}
          total={quizResult.total}
          answers={quizResult.answers}
          xpGained={quizResult.xpGained}
          coinsGained={quizResult.coinsGained}
          stars={quizResult.stars}
          avatarId={progress.player.avatarId}
          onPlayAgain={handlePlayAgain}
          onBack={handleBackToTopics}
        />
      )}


      {screen === 'portfolio' && (
        <PortfolioScreen
          onBack={() => setScreen('dashboard')}
        />
      )}
      {screen === 'progress' && (
        <ProgressScreen
          progress={progress}
          onBack={() => setScreen('dashboard')}
          onReset={resetProgress}
          xpForNextLevel={xpForNextLevel}
          currentLevelXP={currentLevelXP}
        />
      )}
      </Suspense>
    </div>
  );
}
