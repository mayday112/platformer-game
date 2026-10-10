/**
 * Grand Victory Modal Component
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Home, Crown } from 'lucide-react';
import { ASSETS } from '../assets/assetRegistry';

interface VictoryModalProps {
  totalScore: number;
  totalCrystals: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  totalScore,
  totalCrystals,
  onPlayAgain,
  onHome,
}) => {
  useEffect(() => {
    // Grand celebration confetti showers
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#818cf8', '#f59e0b', '#ec4899'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#818cf8', '#f59e0b', '#ec4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Crown Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <Crown className="w-9 h-9 text-amber-400 animate-bounce" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>KERAJAAN AETHERIA TELAH DISELAMATKAN</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-indigo-300 mb-3">
          KEMENANGAN AGUNG!
        </h2>

        {/* Hero portrait badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-cyan-800/60 mb-6">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-400 shrink-0">
            <img
              src={ASSETS.heroPortrait}
              alt="Lyra"
              className="w-full h-full object-cover pixelated"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-cyan-300 font-pixel">LYRA</div>
            <div className="text-[11px] text-amber-300 font-medium">Sang Legenda Kristal Abadi</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">Total Skor Akhir</span>
            <span className="font-pixel text-cyan-300 text-base tabular-nums">{totalScore}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">Total Kristal</span>
            <span className="font-pixel text-amber-300 text-base tabular-nums">{totalCrystals}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 px-4 rounded-xl font-bold font-pixel text-xs bg-gradient-to-r from-amber-400 to-cyan-500 hover:from-amber-300 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 fill-slate-950" />
            <span>MAIN LAGI DARI LEVEL 1</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
