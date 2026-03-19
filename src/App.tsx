import { useState, useEffect } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Result from './components/Result';
import type { AppState, AnswerSubmit } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [playerId, setPlayerId] = useState('');
  const [answers, setAnswers] = useState<AnswerSubmit[]>([]);
  const [bossImages, setBossImages] = useState<string[]>([]);

  // 在初始化時預先載入 100 張素材
  useEffect(() => {
    const images = Array.from({ length: 100 }).map(
      (_, i) => `https://api.dicebear.com/9.x/pixel-art/svg?seed=BossLevel${i}_${Math.random()}`
    );
    // 背景預載（可選，主要是避免遊戲中發生轉圈圈）
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    setBossImages(images);
  }, []);

  const handleStart = (id: string) => {
    setPlayerId(id);
    setAppState('GAME');
  };

  const handleFinish = (submittedAnswers: AnswerSubmit[]) => {
    setAnswers(submittedAnswers);
    setAppState('RESULT');
  };

  const handleRestart = () => {
    setAppState('HOME');
    setPlayerId('');
    setAnswers([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1a2e] text-white">
      {/* Container */}
      <main className="w-full max-w-4xl flex-1 flex flex-col">
        {appState === 'HOME' && <Home onStart={handleStart} />}
        {appState === 'GAME' && <Game id={playerId} onFinish={handleFinish} bossImages={bossImages} />}
        {appState === 'RESULT' && <Result id={playerId} answers={answers} onRestart={handleRestart} />}
      </main>
    </div>
  );
}

export default App;
