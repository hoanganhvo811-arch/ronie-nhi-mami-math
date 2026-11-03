// src/components/LoadingScreen.tsx
// Màn hình tải chuyển cảnh mềm mại cho trẻ em (Cute Soft Loading Transition)

import React from 'react';
import { RonieAvatar } from '../features/character/RonieAvatar';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Đang mở cánh cổng diệu kỳ...',
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-sky-200 via-pink-100 to-amber-100 flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      {/* VÒNG TRÒN NĂNG LƯỢNG VÀ RONIE NHẢY NHÓT */}
      <div className="relative mb-6">
        <div className="w-36 h-36 rounded-full bg-white/80 border-4 border-amber-300 shadow-xl flex items-center justify-center animate-bounce">
          <RonieAvatar size="lg" state="celebrating" />
        </div>
        <div className="text-3xl absolute -top-2 -right-2 animate-spin">✨</div>
      </div>

      {/* DÒNG THÔNG BÁO HOẠT HÌNH */}
      <h3 className="font-comic font-black text-xl md:text-2xl text-slate-800 text-center drop-shadow-sm mb-3">
        {message}
      </h3>

      {/* THANH TẢI PASTEL DỄ THƯƠNG */}
      <div className="w-56 h-3.5 bg-white/70 rounded-full overflow-hidden border-2 border-amber-300 shadow-inner">
        <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 rounded-full animate-pulse w-full" />
      </div>

      <span className="text-xs font-bold text-slate-600 mt-2">
        Ronie đang chuẩn bị những phép tính thú vị nhé!
      </span>
    </div>
  );
};
