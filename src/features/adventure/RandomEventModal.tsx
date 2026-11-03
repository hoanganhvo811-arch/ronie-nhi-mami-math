// src/features/adventure/RandomEventModal.tsx
// Hộp thoại Sự Kiện Ngẫu Nhiên Bất Ngờ Trên Đường Phiêu Lưu (Phase 8)

import React, { useState } from 'react';
import { Sparkles, Star, Heart, X, CheckCircle2, Gift } from 'lucide-react';
import type { IRandomWorldEvent } from '../../types/adventure';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';

interface RandomEventModalProps {
  event: IRandomWorldEvent | null;
  onClose: () => void;
  onClaimReward?: (stars: number) => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({
  event,
  onClose,
  onClaimReward,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!event) return null;

  const handleSelectOption = (opt: string | number) => {
    if (isAnswered || !event.quickQuestion) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    const correct = opt.toString() === event.quickQuestion.correctAnswer.toString();
    setIsCorrect(correct);

    if (correct) {
      VoiceSystem.givePositiveFeedback();
      if (onClaimReward && event.reward.starsGain) {
        onClaimReward(event.reward.starsGain);
      }
    } else {
      VoiceSystem.giveEncouragingFeedback();
    }
  };

  const handleSimpleClaim = () => {
    soundManager.playCorrect();
    if (onClaimReward && event.reward.starsGain) {
      onClaimReward(event.reward.starsGain);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-pink-50 to-indigo-50 rounded-3xl p-6 border-4 border-amber-300 shadow-2xl text-center flex flex-col items-center">
        {/* NÚT ĐÓNG */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-500 rounded-xl shadow cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* EMOJI NHÂN VẬT & TIÊU ĐỀ */}
        <div className="w-20 h-20 -mt-16 rounded-3xl bg-white border-4 border-amber-300 shadow-xl flex items-center justify-center text-4xl mb-2 animate-bounce">
          {event.character.avatarEmoji}
        </div>

        <div className="flex items-center gap-1 text-xs font-comic font-black text-rose-500 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>SỰ KIỆN BẤT NGỜ TRÊN ĐƯỜNG ĐI</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <h3 className="text-xl font-comic font-black text-slate-800 mb-2">
          {event.title}
        </h3>

        <div className="bg-white/80 border-2 border-amber-200 rounded-2xl p-3 mb-4 text-xs font-comic font-bold text-slate-700 leading-relaxed text-left w-full">
          <p className="mb-1 text-slate-500 italic">{event.description}</p>
          <p className="text-amber-900 font-black">
            "{event.character.quote}"
          </p>
        </div>

        {/* NẾU LÀ CÂU ĐỐ THẦN TỐC */}
        {event.quickQuestion && (
          <div className="w-full mb-4">
            <h4 className="text-sm font-comic font-black text-indigo-900 mb-2">
              {event.quickQuestion.questionText}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {event.quickQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                let btnStyle = 'bg-white hover:bg-amber-100 text-slate-800 border-amber-200';
                if (isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-rose-500 text-white border-rose-600';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-2.5 rounded-xl font-comic font-black text-lg border-2 shadow transition-all cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PHẦN THƯỞNG NHẬN ĐƯỢC */}
        <div className="w-full bg-amber-100/90 border border-amber-300 rounded-2xl p-3 flex items-center justify-between mb-4 text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{event.reward.icon}</span>
            <span className="text-xs font-comic font-bold text-amber-950">
              {event.reward.text}
            </span>
          </div>
          {event.reward.starsGain && (
            <div className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2 py-1 rounded-full text-xs font-comic font-black shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-950" />
              <span>+{event.reward.starsGain}</span>
            </div>
          )}
        </div>

        {/* NÚT HOÀN TẤT */}
        {(!event.quickQuestion || isAnswered) && (
          <button
            type="button"
            onClick={handleSimpleClaim}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-rose-400 hover:brightness-110 active:scale-95 text-slate-950 font-comic font-black text-sm rounded-2xl shadow-lg border-2 border-white transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Tiếp Tục Cuộc Phiêu Lưu 🚀</span>
          </button>
        )}
      </div>
    </div>
  );
};
