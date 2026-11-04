// src/features/mission-gameplay/RocketLaunchController.tsx
// Trực quan hóa Gameplay 5: Phóng Tên Lửa Toán Học Bay Vào Vũ Trụ (Rocket Launch)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface RocketLaunchControllerProps {
  runState: IMissionRunState;
}

export const RocketLaunchController: React.FC<RocketLaunchControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Tính vị trí tên lửa: progress < 100 tên lửa nạp nhiên liệu ở bệ phóng, progress >= 100 bay vút lên bầu trời
  const isLaunched = progress >= 100;
  const rocketBottomPercent = isLaunched ? 70 : 15 + (progress / 100) * 15;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* BẦU TRỜI ĐÊM HUYỀN ẢO & ÁNH SAO */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-4 left-10 text-xl animate-ping">✨</div>
        <div className="absolute top-10 right-16 text-2xl animate-pulse">⭐</div>
        <div className="absolute top-20 left-1/3 text-lg">🌟</div>
        <div className="absolute top-6 right-1/3 text-3xl animate-bounce">🪐</div>
        <div className="absolute top-14 left-16 text-4xl opacity-70">🌙</div>
      </div>

      {/* TOP: THANH THÔNG TIN NHIÊN LIỆU PHÓNG */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🚀 Nhiên liệu tên lửa:</span>
          <span className="text-amber-300 text-sm">{Math.round(progress)}%</span>
        </span>
        <span className="text-emerald-300">
          {isLaunched ? '🎉 ĐÃ PHÓNG VÀO VŨ TRỤ!' : `Cần thêm ${100 - Math.round(progress)}% để phóng`}
        </span>
      </div>

      {/* KHU VỰC BỆ PHÓNG VÀ TÊN LỬA */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        {/* BỆ PHÓNG BÊN DƯỚI */}
        <div className="absolute bottom-2 w-48 h-6 bg-slate-800 rounded-t-xl border-t-2 border-slate-600 flex items-center justify-around z-10 shadow-lg">
          <div className="w-3 h-full bg-amber-400/40" />
          <div className="w-3 h-full bg-amber-400/40" />
          <div className="w-3 h-full bg-amber-400/40" />
        </div>

        {/* CỘT ĐIỀU KHIỂN & RONIE PHI HÀNH GIA */}
        <div className="absolute bottom-4 left-6 sm:left-14 z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="md" state={ronieAnimState} variant="photo" />
          </div>
          <span className="px-2 py-0.5 bg-indigo-600 text-white font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            Chỉ Huy Ronie
          </span>
        </div>

        {/* CHIẾC TÊN LỬA HOÀNG GIA */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ease-out flex flex-col items-center ${
            isLaunched ? 'animate-bounce' : ''
          }`}
          style={{ bottom: `${rocketBottomPercent}%` }}
        >
          {/* ĐẦU TÊN LỬA */}
          <div className="w-16 h-28 sm:w-20 sm:h-32 relative flex flex-col items-center">
            {/* Chóp tên lửa */}
            <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[40px] border-b-rose-500" />

            {/* Thân tên lửa */}
            <div className="w-16 sm:w-20 flex-1 bg-gradient-to-r from-slate-100 via-white to-slate-200 border-x-2 border-slate-300 flex flex-col items-center justify-center relative shadow-md">
              {/* Cửa sổ phi thuyền */}
              <div className="w-7 h-7 rounded-full bg-sky-400 border-2 border-amber-400 flex items-center justify-center shadow-inner">
                <span className="text-xs">🧑‍🚀</span>
              </div>
              <span className="text-[9px] font-comic font-black text-rose-600 mt-1">RONIE 1</span>
            </div>

            {/* Cánh đuôi tên lửa */}
            <div className="w-24 sm:w-28 flex justify-between absolute bottom-0">
              <div className="w-4 h-8 bg-rose-600 -skew-x-12 rounded-bl-lg" />
              <div className="w-4 h-8 bg-rose-600 skew-x-12 rounded-br-lg" />
            </div>

            {/* LỬA PHÓNG KHI ĐẠT TIẾN TRÌNH HOẶC HOÀN THÀNH */}
            <div
              className={`transition-all duration-500 ${
                progress > 50 || isLaunched ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <span className="text-2xl animate-pulse">🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER: PHẢN HỒI HÀNH ĐỘNG CỦA GAMEPLAY */}
      <div className="z-10 flex items-center justify-between text-xs font-comic font-bold text-white/90">
        <div className="flex items-center gap-1.5 truncate max-w-[80%]">
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
              Giải đúng câu đố toán học để nạp nhiên liệu sao phóng tên lửa!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
