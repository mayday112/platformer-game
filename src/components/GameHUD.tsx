/**
 * Game HUD Component
 * Displays hearts, mana bar, crystal count, score, boss health, and quick audio controls.
 */

import React from 'react';
import { Heart, Sparkles, Key, Volume2, VolumeX, Music, Pause, Maximize, HelpCircle } from 'lucide-react';
import { GameStatus } from '../game/events';
import { sound } from '../game/audio';

interface GameHUDProps {
  status: GameStatus;
  sfxOn: boolean;
  bgmOn: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
  onPause: () => void;
  onOpenHelp: () => void;
  onToggleFullscreen: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  status,
  sfxOn,
  bgmOn,
  onToggleSfx,
  onToggleBgm,
  onPause,
  onOpenHelp,
  onToggleFullscreen,
}) => {
  const manaPercent = Math.min(100, Math.max(0, (status.mana / status.maxMana) * 100));

  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-2 sm:p-4 pointer-events-none select-none flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        {/* LEFT: Player Stats (HP & Mana) */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/80 backdrop-blur-md p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-800 shadow-xl">
          {/* Hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: status.maxHp }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  i < status.hp
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-700 fill-slate-800 scale-90'
                }`}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Mana Bar */}
          <div className="flex flex-col gap-1 w-18 sm:w-24">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold leading-none">
              <span>MANA</span>
              <span className="tabular-nums">{Math.round(status.mana)}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-950">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* CENTER: Crystals & Key (if present) */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 sm:py-2 rounded-xl border border-slate-800 shadow-xl">
          {/* Crystals */}
          <div className="flex items-center gap-1.5 text-cyan-300 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-pixel tabular-nums">{status.crystals}</span>
          </div>

          {/* Golden Key */}
          {status.hasKey && (
            <div className="flex items-center gap-1 text-amber-400 animate-bounce">
              <Key className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-wider">KUNCI</span>
            </div>
          )}

          {/* Level Badge */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
            <span className="text-slate-600">·</span>
            <span>{status.levelName}</span>
          </div>
        </div>

        {/* RIGHT: Action & Audio Controls */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
          {/* SFX Toggle */}
          <button
            onClick={onToggleSfx}
            className={`p-2 rounded-lg border backdrop-blur-md transition-colors ${
              sfxOn
                ? 'bg-slate-900/80 text-cyan-400 border-slate-800 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-500 border-slate-800/60'
            }`}
            title="Efek Suara"
            aria-label="Efek Suara"
          >
            {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* BGM Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-2 rounded-lg border backdrop-blur-md transition-colors ${
              bgmOn
                ? 'bg-slate-900/80 text-indigo-400 border-slate-800 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-500 border-slate-800/60'
            }`}
            title="Musik Retro"
            aria-label="Musik Retro"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 backdrop-blur-md transition-colors hidden sm:block"
            title="Layar Penuh"
            aria-label="Layar Penuh"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Help Modal */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 backdrop-blur-md transition-colors"
            title="Panduan Kontrol"
            aria-label="Panduan Kontrol"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Pause */}
          <button
            onClick={onPause}
            className="p-2 rounded-lg bg-slate-900/80 text-amber-400 border border-slate-800 hover:bg-slate-800 backdrop-blur-md transition-colors"
            title="Jeda Permainan"
            aria-label="Jeda Permainan"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOSS HEALTH BAR (shown when Boss is active in Level 3) */}
      {status.bossHp !== undefined && status.bossMaxHp !== undefined && status.bossHp > 0 && (
        <div className="w-full max-w-md mx-auto pointer-events-auto bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-purple-900/80 shadow-2xl flex flex-col gap-1 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold px-1">
            <span className="font-pixel text-[11px] text-purple-400">MALACOR THE SHADOW ARCHON</span>
            <span className="tabular-nums text-purple-200">
              {status.bossHp} / {status.bossMaxHp} HP
            </span>
          </div>
          <div className="w-full h-3 bg-purple-950/80 rounded-full overflow-hidden border border-purple-700/60 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(status.bossHp / status.bossMaxHp) * 100}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
