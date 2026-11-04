// src/features/main-menu/MainMenu.tsx
// Màn hình chính (Main Menu): Lâu Đài Nhi Mami 3D Cartoon Fantasy (Image 1 Reference)

import React from 'react';
import { Compass, Sparkles, Shirt, User, BookOpen, Settings, Crown, Star, Volume2 } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { soundManager } from '../../services/audio/AudioManager';
import { AudioControlBar } from '../../components/AudioControlBar';
import { CartoonButton } from '../../design-system/CartoonButton';

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
  const handleQueenGreeting = () => {
    soundManager.playTap();
    soundManager.speakVietnamese('Chào mừng con yêu đến với Vương Quốc Toán Học! Hãy cùng Ronie giải cứu các bạn nhỏ nhé!');
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-sky-300 via-pink-100 to-amber-100 overflow-x-hidden select-none">
      {/* 1. BẦU TRỜI & CÁNH ĐỒNG HOA ANH ĐÀO VƯƠNG QUỐC (Image 1 Fantasy Atmosphere) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Những đám mây trắng bồng bềnh */}
        <div className="absolute top-4 left-6 text-6xl opacity-70 animate-pulse">☁️</div>
        <div className="absolute top-10 right-14 text-7xl opacity-60">☁️</div>
        <div className="absolute top-28 left-1/4 text-5xl opacity-50">☁️</div>

        {/* Cánh hoa anh đào & bướm xanh bay lượn */}
        <div className="absolute top-16 left-12 text-3xl animate-bounce">🌸</div>
        <div className="absolute top-24 right-20 text-3xl animate-bounce" style={{ animationDelay: '300ms' }}>🌸</div>
        <div className="absolute top-36 left-1/3 text-2xl animate-pulse">🦋</div>
        <div className="absolute top-20 right-1/3 text-2xl animate-pulse" style={{ animationDelay: '500ms' }}>🦋</div>
        <div className="absolute bottom-24 left-10 text-4xl animate-pulse">✨</div>
        <div className="absolute bottom-28 right-16 text-4xl animate-pulse" style={{ animationDelay: '700ms' }}>✨</div>

        {/* Cầu vồng pastel mờ ảo phía xa */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full border-[28px] border-pink-300/25 border-b-0 pointer-events-none" />
      </div>

      {/* 2. THANH HUD TRÊN CÙNG: HỒ SƠ BÉ, SAO VÀNG, ÂM THANH & CỔNG PHỤ HUYNH */}
      <header className="w-full max-w-6xl mx-auto p-3 sm:p-5 flex items-center justify-between relative z-30">
        {/* HỒ SƠ BÉ RONIE */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onOpenProfile();
          }}
          className="flex items-center gap-2.5 sm:gap-3 bg-white/90 hover:bg-white px-3.5 sm:px-4 py-2 rounded-2xl border-3 border-amber-300 shadow-[0_6px_0_#d97706,0_8px_15px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          <RonieAvatar size="sm" state="idle" variant="photo" />
          <div className="text-left">
            <div className="text-slate-900 font-comic font-black text-xs sm:text-sm leading-tight flex items-center gap-1">
              <span>Hồ Sơ Ronie</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-rose-500 text-white rounded-full">Lớp 1</span>
            </div>
            <div className="text-amber-600 font-comic font-black text-xs flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{totalStars} Sao Vàng</span>
            </div>
          </div>
        </button>

        {/* NÚT ĐIỀU KHIỂN BÊN PHẢI */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenShowcase && (
            <CartoonButton
              color="purple"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
              onClick={onOpenShowcase}
              className="hidden md:inline-flex"
            >
              Sân Khấu
            </CartoonButton>
          )}

          <AudioControlBar />

          {/* CỔNG PHỤ HUYNH BẢO VỆ */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenSettings();
            }}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-indigo-700 rounded-2xl border-3 border-indigo-300 shadow-[0_4px_0_#4338ca] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 font-comic font-black text-xs"
            title="Khu vực phụ huynh & Cài đặt (Có mã bảo vệ)"
          >
            <Settings className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Cài Đặt</span>
          </button>
        </div>
      </header>

      {/* 3. KHU VỰC TRUNG TÂM: LÂU ĐÀI THẦN TIÊN & NỮ HOÀNG & RONIE (Image 1 Style) */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center px-4 relative z-20 my-auto py-2">
        {/* BANNER RƠI DẢI LỤA HOÀNG GIA CHÀO MỪNG (WELCOME RIBBON) */}
        <div className="relative mb-2 sm:mb-4 animate-scaleUp text-center">
          <div className="inline-block relative">
            {/* Dải băng tím hồng hoàng gia cong nhẹ */}
            <div className="px-6 sm:px-10 py-2 sm:py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-comic font-black text-lg sm:text-2xl md:text-3xl rounded-3xl border-3 border-amber-300 shadow-[0_8px_20px_rgba(168,85,247,0.4)] tracking-wide">
              ✨ VƯƠNG QUỐC TOÁN HỌC ✨
            </div>
            {/* Nơ dải lụa hai bên */}
            <div className="hidden sm:block absolute -left-4 top-1/2 -translate-y-1/2 text-2xl">🎀</div>
            <div className="hidden sm:block absolute -right-4 top-1/2 -translate-y-1/2 text-2xl">🎀</div>
          </div>
          <p className="font-comic font-black text-xs sm:text-sm text-purple-900 mt-1 drop-shadow-sm">
            Cùng Ronie & Nhi Mami chinh phục Toán Lớp 1 (GDPT 2018)
          </p>
        </div>

        {/* KHÔNG GIAN 3D LÂU ĐÀI, NỮ HOÀNG VÀ HIỆP SĨ RONIE */}
        <div className="relative w-full max-w-3xl flex items-end justify-center min-h-[220px] sm:min-h-[280px] my-2">
          {/* LÂU ĐÀI FANTASY Ở HẬU CẢNH */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-90 drop-shadow-2xl pointer-events-none">
            <svg viewBox="0 0 400 240" className="w-80 sm:w-96 md:w-[480px] h-auto">
              <defs>
                <linearGradient id="castleWall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDF4FF" />
                  <stop offset="50%" stopColor="#F3E8FF" />
                  <stop offset="100%" stopColor="#E9D5FF" />
                </linearGradient>
                <linearGradient id="castleRoof" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
                <linearGradient id="goldTower" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Ngọn đồi xanh mướt */}
              <ellipse cx="200" cy="225" rx="190" ry="35" fill="#86EFAC" stroke="#4ADE80" strokeWidth="4" />

              {/* Tháp trái */}
              <rect x="70" y="90" width="50" height="110" rx="6" fill="url(#castleWall)" stroke="#C084FC" strokeWidth="3" />
              <polygon points="95,40 60,90 130,90" fill="url(#castleRoof)" stroke="#BE123C" strokeWidth="2" />
              <circle cx="95" cy="120" r="10" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2" />

              {/* Tháp phải */}
              <rect x="280" y="90" width="50" height="110" rx="6" fill="url(#castleWall)" stroke="#C084FC" strokeWidth="3" />
              <polygon points="305,40 270,90 340,90" fill="url(#castleRoof)" stroke="#BE123C" strokeWidth="2" />
              <circle cx="305" cy="120" r="10" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2" />

              {/* Tháp cung điện trung tâm nguy nga */}
              <rect x="135" y="65" width="130" height="135" rx="10" fill="url(#castleWall)" stroke="#C084FC" strokeWidth="4" />
              <polygon points="200,10 140,65 260,65" fill="url(#goldTower)" stroke="#B45309" strokeWidth="3" />
              <circle cx="200" cy="95" r="16" fill="#FEF08A" stroke="#EAB308" strokeWidth="3" />
              <path d="M 175 200 C 175 155 225 155 225 200 Z" fill="#9333EA" stroke="#6B21A8" strokeWidth="3" />

              {/* Cờ hoàng gia trên đỉnh chóp */}
              <line x1="200" y1="10" x2="200" y2="-5" stroke="#B45309" strokeWidth="3" />
              <polygon points="200,-5 225,2 200,10" fill="#F43F5E" />
            </svg>
          </div>

          {/* NHÂN VẬT CHÍNH 1: NỮ HOÀNG NHI MAMI CHÀO ĐÓN BÉ (Image 1 Pose) */}
          <div
            onClick={handleQueenGreeting}
            className="relative z-20 flex flex-col items-center mr-6 sm:mr-16 cursor-pointer transform hover:scale-105 transition-transform"
            title="Chạm vào Mẹ Nhi Mami để nghe lời chào!"
          >
            {/* Lời chào bong bóng nhỏ của Nữ hoàng */}
            <div className="absolute -top-12 -left-6 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-purple-300 shadow-md font-comic font-black text-[11px] sm:text-xs text-purple-900 animate-bounce flex items-center gap-1 whitespace-nowrap">
              <span>👑 Chào con yêu!</span>
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <QueenNhiMamiAvatar size="2xl" speaking={true} variant="photo" />
            <span className="mt-1 px-3 py-0.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-comic font-black text-xs rounded-full shadow-md border border-white">
              Nữ Hoàng Nhi Mami
            </span>
          </div>

          {/* NHÂN VẬT CHÍNH 2: BÉ HIỆP SĨ NHỆN RONIE VUI TƯƠI SẴN SÀNG */}
          <div
            onClick={() => {
              soundManager.playCelebration();
            }}
            className="relative z-25 flex flex-col items-center -ml-2 sm:-ml-8 cursor-pointer transform hover:scale-105 transition-transform"
            title="Hiệp sĩ nhện Ronie!"
          >
            <div className="absolute -top-10 -right-4 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-rose-400 shadow-md font-comic font-black text-[11px] sm:text-xs text-rose-600 animate-pulse whitespace-nowrap">
              🕸️ Sẵn sàng xuất phát!
            </div>
            <RonieAvatar size="xl" state="celebrating" variant="photo" />
            <span className="mt-1 px-3 py-0.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-comic font-black text-xs rounded-full shadow-md border border-white">
              Hiệp Sĩ Ronie
            </span>
          </div>
        </div>
      </main>

      {/* 4. CÁC ĐỊA ĐIỂM TƯƠNG TÁC THẦN KỲ (3D CARTOON DESTINATIONS - Không dùng nút phẳng) */}
      <footer className="w-full max-w-5xl mx-auto p-3 sm:p-5 relative z-30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* ĐIỂM 1: BẢN ĐỒ PHIÊU LƯU 6 VÙNG ĐẤT (Nút Lớn Nhất Kêu Gọi Hành Động) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onStartAdventure();
            }}
            className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-600 border-4 border-emerald-200 shadow-[0_8px_0_#065f46,0_12px_20px_rgba(4,120,87,0.35)] active:translate-y-1.5 active:shadow-none hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center text-center text-white"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center text-2xl mb-1 shadow-inner">
              🧭
            </div>
            <span className="font-comic font-black text-base sm:text-lg drop-shadow-sm">PHIÊU LƯU</span>
            <span className="text-[11px] font-comic font-bold text-emerald-100">6 Vùng Bản Đồ</span>
          </button>

          {/* ĐIỂM 2: LÂU ĐÀI HOÀNG GIA (GẶP MẸ NHI MAMI NHẬN THƯỞNG) */}
          <button
            type="button"
            title="Vào Lâu Đài Hoàng Gia"
            onClick={() => {
              soundManager.playTap();
              onOpenCastle();
            }}
            className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 border-4 border-purple-200 shadow-[0_8px_0_#581c87,0_12px_20px_rgba(88,28,135,0.35)] active:translate-y-1.5 active:shadow-none hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center text-center text-white"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center text-2xl mb-1 shadow-inner">
              👑
            </div>
            <span className="font-comic font-black text-base sm:text-lg drop-shadow-sm">LÂU ĐÀI</span>
            <span className="text-[11px] font-comic font-bold text-purple-100">Yết kiến Nữ hoàng</span>
          </button>

          {/* ĐIỂM 3: PHÒNG ĐỒ CHƠI & TỦ TRANG PHỤC */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenToyRoom();
            }}
            className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 border-4 border-rose-200 shadow-[0_8px_0_#9f1239,0_12px_20px_rgba(159,18,57,0.35)] active:translate-y-1.5 active:shadow-none hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center text-center text-white"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center text-2xl mb-1 shadow-inner">
              🧸
            </div>
            <span className="font-comic font-black text-base sm:text-lg drop-shadow-sm">PHÒNG ĐỒ CHƠI</span>
            <span className="text-[11px] font-comic font-bold text-rose-100">Kho báu & Trang phục</span>
          </button>

          {/* ĐIỂM 4: GÓC HỌC TOÁN TRONG RỪNG */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenMathCorner();
            }}
            className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-4 border-amber-200 shadow-[0_8px_0_#92400e,0_12px_20px_rgba(146,64,14,0.35)] active:translate-y-1.5 active:shadow-none hover:brightness-105 transition-all cursor-pointer flex flex-col items-center justify-center text-center text-amber-950"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/35 flex items-center justify-center text-2xl mb-1 shadow-inner">
              📐
            </div>
            <span className="font-comic font-black text-base sm:text-lg drop-shadow-sm">GÓC HỌC TOÁN</span>
            <span className="text-[11px] font-comic font-bold text-amber-900">Bảng đố vui Lớp 1</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
