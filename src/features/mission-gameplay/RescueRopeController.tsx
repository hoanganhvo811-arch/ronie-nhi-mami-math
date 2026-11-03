// src/features/mission-gameplay/RescueRopeController.tsx
// Trực quan hóa Gameplay 1: Giải cứu cô bé khỏi vực sâu bằng dây tơ nhện

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface RescueRopeControllerProps {
  runState: IMissionRunState;
}

export const RescueRopeController: React.FC<RescueRopeControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Tính vị trí cô bé: progress 0% ở đáy vực (bottom 10%), progress 100% ở đỉnh vực (bottom 75%)
  const girlBottomPercent = 10 + (progress / 100) * 65;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-teal-800 to-slate-950 border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* NỀN ĐỒ HỌA: VÁCH ĐÁ & BẦU TRỜI */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Vách núi đá bên trái */}
          <polygon points="0,0 120,0 80,200 0,200" fill="#1E293B" />
          {/* Vách núi đá bên phải */}
          <polygon points="280,0 400,0 400,200 320,200" fill="#1E293B" />
          {/* Mây trời */}
          <circle cx="200" cy="30" r="15" fill="#FFFFFF" opacity="0.6" />
          <circle cx="220" cy="30" r="20" fill="#FFFFFF" opacity="0.6" />
        </svg>
      </div>

      {/* TOP: THƯỚC ĐO ĐỘ CAO */}
      <div className="z-10 flex items-center justify-between bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🧗 Độ cao giải cứu:</span>
          <span className="text-amber-300 text-sm">{Math.round(progress)}%</span>
        </span>
        <span className="text-emerald-300">
          {progress >= 100 ? '🎉 ĐÃ LÊN ĐỈNH VỰC!' : `Còn ${100 - Math.round(progress)}% nữa`}
        </span>
      </div>

      {/* KHU VỰC VỰC THẲM: RONIE Ở TRÊN & CÔ BÉ Ở DƯỚI */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        {/* RONIE TRÊN BỜ VỰC BÊN PHẢI */}
        <div className="absolute top-2 right-6 sm:right-16 z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="lg" state={ronieAnimState} variant="photo" />
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            Hiệp Sĩ Ronie
          </span>
        </div>

        {/* SỢI DÂY TƠ NHỆN NỐI TỪ RONIE XUỐNG CÔ BÉ */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
          <line
            x1="75%"
            y1="25%"
            x2="50%"
            y2={`${100 - girlBottomPercent}%`}
            stroke="#FDE047"
            strokeWidth="3.5"
            strokeDasharray={ronieAnimState === 'pull' ? '4 2' : 'none'}
            className={ronieAnimState === 'pull' ? 'animate-pulse' : ''}
          />
        </svg>

        {/* CÔ BÉ NƠ HỒNG ĐANG ĐƯỢC KÉO LÊN */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-out flex flex-col items-center"
          style={{ bottom: `${girlBottomPercent}%` }}
        >
          <div className="relative">
            <NPCAvatar npcId="rescued_girl" size="md" />
            {progress < 100 ? (
              <span className="absolute -top-3 -right-2 text-base animate-bounce">🆘</span>
            ) : (
              <span className="absolute -top-3 -right-2 text-base animate-spin">⭐</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-pink-500 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-0.5">
            Cô Bé Nơ Hồng
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
