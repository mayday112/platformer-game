/**
 * Title Menu Component
 * Fantasy Pixel Anime Title Screen with artwork background and game options.
 */

import React from 'react';
import { Play, Compass, HelpCircle, Sparkles, Volume2, VolumeX, Music } from 'lucide-react';
import { ASSETS } from '../assets/assetRegistry';

interface TitleMenuProps {
  highScore: number;
  totalCrystals: number;
  sfxOn: boolean;
  bgmOn: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenControls: () => void;
}

export const TitleMenu: React.FC<TitleMenuProps> = ({
  highScore,
  totalCrystals,
  sfxOn,
  bgmOn,
  onToggleSfx,
  onToggleBgm,
  onStartGame,
  onOpenLevelSelect,
  onOpenControls,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background artwork */}
      <img
        src={ASSETS.cover}
        alt="Aetheria: Crystal Legend"
        className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90 contrast-110"
        referrerPolicy="no-referrer"
      />

      {/* Atmospheric scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-6 flex flex-col items-center text-center">
        {/* Title Badges */}
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>FANTASY PIXEL PLATFORMER</span>
        </div>

        {/* Game Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-pixel text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_4px_16px_rgba(6,182,212,0.6)] mb-2">
          AETHERIA
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-cyan-200/90 font-pixel mb-6">
          CRYSTAL LEGEND
        </p>

        {/* High Score / Best Crystal summary */}
        {(highScore > 0 || totalCrystals > 0) && (
          <div className="mb-6 flex items-center gap-4 text-xs bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-900/50 text-slate-300">
            <div>
              <span className="text-slate-500 mr-1.5">Skor Terbaik:</span>
              <span className="font-pixel text-cyan-300 tabular-nums">{highScore}</span>
            </div>
            <span className="text-slate-700">·</span>
            <div>
              <span className="text-slate-500 mr-1.5">Kristal:</span>
              <span className="font-pixel text-amber-300 tabular-nums">{totalCrystals}</span>
            </div>
          </div>
        )}

        {/* Action Menu Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          {/* Start Game */}
          <button
            onClick={onStartGame}
            className="w-full py-3.5 px-6 rounded-xl font-bold font-pixel text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>MULAI PETUALANGAN</span>
          </button>

          {/* Level Select */}
          <button
            onClick={onOpenLevelSelect}
            className="w-full py-3 px-6 rounded-xl font-medium text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>PILIH LEVEL</span>
          </button>

          {/* Controls Guide */}
          <button
            onClick={onOpenControls}
            className="w-full py-3 px-6 rounded-xl font-medium text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>PANDUAN KONTROL</span>
          </button>
        </div>

        {/* Quick Audio Bar in Footer */}
        <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
          <button
            onClick={onToggleSfx}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {sfxOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>SFX: {sfxOn ? 'ON' : 'OFF'}</span>
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={onToggleBgm}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Music className={`w-4 h-4 ${bgmOn ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span>MUSIK: {bgmOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Desktop · Tablet · Mobile Touch Supported · Phaser + Vite
        </p>
      </div>
    </div>
  );
};
