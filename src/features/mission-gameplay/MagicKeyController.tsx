// src/features/mission-gameplay/MagicKeyController.tsx
// Trực quan hóa Gameplay 6: Tìm Chìa Khóa Ma Thuật Mở Cổng Lâu Đài (Magic Key)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface MagicKeyControllerProps {
  runState: IMissionRunState;
}

export const MagicKeyController: React.FC<MagicKeyControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Tính số chìa khóa đã thu thập được (tối đa 3 chìa theo tiến trình: 33%, 66%, 100%)
  const keysCount = Math.min(3, Math.floor((progress / 100) * 3) + (progress >= 100 ? 1 : 0));
  const isGateOpen = progress >= 100;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-900 via-rose-950 to-slate-950 border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* NỀN CUNG ĐIỆN VÀ HOA VĂN HOÀNG GIA */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          <rect x="0" y="0" width="400" height="200" fill="#2E1065" />
          <circle cx="200" cy="80" r="60" fill="#F59E0B" opacity="0.15" />
          <path d="M 50,0 L 50,200 M 350,0 L 350,200" stroke="#FDE047" strokeWidth="2" opacity="0.3" />
        </svg>
      </div>

      {/* TOP: THANH THU THẬP CHÌA KHÓA */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-2">
          <span>🗝️ Chìa khóa ma thuật:</span>
          <span className="flex items-center gap-1 text-sm">
            <span className={keysCount >= 1 ? 'opacity-100 scale-110 transition-all' : 'opacity-30 grayscale'}>
              🔑
            </span>
            <span className={keysCount >= 2 ? 'opacity-100 scale-110 transition-all' : 'opacity-30 grayscale'}>
              🗝️
            </span>
            <span className={keysCount >= 3 ? 'opacity-100 scale-110 transition-all' : 'opacity-30 grayscale'}>
              ✨
            </span>
          </span>
        </span>
        <span className="text-amber-300">
          {isGateOpen ? '🎉 CÁNH CỔNG ĐÃ MỞ RỘNG!' : `Tiến độ: ${Math.round(progress)}%`}
        </span>
      </div>

      {/* KHU VỰC CÁNH CỔNG VÀ RONIE */}
      <div className="relative flex-1 w-full flex items-center justify-around">
        {/* RONIE BÊN TRÁI TIẾN VÀO CỔNG */}
        <div className="z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="md" state={ronieAnimState} variant="photo" />
          </div>
          <span className="px-2 py-0.5 bg-amber-500 text-amber-950 font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            Hiệp Sĩ Ronie
          </span>
        </div>

        {/* CÁNH CỔNG MA THUẬT VỚI 3 Ổ KHÓA HOÀNG GIA */}
        <div className="relative z-15 flex flex-col items-center justify-center">
          {/* KHUNG CỔNG */}
          <div className="w-44 h-40 sm:w-52 sm:h-44 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-t-full border-4 border-amber-300 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* HAI CÁNH CỬA MỞ HOẶC ĐÓNG */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1/2 bg-amber-900 border-r border-amber-400 transition-all duration-1000 ${
                isGateOpen ? '-translate-x-full opacity-40' : 'translate-x-0'
              }`}
            />
            <div
              className={`absolute right-0 top-0 bottom-0 w-1/2 bg-amber-900 border-l border-amber-400 transition-all duration-1000 ${
                isGateOpen ? 'translate-x-full opacity-40' : 'translate-x-0'
              }`}
            />

            {/* ÁNH SÁNG KHO BÁU BÊN TRONG KHI MỞ */}
            {isGateOpen && (
              <div className="z-25 flex flex-col items-center animate-bounce">
                <span className="text-4xl">👑</span>
                <span className="text-[11px] font-comic font-black text-amber-300 drop-shadow">
                  VƯƠNG MIỆN MỞ RA!
                </span>
              </div>
            )}

            {/* 3 Ổ KHÓA TRÊN CỔNG KHI ĐANG ĐÓNG */}
            {!isGateOpen && (
              <div className="z-20 flex flex-col items-center gap-2">
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md border-2 ${keysCount >= 1 ? 'bg-amber-400 border-white animate-pulse' : 'bg-slate-700 border-slate-500'}`}>
                    {keysCount >= 1 ? '🔓' : '🔒'}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md border-2 ${keysCount >= 2 ? 'bg-amber-400 border-white animate-pulse' : 'bg-slate-700 border-slate-500'}`}>
                    {keysCount >= 2 ? '🔓' : '🔒'}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md border-2 ${keysCount >= 3 ? 'bg-amber-400 border-white animate-pulse' : 'bg-slate-700 border-slate-500'}`}>
                  {keysCount >= 3 ? '🔓' : '🔒'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: PHẢN HỒI HÀNH ĐỘNG */}
      <div className="z-10 flex items-center justify-between text-xs font-comic font-bold text-white/90">
        <div className="flex items-center gap-1.5 truncate max-w-[85%]">
          {actionFeedback ? (
            <span
              className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-rose-600/90 text-white animate-shake'
              }`}
            >
              {actionFeedback.text}
            </span>
          ) : (
            <span className="text-amber-200/80">
              Giải đúng câu đố toán học để thu thập đủ 3 chìa khóa mở cánh cổng lâu đài!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
