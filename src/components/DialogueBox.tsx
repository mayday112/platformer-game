/**
 * Dialogue Box Component with 16-bit Anime Character Portraits
 */

import React from 'react';
import { ASSETS } from '../assets/assetRegistry';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  avatar: 'hero' | 'boss';
  onDismiss: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, text, avatar, onDismiss }) => {
  const avatarSrc = avatar === 'boss' ? ASSETS.bossPortrait : ASSETS.heroPortrait;
  const isBoss = avatar === 'boss';

  return (
    <aside
      aria-label="Story Dialogue"
      className="fixed bottom-24 sm:bottom-28 left-4 right-4 max-w-xl mx-auto z-40 bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 p-3 sm:p-4 shadow-2xl flex items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
      style={{
        borderColor: isBoss ? '#9333ea' : '#0284c7',
      }}
      onClick={onDismiss}
    >
      {/* Anime Portrait */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-slate-900 shadow-md"
        style={{ borderColor: isBoss ? '#c084fc' : '#38bdf8' }}
      >
        <img
          src={avatarSrc}
          alt={speaker}
          className="w-full h-full object-cover pixelated"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Speech content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-xs sm:text-sm font-bold tracking-wider font-pixel"
            style={{ color: isBoss ? '#f472b6' : '#7dd3fc' }}
          >
            {speaker}
          </span>
          <span className="text-[10px] text-slate-500 animate-pulse">Ketuk untuk Lanjut ▶</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {text}
        </p>
      </div>
    </aside>
  );
};
