// src/features/mission-gameplay/MissionPauseModal.tsx
// Modal Tạm Dừng Nhiệm vụ - Hỗ trợ Tiếp tục, Chơi lại và Trở về Lâu Đài Hoàng Gia

import React from 'react';
import { Play, RotateCcw, Castle, Compass } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';

interface MissionPauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRetry: () => void;
  onReturnToCastle: () => void;
  onReturnToMissions: () => void;
}

export const MissionPauseModal: React.FC<MissionPauseModalProps> = ({
  isOpen,
  onResume,
  onRetry,
  onReturnToCastle,
  onReturnToMissions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-sky-100 to-indigo-50 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* AVATAR RONIE ĐANG NGHỈ NGƠI */}
        <div className="-mt-14 mb-2">
          <RonieAvatar size="lg" state="idle" variant="photo" />
        </div>

        <h2 className="text-2xl font-comic font-black text-indigo-900 mb-1">
          ⏸️ TẠM DỪNG GAME
        </h2>
        <p className="text-xs font-comic font-bold text-slate-600 mb-5">
          Bé hãy uống một ngụm nước rồi chúng ta tiếp tục nhé!
        </p>

        {/* NÚT BẤM ĐIỀU HƯỚNG */}
        <div className="w-full flex flex-col gap-3">
          {/* TIẾP TỤC */}
          <button
            onClick={onResume}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-comic font-black rounded-2xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Tiếp Tục Chơi</span>
          </button>

          {/* CHƠI LẠI */}
          <button
            onClick={onRetry}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-amber-950 font-comic font-black rounded-2xl shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Từ Đầu</span>
          </button>

          {/* VỀ LÂU ĐÀI HOÀNG GIA (CRITERION 10) */}
          <button
            onClick={onReturnToCastle}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white font-comic font-black rounded-2xl shadow-md border-2 border-pink-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Castle className="w-4 h-4" />
            <span>Về Lâu Đài Hoàng Gia</span>
          </button>

          {/* CHỌN NHIỆM VỤ KHÁC */}
          <button
            onClick={onReturnToMissions}
            className="w-full py-2 px-4 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-700 font-comic font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Chọn Nhiệm Vụ Khác</span>
          </button>
        </div>
      </div>
    </div>
  );
};
