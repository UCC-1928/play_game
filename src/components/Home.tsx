import { useState } from 'react';
import { Play } from 'lucide-react';

interface HomeProps {
  onStart: (id: string) => void;
}

export default function Home({ onStart }: HomeProps) {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!id.trim()) {
      setError('請輸入 ID 才能開始遊戲！');
      return;
    }
    setError('');
    onStart(id.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full p-6 text-center dot-bg">
      <h1 className="text-4xl md:text-6xl pacman-text mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        PAC-MAN<br />QUIZ ARCADE
      </h1>

      {/* 隨機遊走的幽靈 - 紅色 Blinky */}
      <div className="ghost-container move-wander-red">
        <div className="ghost-body ghost-red">
          <div className="ghost-eyes">
            <div className="eye-white"><div className="eye-blue"></div></div>
            <div className="eye-white"><div className="eye-blue"></div></div>
          </div>
          <div className="ghost-feet">
            <div className="foot"></div>
            <div className="foot"></div>
            <div className="foot"></div>
          </div>
        </div>
      </div>

      {/* 隨機遊走的幽靈 - 粉色 Pinky */}
      <div className="ghost-container move-wander-pink">
        <div className="ghost-body ghost-pink">
          <div className="ghost-eyes">
            <div className="eye-white"><div className="eye-blue"></div></div>
            <div className="eye-white"><div className="eye-blue"></div></div>
          </div>
          <div className="ghost-feet">
            <div className="foot"></div>
            <div className="foot"></div>
            <div className="foot"></div>
          </div>
        </div>
      </div>

      {/* 小精靈動畫區域 1 */}
      <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none h-20 flex items-center">
        <div className="move-horizontal flex items-center gap-12">
          <div className="pacman-sprite translate-y-2" />
          <div className="flex gap-16">
            <div className="pacman-dot" />
            <div className="pacman-dot" />
            <div className="pacman-dot" />
            <div className="pacman-dot" />
          </div>
        </div>
      </div>
      
      <div className="pixel-border p-8 flex flex-col items-center max-w-md w-full gap-6">
        <p className="text-xl text-white tracking-widest">INSERT COIN (ID)</p>
        
        <div className="w-full flex-col flex items-start">
          <label className="text-sm mb-2 text-maze">PLAYER ID</label>
          <input
            type="text"
            className="w-full bg-black text-white p-3 border-2 border-maze outline-none focus:border-white transition-colors"
            placeholder="ENTER ID..."
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
          {error && <span className="text-ghost-red text-xs mt-2">{error}</span>}
        </div>

        <button 
          className="bg-brand hover:bg-yellow-400 active:bg-brand text-black font-bold w-full py-4 text-xl flex items-center justify-center gap-2 mt-4 transition-transform hover:scale-105"
          onClick={handleStart}
        >
          <Play fill="currentColor" size={24} />
          START GAME
        </button>
      </div>

      {/* 小精靈動畫區域 2 (反向或不同位置) */}
      <div className="absolute bottom-20 left-0 w-full overflow-hidden pointer-events-none h-20 flex items-center">
        <div className="move-horizontal flex items-center gap-12" style={{ animationDelay: '-5s', animationDirection: 'reverse' }}>
          <div className="flex gap-16">
            <div className="pacman-dot" />
            <div className="pacman-dot" />
            <div className="pacman-dot" />
            <div className="pacman-dot" />
          </div>
          <div className="pacman-sprite scale-x-[-1] translate-y-[-2px]" />
        </div>
      </div>
      
      <p className="mt-12 text-gray-500 text-xs text-center uppercase tracking-[0.2em]">
        © 1980 NAMCO / 2026 PIXEL PI
      </p>
    </div>
  );
}
