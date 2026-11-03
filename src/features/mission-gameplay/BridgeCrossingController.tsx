// src/features/mission-gameplay/BridgeCrossingController.tsx
// Trực quan hóa Gameplay 3: Vượt cầu đá kỳ diệu qua sông Cầu Vồng

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface BridgeCrossingControllerProps {
  runState: IMissionRunState;
}

export const BridgeCrossingController: React.FC<BridgeCrossingControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Tổng số viên đá vượt sông (ví dụ 4 viên tương ứng 25%, 50%, 75%, 100%)
  const totalStones = 4;
  // Số viên đá đã được kích hoạt / nổi lên
  const activeStoneCount = Math.floor(progress / 25);

  // Vị trí ngang của Ronie theo số viên đá đã bước:
  // 0% -> Bờ trái (10%), 25% -> Đá 1 (28%), 50% -> Đá 2 (46%), 75% -> Đá 3 (64%), 100% -> Bờ phải (82%)
  const ronieLeftPercent = 10 + (progress / 100) * 72;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-900 via-sky-900 to-teal-950 border-4 border-pink-400 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* NỀN ĐỒ HỌA: DÒNG SÔNG MA THUẬT & CẦU VỒNG */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Vòm Cầu Vồng phía xa */}
          <path d="M 50,160 A 150,120 0 0,1 350,160" stroke="#EC4899" strokeWidth="8" fill="none" opacity="0.3" />
          <path d="M 60,160 A 140,110 0 0,1 340,160" stroke="#FBBF24" strokeWidth="8" fill="none" opacity="0.3" />
          <path d="M 70,160 A 130,100 0 0,1 330,160" stroke="#38BDF8" strokeWidth="8" fill="none" opacity="0.3" />
          {/* Bờ sông bên trái */}
          <ellipse cx="40" cy="180" rx="60" ry="30" fill="#047857" />
          {/* Bờ sông bên phải */}
          <ellipse cx="360" cy="180" rx="60" ry="30" fill="#047857" />
          {/* Làn sóng sông lấp lánh */}
          <path d="M 0,180 Q 100,165 200,180 T 400,180" stroke="#38BDF8" strokeWidth="3" fill="none" opacity="0.6" />
          <path d="M 0,190 Q 100,175 200,190 T 400,190" stroke="#818CF8" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
      </div>

      {/* TOP: THƯỚC ĐO TIẾN ĐỘ QUA SÔNG */}
      <div className="z-10 flex items-center justify-between bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-300/40 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🌈 Khoảng cách qua sông:</span>
          <span className="text-pink-300 text-sm">{Math.round(progress)}%</span>
        </span>
        <span className="text-emerald-300">
          {progress >= 100 ? '🎉 ĐÃ QUA BỜ BÊN KIA!' : `Còn ${totalStones - activeStoneCount} bước đá nữa`}
        </span>
      </div>

      {/* SÂN DIỄN HOẠT: DÒNG SÔNG, CÁC VIÊN ĐÁ MA THUẬT, RONIE & THỎ TRẮNG */}
      <div className="relative flex-1 w-full flex items-center">
        {/* BỜ BÊN TRÁI (XUẤT PHÁT) */}
        <div className="absolute left-3 bottom-4 z-10 flex flex-col items-center">
          <div className="w-16 h-8 bg-emerald-700 rounded-full border-2 border-emerald-400 flex items-center justify-center shadow-lg">
            <span className="text-[10px] text-white font-comic font-black">Bờ Tây</span>
          </div>
        </div>

        {/* CÁC VIÊN ĐÁ MA THUẬT NỔI GIỮA DÒNG SÔNG */}
        <div className="absolute inset-x-20 bottom-6 flex justify-around items-center z-10">
          {[1, 2, 3, 4].map((step) => {
            const isEmerged = activeStoneCount >= step;
            return (
              <div
                key={step}
                className={`transition-all duration-500 flex flex-col items-center ${
                  isEmerged
                    ? 'translate-y-0 opacity-100 scale-105'
                    : 'translate-y-6 opacity-30 scale-75'
                }`}
              >
                <div
                  className={`w-12 h-10 sm:w-14 sm:h-12 rounded-2xl flex items-center justify-center border-3 shadow-xl transition-all ${
                    isEmerged
                      ? 'bg-gradient-to-t from-pink-500 to-rose-300 border-white text-white shadow-pink-500/50 animate-bounce'
                      : 'bg-slate-700 border-slate-500 text-slate-400'
                  }`}
                  style={{ animationDuration: `${2 + step * 0.2}s` }}
                >
                  <span className="text-sm font-comic font-black">
                    {isEmerged ? '⭐' : `?`}
                  </span>
                </div>
                <span className="text-[9px] font-comic font-black text-amber-200 mt-1">
                  Đá {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* BỜ BÊN PHẢI (ĐÍCH ĐẾN) VỚI THỎ CON ĐANG CỔ VŨ */}
        <div className="absolute right-3 bottom-4 z-20 flex flex-col items-center">
          <div className="relative">
            <NPCAvatar npcId="rabbit" size="sm" />
            <span className="absolute -top-3 -right-2 text-base animate-bounce">🥕</span>
          </div>
          <span className="px-2 py-0.5 bg-pink-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-0.5">
            Thỏ Trắng
          </span>
        </div>

        {/* HIỆP SĨ RONIE NHẢY QUA TỪNG VIÊN ĐÁ */}
        <div
          className="absolute bottom-8 z-30 transition-all duration-700 ease-out flex flex-col items-center"
          style={{ left: `${ronieLeftPercent}%` }}
        >
          <div className="relative">
            <RonieAvatar size="md" state={ronieAnimState} variant="photo" />
            {ronieAnimState === 'jump' && (
              <span className="absolute -top-4 -right-2 text-xl animate-ping">✨</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-0.5">
            Ronie
          </span>
        </div>
      </div>

      {/* THÔNG BÁO HÀNH ĐỘNG THỜI GIAN THỰC */}
      {actionFeedback && (
        <div className="z-20 self-center px-4 py-1.5 bg-slate-900/90 text-white font-comic font-black text-xs rounded-full border border-pink-300 shadow-lg animate-bounce">
          {actionFeedback.text}
        </div>
      )}
    </div>
  );
};
