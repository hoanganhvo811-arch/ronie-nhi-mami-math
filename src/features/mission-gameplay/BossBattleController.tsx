// src/features/mission-gameplay/BossBattleController.tsx
// Trực quan hóa Gameplay 8: Đấu Trùm Cuối Quái Vật Tinh Nghịch (Boss Battle)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface BossBattleControllerProps {
  runState: IMissionRunState;
}

export const BossBattleController: React.FC<BossBattleControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, secondaryAnimState, actionFeedback, mistakesCount } = runState;

  // Thanh máu của Boss: 100% máu ban đầu, giảm dần theo tiến trình của Ronie (Boss HP = 100 - progress)
  const bossHpPercent = Math.max(0, 100 - progress);
  const isBossDefeated = bossHpPercent <= 0;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-rose-950 to-slate-950 border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* SÂN ĐẤU HOÀNG GIA: ÁNH SÁNG VÀ TIA SÉT HOẠT HÌNH */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Vòng tròn ma thuật sân đấu */}
          <ellipse cx="200" cy="160" rx="160" ry="35" fill="#7C3AED" opacity="0.3" />
          <line x1="200" y1="0" x2="200" y2="200" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 6" opacity="0.3" />
        </svg>
      </div>

      {/* TOP: THANH ĐO MÁU CỦA TRÙM VÀ RONIE */}
      <div className="z-10 flex items-center justify-between gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-white font-comic text-xs">
        {/* THANH MÁU RONIE */}
        <div className="flex items-center gap-1.5 flex-1 max-w-[40%]">
          <span className="font-black text-rose-400 text-xs">Ronie:</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <span key={idx} className="text-sm">
                {idx < 3 - mistakesCount ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
        </div>

        {/* VS ICON */}
        <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black rounded-full text-[10px] shadow-sm">
          VS
        </span>

        {/* THANH MÁU TRÙM CUỐI */}
        <div className="flex items-center gap-1.5 flex-1 max-w-[45%] justify-end">
          <span className="font-black text-amber-300 text-xs truncate">Trùm Bánh Quy:</span>
          <div className="w-20 sm:w-28 h-3.5 bg-slate-800 rounded-full border border-amber-400/80 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${bossHpPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-amber-300 font-black">{Math.round(bossHpPercent)}%</span>
        </div>
      </div>

      {/* KHU VỰC ĐẤU TRƯỜNG: RONIE BÊN TRÁI VS BOSS BÊN PHẢI */}
      <div className="relative flex-1 w-full flex items-center justify-between px-6 sm:px-16">
        {/* HIỆP SĨ RONIE BÊN TRÁI */}
        <div className="z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="lg" state={ronieAnimState} variant="photo" />
            {ronieAnimState === 'attack' && (
              <span className="absolute -top-3 -right-4 text-3xl animate-ping">⚡</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            Hiệp Sĩ Ronie
          </span>
        </div>

        {/* HIỆU ỨNG CHIÊU THỨC TIA SÁNG Ở GIỮA */}
        <div className="z-15 flex flex-col items-center">
          {ronieAnimState === 'attack' && (
            <div className="flex items-center gap-1 animate-pulse">
              <span className="text-2xl animate-spin">🌟</span>
              <span className="text-3xl text-amber-300 font-comic font-black">💥 BÙM!</span>
              <span className="text-2xl animate-bounce">⚡</span>
            </div>
          )}
        </div>

        {/* TRÙM CUỐI BÊN PHẢI (QUÁI VẬT BÁNH QUY HOẠT HÌNH) */}
        <div className="z-20 flex flex-col items-center">
          <div className={`relative transition-all duration-500 ${isBossDefeated ? 'opacity-80 scale-90' : ''}`}>
            <NPCAvatar npcId="cookie_monster" size="lg" />
            {isBossDefeated ? (
              <span className="absolute -top-4 -right-2 text-3xl animate-bounce">🏳️</span>
            ) : secondaryAnimState === 'pushed_back' ? (
              <span className="absolute -top-3 -left-3 text-2xl animate-ping">💫</span>
            ) : null}
          </div>
          <span className="px-2 py-0.5 bg-amber-500 text-amber-950 font-comic font-black text-[10px] rounded-full shadow-md mt-1">
            {isBossDefeated ? '🤝 Bạn Quái Vật' : 'Quái Vật Bánh Quy'}
          </span>
        </div>
      </div>

      {/* FOOTER: PHẢN HỒI HÀNH ĐỘNG */}
      <div className="z-10 flex items-center justify-between text-xs font-comic font-bold text-white/90">
        <div className="flex items-center gap-1.5 truncate max-w-[85%]">
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
              Giải đúng câu đố toán học để Ronie tung chiêu thức Sao Băng đẩy lùi Boss!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
