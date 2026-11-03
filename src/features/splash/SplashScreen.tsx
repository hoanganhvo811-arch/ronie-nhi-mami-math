// src/features/splash/SplashScreen.tsx
// Màn hình khởi động (Splash Screen) hoạt ảnh Ronie đu tơ nhện & Nữ hoàng chào đón

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Volume2 } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [isSwungIn, setIsSwungIn] = useState<boolean>(false);
  const [showQueenGreeting, setShowQueenGreeting] = useState<boolean>(false);

  useEffect(() => {
    // 1. Hoạt ảnh Ronie đu tơ nhện từ trên cao xuống
    const swingTimer = setTimeout(() => {
      setIsSwungIn(true);
      soundManager.playWebShoot();
    }, 400);

    // 2. Nữ hoàng Nhi Mami cất lời chào đón
    const queenTimer = setTimeout(() => {
      setShowQueenGreeting(true);
      soundManager.playCorrect();
    }, 1100);

    return () => {
      clearTimeout(swingTimer);
      clearTimeout(queenTimer);
    };
  }, []);

  const handleStartGame = () => {
    soundManager.playTap();
    soundManager.playCelebration();
    onStart();
  };

  const handleReadGreeting = () => {
    soundManager.playTap();
    soundManager.speakVietnamese('Chào mừng bé đến với Vương Quốc Toán Học cùng Ronie và Nữ hoàng Nhi Mami!');
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-6 md:p-10 bg-gradient-to-b from-sky-300 via-pink-200 to-amber-100 overflow-hidden select-none">
      {/* CÁC ĐÁM MÂY PASTEL TRÔI LƠ LỬNG */}
      <div className="absolute top-8 left-12 text-6xl opacity-70 animate-pulse pointer-events-none">☁️</div>
      <div className="absolute top-24 right-16 text-7xl opacity-60 pointer-events-none">☁️</div>
      <div className="absolute bottom-32 left-10 text-5xl opacity-50 pointer-events-none">✨</div>
      <div className="absolute bottom-40 right-12 text-6xl opacity-50 pointer-events-none">🌸</div>

      {/* DÂY TƠ NHỆN TỪ ĐỈNH MÀN HÌNH */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-white via-amber-200 to-rose-400 shadow-md transition-all duration-1000 ease-out origin-top ${
          isSwungIn ? 'h-44 md:h-52' : 'h-0'
        }`}
      />

      {/* TOP: HUY HIỆU GIÁO DỤC */}
      <div className="z-10 flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-md border-2 border-amber-300">
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
        <span className="font-comic font-black text-xs md:text-sm text-slate-800 tracking-wide">
          BỘ GIÁO DỤC & ĐÀO TẠO • TOÁN LỚP 1 (GDPT 2018)
        </span>
      </div>

      {/* KHU VỰC TRUNG TÂM: LOGO & HOẠT ẢNH NHÂN VẬT */}
      <div className="flex flex-col items-center text-center my-auto z-10 w-full max-w-3xl">
        {/* LOGO CHÍNH THỨC */}
        <div className="animate-scaleUp">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-rose-500 to-amber-400 text-white font-black text-xs md:text-sm rounded-full shadow-md mb-2">
            ⭐ GAME PHIÊU LƯU GIÁO DỤC THIẾU NHI ⭐
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-comic tracking-tight drop-shadow-md">
            <span className="text-rose-500 drop-shadow-[0_4px_6px_rgba(225,29,72,0.3)]">RONIE</span>{' '}
            <span className="text-amber-500">&</span>{' '}
            <span className="text-purple-600 drop-shadow-[0_4px_6px_rgba(147,51,234,0.3)]">NHI MAMI</span>
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-600 tracking-wider font-comic mt-1 drop-shadow-sm">
            VƯƠNG QUỐC TOÁN HỌC
          </h2>
        </div>

        {/* KHU VỰC HOẠT ẢNH: RONIE ĐU TƠ XUỐNG & NỮ HOÀNG ĐÓN CHÀO */}
        <div className="flex items-end justify-center gap-6 sm:gap-16 my-6 min-h-[180px]">
          {/* RONIE ĐU TƠ XUỐNG */}
          <div
            className={`flex flex-col items-center transition-all duration-1000 ease-out transform ${
              isSwungIn ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-48 opacity-0 scale-75'
            }`}
          >
            <div className="relative">
              <RonieAvatar size="xl" state={isSwungIn ? 'celebrating' : 'jumping'} variant="photo" />
              <div className="text-2xl absolute -top-3 -right-2 animate-bounce">🕸️</div>
            </div>
            <span className="mt-2 px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full shadow-md">
              Hiệp Sĩ Ronie
            </span>
          </div>

          {/* NỮ HOÀNG NHI MAMI CHÀO ĐÓN */}
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out transform ${
              showQueenGreeting ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
            }`}
          >
            <QueenNhiMamiAvatar size="xl" speaking={showQueenGreeting} variant="photo" />
            <span className="mt-2 px-3 py-1 bg-purple-600 text-white font-black text-xs rounded-full shadow-md">
              Nữ Hoàng Nhi Mami
            </span>
          </div>
        </div>

        {/* LỜI CHÀO MỪNG CỦA NỮ HOÀNG */}
        {showQueenGreeting && (
          <div className="relative bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-3xl border-3 border-amber-300 shadow-xl max-w-lg mx-auto animate-fadeIn flex items-center gap-3">
            <p className="text-sm md:text-base font-bold text-slate-800 leading-snug">
              👑 "Chào mừng con yêu đến với Vương Quốc Toán Học! Hãy cùng mẹ khám phá nhé!"
            </p>
            <button
              type="button"
              onClick={handleReadGreeting}
              className="p-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl shadow-sm transition-all active:scale-90 flex-shrink-0 cursor-pointer"
              title="Nghe lời chào"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* FOOTER: NÚT BẮT ĐẦU TO LỚN, 3D CUTE JELLY BUTTON */}
      <footer className="w-full max-w-md flex flex-col items-center gap-3 z-10 mb-2">
        <button
          type="button"
          onClick={handleStartGame}
          className="w-full py-5 px-10 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 text-white font-comic font-black text-2xl md:text-3xl rounded-3xl border-4 border-white shadow-[0_12px_24px_rgba(16,185,129,0.4)] flex items-center justify-center gap-4 cursor-pointer transform active:scale-95 transition-all animate-bounce"
        >
          <Play className="w-9 h-9 fill-white drop-shadow-md" />
          <span>BẮT ĐẦU PHIÊU LƯU!</span>
        </button>

        <span className="text-xs font-bold text-slate-600">
          Chạm vào màn hình để cùng Ronie mở cánh cổng lâu đài ✨
        </span>
      </footer>
    </div>
  );
};
