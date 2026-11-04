// src/features/challenge-arena/ChallengeArena.tsx
// Giao diện Đấu Trường Toán Học Hoàng Gia (Challenge Arena) - Phase 5
// 5 Chế độ: 60s, Marathon 20 câu, Boss Battle, Mystery Number, Multi-step
// Đầy đủ nút Tắt/Bật đếm giờ, đọc âm thanh tiếng Việt, giao diện hoạt hình 3D

import React, { useState, useEffect } from 'react';
import {
  ChallengeArenaEngine,
  ARENA_MODES_CONFIG,
} from './ChallengeArenaEngine';
import type {
  ChallengeArenaMode,
  IArenaSessionState,
} from '../../types/training-and-arena';
import { soundManager } from '../../services/audio/AudioManager';
import {
  Volume2,
  Clock,
  Swords,
  Shield,
  ArrowLeft,
  Flame,
  Star,
  Award,
  Zap,
  RotateCcw,
  Play,
  Heart,
} from 'lucide-react';

interface ChallengeArenaProps {
  onBack: () => void;
  onChallengeComplete?: (result: { expGained: number; stars: number }) => void;
}

export const ChallengeArena: React.FC<ChallengeArenaProps> = ({
  onBack,
  onChallengeComplete,
}) => {
  const [selectedMode, setSelectedMode] = useState<ChallengeArenaMode>('speed_60s');
  const [isTimerEnabled, setIsTimerEnabled] = useState<boolean>(true);
  const [engine, setEngine] = useState<ChallengeArenaEngine | null>(null);
  const [sessionState, setSessionState] = useState<IArenaSessionState | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Khởi động BGM
  useEffect(() => {
    soundManager.playBgm('castle');
  }, []);

  // Timer Tick Interval khi đang thi đấu
  useEffect(() => {
    if (!engine || !sessionState || sessionState.isFinished) return;

    const interval = setInterval(() => {
      const res = engine.tickSecond();
      const updated = engine.getState();
      setSessionState(updated);

      if (res.isTimeUp) {
        soundManager.playCelebration();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engine, sessionState?.isFinished]);

  const handleStartMode = (mode: ChallengeArenaMode) => {
    soundManager.playTap();
    const newEngine = new ChallengeArenaEngine(mode, isTimerEnabled);
    setEngine(newEngine);
    setSessionState(newEngine.getState());
    setFeedback(null);
  };

  const handleSelectOption = (opt: unknown) => {
    if (!engine || feedback || sessionState?.isFinished) return;

    soundManager.playTap();
    const res = engine.submitAnswer(opt);
    setSessionState(engine.getState());

    if (res.isCorrect) {
      soundManager.playAttack();
      setFeedback({ isCorrect: true, text: '💥 Xuất sắc! Đòn tấn công trúng đích!' });
    } else {
      soundManager.playTryAgain();
      setFeedback({ isCorrect: false, text: 'Quái vật né được đòn rồi! Tiếp tục cố gắng nào!' });
    }

    setTimeout(() => {
      setFeedback(null);
      const hasNext = engine.nextQuestion();
      const updated = engine.getState();
      setSessionState(updated);

      if (!hasNext || updated.isFinished) {
        soundManager.playCelebration();
        if (onChallengeComplete && updated.resultBreakdown) {
          onChallengeComplete({
            expGained: updated.resultBreakdown.expEarned,
            stars: updated.resultBreakdown.starsEarned,
          });
        }
      }
    }, 1400);
  };

  const handleListenQuestion = () => {
    if (sessionState?.currentQuestion) {
      soundManager.speakVietnamese(sessionState.currentQuestion.questionText);
    }
  };

  // MÀN HÌNH TỔNG KẾT THỬ THÁCH
  if (sessionState?.isFinished && sessionState.resultBreakdown) {
    const res = sessionState.resultBreakdown;
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-black flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-lg bg-slate-900/95 border-4 border-amber-400 rounded-3xl p-6 text-center shadow-[0_10px_40px_rgba(245,158,11,0.3)]">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h2 className="text-2xl font-comic font-black text-amber-300 drop-shadow-md mb-1">
            {res.title}
          </h2>
          <p className="text-slate-300 text-xs font-comic mb-4">{res.queenFeedback}</p>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 ${
                  star <= res.starsEarned
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_#f59e0b]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-2xl mb-6 border border-slate-700">
            <div>
              <span className="text-[11px] text-slate-400 font-comic block">Chính xác</span>
              <span className="text-xl font-black text-emerald-400 font-comic">{res.accuracy}%</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-comic block">Câu đúng</span>
              <span className="text-xl font-black text-cyan-400 font-comic">
                {sessionState.correctCount}/{sessionState.questions.length}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-comic block">EXP nhận</span>
              <span className="text-xl font-black text-amber-400 font-comic">+{res.expEarned}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEngine(null);
                setSessionState(null);
              }}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-comic font-black rounded-2xl shadow-[0_4px_0_#9a3412] active:translate-y-1 transition-all cursor-pointer"
            >
              Chọn Đấu Trường Khác
            </button>
            <button
              onClick={() => handleStartMode(sessionState.mode)}
              className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-comic font-black rounded-2xl shadow-[0_4px_0_#334155] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Đấu Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MÀN HÌNH ĐANG THI ĐẤU
  if (sessionState && !sessionState.isFinished && sessionState.currentQuestion) {
    const q = sessionState.currentQuestion;
    const modeConfig = ARENA_MODES_CONFIG[sessionState.mode];

    return (
      <div className="relative w-full min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 flex flex-col justify-between p-3 sm:p-5 select-none">
        {/* Top Header HUD */}
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-amber-400 shadow-md">
          <button
            onClick={() => {
              setEngine(null);
              setSessionState(null);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-comic font-bold border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            Thoát
          </button>

          {/* Đồng hồ đếm ngược hoặc số câu */}
          <div className="flex items-center gap-4">
            {sessionState.isTimerEnabled && (
              <div className="flex items-center gap-1.5 bg-rose-950/80 px-3 py-1 rounded-xl border border-rose-500/50">
                <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="text-rose-300 font-comic font-black text-sm">
                  {sessionState.timeRemainingSeconds}s
                </span>
              </div>
            )}

            <div className="text-amber-300 font-comic font-bold text-xs">
              Câu {sessionState.currentIndex + 1}/{sessionState.questions.length}
            </div>

            <div className="flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/40 text-amber-300 text-xs font-comic font-black">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{sessionState.score}</span>
            </div>
          </div>

          <button
            onClick={handleListenQuestion}
            className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl border border-cyan-400/40"
            title="Nghe Nữ Hoàng đọc đề"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Boss HP Bar (nếu là boss_10q) */}
        {sessionState.mode === 'boss_10q' && (
          <div className="w-full max-w-xl mx-auto my-2 bg-slate-900/90 border border-purple-500/60 p-3 rounded-2xl flex flex-col items-center">
            <div className="flex justify-between w-full text-xs font-comic font-bold text-purple-300 mb-1">
              <span>Quái Vật Bánh Quy Khổng Lồ</span>
              <span>HP: {sessionState.bossHp}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-purple-400/40">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-500"
                style={{ width: `${sessionState.bossHp}%` }}
              />
            </div>
          </div>
        )}

        {/* Question Arena Box */}
        <div className="w-full max-w-2xl mx-auto my-auto bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-3 border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col items-center">
          <div className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-comic font-black mb-4 border border-amber-400/30">
            {modeConfig.name}
          </div>

          <h3 className="text-xl sm:text-2xl font-comic font-black text-white text-center mb-6 leading-relaxed">
            {q.questionText}
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={feedback !== null}
                onClick={() => handleSelectOption(opt)}
                className={`py-4 px-6 rounded-2xl font-comic font-black text-2xl sm:text-3xl border-3 transition-all cursor-pointer shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-1 ${
                  sessionState.selectedOption === opt
                    ? feedback?.isCorrect
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_5px_0_#065f46]'
                      : 'bg-rose-500 border-rose-300 text-white shadow-[0_5px_0_#9f1239]'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-amber-300 hover:border-amber-400 shadow-[0_5px_0_#1e293b]'
                }`}
              >
                {String(opt)}
              </button>
            ))}
          </div>

          {feedback && (
            <div
              className={`mt-4 font-comic font-black text-base animate-bounce ${
                feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-500 font-comic">
          Đấu Trường Toán Học • Không áp lực thời gian • Chơi hết mình cùng Ronie
        </div>
      </div>
    );
  }

  // MÀN HÌNH CHỌN 5 CHẾ ĐỘ ĐẤU TRƯỜNG
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white font-comic font-bold text-sm rounded-2xl border-2 border-slate-700 shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          Về Lâu Đài
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-comic font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ĐẤU TRƯỜNG TOÁN HỌC
            </h1>
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-cyan-200 font-comic">
            Nơi tôi luyện bản lĩnh và tư duy đỉnh cao của các Đại Hiệp Sĩ nhí!
          </p>
        </div>

        {/* Nút Toggle Bật/Tắt đếm giờ */}
        <button
          onClick={() => setIsTimerEnabled(!isTimerEnabled)}
          className={`px-3 py-1.5 rounded-xl font-comic font-black text-xs border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            isTimerEnabled
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
          }`}
          title="Bật hoặc tắt đếm ngược thời gian"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isTimerEnabled ? 'Đếm giờ: BẬT' : 'Đếm giờ: TẮT'}</span>
        </button>
      </div>

      {/* Grid 5 Chế Độ Đấu Trường */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-auto">
        {(Object.keys(ARENA_MODES_CONFIG) as ChallengeArenaMode[]).map((modeKey) => {
          const mode = ARENA_MODES_CONFIG[modeKey];
          return (
            <div
              key={modeKey}
              onClick={() => handleStartMode(modeKey)}
              className="group relative bg-slate-900/90 hover:bg-slate-800/95 backdrop-blur-md border-3 border-slate-700 hover:border-amber-400 rounded-3xl p-4 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_25px_rgba(245,158,11,0.25)] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                {mode.icon}
              </div>

              <h4 className="font-comic font-black text-base text-white group-hover:text-amber-300 mb-1">
                {mode.name}
              </h4>

              <span className="text-[10px] font-comic font-bold text-cyan-300 mb-2">
                {mode.subtitle}
              </span>

              <p className="text-[11px] text-slate-400 font-comic line-clamp-3 leading-relaxed mb-4">
                {mode.description}
              </p>

              <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:from-amber-400 group-hover:to-orange-400 text-slate-950 font-comic font-black text-xs rounded-xl shadow-[0_3px_0_#9a3412] active:translate-y-0.5 transition-all">
                Thách Đấu
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-500 font-comic pt-2 border-t border-slate-800">
        <span>© Đấu Trường La Mã Hoàng Gia • Vương Quốc Toán Học</span>
        <span>An toàn tâm lý • Không ép buộc tốc độ</span>
      </div>
    </div>
  );
};
