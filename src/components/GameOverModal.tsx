/**
 * Game Over Modal Component
 */

import React from 'react';
import { RotateCcw, Home, Skull, ShieldAlert } from 'lucide-react';

interface GameOverModalProps {
  reason: string;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ reason, onRetry, onHome }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-rose-800/80 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Skull Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center mb-3">
          <Skull className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-pixel text-rose-400 mb-1">
          PETUALANGAN TERHENTI
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-rose-300/90 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/60 mb-6">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Penyebab: {reason}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Kekuatan kristal belum padam sepenuhnya! Bangkitlah kembali, ksatria Lyra!
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRetry}
            className="w-full py-3.5 px-4 rounded-xl font-bold font-pixel text-xs bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-slate-950 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 fill-slate-950" />
            <span>COBA LAGI</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>KEMBALI KE MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
