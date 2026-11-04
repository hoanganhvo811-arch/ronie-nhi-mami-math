// src/features/math-engine/VisualMathQuiz.tsx
// Bảng Đen Thần Kỳ Trong Khu Rừng Học Toán (Magical Forest Classroom - Image 2 Reference)
// Giao diện câu hỏi toán học 3D trực quan, đa giác quan cho trẻ Lớp 1 (GDPT 2018)

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, HelpCircle, Sparkles, CheckCircle2, RotateCcw, Heart } from 'lucide-react';
import type { IMathQuestion } from '../../types/game';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { getRandomPhrase } from '../dialogue/dialogueLibrary';
import { WoodenChalkboard } from '../../design-system/WoodenChalkboard';
import { CartoonButton } from '../../design-system/CartoonButton';

interface VisualMathQuizProps {
  question: IMathQuestion;
  onAnswer: (correct: boolean) => void;
  onClose?: () => void;
}

// Bảng màu 3D rực rỡ vui tươi cho các nút đáp án (Image 2 Palette: Red, Orange, Green, Blue, Purple)
const OPTION_THEMES = [
  {
    bg: 'from-rose-400 via-rose-500 to-rose-600',
    border: 'border-rose-300',
    shadow: '#9f1239',
    glow: 'rgba(244,63,94,0.4)',
    text: 'text-white',
  },
  {
    bg: 'from-amber-400 via-amber-500 to-amber-600',
    border: 'border-amber-200',
    shadow: '#92400e',
    glow: 'rgba(245,158,11,0.4)',
    text: 'text-amber-950',
  },
  {
    bg: 'from-emerald-400 via-emerald-500 to-emerald-600',
    border: 'border-emerald-300',
    shadow: '#065f46',
    glow: 'rgba(16,185,129,0.4)',
    text: 'text-white',
  },
  {
    bg: 'from-sky-400 via-sky-500 to-sky-600',
    border: 'border-sky-300',
    shadow: '#0369a1',
    glow: 'rgba(14,165,233,0.4)',
    text: 'text-white',
  },
  {
    bg: 'from-purple-400 via-purple-500 to-purple-600',
    border: 'border-purple-300',
    shadow: '#581c87',
    glow: 'rgba(168,85,247,0.4)',
    text: 'text-white',
  },
  {
    bg: 'from-pink-400 via-pink-500 to-pink-600',
    border: 'border-pink-300',
    shadow: '#831843',
    glow: 'rgba(236,72,153,0.4)',
    text: 'text-white',
  },
];

