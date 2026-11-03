// src/components/NavigationHeader.tsx
// Thanh điều hướng dùng chung chuẩn Responsive, Touch-friendly cho trẻ 6-7 tuổi

import React from 'react';
import { Home, ArrowLeft, Star, Shield } from 'lucide-react';
import { soundManager } from '../services/audio/AudioManager';
import { AudioControlBar } from './AudioControlBar';

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  onHome?: () => void;
  onBack?: () => void;
  onOpenSettings?: () => void;
  totalStars?: number;
  rightAddon?: React.ReactNode;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  onHome,
  onBack,
  onOpenSettings,
  totalStars = 12,
  rightAddon,
}) => {

  return (
    <header className="w-full flex items-center justify-between p-3 md:p-4 bg-white/40 backdrop-blur-md border-b-2 border-white/60 shadow-sm z-30 select-none">
      {/* NÚT BACK / HOME */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onBack();
            }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border-2 border-amber-200 shadow-md flex items-center justify-center transition-all transform active:scale-90 cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 text-amber-600" />
          </button>
        )}

        {onHome && (
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onHome();
            }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-amber-300 shadow-md flex items-center justify-center transition-all transform active:scale-90 cursor-pointer"
            title="Về Trang Chủ"
          >
            <Home className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        )}

        {/* TIÊU ĐỀ MÀN HÌNH */}
        <div className="ml-1 md:ml-3">
          <h2 className="text-lg md:text-2xl font-black text-slate-850 font-comic leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="hidden sm:block text-xs md:text-sm font-bold text-amber-800/80">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* THÔNG TIN NGƯỜI CHƠI & CÁC NÚT PHẢI */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* SAO TÍCH LŨY */}
        <div className="flex items-center gap-2 bg-amber-100/90 border-2 border-amber-300/80 px-3 py-1.5 rounded-2xl shadow-sm">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
          <span className="font-black text-sm md:text-base text-amber-900">{totalStars}</span>
          <span className="hidden sm:inline text-xs font-bold text-amber-700">Sao</span>
        </div>

        {rightAddon}

        {/* THANH ĐIỀU KHIỂN ÂM THANH ĐA TẦNG CHO BÉ & PHỤ HUYNH (PHASE 6) */}
        <AudioControlBar />

        {/* NÚT PHỤ HUYNH */}
        {onOpenSettings && (
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenSettings();
            }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-2 border-indigo-300 shadow-md flex items-center justify-center transition-all transform active:scale-90 cursor-pointer"
            title="Khu vực phụ huynh"
          >
            <Shield className="w-6 h-6 text-indigo-700" />
          </button>
        )}
      </div>
    </header>
  );
};
