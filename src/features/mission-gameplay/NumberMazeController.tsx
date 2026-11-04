// src/features/mission-gameplay/NumberMazeController.tsx
// Trực quan hóa Gameplay 7: Vượt Mê Cung Số Kỳ Diệu (Number Maze)

import React from 'react';
import { RonieAvatar } from '../character/RonieAvatar';
import type { IMissionRunState } from '../../mission-engine/types';

interface NumberMazeControllerProps {
  runState: IMissionRunState;
}

export const NumberMazeController: React.FC<NumberMazeControllerProps> = ({ runState }) => {
  const { progress, ronieAnimState, actionFeedback } = runState;

  // Tính vị trí bước đi của Ronie trong mê cung (5 trạm dừng chân tương ứng 0%, 25%, 50%, 75%, 100%)
  const stepIndex = Math.min(4, Math.floor((progress / 100) * 4) + (progress >= 100 ? 1 : 0));
  const isCompleted = progress >= 100;

  // Tọa độ các viên đá bước nhảy trong mê cung (dạng đường uốn lượn hình chữ S)
  const steps = [
    { x: '10%', y: '65%', label: 'Xuất phát' },
    { x: '30%', y: '35%', label: 'Cổng 1' },
    { x: '50%', y: '65%', label: 'Cổng 2' },
    { x: '70%', y: '35%', label: 'Cổng 3' },
    { x: '90%', y: '50%', label: 'Đích đến' },
  ];

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-teal-900 via-emerald-950 to-slate-950 border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* NỀN MÊ CUNG KHU RỪNG HUYỀN ẢO */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M 40,130 Q 120,50 200,130 T 360,100"
            fill="none"
            stroke="#34D399"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="6 8"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* TOP: THANH THÔNG TIN VƯỢT MÊ CUNG */}
      <div className="z-10 flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-comic font-black text-xs">
        <span className="flex items-center gap-1.5">
          <span>🌀 Mê cung số kỳ diệu:</span>
          <span className="text-emerald-300 text-sm">Chặng {stepIndex + 1} / 5</span>
        </span>
        <span className="text-amber-300">
          {isCompleted ? '🎉 ĐÃ THOÁT KHỎI MÊ CUNG!' : `Tiến trình: ${Math.round(progress)}%`}
        </span>
      </div>

      {/* KHU VỰC CÁC VIÊN ĐÁ BƯỚC NHẢY TRONG MÊ CUNG */}
      <div className="relative flex-1 w-full flex items-center">
        {/* ĐƯỜNG MÊ CUNG UỐN LƯỢN NỐI CÁC TRẠM */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <polyline
            points="40,130 120,70 200,130 280,70 360,100"
            fill="none"
            stroke="#FDE047"
            strokeWidth="4"
            strokeDasharray="8 4"
            className="animate-pulse"
          />
        </svg>

        {/* 5 VIÊN ĐÁ TRẠM DỪNG */}
        {steps.map((st, idx) => {
          const isPassed = idx <= stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className="absolute z-15 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: st.x, top: st.y }}
            >
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-comic font-black text-xs sm:text-sm shadow-lg transition-all duration-500 border-2 ${
                  isPassed
                    ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 border-white scale-110 shadow-amber-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-600'
                } ${isCurrent ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''}`}
              >
                {idx === 4 ? '🏁' : idx + 1}
              </div>
              <span className="text-[9px] font-comic font-bold text-white/80 mt-1 drop-shadow">
                {st.label}
              </span>
            </div>
          );
        })}

        {/* RONIE ĐANG ĐỨNG TẠI VỊ TRÍ BƯỚC HIỆN TẠI */}
        <div
          className="absolute z-25 -translate-x-1/2 -translate-y-full transition-all duration-700 ease-out flex flex-col items-center pointer-events-none"
          style={{
            left: steps[stepIndex].x,
            top: steps[stepIndex].y,
            marginTop: '-12px',
          }}
        >
          <div className="relative">
            <RonieAvatar size="sm" state={ronieAnimState} variant="photo" />
          </div>
          <span className="px-1.5 py-0.2 bg-rose-600 text-white font-comic font-black text-[9px] rounded-full shadow-md mt-0.5">
            Ronie
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
            <span className="text-emerald-200/80">
              Giải đúng câu đố toán học để dẫn lối cho bé Ronie vượt qua mê cung số!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