export const VisualMathQuiz: React.FC<VisualMathQuizProps> = ({ question, onAnswer, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const transitionTimerRef = useRef<any>(null);

  // Tự động mở khóa và làm mới khi nhận câu hỏi mới
  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsLocked(false);
    setShowHint(false);

    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [question.id, question.questionText]);

  const handleSelectOption = (option: string | number) => {
    if (isLocked) return;
    setSelectedAnswer(option);
    setIsLocked(true);

    const correct = option.toString().trim() === question.correctAnswer.toString().trim();
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      try {
        const cheer = getRandomPhrase('answer_correct');
        VoiceSystem.givePositiveFeedback(cheer);
      } catch (err) {
        console.warn('Lỗi âm thanh khen ngợi:', err);
      }

      transitionTimerRef.current = setTimeout(() => {
        setIsLocked(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        onAnswer(true);
      }, 1100);
    } else {
      soundManager.playTryAgain();
      try {
        const comfort = getRandomPhrase('answer_wrong');
        VoiceSystem.giveEncouragingFeedback(comfort);
      } catch (err) {
        console.warn('Lỗi âm thanh động viên:', err);
      }

      transitionTimerRef.current = setTimeout(() => {
        setIsLocked(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
        setShowHint(true);
      }, 1200);
    }
  };

  const handleSpeakQuestion = () => {
    soundManager.playTap();
    VoiceSystem.narrateQuestion(question.questionText);
  };

  const handleToggleHint = () => {
    soundManager.playTap();
    setShowHint((prev) => !prev);
    if (!showHint && question.hint) {
      VoiceSystem.speakCharacter('queen', question.hint);
    }
  };

  return (
    <div className="relative w-full max-w-4xl flex flex-col items-center select-none py-2 px-2 sm:px-4">
      {/* 1. KHUNG BẢNG ĐEN GỖ THẦN KỲ TRÊN GIÁ ĐỠ (Image 2 Reference) */}
      <div className="relative w-full flex flex-col items-center">
        {/* NÚT THOÁT NHỎ GỌN TRÊN CÙNG GÓC BẢNG (nếu có onClose) */}
        {onClose && (
          <div className="w-full flex justify-between items-center mb-2 px-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white font-comic font-black text-xs rounded-2xl border-2 border-emerald-500/80 shadow-[0_4px_0_#064e3b] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌳 Trở Về</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-amber-950 font-comic font-black text-xs rounded-full shadow-md border border-white">
                ⭐ Lớp 1 • GDPT 2018
              </span>
            </div>
          </div>
        )}

        {/* BẢNG ĐEN GỖ */}
        <WoodenChalkboard
          title="LỚP HỌC RỪNG XANH"
          headerAddon={
            <button
              type="button"
              onClick={handleSpeakQuestion}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-comic font-black text-xs sm:text-sm rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer border border-white"
              title="Nghe cô đọc đề bài"
            >
              <Volume2 className="w-4 h-4 text-amber-900 animate-pulse" />
              <span>🔊 Nghe Đề</span>
            </button>
          }
          className="w-full"
        >
          {/* CÂU HỎI TRÊN BẢNG ĐEN (PHẤN TRẮNG PHÁT SÁNG) */}
          <div className="w-full text-center py-2 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-comic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-snug tracking-wide">
              {question.questionText}
            </h2>
          </div>

          {/* KHU VỰC MINH HỌA TRỰC QUAN TRÊN BẢNG (Chalk Drawings & 3D Blocks) */}
          <div className="w-full min-h-[130px] sm:min-h-[160px] bg-black/25 rounded-2xl p-4 my-2 border-2 border-emerald-800/60 shadow-inner flex flex-wrap items-center justify-center gap-3 relative overflow-hidden">
            {/* Đếm số lượng quả (Image 2 style dice / items) */}
            {question.visualType === 'COUNTING' && question.visualData.countItems && (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-2">
                {Array.from({ length: question.visualData.countItems.count }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-md hover:scale-125 transition-transform animate-bounce select-none cursor-pointer"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    <span className="text-4xl sm:text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                      {question.visualData.countItems!.emoji}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Phép cộng / trừ trực quan như 2 xúc xắc trên bảng ở Image 2 */}
            {(question.visualType === 'ADDITION_VISUAL' || question.visualType === 'SUBTRACTION_VISUAL') && (
              <div className="flex items-center justify-center gap-3 sm:gap-6 text-3xl sm:text-4xl">
                {/* Nhóm A (khối hộp xúc xắc) */}
                <div className="flex gap-2 bg-white/90 p-3 sm:p-4 rounded-2xl border-3 border-amber-300 shadow-[0_6px_0_#d97706] items-center">
                  {Array.from({ length: question.visualData.groupA?.count || 0 }).map((_, idx) => (
                    <span key={idx} className="text-3xl sm:text-4xl animate-pulse">
                      {question.visualData.groupA?.emoji}
                    </span>
                  ))}
                  {(!question.visualData.groupA || question.visualData.groupA.count === 0) && (
                    <span className="font-comic font-black text-slate-800 text-2xl">0</span>
                  )}
                </div>

                {/* Dấu toán học viết phấn lớn */}
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 font-black font-comic text-3xl flex items-center justify-center shadow-[0_4px_0_#b45309] border border-white">
                  {question.visualType === 'ADDITION_VISUAL' ? '+' : '-'}
                </div>

                {/* Nhóm B (khối hộp xúc xắc) */}
                <div className="flex gap-2 bg-white/90 p-3 sm:p-4 rounded-2xl border-3 border-amber-300 shadow-[0_6px_0_#d97706] items-center">
                  {Array.from({ length: question.visualData.groupB?.count || 0 }).map((_, idx) => (
                    <span key={idx} className="text-3xl sm:text-4xl animate-pulse">
                      {question.visualData.groupB?.emoji}
                    </span>
                  ))}
                  {(!question.visualData.groupB || question.visualData.groupB.count === 0) && (
                    <span className="font-comic font-black text-slate-800 text-2xl">0</span>
                  )}
                </div>

                {/* Dấu bằng viết phấn */}
                <div className="text-3xl sm:text-4xl font-black font-comic text-yellow-300 drop-shadow-md">
                  = ?
                </div>
              </div>
            )}

            {/* So sánh lớn bé bằng */}
            {question.visualType === 'COMPARISON' && question.visualData.comparisonValues && (
              <div className="flex items-center gap-4 sm:gap-6 text-3xl sm:text-4xl font-black font-comic">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-[0_6px_0_#b45309] border-2 border-white">
                  {question.visualData.comparisonValues.left}
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 border-3 border-dashed border-yellow-300 flex items-center justify-center text-yellow-300 text-3xl font-black animate-pulse">
                  ?
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 to-sky-300 text-cyan-950 flex items-center justify-center shadow-[0_6px_0_#0284c7] border-2 border-white">
                  {question.visualData.comparisonValues.right}
                </div>
              </div>
            )}

            {/* Hình học */}
            {question.visualType === 'GEOMETRY' && question.visualData.shapes && (
              <div className="flex items-center justify-center py-3">
                {question.visualData.shapes[0].type === 'circle' && (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300 border-4 border-white shadow-[0_8px_20px_rgba(56,189,248,0.5)] animate-pulse" />
                )}
                {question.visualType === 'GEOMETRY' && question.visualData.shapes[0].type === 'square' && (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 border-4 border-white shadow-[0_8px_20px_rgba(244,63,94,0.5)]" />
                )}
                {question.visualType === 'GEOMETRY' && question.visualData.shapes[0].type === 'triangle' && (
                  <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] border-b-amber-400 drop-shadow-[0_8px_16px_rgba(245,158,11,0.5)]" />
                )}
                {question.visualType === 'GEOMETRY' && question.visualData.shapes[0].type === 'rectangle' && (
                  <div className="w-36 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-white shadow-[0_8px_20px_rgba(16,185,129,0.5)]" />
                )}
              </div>
            )}

            {/* Thước đo cm */}
            {question.visualType === 'RULER_CM' && question.visualData.measurement && (
              <div className="w-full flex flex-col items-center gap-2 py-2">
                <div
                  className="h-8 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-xl shadow-md border-2 border-amber-600 transition-all flex items-center justify-end px-3 text-xs font-comic font-black text-amber-950"
                  style={{ width: `${Math.min(question.visualData.measurement.lengthCm * 36, 320)}px` }}
                >
                  ✏️ Bút Chì ({question.visualData.measurement.lengthCm} cm)
                </div>
                <div className="w-[340px] max-w-full h-12 bg-amber-100 rounded-xl border-3 border-amber-500 flex items-center justify-between px-3 text-xs font-comic font-black text-amber-900 shadow-inner select-none">
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
              <div className="relative w-28 h-28 rounded-full bg-white border-4 border-amber-400 shadow-[0_8px_16px_rgba(0,0,0,0.3)] flex items-center justify-center">
                <span className="absolute top-1.5 font-comic font-black text-xs text-slate-700">12</span>
                <span className="absolute right-2 font-comic font-black text-xs text-slate-700">3</span>
                <span className="absolute bottom-1.5 font-comic font-black text-xs text-slate-700">6</span>
                <span className="absolute left-2 font-comic font-black text-xs text-slate-700">9</span>
                <div
                  className="absolute w-2 h-7 bg-rose-500 rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${question.visualData.clockTime.hour * 30}deg) translateY(-50%)`,
                  }}
                />
                <div className="absolute w-1.5 h-10 bg-sky-600 rounded-full origin-bottom" style={{ transform: 'translateY(-50%)' }} />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 z-10 border-2 border-amber-300" />
              </div>
            )}
          </div>
        </WoodenChalkboard>

        {/* 2 CHÂN GIÁ ĐỠ GỖ CỦA BẢNG ĐEN (Easel Stand Legs) */}
        <div className="w-3/4 flex justify-between px-8 -mt-1 pointer-events-none">
          <div className="w-4 sm:w-5 h-8 sm:h-12 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 shadow-lg rounded-b-md" />
          <div className="w-4 sm:w-5 h-8 sm:h-12 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 shadow-lg rounded-b-md" />
        </div>
      </div>

      {/* 2. KHU VỰC TƯƠNG TÁC THẢM CỎ: RONIE CHỈ ĐƯỜNG & NÚT ĐÁP ÁN 3D (Image 2 Grass Area) */}
      <div className="w-full mt-3 sm:mt-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-4">
        {/* HIỆP SĨ RONIE ĐỨNG TRÊN GỐC CÂY CẦM GẬY CHỈ ĐIỂM (Image 2 Teacher Pose) */}
        <div className="shrink-0 flex sm:flex-col items-center gap-2 relative">
          {/* Gốc cây rêu phong nơi Ronie đứng */}
          <div className="relative flex flex-col items-center">
            {/* Lời thoại gợi ý hoặc cổ vũ từ Ronie */}
            <div className="hidden sm:block mb-1 px-3 py-1 bg-white/95 text-rose-600 font-comic font-black text-[11px] rounded-2xl border-2 border-rose-300 shadow-md animate-pulse whitespace-nowrap">
              {isCorrect === true
                ? '🎉 Đúng rồi, bé giỏi quá!'
                : isCorrect === false
                ? '💪 Cố lên nào bé yêu!'
                : '✨ Bé chọn số nào nè?'}
            </div>

            <div className="relative">
              <RonieAvatar
                size="md"
                state={isCorrect === true ? 'victory' : isCorrect === false ? 'sad' : 'jumping'}
                variant="photo"
              />
              {/* Gậy chỉ điểm ngôi sao vàng */}
              <div className="absolute -top-3 -right-2 text-2xl animate-bounce">🪄</div>
            </div>

            {/* Bục gỗ gốc cây */}
            <div className="hidden sm:block w-20 h-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-full border-2 border-emerald-600 shadow-md" />
          </div>
        </div>

        {/* CÁC NÚT ĐÁP ÁN 3D ĐẶT TRÊN THẢM CỎ HOA (Image 2 3D Numbers) */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const theme = OPTION_THEMES[idx % OPTION_THEMES.length];

            let stateStyle = `bg-gradient-to-b ${theme.bg} ${theme.text} ${theme.border} shadow-[0_8px_0_${theme.shadow},0_12px_20px_${theme.glow}]`;

            if (isSelected) {
              if (isCorrect === true) {
                stateStyle =
                  'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white border-white shadow-[0_8px_0_#065f46] scale-105 animate-bounce';
              } else if (isCorrect === false) {
                stateStyle =
                  'bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 text-white border-white shadow-[0_8px_0_#9f1239] animate-shake';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelectOption(option)}
                className={`relative h-18 sm:h-20 rounded-3xl border-4 font-comic font-black text-3xl sm:text-4xl transition-all transform active:translate-y-2 active:shadow-none hover:scale-105 cursor-pointer flex items-center justify-center ${stateStyle}`}
              >
                {/* Lớp ánh sáng bóng tròn trên nút 3D */}
                <div className="absolute top-1.5 inset-x-3 h-4 bg-white/35 rounded-full pointer-events-none" />
                <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. KHUNG LỜI KHUYÊN HOÀNG GIA DỊU DÀNG TỪ MẸ NHI MAMI */}
      <div className="w-full mt-3 flex flex-col items-center">
        <button
          type="button"
          onClick={handleToggleHint}
          className="px-4 py-2 bg-white/90 hover:bg-white text-purple-900 rounded-2xl border-2 border-purple-300 shadow-[0_4px_0_#7e22ce] active:translate-y-1 active:shadow-none transition-all font-comic font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>{showHint ? 'Ẩn Lời Khuyên Của Nữ Hoàng' : '👑 Bé Cần Mẹ Nhi Mami Mách Nhỏ?'}</span>
        </button>

        {showHint && (
          <div className="w-full mt-2.5 p-3.5 bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 border-3 border-purple-300 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn text-left">
            <div className="shrink-0">
              <QueenNhiMamiAvatar size="sm" state="encouraging" variant="photo" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-comic font-black text-purple-700 flex items-center gap-1">
                <span>👑 Nữ Hoàng Nhi Mami:</span>
              </div>
              <p className="text-xs sm:text-sm font-comic font-bold text-slate-800 leading-relaxed mt-0.5">
                "{question.hint}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
