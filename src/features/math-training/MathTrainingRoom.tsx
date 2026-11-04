// src/features/math-training/MathTrainingRoom.tsx
// Giao diện Hoạt Hình 3D Phòng Luyện Toán (Math Training Room) - Phase 5
// 8 Khu vực chuyên đề, 3 mức độ, tùy chọn 5-10-15 câu và tính năng tiếp tục bài học

import React, { useState, useEffect } from 'react';
import {
  TrainingRoomEngine,
  TRAINING_TOPICS_CONFIG,
} from './TrainingRoomEngine';
import type {
  TrainingTopicId,
  TrainingLevel,
  ITrainingSessionState,
} from '../../types/training-and-arena';
import { soundManager } from '../../services/audio/AudioManager';
import {
  Volume2,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Play,
  Award,
  Star,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface MathTrainingRoomProps {
  onBack: () => void;
  onSessionComplete?: (result: { expGained: number; stars: number }) => void;
}

export const MathTrainingRoom: React.FC<MathTrainingRoomProps> = ({
  onBack,
  onSessionComplete,
}) => {
  // Trạng thái chọn chủ đề & cấu hình
  const [selectedTopicId, setSelectedTopicId] = useState<TrainingTopicId>('addition_subtraction');
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevel>('practice');
  const [selectedCount, setSelectedCount] = useState<5 | 10 | 15>(5);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Phiên luyện tập đang chạy
  const [engine, setEngine] = useState<TrainingRoomEngine | null>(null);
  const [sessionState, setSessionState] = useState<ITrainingSessionState | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Khởi động nhạc nền
  useEffect(() => {
    soundManager.playBgm('castle');
  }, []);

  // Tiếp tục chủ đề đang luyện
  const lastTopicId = TrainingRoomEngine.getLastPracticedTopic();

  const handleOpenTopic = (topicId: TrainingTopicId) => {
    setSelectedTopicId(topicId);
    setShowConfigModal(true);
    soundManager.playTap();
  };

  const handleStartSession = () => {
    const newEngine = new TrainingRoomEngine(selectedTopicId, selectedLevel, selectedCount);
    setEngine(newEngine);
    setSessionState(newEngine.getState());
    setShowConfigModal(false);
    setHintText(null);
    setFeedback(null);
    soundManager.playTap();
  };

  const handleSelectOption = (opt: unknown) => {
    if (!engine || feedback) return;

    soundManager.playTap();
    const res = engine.submitAnswer(opt);
    setSessionState(engine.getState());

    if (res.isCorrect) {
      soundManager.playCorrect();
      setFeedback({ isCorrect: true, text: 'Đúng rồi! Bé thật thông minh!' });
    } else {
      soundManager.playTryAgain();
      setFeedback({ isCorrect: false, text: res.explanation || 'Chưa chính xác, cố lên bé nhé!' });
    }

    // Tự động chuyển câu sau 1.5 giây
    setTimeout(() => {
      setFeedback(null);
      setHintText(null);
      const hasNext = engine.nextQuestion();
      const updated = engine.getState();
      setSessionState(updated);

      if (!hasNext) {
        soundManager.playCelebration();
        const summary = engine.getSessionSummary();
        if (onSessionComplete) {
          onSessionComplete({ expGained: summary.expGained, stars: summary.stars });
        }
      }
    }, 1500);
  };

  const handleListenQuestion = () => {
    if (sessionState?.currentQuestion) {
      soundManager.speakVietnamese(sessionState.currentQuestion.questionText);
    }
  };

  const handleShowHint = () => {
    if (!engine) return;
    const hint = engine.useHint();
    setHintText(hint);
    soundManager.speakVietnamese(hint);
  };

  // MÀN HÌNH TỔNG KẾT
  if (sessionState?.isCompleted && engine) {
    const summary = engine.getSessionSummary();
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-950 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-md border-4 border-amber-400 rounded-3xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="text-6xl mb-3 animate-bounce">🏆</div>
          <h2 className="text-2xl font-comic font-black text-amber-300 drop-shadow-md mb-2">
            HOÀN THÀNH LUYỆN TẬP!
          </h2>
          <p className="text-slate-300 text-sm mb-4 font-comic">{summary.queenFeedback}</p>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 ${
                  star <= summary.stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_#f59e0b]'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-2xl mb-6 border border-slate-700">
            <div>
              <span className="text-[11px] text-slate-400 font-comic block">Chính xác</span>
              <span className="text-xl font-black text-emerald-400 font-comic">
                {summary.accuracy}%
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-comic block">Câu đúng</span>
              <span className="text-xl font-black text-cyan-400 font-comic">
                {summary.correctCount}/{summary.totalQuestions}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-comic block">EXP nhận</span>
              <span className="text-xl font-black text-amber-400 font-comic">
                +{summary.expGained}
              </span>
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
              Chọn Chủ Đề Khác
            </button>
            <button
              onClick={handleStartSession}
              className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-comic font-black rounded-2xl shadow-[0_4px_0_#334155] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Luyện Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MÀN HÌNH ĐANG LUYỆN TẬP
  if (sessionState && !sessionState.isCompleted && sessionState.currentQuestion) {
    const q = sessionState.currentQuestion;
    const progressPercent = Math.round(
      (sessionState.currentIndex / sessionState.questions.length) * 100
    );

    return (
      <div className="relative w-full min-h-screen bg-gradient-to-b from-sky-400 via-indigo-900 to-slate-950 flex flex-col justify-between p-3 sm:p-5 select-none">
        {/* Top Header */}
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-amber-400 shadow-md">
          <button
            onClick={() => {
              setEngine(null);
              setSessionState(null);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-comic font-bold border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            Rời phòng
          </button>

          <div className="flex-1 mx-4 max-w-xs">
            <div className="flex justify-between text-xs text-amber-300 font-comic font-bold mb-1">
              <span>
                Câu {sessionState.currentIndex + 1}/{sessionState.questions.length}
              </span>
              <span>Đúng: {sessionState.correctCount}</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShowHint}
              className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl border border-amber-400/40"
              title="Xem gợi ý"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
            <button
              onClick={handleListenQuestion}
              className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl border border-cyan-400/40"
              title="Nghe Nữ Hoàng đọc đề"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nội dung câu hỏi */}
        <div className="w-full max-w-2xl mx-auto my-auto bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-3 border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center">
          {hintText && (
            <div className="w-full mb-4 p-3 bg-amber-950/60 border border-amber-400/50 rounded-2xl text-xs text-amber-200 font-comic flex items-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{hintText}</span>
            </div>
          )}

          <h3 className="text-xl sm:text-2xl font-comic font-black text-white text-center mb-6 leading-relaxed">
            {q.questionText}
          </h3>

          {/* Đáp án lựa chọn */}
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

        <div className="text-center text-xs text-slate-400 font-comic">
          Vương Quốc Toán Học Lớp 1 GDPT 2018 • Đồng hành cùng Nữ Hoàng Nhi Mami & Ronie
        </div>
      </div>
    );
  }

  // MÀN HÌNH CHÍNH: PHÒNG LUYỆN TOÁN VỚI 8 KHU VỰC
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-sky-500 via-indigo-950 to-slate-950 p-4 sm:p-6 flex flex-col justify-between select-none">
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
          <h1 className="text-2xl sm:text-3xl font-comic font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            PHÒNG LUYỆN TOÁN HOÀNG GIA
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200 font-comic">
            Chọn một góc học tập đáng yêu để tự do rèn luyện cùng Ronie nhé!
          </p>
        </div>

        {/* Nút tiếp tục chủ đề đang luyện */}
        <button
          onClick={() => handleOpenTopic(lastTopicId)}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-comic font-black text-xs rounded-2xl shadow-[0_3px_0_#065f46] cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          Tiếp tục chủ đề đang luyện
        </button>
      </div>

      {/* Grid 8 Khu Vực Chuyên Đề */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-auto">
        {(Object.keys(TRAINING_TOPICS_CONFIG) as TrainingTopicId[]).map((topicId) => {
          const topic = TRAINING_TOPICS_CONFIG[topicId];
          return (
            <div
              key={topicId}
              onClick={() => handleOpenTopic(topicId)}
              className="group relative bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border-3 border-slate-700 hover:border-amber-400 rounded-3xl p-4 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_20px_rgba(245,158,11,0.2)] cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr flex items-center justify-center text-3xl mb-2 shadow-inner group-hover:scale-110 transition-transform">
                {topic.icon}
              </div>

              <h4 className="font-comic font-black text-base text-white group-hover:text-amber-300 mb-1">
                {topic.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-comic line-clamp-2 leading-relaxed">
                {topic.description}
              </p>

              <span className="mt-3 text-[10px] font-comic font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                Luyện tập ngay
              </span>
            </div>
          );
        })}
      </div>

      {/* MODAL CẤU HÌNH PHIÊN LUYỆN TẬP */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <h3 className="text-xl font-comic font-black text-amber-300 text-center mb-1">
              {TRAINING_TOPICS_CONFIG[selectedTopicId].name}
            </h3>
            <p className="text-xs text-slate-300 text-center font-comic mb-5">
              {TRAINING_TOPICS_CONFIG[selectedTopicId].stationName}
            </p>

            {/* Chọn Mức Độ */}
            <div className="mb-4">
              <label className="text-xs font-comic font-bold text-slate-300 mb-2 block">
                1. Chọn mức độ thử thách:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'practice', label: 'Luyện tập', icon: '🌱' },
                  { id: 'advanced', label: 'Nâng cao', icon: '⭐' },
                  { id: 'expert', label: 'Chuyên gia', icon: '👑' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id as TrainingLevel)}
                    className={`py-2 px-1 rounded-xl text-xs font-comic font-black border-2 transition-all cursor-pointer ${
                      selectedLevel === lvl.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="block text-base mb-0.5">{lvl.icon}</span>
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Số Câu Hỏi */}
            <div className="mb-6">
              <label className="text-xs font-comic font-bold text-slate-300 mb-2 block">
                2. Chọn số lượng câu hỏi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setSelectedCount(cnt as 5 | 10 | 15)}
                    className={`py-2 rounded-xl text-xs font-comic font-black border-2 transition-all cursor-pointer ${
                      selectedCount === cnt
                        ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md scale-105'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {cnt} câu hỏi
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-comic font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleStartSession}
                className="flex-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-comic font-black text-sm rounded-xl shadow-[0_3px_0_#065f46] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Bắt Đầu Luyện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400 font-comic pt-2 border-t border-slate-800">
        <span>© Vương Quốc Toán Học • Bản quyền Ronie & Nhi Mami</span>
        <span>Chuẩn Bộ GD&ĐT 2018</span>
      </div>
    </div>
  );
};
