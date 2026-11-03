// src/features/main-menu/MainMenu.tsx
// Màn hình chính (Main Menu) Lâu đài trung tâm, Ronie nổi bật & 5 Nút Lớn cho trẻ 6-7 tuổi

import React from 'react';
import { Compass, Sparkles, Shirt, User, BookOpen, Settings, Crown, Volume2, VolumeX, Star } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface MainMenuProps {
  onStartAdventure: () => void;
  onOpenCastle: () => void;
  onOpenToyRoom: () => void;
  onOpenProfile: () => void;
  onOpenMathCorner: () => void;
  onOpenSettings: () => void;
  onOpenShowcase?: () => void;
  totalStars?: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartAdventure,
  onOpenCastle,
  onOpenToyRoom,
  onOpenProfile,
  onOpenMathCorner,
  onOpenSettings,
  onOpenShowcase,
  totalStars = 12,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-sky-200 via-pink-100 to-amber-50 overflow-y-auto select-none">
      {/* TRANG TRÍ ĐỒ HỌA MÂY & ÁNH NẮNG PASTEL */}
      <div className="absolute top-6 left-8 text-5xl opacity-40 pointer-events-none animate-pulse">☁️</div>
      <div className="absolute top-12 right-12 text-6xl opacity-40 pointer-events-none">☁️</div>
      <div className="absolute bottom-20 left-12 text-4xl opacity-30 pointer-events-none">✨</div>

      {/* TOP HEADER: THÔNG TIN RONIE & NÚT CÀI ĐẶT NHANH */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-20">
        {/* NÚT PROFILE RONIE */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onOpenProfile();
          }}
          className="flex items-center gap-3 bg-white/80 hover:bg-white backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <RonieAvatar size="sm" state="idle" />
          <div className="text-left">
            <div className="text-slate-800 font-comic font-black text-sm md:text-base leading-tight">
              Bé Ronie
            </div>
            <div className="text-amber-600 font-bold text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{totalStars} Sao Tri Thức</span>
            </div>
          </div>
        </button>

        {/* NÚT LÂU ĐÀI & SÂN KHẤU & ÂM THANH & CÀI ĐẶT */}
        <div className="flex items-center gap-2">
          {onOpenShowcase && (
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onOpenShowcase();
              }}
              className="px-3 py-2.5 bg-gradient-to-r from-amber-400 to-rose-400 hover:brightness-110 text-slate-950 rounded-2xl shadow-md font-comic font-black text-xs md:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Mở Sân Khấu Nhân Vật & Hội Thoại"
            >
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span className="hidden md:inline">Sân Khấu Nhân Vật</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenCastle();
            }}
            className="px-3.5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white rounded-2xl shadow-md font-comic font-black text-xs md:text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            title="Vào Lâu Đài Hoàng Gia"
          >
            <Crown className="w-5 h-5 text-amber-300" />
            <span className="hidden sm:inline">Lâu Đài Nữ Hoàng</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2.5 bg-white/80 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-200 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Bật/Tắt âm thanh"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenSettings();
            }}
            className="p-2.5 bg-white/80 hover:bg-white text-indigo-700 rounded-2xl border-2 border-indigo-200 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Khu vực phụ huynh"
          >
            <Settings className="w-5 h-5 text-indigo-600" />
          </button>
        </div>
      </header>

      {/* KHU VỰC TRUNG TÂM: LÂU ĐÀI HOÀNG GIA & RONIE NỔI BẬT */}
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-auto py-2 z-10">
        {/* HÌNH TƯỢNG LÂU ĐÀI 2.5D CUTE PASTEL */}
        <div className="relative flex flex-col items-center">
          {/* LÂU ĐÀI VẼ VECTOR PASTEL */}
          <div className="w-64 h-48 sm:w-80 sm:h-56 relative flex items-center justify-center drop-shadow-xl">
            <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
              {/* Nền đồi cỏ xanh pastel */}
              <ellipse cx="100" cy="140" rx="90" ry="25" fill="#BBF7D0" />
              {/* Tháp trái & phải */}
              <rect x="35" y="60" width="30" height="70" rx="4" fill="#E9D5FF" stroke="#C084FC" strokeWidth="2" />
              <polygon points="50,30 30,60 70,60" fill="#F472B6" />
              <rect x="135" y="60" width="30" height="70" rx="4" fill="#E9D5FF" stroke="#C084FC" strokeWidth="2" />
              <polygon points="150,30 130,60 170,60" fill="#F472B6" />
              {/* Tháp chính giữa */}
              <rect x="70" y="45" width="60" height="85" rx="6" fill="#FDF4FF" stroke="#C084FC" strokeWidth="2" />
              <polygon points="100,10 65,45 135,45" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Cổng vòm lâu đài */}
              <path d="M 85 130 C 85 105 115 105 115 130 Z" fill="#9333EA" />
              {/* Cửa sổ nhỏ */}
              <circle cx="100" cy="70" r="8" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2" />
              <rect x="45" y="80" width="10" height="15" rx="2" fill="#BAE6FD" />
              <rect x="145" y="80" width="10" height="15" rx="2" fill="#BAE6FD" />
              {/* Ngôi sao lấp lánh đỉnh tháp */}
              <polygon points="100,2 103,8 109,8 104,12 106,18 100,14 94,18 96,12 91,8 97,8" fill="#FDE047" />
            </svg>
          </div>

          {/* NHÂN VẬT RONIE NỔI BẬT ĐỨNG TRƯỚC LÂU ĐÀI */}
          <div className="relative -mt-16 flex flex-col items-center">
            <RonieAvatar size="xl" state="celebrating" />
            <div className="bg-white/95 px-4 py-1.5 rounded-full border-2 border-rose-400 shadow-md font-comic font-black text-xs md:text-sm text-rose-600 mt-1">
              🕷️ Bé Ronie sẵn sàng!
            </div>
          </div>
        </div>

        {/* TIÊU ĐỀ GAME */}
        <div className="text-center mt-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-comic text-slate-900 tracking-wide">
            <span className="text-rose-500">RONIE</span> &{' '}
            <span className="text-purple-600">NHI MAMI</span>
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black font-comic text-amber-600">
            VƯƠNG QUỐC TOÁN HỌC
          </h2>
        </div>
      </div>

      {/* CÁC NÚT LỚN (5 BIG BUTTONS FOR KIDS) */}
      <footer className="w-full max-w-4xl mx-auto z-20 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {/* NÚT 1: PHIÊU LƯU (BẢN ĐỒ THẾ GIỚI) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onStartAdventure();
            }}
            className="col-span-2 sm:col-span-1 lg:col-span-1 py-4 px-3 bg-gradient-to-b from-emerald-400 to-teal-500 hover:brightness-110 text-white rounded-3xl border-3 border-emerald-200 shadow-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transform active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Compass className="w-7 h-7" />
            </div>
            <span className="font-comic font-black text-base md:text-lg">PHIÊU LƯU</span>
            <span className="text-[10px] font-bold text-emerald-100">Bản đồ 5 vùng</span>
          </button>

          {/* NÚT 2: PHÒNG ĐỒ CHƠI (TOY ROOM) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenToyRoom();
            }}
            className="py-4 px-3 bg-gradient-to-b from-amber-300 to-orange-400 hover:brightness-110 text-amber-950 rounded-3xl border-3 border-amber-200 shadow-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transform active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center">
              <Shirt className="w-7 h-7 text-amber-950" />
            </div>
            <span className="font-comic font-black text-sm md:text-base">PHÒNG ĐỒ CHƠI</span>
            <span className="text-[10px] font-bold text-amber-900">Tủ đồ & Kệ đồ chơi</span>
          </button>

          {/* NÚT 3: HỒ SƠ CỦA RONIE (PROFILE) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenProfile();
            }}
            className="py-4 px-3 bg-gradient-to-b from-sky-300 to-blue-400 hover:brightness-110 text-blue-950 rounded-3xl border-3 border-sky-200 shadow-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transform active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center">
              <User className="w-7 h-7 text-blue-950" />
            </div>
            <span className="font-comic font-black text-sm md:text-base">HỒ SƠ RONIE</span>
            <span className="text-[10px] font-bold text-blue-900">Cấp độ & Thành tích</span>
          </button>

          {/* NÚT 4: GÓC HỌC TOÁN (MATH CORNER / MISSIONS) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenMathCorner();
            }}
            className="py-4 px-3 bg-gradient-to-b from-purple-300 to-violet-500 hover:brightness-110 text-white rounded-3xl border-3 border-purple-200 shadow-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transform active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="font-comic font-black text-sm md:text-base">GÓC HỌC TOÁN</span>
            <span className="text-[10px] font-bold text-purple-100">Bài tập & Thử thách</span>
          </button>

          {/* NÚT 5: CÀI ĐẶT (SETTINGS / PARENT DASHBOARD) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenSettings();
            }}
            className="col-span-2 sm:col-span-2 lg:col-span-1 py-4 px-3 bg-gradient-to-b from-slate-200 to-slate-400 hover:brightness-105 text-slate-800 rounded-3xl border-3 border-slate-300 shadow-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transform active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/40 flex items-center justify-center text-slate-800">
              <Settings className="w-7 h-7" />
            </div>
            <span className="font-comic font-black text-sm md:text-base">CÀI ĐẶT</span>
            <span className="text-[10px] font-bold text-slate-600">Phụ huynh & Giờ chơi</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
