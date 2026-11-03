// src/features/rewards/RewardModal.tsx
// Màn hình vinh danh chiến thắng & trao thưởng 3 Sao từ Nữ hoàng Nhi Mami

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Award, ChevronRight, Home } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface RewardModalProps {
  stars: number;
  score: number;
  zoneTitle: string;
  onNextStage: () => void;
  onReturnToMap: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  stars,
  score,
  zoneTitle,
  onNextStage,
  onReturnToMap,
}) => {
  useEffect(() => {
    // Kích hoạt pháo hoa giấy rực rỡ
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: number = window.setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.4 + 0.1 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#8B5CF6'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleNextClick = () => {
    soundManager.playTap();
    onNextStage();
  };

  const handleReturnMapClick = () => {
    soundManager.playTap();
    onReturnToMap();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl border-4 border-amber-400 p-6 md:p-8 flex flex-col items-center text-center shadow-2xl animate-scaleUp">
        {/* HUY HIỆU ĐỈNH ĐẦU */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-white shadow-xl flex items-center justify-center -mt-14 mb-2">
          <Award className="w-10 h-10 text-amber-900" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-amber-300 font-comic tracking-wide">
          XUẤT SẮC QUÁ!
        </h2>
        <div className="text-xs md:text-sm font-bold text-cyan-300 uppercase tracking-widest mt-1">
          ĐÃ HOÀN THÀNH {zoneTitle}
        </div>

        {/* 3 NGÔI SAO VINH DANH */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-12 h-12 transition-all ${
                starIdx <= stars
                  ? 'fill-amber-400 text-amber-300 animate-bounce'
                  : 'fill-slate-700 text-slate-600'
              }`}
              style={{ animationDelay: `${starIdx * 200}ms` }}
            />
          ))}
        </div>

        {/* HOẠT CẢNH RONIE VÀ NỮ HOÀNG ĂN MỪNG */}
        <div className="flex items-center justify-center gap-6 my-2 p-3 bg-slate-800/80 rounded-2xl border border-slate-700 w-full">
          <RonieAvatar size="md" state="celebrating" />
          <div className="text-3xl animate-bounce">💖</div>
          <QueenNhiMamiAvatar size="md" speaking={true} />
        </div>

        {/* LỜI KHEN NGỢI CỦA NỮ HOÀNG */}
        <div className="p-3 bg-amber-500/15 border border-amber-400/40 rounded-2xl text-amber-200 text-xs md:text-sm font-bold my-3 leading-relaxed">
          👑 <strong>Nữ hoàng Nhi Mami:</strong> "Ronie của mẹ hôm nay giải toán thật thông minh! Con xứng đáng nhận được những Ngôi Sao Tri Thức rực rỡ nhất!"
        </div>

        {/* ĐIỂM SỐ */}
        <div className="text-sm font-bold text-slate-300 mb-4">
          Điểm Thưởng Thao Tác: <span className="text-amber-400 text-lg font-black">{score}</span>
        </div>

        {/* NÚT ĐIỀU HƯỚNG */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            type="button"
            onClick={handleReturnMapClick}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm rounded-2xl border border-slate-600 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Về Bản Đồ</span>
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-sm rounded-2xl border-2 border-emerald-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Thử Thách Tiếp Theo</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
