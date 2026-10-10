/**
 * Level Select Modal Component
 */

import React from 'react';
import { X, Play, Compass, Trees, Gem, Skull } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface LevelSelectModalProps {
  unlockedLevel: number;
  onSelectLevel: (levelIndex: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevel,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold font-pixel text-slate-100">
              PILIH TAHAPAN
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {LEVELS.map((level, idx) => {
            const isUnlocked = level.id <= unlockedLevel;
            const Icon = level.theme === 'forest' ? Trees : level.theme === 'cavern' ? Gem : Skull;

            return (
              <div
                key={level.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 cursor-pointer shadow-md'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                }`}
                onClick={() => {
                  if (isUnlocked) onSelectLevel(idx);
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      level.theme === 'forest'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                        : level.theme === 'cavern'
                        ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
                        : 'bg-purple-950/80 text-rose-400 border-purple-800/60'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-pixel text-cyan-300">
                        LEVEL {level.id}
                      </span>
                      {level.hasKey && (
                        <span className="text-[10px] text-amber-400 font-medium">· Butuh Kunci</span>
                      )}
                      {level.boss && (
                        <span className="text-[10px] text-rose-400 font-medium">· Boss Fight</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{level.name}</div>
                    <div className="text-xs text-slate-400">{level.subtitle}</div>
                  </div>
                </div>

                {isUnlocked ? (
                  <button className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0">
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Main</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-medium shrink-0">Terkunci</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
