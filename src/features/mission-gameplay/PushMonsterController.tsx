// src/features/mission-gameplay/PushMonsterController.tsx
// Trực quan hóa Gameplay 2: Đẩy lùi quái vật bánh quy bằng tơ sao hoàng kim

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface PushMonsterControllerProps {
  runState: IMissionRunState;
}

export const PushMonsterController: React.FC<PushMonsterControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Vị trí quái vật trên sàn đấu: progress 0% ở gần Ronie (35%), progress 100% bị đẩy ra xa (85%)
  const monsterLeftPercent = 40 + (progress / 100) * 45;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-800 via-orange-950 to-slate-950 border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* SÀN ĐẤU & VẠCH ĐÍCH */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          <line x1="50" y1="180" x2="350" y2="180" stroke="#FBBF24" strokeWidth="4" />
          <line x1="180" y1="160" x2="180" y2="200" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="330" y1="150" x2="330" y2="200" stroke="#10B981" strokeWidth="6" />
        </svg>
      </div>

      {/* TOP: THƯỚC ĐO KHOẢNG CÁCH ĐẨY LÙI */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/40 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🍪 Khoảng cách đẩy lùi:</span>
          <span className="text-amber-300 text-sm">{Math.round(progress)}%</span>
        </span>
        <span className="text-emerald-300">
          {progress >= 100 ? '🎉 QUÁI VẬT ĐÃ BỎ CHẠY!' : `Đẩy thêm ${100 - Math.round(progress)}% nữa`}
        </span>
      </div>

      {/* SÂN ĐẤU TƯƠNG TÁC */}
      <div className="relative flex-1 w-full flex items-center">
        {/* RONIE Ở BÊN TRÁI */}
        <div className="absolute left-6 sm:left-12 z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="lg" state={ronieAnimState} variant="photo" />
            {ronieAnimState === 'attack' && (
              <span className="absolute -top-3 -right-3 text-2xl animate-ping">💥</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            Hiệp Sĩ Ronie
          </span>
        </div>

        {/* TIA TƠ SAO BẮN SANG PHẢI KHI TẤN CÔNG */}
        {ronieAnimState === 'attack' && (
          <div className="absolute left-28 sm:left-36 right-20 h-4 z-15 flex items-center animate-pulse">
            <div className="w-full h-2 bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-400 rounded-full shadow-lg" />
            <span className="text-xl -ml-2">⭐</span>
          </div>
        )}

        {/* QUÁI VẬT BÁNH QUY BÊN PHẢI (DI CHUYỂN THEO TIẾN TRÌNH) */}
        <div
          className="absolute z-20 transition-all duration-700 ease-out flex flex-col items-center"
          style={{ left: `${monsterLeftPercent}%` }}
        >
          <div className="relative">
            <NPCAvatar npcId="cookie_monster" size="lg" />
            {ronieAnimState === 'attack' && (
              <span className="absolute -top-3 -right-2 text-xl animate-bounce">🍪💨</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-purple-700 text-white font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            Quái Vật Bánh Quy
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
