/**
 * Level Clear Modal Component
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';

interface LevelClearModalProps {
  levelId: number;
  score: number;
  crystals: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const LevelClearModal: React.FC<LevelClearModalProps> = ({
  levelId,
  score,
  crystals,
  onNextLevel,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#f59e0b', '#34d399'],
    });
  }, []);

  // Calculate 1 to 3 stars based on crystals collected in level
  const starsCount = crystals >= 10 ? 3 : crystals >= 5 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-cyan-700/80 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>AREA BERHASIL DIBERSIHKAN</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 mb-4">
          LEVEL {levelId} SELESAI!
        </h2>

        {/* Stars Rating */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-8 h-8 transition-transform duration-300 ${
                starIdx <= starsCount
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                  : 'text-slate-700 fill-slate-800 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">Total Skor</span>
            <span className="font-pixel text-cyan-300 text-sm tabular-nums">{score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">Kristal Mana</span>
            <span className="font-pixel text-amber-300 text-sm tabular-nums">{crystals}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 px-4 rounded-xl font-bold font-pixel text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>LANJUT KE LEVEL BERIKUTNYA</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={onRestart}
              className="py-2.5 px-3 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={onHome}
              className="py-2.5 px-3 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
