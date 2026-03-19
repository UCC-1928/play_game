import { useState, useEffect } from 'react';
import type { Question, AnswerSubmit } from '../types';
import { fetchQuestions } from '../api';

interface GameProps {
  id: string;
  onFinish: (answers: AnswerSubmit[]) => void;
  bossImages: string[];
}

export default function Game({ onFinish, bossImages }: GameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSubmit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const questionCount = Number(import.meta.env.VITE_QUESTION_COUNT || 5);

  useEffect(() => {
    fetchQuestions(questionCount)
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [questionCount]);

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { questionId: currentQ.id, selectedOption: option }];
    
    if (currentIndex + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      // 遊戲結束
      onFinish(newAnswers);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full w-full">
        <p className="text-2xl animate-pulse">LOADING STAGE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full w-full">
        <p className="text-brand-500 text-xl">ERROR: {error}</p>
        <button className="pixel-border mt-6 px-4 py-2" onClick={() => window.location.reload()}>RETRY</button>
      </div>
    );
  }

  if (questions.length === 0) {
     return <div className="flex-1 flex justify-center items-center">NO QUESTIONS FOUND</div>
  }

  const currentQ = questions[currentIndex];
  // 隨機選一個已預載的 boss
  const bossSrc = bossImages[currentIndex % bossImages.length];

  // 選項配色 (對應不同的幽靈)
  const optionColors = [
    'hover:border-ghost-red hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]',
    'hover:border-ghost-pink hover:shadow-[0_0_15px_rgba(255,184,255,0.5)]',
    'hover:border-ghost-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]',
    'hover:border-ghost-orange hover:shadow-[0_0_15px_rgba(255,184,82,0.5)]',
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl mx-auto p-4 gap-6 dot-bg">
      <div className="w-full flex justify-between text-brand tracking-[0.2em] mb-2">
        <span>STAGE {currentIndex + 1}/{questions.length}</span>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="w-4 h-4 rounded-full bg-brand animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-6 items-center">
        {/* Boss 圖片顯示區域 (外框改為迷宮藍) */}
        <div className="pixel-border bg-black p-4 w-48 h-48 flex-shrink-0 flex items-center justify-center border-maze border-4">
          <img src={bossSrc} alt={`Boss ${currentIndex + 1}`} className="w-full h-full pixelated" />
        </div>

        {/* 題目區域 */}
        <div className="pixel-border bg-black p-8 flex-1 w-full text-left min-h-[12rem] flex items-center border-maze border-4">
          <h2 className="text-xl md:text-2xl leading-relaxed pacman-text">{currentQ.text}</h2>
        </div>
      </div>

      {/* 選項區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
        {(['A', 'B', 'C', 'D'] as const).map((opt, idx) => (
          <button
            key={opt}
            onClick={() => handleSelectOption(opt)}
            className={`pixel-border bg-black text-white p-5 text-left transition-all border-2 border-gray-800 ${optionColors[idx]} group`}
          >
            <span className="text-brand mr-4 group-hover:animate-ping inline-block">●</span>
            <span className="text-sm font-bold text-gray-400 mr-2">[{opt}]</span>
            <span className="flex-1 group-hover:text-white transition-colors">{currentQ.options[opt]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
