/**
 * Virtual Touch Gamepad for Mobile & Tablet
 * Ergonomic layout with multi-touch support and haptic feedback.
 */

import React, { useCallback, useState } from 'react';
import { ArrowLeft, ArrowRight, Sword, Sparkles, Wind, ArrowUp, Eye, EyeOff } from 'lucide-react';
import { virtualGamepad } from '../game/events';

interface TouchControllerProps {
  visible: boolean;
  onToggleVisible: () => void;
}

export const TouchController: React.FC<TouchControllerProps> = ({ visible, onToggleVisible }) => {
  const [opacity, setOpacity] = useState<number>(0.85);

  const handleHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
  };

  // Button binding helper
  const bindButton = (key: keyof typeof virtualGamepad, isImpulse: boolean = false) => {
    return {
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault();
        virtualGamepad[key] = true;
        handleHaptic();
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isImpulse) virtualGamepad[key] = false;
      },
      onTouchCancel: (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isImpulse) virtualGamepad[key] = false;
      },
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        virtualGamepad[key] = true;
        handleHaptic();
      },
      onPointerUp: (e: React.PointerEvent) => {
        e.preventDefault();
        if (!isImpulse) virtualGamepad[key] = false;
      },
      onPointerLeave: (e: React.PointerEvent) => {
        e.preventDefault();
        if (!isImpulse) virtualGamepad[key] = false;
      },
    };
  };

  if (!visible) {
    return (
      <button
        onClick={onToggleVisible}
        className="fixed bottom-4 right-4 z-40 bg-slate-900/80 hover:bg-slate-800 text-slate-300 p-2.5 rounded-xl border border-slate-700/60 shadow-lg text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all"
        title="Tampilkan Tombol Sentuh"
      >
        <Eye className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline">Sentuh</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none flex flex-col justify-end p-3 md:p-6"
      style={{ opacity }}
    >
      {/* Quick opacity / hide bar */}
      <div className="pointer-events-auto flex justify-between items-center mb-2 px-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 hidden sm:inline">Transparansi:</span>
          <button
            onClick={() => setOpacity((prev) => (prev <= 0.4 ? 0.95 : prev - 0.25))}
            className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 hover:text-white"
          >
            {Math.round(opacity * 100)}%
          </button>
        </div>
        <button
          onClick={onToggleVisible}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 hover:text-white"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Sembunyikan</span>
        </button>
      </div>

      <div className="w-full flex items-end justify-between">
        {/* LEFT D-PAD (Movement) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            {...bindButton('left')}
            className="w-15 h-15 sm:w-17 sm:h-17 rounded-2xl bg-slate-900/80 active:bg-cyan-900/60 border-2 border-slate-700 active:border-cyan-400 flex items-center justify-center text-slate-200 active:scale-95 shadow-xl backdrop-blur-md transition-transform"
            aria-label="Kiri"
          >
            <ArrowLeft className="w-7 h-7 text-cyan-400" />
          </button>
          <button
            {...bindButton('right')}
            className="w-15 h-15 sm:w-17 sm:h-17 rounded-2xl bg-slate-900/80 active:bg-cyan-900/60 border-2 border-slate-700 active:border-cyan-400 flex items-center justify-center text-slate-200 active:scale-95 shadow-xl backdrop-blur-md transition-transform"
            aria-label="Kanan"
          >
            <ArrowRight className="w-7 h-7 text-cyan-400" />
          </button>
        </div>

        {/* RIGHT ACTION CLUSTER */}
        <div className="pointer-events-auto grid grid-cols-2 gap-2 sm:gap-3">
          {/* Dash (Y) */}
          <button
            {...bindButton('dash', true)}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-slate-900/80 active:bg-amber-900/60 border-2 border-slate-700 active:border-amber-400 flex flex-col items-center justify-center text-slate-200 active:scale-95 shadow-xl backdrop-blur-md transition-transform"
            aria-label="Dash"
          >
            <Wind className="w-5 h-5 text-amber-400" />
            <span className="text-[9px] font-bold text-amber-300">DASH</span>
          </button>

          {/* Magic Blast (X) */}
          <button
            {...bindButton('magic', true)}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-slate-900/80 active:bg-indigo-900/60 border-2 border-slate-700 active:border-indigo-400 flex flex-col items-center justify-center text-slate-200 active:scale-95 shadow-xl backdrop-blur-md transition-transform"
            aria-label="Sihir"
          >
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-[9px] font-bold text-indigo-300">SIHIR</span>
          </button>

          {/* Sword Slash (B) */}
          <button
            {...bindButton('attack', true)}
            className="w-15 h-15 sm:w-17 sm:h-17 rounded-2xl bg-slate-900/85 active:bg-rose-900/60 border-2 border-slate-700 active:border-rose-400 flex flex-col items-center justify-center text-slate-200 active:scale-95 shadow-xl backdrop-blur-md transition-transform"
            aria-label="Tebasan"
          >
            <Sword className="w-6 h-6 text-rose-400" />
            <span className="text-[9px] font-bold text-rose-300">TEBAS</span>
          </button>

          {/* Jump (A) */}
          <button
            {...bindButton('jump', true)}
            className="w-15 h-15 sm:w-17 sm:h-17 rounded-2xl bg-slate-900/85 active:bg-emerald-900/60 border-2 border-slate-700 active:border-emerald-400 flex flex-col items-center justify-center text-slate-200 active:scale-95 shadow-xl backdrop-blur-md transition-transform"
            aria-label="Lompat"
          >
            <ArrowUp className="w-6 h-6 text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-300">LOMPAT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
