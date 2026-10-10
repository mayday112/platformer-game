/**
 * Pause Modal Component
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  sfxOn: boolean;
  bgmOn: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  sfxOn,
  bgmOn,
  onToggleSfx,
  onToggleBgm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center">
        <h2 className="text-xl font-bold font-pixel text-cyan-400 mb-1">
          PERMAIKAN DIJEDA
        </h2>
        <p className="text-xs text-slate-400 mb-6">Ambil nafas sejenak, Ksatria Lyra!</p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl font-bold font-pixel text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>LANJUTKAN</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>ULANGI LEVEL</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>KEMBALI KE MENU</span>
          </button>
        </div>

        {/* Audio settings */}
        <div className="mt-6 pt-4 border-t border-slate-800 w-full flex items-center justify-around text-xs text-slate-400">
          <button
            onClick={onToggleSfx}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {sfxOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>SFX: {sfxOn ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={onToggleBgm}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Music className={`w-4 h-4 ${bgmOn ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span>MUSIK: {bgmOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
