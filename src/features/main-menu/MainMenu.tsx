// src/features/main-menu/MainMenu.tsx
// Màn hình chính (Main Menu) rực rỡ, hấp dẫn và thân thiện với trẻ em

import React from 'react';
import { Play, Shirt, Shield, Volume2, VolumeX, Sparkles, Star } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface MainMenuProps {
  onStartAdventure: () => void;
  onOpenInventory: () => void;
  onOpenParentDashboard: () => void;
  totalStars?: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartAdventure,
  onOpenInventory,
  onOpenParentDashboard,
  totalStars = 12,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-4 md:p-8 bg-gradient-to-b from-sky-400 via-indigo-600 to-slate-950 overflow-hidden select-none">
      {/* HIỆU ỨNG ÁNH SÁNG & ĐÁM MÂY HOẠT HÌNH */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/30 rounded-full blur-xl pointer-events-none animate-pulse" />
      <div className="absolute top-24 right-16 w-48 h-20 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* TOP BAR: THÔNG TIN NGƯỜI CHƠI & NÚT CÀI ĐẶT NHANH */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-lg">
          <RonieAvatar size="sm" state="idle" />
          <div>
            <div className="text-white font-black text-sm md:text-base leading-tight">Bé Ronie</div>
            <div className="text-amber-300 font-bold text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
              <span>{totalStars} Sao Tri Thức</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl border border-white/40 shadow-lg transition-all active:scale-90 cursor-pointer"
            title="Bật/Tắt âm thanh"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenParentDashboard();
            }}
            className="p-3 bg-indigo-900/60 hover:bg-indigo-900/80 text-indigo-200 rounded-2xl border border-indigo-400/50 shadow-lg transition-all active:scale-90 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Khu vực phụ huynh"
          >
            <Shield className="w-5 h-5" />
            <span className="hidden sm:inline">Phụ Huynh</span>
          </button>
        </div>
      </header>

      {/* MAIN BANNER: LOGO GAME HOÀNG GIA */}
      <div className="flex flex-col items-center text-center my-auto z-10">
        {/* NHÃN GIÁO DỤC */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-md mb-2">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>TOÁN TIỂU HỌC LỚP 1 • CHƯƠNG TRÌNH GDPT 2018</span>
        </div>

        {/* TIÊU ĐỀ CHÍNH */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-comic tracking-wide drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]">
          <span className="text-rose-400">RONIE</span> &{' '}
          <span className="text-purple-300">NHI MAMI</span>
        </h1>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-300 tracking-wider drop-shadow-md mt-1">
          VƯƠNG QUỐC TOÁN HỌC
        </h2>

        {/* HOẠT CẢNH RONIE VÀ NỮ HOÀNG ĐÓN CHÀO BÉ */}
        <div className="flex items-center justify-center gap-8 md:gap-14 my-6">
          <div className="flex flex-col items-center">
            <RonieAvatar size="xl" state="celebrating" />
            <span className="text-xs font-bold text-rose-200 mt-2 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-400/40">
              🕷️ Hiệp Sĩ Ronie
            </span>
          </div>

          <div className="text-4xl md:text-5xl animate-bounce text-amber-300 drop-shadow-md">
            ✨
          </div>

          <div className="flex flex-col items-center">
            <QueenNhiMamiAvatar size="xl" speaking={true} />
            <span className="text-xs font-bold text-purple-200 mt-2 bg-purple-950/40 px-3 py-1 rounded-full border border-purple-400/40">
              👑 Nữ Hoàng Nhi Mami
            </span>
          </div>
        </div>

        {/* LỜI CHÀO DỊU DÀNG CỦA NỮ HOÀNG */}
        <p className="text-sm md:text-base font-bold text-amber-100 max-w-lg mx-auto bg-slate-900/60 backdrop-blur-sm px-6 py-2.5 rounded-2xl border border-amber-300/40 shadow-inner">
          "Chào mừng Ronie yêu quý! Mẹ con mình cùng khám phá 5 Vùng đất Toán học diệu kỳ nhé!"
        </p>
      </div>

      {/* FOOTER ACTIONS: NÚT BẮT ĐẦU LỚN & TỦ ĐỒ */}
      <footer className="w-full max-w-md flex flex-col sm:flex-row gap-4 justify-center items-center z-10 mb-4">
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onOpenInventory();
          }}
          className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-2 border-amber-400/60 font-black text-base rounded-3xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Shirt className="w-6 h-6 text-amber-400" />
          <span>TỦ ĐỒ RONIE</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onStartAdventure();
          }}
          className="w-full sm:w-auto flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:brightness-110 text-white font-black text-xl md:text-2xl rounded-3xl border-3 border-emerald-200 shadow-2xl flex items-center justify-center gap-3 cursor-pointer transition-all transform active:scale-95 animate-pulse"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>BẮT ĐẦU PHIÊU LƯU!</span>
        </button>
      </footer>
    </div>
  );
};
