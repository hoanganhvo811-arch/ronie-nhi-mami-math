// src/design-system/TreasureChestCelebration.tsx
// Rương báu hoàng gia phát sáng ăn mừng chiến thắng (Image 3 Reference)

import React from 'react';

interface TreasureChestCelebrationProps {
  stars?: number;
  score?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TreasureChestCelebration: React.FC<TreasureChestCelebrationProps> = ({
  stars = 3,
  score,
  children,
  className = '',
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-4 select-none ${className}`}>
      {/* TIA SÁNG HÀO QUANG TOẢ XOAY TRÒN PHÍA SAU (SUNBURST RAYS) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-300/40 via-yellow-200/50 to-amber-400/30 blur-2xl animate-spin" />
      </div>

      {/* RƯƠNG KHO BÁU HOÀNG GIA ĐANG MỞ NẮP NỞ HOA QUÀ TẶNG */}
      <div className="relative z-10 flex flex-col items-center">
        {/* HÀNG SAO VÀNG DANH DỰ TO TỎA SÁNG */}
        <div className="flex items-center gap-3 mb-2 animate-bounce">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`text-4xl sm:text-5xl drop-shadow-[0_4px_8px_rgba(245,158,11,0.6)] transform transition-transform ${
                i < stars ? 'scale-115 text-amber-400' : 'opacity-30 grayscale text-slate-400'
              }`}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* HÌNH ẢNH CHIẾC RƯƠNG VÀNG MỞ NẮP */}
        <div className="relative w-52 h-40 sm:w-64 sm:h-48 flex items-center justify-center">
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="chestWood" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="50%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>

            {/* Thân rương gỗ viền vàng */}
            <rect x="25" y="70" width="150" height="80" rx="14" fill="url(#chestWood)" stroke="#451A03" strokeWidth="4" />
            <rect x="25" y="70" width="150" height="16" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="2" />
            <rect x="25" y="134" width="150" height="16" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="2" />
            <rect x="35" y="70" width="14" height="80" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="2" />
            <rect x="151" y="70" width="14" height="80" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="2" />

            {/* Nắp rương mở vát lên trên */}
            <path d="M 20 65 Q 100 20 180 65 L 175 45 Q 100 5 25 45 Z" fill="url(#chestWood)" stroke="#451A03" strokeWidth="3" />
            <path d="M 22 55 Q 100 15 178 55" stroke="url(#goldGradient)" strokeWidth="6" fill="none" />

            {/* Ổ khóa hoàng gia phát sáng */}
            <circle cx="100" cy="95" r="16" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="3" />
            <circle cx="100" cy="93" r="4" fill="#451A03" />
            <polygon points="98,95 102,95 103,103 97,103" fill="#451A03" />

            {/* Tiền vàng & ngọc quý tràn ra khỏi miệng rương */}
            <circle cx="65" cy="62" r="12" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="85" cy="58" r="14" fill="#FACC15" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="115" cy="58" r="14" fill="#FACC15" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="135" cy="62" r="12" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="100,50 106,62 94,62" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
            <polygon points="75,54 80,64 70,64" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
            <polygon points="125,54 130,64 120,64" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          </svg>

          {/* HẠT BỤI VÀNG VÀ ÁNH SÁNG LẤP LÁNH */}
          <div className="text-2xl absolute -top-4 -left-2 animate-bounce">✨</div>
          <div className="text-3xl absolute -top-6 -right-2 animate-spin">🌟</div>
          <div className="text-2xl absolute top-1/2 -left-6 animate-pulse">💎</div>
          <div className="text-2xl absolute top-1/2 -right-6 animate-pulse">🍭</div>
        </div>

        {/* ĐIỂM SỐ & CHIẾN CÔNG */}
        {score !== undefined && (
          <div className="mt-2 px-5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 rounded-full border-2 border-white shadow-md font-comic font-black text-sm sm:text-base flex items-center gap-2">
            <span>🏆</span>
            <span>+ {score} Điểm Chiến Công</span>
          </div>
        )}

        {children && <div className="mt-3 w-full">{children}</div>}
      </div>
    </div>
  );
};
