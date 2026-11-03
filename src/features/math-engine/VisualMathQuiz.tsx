// src/features/math-engine/VisualMathQuiz.tsx
// Giao diện câu hỏi toán học tương tác trực quan đa giác quan cho trẻ Lớp 1

import React, { useState } from 'react';
import { Volume2, HelpCircle, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import type { IMathQuestion } from '../../types/game';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { getRandomPhrase } from '../dialogue/dialogueLibrary';

interface VisualMathQuizProps {
  question: IMathQuestion;
  onAnswer: (correct: boolean) => void;
  onClose?: () => void;
}

export const VisualMathQuiz: React.FC<VisualMathQuizProps> = ({ question, onAnswer, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleSelectOption = (option: string | number) => {
    if (isLocked) return;
    setSelectedAnswer(option);
    setIsLocked(true);

    const correct = option.toString() === question.correctAnswer.toString();
    setIsCorrect(correct);

    if (correct) {
      const cheer = getRandomPhrase('answer_correct');
      VoiceSystem.givePositiveFeedback(cheer);
      setTimeout(() => {
        onAnswer(true);
      }, 1200);
    } else {
      const comfort = getRandomPhrase('answer_wrong');
      VoiceSystem.giveEncouragingFeedback(comfort);
      setTimeout(() => {
        setIsLocked(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
        setShowHint(true);
      }, 1500);
    }
  };

  const handleSpeakQuestion = () => {
    soundManager.playTap();
    VoiceSystem.narrateQuestion(question.questionText);
  };

  const handleToggleHint = () => {
    soundManager.playTap();
    setShowHint((prev) => !prev);
    if (!showHint) {
      VoiceSystem.speakCharacter('queen', question.hint);
    }
  };

  return (
    <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-300 flex flex-col items-center">
      {/* HEADER: Chủ đề & Nút âm thanh */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="px-3.5 py-1.5 bg-amber-100 text-amber-800 font-bold rounded-full text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Vương Quốc Toán Học Lớp 1
        </span>

        <button
          type="button"
          onClick={handleSpeakQuestion}
          className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-md transition-all transform active:scale-90 flex items-center gap-1.5 text-xs md:text-sm font-bold cursor-pointer"
          title="Đọc đề bài"
        >
          <Volume2 className="w-5 h-5" />
          <span>Nghe đề</span>
        </button>
      </div>

      {/* ĐỀ BÀI CÂU HỎI */}
      <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center leading-snug mb-4">
        {question.questionText}
      </h3>

      {/* KHU VỰC MINH HỌA TRỰC QUAN (VISUAL AREA) */}
      <div className="w-full min-h-[140px] bg-sky-50/80 rounded-2xl p-4 mb-6 border-2 border-sky-100 flex flex-wrap items-center justify-center gap-3">
        {/* Đếm số lượng quả */}
        {question.visualType === 'COUNTING' && question.visualData.countItems && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: question.visualData.countItems.count }).map((_, idx) => (
              <span
                key={idx}
                className="text-4xl md:text-5xl transform hover:scale-125 transition-transform animate-bounce select-none"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {question.visualData.countItems!.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Phép cộng / trừ trực quan */}
        {(question.visualType === 'ADDITION_VISUAL' || question.visualType === 'SUBTRACTION_VISUAL') && (
          <div className="flex items-center justify-center gap-4 text-3xl md:text-4xl">
            <div className="flex gap-1.5 bg-white/80 p-2.5 rounded-xl border border-sky-200 shadow-sm">
              {Array.from({ length: question.visualData.groupA?.count || 0 }).map((_, idx) => (
                <span key={idx}>{question.visualData.groupA?.emoji}</span>
              ))}
            </div>

            <span className="font-black text-amber-600 text-2xl">
              {question.visualType === 'ADDITION_VISUAL' ? '➕' : '➖'}
            </span>

            <div className="flex gap-1.5 bg-white/80 p-2.5 rounded-xl border border-sky-200 shadow-sm">
              {Array.from({ length: question.visualData.groupB?.count || 0 }).map((_, idx) => (
                <span key={idx}>{question.visualData.groupB?.emoji}</span>
              ))}
            </div>
          </div>
        )}

        {/* So sánh lớn bé bằng */}
        {question.visualType === 'COMPARISON' && question.visualData.comparisonValues && (
          <div className="flex items-center gap-6 text-4xl font-black">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center shadow-md">
              {question.visualData.comparisonValues.left}
            </div>
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-dashed border-sky-400 flex items-center justify-center text-sky-600 text-2xl font-black">
              ?
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-cyan-200 text-cyan-950 flex items-center justify-center shadow-md">
              {question.visualData.comparisonValues.right}
            </div>
          </div>
        )}

        {/* Hình học */}
        {question.visualType === 'GEOMETRY' && question.visualData.shapes && (
          <div className="flex items-center justify-center py-2">
            {question.visualData.shapes[0].type === 'circle' && (
              <div className="w-20 h-20 rounded-full bg-sky-400 border-4 border-sky-600 shadow-lg animate-pulse" />
            )}
            {question.visualData.shapes[0].type === 'square' && (
              <div className="w-20 h-20 rounded-xl bg-rose-500 border-4 border-rose-700 shadow-lg" />
            )}
            {question.visualData.shapes[0].type === 'triangle' && (
              <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-amber-400 drop-shadow-md" />
            )}
            {question.visualData.shapes[0].type === 'rectangle' && (
              <div className="w-32 h-16 rounded-xl bg-emerald-500 border-4 border-emerald-700 shadow-lg" />
            )}
          </div>
        )}

        {/* Thước đo cm */}
        {question.visualType === 'RULER_CM' && question.visualData.measurement && (
          <div className="w-full flex flex-col items-center gap-2">
            <div
              className="h-6 bg-amber-400 rounded-lg shadow-sm border border-amber-600 transition-all flex items-center justify-end px-2 text-[10px] font-bold text-amber-900"
              style={{ width: `${Math.min(question.visualData.measurement.lengthCm * 35, 300)}px` }}
            >
              ✏️ Bút chì
            </div>
            {/* Hình ảnh thước kẻ */}
            <div className="w-[320px] max-w-full h-10 bg-yellow-100 rounded-md border-2 border-yellow-500 flex items-center justify-between px-2 text-xs font-bold text-slate-700 select-none">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10 cm</span>
            </div>
          </div>
        )}

        {/* Đồng hồ kim */}
        {question.visualType === 'CLOCK' && question.visualData.clockTime && (
          <div className="relative w-24 h-24 rounded-full bg-white border-4 border-amber-400 shadow-md flex items-center justify-center">
            <span className="absolute top-1 text-[10px] font-bold text-slate-600">12</span>
            <span className="absolute right-1 text-[10px] font-bold text-slate-600">3</span>
            <span className="absolute bottom-1 text-[10px] font-bold text-slate-600">6</span>
            <span className="absolute left-1 text-[10px] font-bold text-slate-600">9</span>
            {/* Kim ngắn chỉ giờ */}
            <div
              className="absolute w-1.5 h-6 bg-rose-500 rounded-full origin-bottom"
              style={{
                transform: `rotate(${question.visualData.clockTime.hour * 30}deg) translateY(-50%)`,
              }}
            />
            {/* Kim dài chỉ phút */}
            <div className="absolute w-1 h-8 bg-sky-600 rounded-full origin-bottom" style={{ transform: 'translateY(-50%)' }} />
            <div className="w-3 h-3 rounded-full bg-slate-800 z-10" />
          </div>
        )}
      </div>

      {/* CÁC NÚT ĐÁP ÁN (TOUCH-FRIENDLY BUTTONS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          let btnStyle = 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 hover:border-amber-400';

          if (isSelected) {
            if (isCorrect === true) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 animate-bounce';
            } else if (isCorrect === false) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 animate-shake';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelectOption(option)}
              className={`h-16 md:h-18 rounded-2xl border-3 shadow-md font-black text-xl md:text-2xl transition-all transform active:scale-95 cursor-pointer flex items-center justify-center ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* NÚT VÀ KHUNG GỢI Ý DỊU DÀNG (GENTLE HINT) */}
      <div className="w-full flex flex-col items-center">
        <button
          type="button"
          onClick={handleToggleHint}
          className="text-xs md:text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>{showHint ? 'Ẩn lời khuyên của Nữ hoàng' : 'Bé cần Nữ hoàng Nhi Mami gợi ý?'}</span>
        </button>

        {showHint && (
          <div className="w-full mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs md:text-sm font-semibold text-center leading-relaxed animate-fadeIn">
            👑 <strong>Nữ hoàng Nhi Mami:</strong> "{question.hint}"
          </div>
        )}
      </div>
    </div>
  );
};
