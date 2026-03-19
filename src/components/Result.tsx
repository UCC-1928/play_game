import { useEffect, useState } from 'react';
import type { AnswerSubmit } from '../types';
import { submitScore } from '../api';

interface ResultProps {
  id: string;
  answers: AnswerSubmit[];
  onRestart: () => void;
}

export default function Result({ id, answers, onRestart }: ResultProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ score: number, passed: boolean } | null>(null);

  useEffect(() => {
    submitScore(id, answers)
      .then((res) => {
        setResult(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, answers]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full w-full">
        <p className="text-2xl animate-pulse">CALCULATING SCORE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full w-full gap-4">
        <p className="text-brand-500 text-xl">ERROR: {error}</p>
        <button className="pixel-border px-6 py-3" onClick={onRestart}>MAIN MENU</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full p-6 text-center dot-bg">
      <h1 className="text-5xl mb-12 drop-shadow-[2_4px_4px_rgba(0,0,0,0.8)] pacman-text tracking-widest animate-bounce">
        {result?.passed ? <span className="text-green-400">STAGE CLEAR!</span> : <span className="text-ghost-red">GAME OVER</span>}
      </h1>
      
      <div className="pixel-border p-8 flex flex-col items-center max-w-md w-full gap-6 border-maze border-4">
        <div className="w-full flex justify-between border-b-2 border-dashed border-maze pb-4">
          <span className="text-maze">PLAYER ID:</span>
          <span>{id}</span>
        </div>
        
        <div className="w-full flex justify-between border-b-2 border-dashed border-maze pb-4">
          <span className="text-maze">SCORE:</span>
          <span className="text-3xl text-brand">{result?.score}</span>
        </div>

        <button 
          className="bg-brand text-black hover:bg-yellow-400 w-full py-4 text-xl mt-6 font-bold shadow-[4px_4px_0_#2121DE] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          onClick={onRestart}
        >
          INSERT COIN
        </button>
      </div>
    </div>
  );
}
