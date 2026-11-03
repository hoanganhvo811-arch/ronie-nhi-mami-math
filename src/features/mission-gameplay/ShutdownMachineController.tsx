// src/features/mission-gameplay/ShutdownMachineController.tsx
// Trực quan hóa Gameplay 5: Tắt cỗ máy kẹo quá tải (SHUTDOWN_MACHINE)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface ShutdownMachineControllerProps {
  runState: IMissionRunState;
}

export const ShutdownMachineController: React.FC<ShutdownMachineControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Năng lượng quá tải của cỗ máy: progress 0% thì nhiệt lượng 100%, progress 100% thì nhiệt lượng về 0% (an toàn)
  const heatPercent = Math.max(0, 100 - progress);
  const isCooledDown = heatPercent === 0;

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-indigo-950 border-4 border-cyan-400 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* NỀN ĐỒ HỌA: NHÀ XƯỞNG BÁNH KẸO VỚI BÁNH RĂNG VÀ ĐỒNG HỒ */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Bánh răng lớn */}
          <circle cx="80" cy="50" r="35" stroke="#38BDF8" strokeWidth="6" strokeDasharray="10 6" fill="none" />
          <circle cx="320" cy="60" r="45" stroke="#F472B6" strokeWidth="8" strokeDasharray="12 8" fill="none" />
          {/* Đường ống dẫn kẹo */}
          <path d="M 0,30 L 400,30" stroke="#64748B" strokeWidth="10" fill="none" />
          <path d="M 200,30 L 200,90" stroke="#64748B" strokeWidth="8" fill="none" />
        </svg>
      </div>

      {/* TOP: ĐỒNG HỒ ÁP SUẤT NHIỆT LƯỢNG */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-400/40 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🌡️ Áp suất nhiệt lượng máy:</span>
          <span
            className={`text-sm ${
              heatPercent > 50
                ? 'text-rose-400 animate-pulse'
                : heatPercent > 20
                ? 'text-amber-300'
                : 'text-emerald-300'
            }`}
          >
            {Math.round(heatPercent)}%
          </span>
        </span>
        <span className="text-emerald-300">
          {isCooledDown ? '🎉 MÁY ĐÃ DỪNG AN TOÀN!' : `Cần xả thêm ${Math.round(heatPercent)}% nhiệt`}
        </span>
      </div>

      {/* SÂN KHẤU: RONIE GẠT CẦN XẢ BÊN TRÁI, CỖ MÁY Ở GIỮA, PHÙ THỦY KẸO BÊN PHẢI */}
      <div className="relative flex-1 w-full flex items-center justify-between px-4 sm:px-10">
        {/* RONIE VỚI CẦN GẠT HÃM PHANH */}
        <div className="z-20 flex flex-col items-center">
          <div className="relative">
            <RonieAvatar size="md" state={ronieAnimState} variant="photo" />
            {/* CẦN GẠT VAN XẢ */}
            <div
              className={`absolute -bottom-1 -right-4 w-3 h-10 bg-amber-400 rounded-full border-2 border-amber-200 origin-bottom transition-transform duration-300 ${
                ronieAnimState === 'pull' ? 'rotate-45' : 'rotate-12'
              }`}
            >
              <div className="w-5 h-5 bg-rose-500 rounded-full -top-2 -left-1 absolute shadow-md" />
            </div>
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-1">
            Ronie Gạt Cần
          </span>
        </div>

        {/* CỖ MÁY KẸO TRUNG TÂM */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Khói xả khi máy còn nóng */}
          {!isCooledDown && (
            <div className="absolute -top-7 flex gap-2 animate-bounce">
              <span className="text-xl">💨</span>
              <span className="text-base">🍬</span>
              <span className="text-xl">💨</span>
            </div>
          )}

          {/* KHUNG THÂN MÁY */}
          <div
            className={`w-36 h-28 sm:w-44 sm:h-32 rounded-2xl border-4 transition-all duration-700 flex flex-col items-center justify-between p-2 shadow-2xl ${
              isCooledDown
                ? 'bg-slate-800 border-emerald-400 shadow-emerald-400/40'
                : 'bg-gradient-to-t from-rose-950 via-slate-800 to-rose-900 border-rose-500 shadow-rose-500/40'
            }`}
          >
            {/* ĐÈN CẢNH BÁO */}
            <div className="flex items-center justify-between w-full px-2">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isCooledDown
                    ? 'bg-emerald-400 shadow-emerald-400/80 shadow-md'
                    : 'bg-rose-500 animate-ping shadow-rose-500 shadow-md'
                }`}
              />
              <span className="font-comic font-black text-[10px] text-cyan-200">
                {isCooledDown ? 'ĐÃ NGUỘI ❄️' : 'QUÁ TẢI 🔥'}
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isCooledDown
                    ? 'bg-emerald-400 shadow-emerald-400/80 shadow-md'
                    : 'bg-rose-500 animate-ping shadow-rose-500 shadow-md'
                }`}
              />
            </div>

            {/* ĐỒNG HỒ ĐO ÁP SUẤT GIỮA MÁY */}
            <div className="w-16 h-16 rounded-full bg-slate-900 border-3 border-amber-300 flex items-center justify-center relative shadow-inner">
              <div
                className="w-1 h-6 bg-rose-500 origin-bottom transition-transform duration-700"
                style={{ transform: `rotate(${-90 + (heatPercent / 100) * 180}deg)` }}
              />
              <div className="w-3 h-3 bg-amber-300 rounded-full absolute" />
            </div>

            {/* THANH ÁP SUẤT */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/20">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  heatPercent > 50
                    ? 'bg-gradient-to-r from-amber-400 to-rose-600'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                }`}
                style={{ width: `${heatPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* PHÙ THỦY KẸO BÊN PHẢI */}
        <div className="z-20 flex flex-col items-center">
          <div className="relative">
            <NPCAvatar npcId="candy_witch" size="md" />
            {isCooledDown && (
              <span className="absolute -top-3 -right-2 text-xl animate-bounce">🍭</span>
            )}
          </div>
          <span className="px-2 py-0.5 bg-purple-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-1">
            Phù Thủy Kẹo
          </span>
        </div>
      </div>

      {/* THÔNG BÁO HÀNH ĐỘNG THỜI GIAN THỰC */}
      {actionFeedback && (
        <div className="z-20 self-center px-4 py-1.5 bg-slate-900/90 text-white font-comic font-black text-xs rounded-full border border-cyan-400 shadow-lg animate-bounce">
          {actionFeedback.text}
        </div>
      )}
    </div>
  );
};
