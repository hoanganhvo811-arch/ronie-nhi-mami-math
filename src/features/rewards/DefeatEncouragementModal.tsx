// src/features/rewards/DefeatEncouragementModal.tsx
// Modal Động Viên An Ủi của Nữ hoàng khi Ronie gặp thử thách khó (Defeat Flow - Phase 5)

import React from 'react';
import { Heart, RotateCcw, Compass, Home, Volume2, ShieldCheck } from 'lucide-react';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';
import { RewardEngine } from './RewardEngine';

interface DefeatEncouragementModalProps {
  onRetry: () => void;
  onChooseEasier: () => void;
  onGoToToyRoom: () => void;
}

export const DefeatEncouragementModal: React.FC<DefeatEncouragementModalProps> = ({
  onRetry,
  onChooseEasier,
  onGoToToyRoom,
}) => {
  const comfortMessage = RewardEngine.getQueenComfortMessage();

  const handleSpeakComfort = () => {
    soundManager.playTap();
    soundManager.speakVietnamese(comfortMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-sky-50 via-pink-50 to-amber-50 rounded-3xl border-4 border-sky-400 p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* AVATAR NỮ HOÀNG VÀ RONIE */}
        <div className="-mt-14 mb-2 flex items-end justify-center gap-3">
          <QueenNhiMamiAvatar size="md" state="encouraging" variant="photo" />
          <RonieAvatar size="md" state="sad" variant="photo" />
        </div>

        {/* TIÊU ĐỀ ẤM ÁP */}
        <div className="flex items-center gap-1.5 text-sky-600 font-comic font-black text-xs uppercase tracking-widest mb-1">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Vòng Tay Ấm Áp Của Nữ Hoàng</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-comic font-black text-slate-800 mb-2 drop-shadow-sm">
          MẸ LUÔN TỰ HÀO VỀ CON!
        </h2>

        {/* LỜI ĐỘNG VIÊN CỦA NỮ HOÀNG */}
        <div className="w-full bg-white/90 border-2 border-pink-200 rounded-2xl p-3.5 my-2 text-left flex items-start gap-2.5 shadow-inner">
          <p className="text-xs font-comic font-bold text-slate-700 leading-relaxed flex-1">
            "{comfortMessage}"
          </p>
          <button
            type="button"
            onClick={handleSpeakComfort}
            className="p-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg cursor-pointer shrink-0 active:scale-90 transition-all"
            title="Nghe lời Nữ hoàng vỗ về"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* CAM KẾT BẢO TOÀN VẬT PHẨM & ĐIỂM SỐ */}
        <div className="w-full bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 my-2 flex items-center gap-2 text-left">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-comic font-bold text-emerald-800">
            Mọi đồ chơi, kẹo ngọt, trang phục và XP của con đều được giữ nguyên 100%!
          </span>
        </div>

        {/* CÁC NÚT BẤM LỰA CHỌN */}
        <div className="w-full flex flex-col gap-2.5 mt-3">
          {/* THỬ LẠI */}
          <button
            onClick={() => {
              soundManager.playTap();
              onRetry();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-comic font-black text-xs sm:text-sm rounded-2xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử Lại Nhiệm Vụ Này 🚀</span>
          </button>

          {/* CHỌN NHIỆM VỤ DỄ HƠN */}
          <button
            onClick={() => {
              soundManager.playTap();
              onChooseEasier();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-amber-950 font-comic font-black text-xs rounded-xl shadow-md border border-amber-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Chọn Nhiệm Vụ Dễ Hơn 🗺️</span>
          </button>

          {/* VÀO PHÒNG ĐỒ CHƠI THƯ GIÃN */}
          <button
            onClick={() => {
              soundManager.playTap();
              onGoToToyRoom();
            }}
            className="w-full py-2 px-4 bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-700 font-comic font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Vào Phòng Đồ Chơi Thư Giãn 🧸</span>
          </button>
        </div>
      </div>
    </div>
  );
};
