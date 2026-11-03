// src/features/mission-gameplay/MathRacingController.tsx
// Trực quan hóa Gameplay 6: Đua xe toán học siêu tốc (MATH_RACING)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface MathRacingControllerProps {
  runState: IMissionRunState;
}

export const MathRacingController: React.FC<MathRacingControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback, mistakesCount } = runState;

  // Vị trí của Xe Ronie trên đường đua (từ 10% đến 82%)
  const roniePositionPercent = 8 + (progress / 100) * 74;

  // Vị trí của Xe Robot (tiến lên theo số lần bé sai hoặc duy trì khoảng 45%)
  const robotPositionPercent = Math.min(78, 25 + mistakesCount * 15);

  const isRonieWinning = roniePositionPercent > robotPositionPercent;
  const isFinished = progress >= 100;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-rose-950 to-slate-950 border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* ĐƯỜNG ĐUA BẦU TRỜI & VẠCH ĐÍCH */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Làn 1 */}
          <line x1="20" y1="100" x2="380" y2="100" stroke="#FBBF24" strokeWidth="2" strokeDasharray="10 6" />
          {/* Làn 2 */}
          <line x1="20" y1="165" x2="380" y2="165" stroke="#FBBF24" strokeWidth="2" strokeDasharray="10 6" />
          {/* Cờ ca-rô vạch đích */}
          <line x1="365" y1="40" x2="365" y2="190" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* TOP: BẢNG TỐC ĐỘ VÀ KHOẢNG CÁCH */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/40 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🏎️ Quãng đường đua:</span>
          <span className="text-amber-300 text-sm">{Math.round(progress)}%</span>
        </span>
        <span className={isFinished ? 'text-emerald-300' : isRonieWinning ? 'text-amber-300' : 'text-rose-400'}>
          {isFinished ? '🏁 RONIE ĐÃ CÁN ĐÍCH ĐẦU TIÊN!' : isRonieWinning ? '⚡ Ronie đang dẫn đầu!' : '⚠️ Robot đang bám sát!'}
        </span>
      </div>

      {/* SÂN ĐUA 2 LÀN XE */}
      <div className="relative flex-1 w-full flex flex-col justify-around py-2">
        {/* LÀN 1: XE NHỆN CỦA RONIE */}
        <div className="relative w-full h-16 flex items-center">
          <div
            className="absolute z-20 transition-all duration-700 ease-out flex items-center gap-2"
            style={{ left: `${roniePositionPercent}%` }}
          >
            {/* Lửa phóng phản lực khi tăng tốc */}
            {ronieAnimState === 'run' && (
              <span className="text-2xl animate-pulse -mr-1">🔥💨</span>
            )}
            {/* XE ĐUA RONIE */}
            <div className="flex items-center bg-rose-600 border-2 border-amber-300 rounded-2xl px-2.5 py-1 shadow-xl">
              <RonieAvatar size="sm" state={ronieAnimState} variant="photo" />
              <div className="flex flex-col ml-1.5">
                <span className="text-[10px] text-white font-comic font-black leading-tight">
                  Spider-Kart
                </span>
                <span className="text-[8px] text-amber-200 font-comic font-bold">
                  Ronie #1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LÀN 2: XE CỦA ROBOT BÍP BÍP */}
        <div className="relative w-full h-16 flex items-center">
          <div
            className="absolute z-20 transition-all duration-700 ease-out flex items-center gap-2"
            style={{ left: `${robotPositionPercent}%` }}
          >
            {/* XE ĐUA ROBOT */}
            <div className="flex items-center bg-sky-700 border-2 border-sky-300 rounded-2xl px-2.5 py-1 shadow-xl">
              <NPCAvatar npcId="robot" size="sm" />
              <div className="flex flex-col ml-1.5">
                <span className="text-[10px] text-white font-comic font-black leading-tight">
                  Speed-Bot
                </span>
                <span className="text-[8px] text-sky-200 font-comic font-bold">
                  Bíp Bíp #2
                </span>
              </div>
            </div>
            {/* Hiệu ứng tia điện bíp bíp */}
            <span className="text-sm animate-bounce">⚡</span>
          </div>
        </div>

        {/* VẠCH ĐÍCH CHECKERED TẬN CÙNG BÊN PHẢI */}
        <div className="absolute right-3 top-4 bottom-4 w-8 border-l-4 border-dashed border-white flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-2xl animate-bounce">🏁</span>
          <span className="text-[9px] text-white font-comic font-black bg-black/60 px-1 rounded mt-1">
            ĐÍCH
          </span>
        </div>
      </div>

      {/* THÔNG BÁO HÀNH ĐỘNG THỜI GIAN THỰC */}
      {actionFeedback && (
        <div className="z-20 self-center px-4 py-1.5 bg-slate-900/90 text-white font-comic font-black text-xs rounded-full border border-amber-300 shadow-lg animate-bounce">
          {actionFeedback.text}
        </div>
      )}
    </div>
  );
};
