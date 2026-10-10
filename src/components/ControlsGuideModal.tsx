/**
 * Controls Guide Modal Component
 * Detailed instructions for Desktop, Tablet, and Mobile devices.
 */

import React, { useState } from 'react';
import { X, Monitor, Smartphone, Sparkles, Sword, Wind, ArrowUp, Zap } from 'lucide-react';

interface ControlsGuideModalProps {
  onClose: () => void;
}

export const ControlsGuideModal: React.FC<ControlsGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile' | 'mechanics'>('desktop');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-pixel text-slate-100">
              PANDUAN KONTROL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'desktop'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'mobile'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tablet / Mobile</span>
          </button>
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'mechanics'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mekanik Game</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto pr-1 flex-1 text-xs text-slate-300 space-y-3">
          {activeTab === 'desktop' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-100 block">Bergerak Kiri / Kanan</span>
                  <span className="text-[11px] text-slate-400">Jalan dan jelajahi area</span>
                </div>
                <span className="font-pixel text-[11px] bg-slate-800 text-cyan-300 px-2.5 py-1 rounded border border-slate-700">
                  A / D atau ◄ / ►
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-100 block">Lompat & Lompat Ganda</span>
                  <span className="text-[11px] text-slate-400">Tekan lagi di udara untuk double jump</span>
                </div>
                <span className="font-pixel text-[11px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded border border-slate-700">
                  SPACE / W / ▲
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-100 block">Tebasan Pedang (Melee)</span>
                  <span className="text-[11px] text-slate-400">Serangan jarak dekat ksatria Lyra</span>
                </div>
                <span className="font-pixel text-[11px] bg-slate-800 text-rose-400 px-2.5 py-1 rounded border border-slate-700">
                  J atau X
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-100 block">Sihir Astral Rune (Ranged)</span>
                  <span className="text-[11px] text-slate-400">Peluru sihir biru (biaya 20 Mana)</span>
                </div>
                <span className="font-pixel text-[11px] bg-slate-800 text-indigo-400 px-2.5 py-1 rounded border border-slate-700">
                  K atau C
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-100 block">Dash Kecepatan Tinggi</span>
                  <span className="text-[11px] text-slate-400">Menembus musuh dengan kilat</span>
                </div>
                <span className="font-pixel text-[11px] bg-slate-800 text-amber-400 px-2.5 py-1 rounded border border-slate-700">
                  SHIFT atau E
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-100 block">Jeda Permainan</span>
                  <span className="text-[11px] text-slate-400">Buka menu pause</span>
                </div>
                <span className="font-pixel text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                  ESC / P
                </span>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs leading-relaxed">
                Gamepad virtual di layar otomatis menyesuaikan layar sentuh smartphone atau tablet, lengkap dengan multi-touch dan feedback getar (haptic).
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                    <span>◄ ► Tombol Kiri & Kanan</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Terletak di sudut kiri bawah layar untuk mengarahkan lari ksatria.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Tombol LOMPAT (A)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Lompat atau tap dua kali di udara untuk double jump.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                    <Sword className="w-3.5 h-3.5" />
                    <span>Tombol TEBAS (B)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ayunkan pedang rune membelah monster dan boss.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tombol SIHIR (X)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tembakkan proyektil sihir kristal jarak jauh.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Tombol DASH (Y)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Meluncur cepat ke depan untuk melewati jurang lebar atau menghindari serangan mendadak.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mechanics' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-0.5">Lompat Ganda (Double Jump)</span>
                <p className="text-[11px] text-slate-400">
                  Tekan lompat sekali lagi saat di udara untuk mencapai tebing tinggi dan pulau terapung.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-indigo-300 block mb-0.5">Regenerasi Mana & Kristal</span>
                <p className="text-[11px] text-slate-400">
                  Mana beregenerasi secara perlahan seiring waktu, atau secara instan (+15 Mana) setiap mengambil Kristal Safir.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-purple-300 block mb-0.5">Jamur Pantul (Spring Pad)</span>
                <p className="text-[11px] text-slate-400">
                  Injak jamur ungu bercahaya untuk melontarkan Lyra tinggi ke angkasa.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">Kunci & Pintu Mistik (Level 2)</span>
                <p className="text-[11px] text-slate-400">
                  Temukan Kunci Kristal Emas di altar puncak untuk membuka segel gerbang menuju tahapan berikutnya.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
