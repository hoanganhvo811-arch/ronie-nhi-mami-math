// src/features/dialogue/DialogueOverlay.tsx
// Lớp phủ thoại phong cách truyện tranh hoạt hình giữa Nữ hoàng Nhi Mami và Ronie

import React from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface DialogueOverlayProps {
  speaker: 'ronie' | 'queen';
  message: string;
  onNext: () => void;
  actionText?: string;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  speaker,
  message,
  onNext,
  actionText = 'Tiếp tục',
}) => {
  const isQueen = speaker === 'queen';

  const handleSpeak = () => {
    soundManager.playTap();
    soundManager.speakVietnamese(message);
  };

  const handleNextClick = () => {
    soundManager.playTap();
    onNext();
  };

  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-amber-300 flex flex-col md:flex-row items-center gap-4 animate-fadeIn">
      {/* AVATAR NHÂN VẬT THOẠI */}
      <div className="flex-shrink-0 flex flex-col items-center">
        {isQueen ? (
          <QueenNhiMamiAvatar size="lg" speaking={true} />
        ) : (
          <RonieAvatar size="lg" state="thinking" />
        )}
        <span
          className={`mt-1 font-black text-xs md:text-sm px-3 py-0.5 rounded-full shadow-sm ${
            isQueen ? 'bg-purple-100 text-purple-900' : 'bg-rose-100 text-rose-900'
          }`}
        >
          {isQueen ? '👑 Nữ Hoàng Nhi Mami' : '🕷️ Bé Ronie'}
        </span>
      </div>

      {/* BONG BÓNG LỜI THOẠI */}
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="relative bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-200 text-slate-800 text-sm md:text-base font-bold leading-relaxed mb-3">
          "{message}"
        </div>

        {/* NÚT THAO TÁC */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSpeak}
            className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Nghe giọng đọc"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe đọc</span>
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white rounded-xl shadow-md font-black text-sm flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
