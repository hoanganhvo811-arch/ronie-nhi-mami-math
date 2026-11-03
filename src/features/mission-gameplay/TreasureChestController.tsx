// src/features/mission-gameplay/TreasureChestController.tsx
// Trực quan hóa Gameplay 4: Mở rương kho báu hoàng gia (TREASURE_CHEST)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface TreasureChestControllerProps {
  runState: IMissionRunState;
}

export const TreasureChestController: React.FC<TreasureChestControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // 4 ổ khóa phong ấn rương
  const totalLocks = 4;
  const unlockedLocks = Math.min(4, Math.floor(progress / 25));
  const isChestFullyOpened = progress >= 100;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-purple-950 via-slate-900 to-amber-950 border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* NỀN ĐỒ HỌA: HANG KHO BÁU HUYỀN BÍ & ÁNH VÀNG */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Nhũ đá hang động trên trần */}
          <polygon points="40,0 60,40 80,0" fill="#4C1D95" />
          <polygon points="120,0 145,50 170,0" fill="#4C1D95" />
          <polygon points="260,0 280,45 300,0" fill="#4C1D95" />
          <polygon points="340,0 360,35 380,0" fill="#4C1D95" />
          {/* Đống vàng dưới sàn hang */}
          <ellipse cx="200" cy="190" rx="140" ry="25" fill="#D97706" />
        </svg>
      </div>

      {/* TOP: THƯỚC ĐO TIẾN TRÌNH MỞ KHÓA */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/40 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🗝️ Ổ khóa đã mở:</span>
          <span className="text-amber-300 text-sm">
            {unlockedLocks} / {totalLocks}
          </span>
        </span>
        <span className="text-emerald-300">
          {isChestFullyOpened ? '💎 RƯƠNG BÁU ĐÃ MỞ BUNG!' : `Còn ${totalLocks - unlockedLocks} ổ khóa nữa`}
        </span>
      </div>

      {/* SÂN KHẤU CHÍNH: RONIE BÊN TRÁI, RƯƠNG Ở GIỮA, RỒNG CON BÊN PHẢI */}
      <div className="relative flex-1 w-full flex items-center justify-between px-4 sm:px-10">
        {/* RONIE BÊN TRÁI */}
        <div className="z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="md" state={ronieAnimState} variant="photo" />
            {ronieAnimState === 'celebrate' && (
              <span className="absolute -top-3 -right-2 text-xl animate-spin">🔑</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-1">
            Ronie Mở Khóa
          </span>
        </div>

        {/* CHIẾC RƯƠNG BÁU HOÀNG GIA & CÁC Ổ KHÓA MA THUẬT */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Ánh sáng tỏa ra khi mở rương hoàn toàn */}
          {isChestFullyOpened && (
            <div className="absolute -inset-10 bg-amber-400/20 blur-2xl rounded-full animate-pulse pointer-events-none" />
          )}

          {/* HÌNH DÁNG RƯƠNG BÁU HOÀNG GIA */}
          <div
            className={`relative w-36 h-28 sm:w-44 sm:h-32 rounded-2xl border-4 transition-all duration-700 flex flex-col items-center justify-center shadow-2xl ${
              isChestFullyOpened
                ? 'bg-gradient-to-t from-amber-600 via-yellow-400 to-amber-200 border-amber-200 scale-110 shadow-amber-400/60'
                : 'bg-gradient-to-t from-amber-950 via-amber-900 to-amber-800 border-amber-500'
            }`}
          >
            {/* NẮP RƯƠNG */}
            <div
              className={`w-full h-8 bg-amber-800 border-b-4 border-amber-600 rounded-t-xl flex items-center justify-center transition-transform ${
                isChestFullyOpened ? '-translate-y-3 rotate-[-6deg]' : ''
              }`}
            >
              <div className="w-12 h-2 bg-amber-300 rounded-full" />
            </div>

            {/* THÂN RƯƠNG & CHÂU BÁU */}
            <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
              {isChestFullyOpened ? (
                <div className="flex flex-col items-center animate-bounce">
                  <span className="text-4xl">👑</span>
                  <span className="text-[10px] font-comic font-black text-amber-950 bg-amber-200 px-2 rounded-full">
                    KHO BÁU ĐÃ MỞ!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-2xl">📦</span>
                </div>
              )}
            </div>

            {/* 4 Ổ KHÓA TREO PHÍA TRƯỚC RƯƠNG */}
            <div className="absolute -bottom-3 flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4].map((lockIndex) => {
                const isUnlocked = unlockedLocks >= lockIndex;
                return (
                  <div
                    key={lockIndex}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 shadow-md transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-emerald-500 border-emerald-200 text-white scale-110 animate-pulse'
                        : 'bg-slate-800 border-amber-400 text-amber-300'
                    }`}
                  >
                    <span className="text-xs">{isUnlocked ? '🔓' : '🔒'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BẠN RỒNG CON HẠT DẺ BÊN PHẢI */}
        <div className="z-20 flex flex-col items-center">
          <div className="relative">
            <NPCAvatar npcId="dragon" size="md" />
            {isChestFullyOpened && (
              <span className="absolute -top-3 -right-2 text-xl animate-bounce">✨</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-emerald-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-1">
            Rồng Con Hạt Dẻ
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
