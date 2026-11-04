// src/features/mission-gameplay/MissionArena.tsx
// Sân khấu chính kết nối Gameplay Visual Controller, Unified Mission Engine và Ngân hàng câu hỏi Toán Lớp 1

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  HelpCircle,
  Pause,
  ArrowLeft,
  Heart,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { IMissionConfig, IMissionRunState } from '../../mission-engine/types';
import { MissionEngine } from '../../mission-engine/MissionEngine';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { RonieAvatar } from '../character/RonieAvatar';

// 6 Visual Controllers
import { RescueRopeController } from './RescueRopeController';
import { PushMonsterController } from './PushMonsterController';
import { BridgeCrossingController } from './BridgeCrossingController';
import { TreasureChestController } from './TreasureChestController';
import { ShutdownMachineController } from './ShutdownMachineController';
import { MathRacingController } from './MathRacingController';

// Modals
import { MissionPauseModal } from './MissionPauseModal';
import { MissionResultModal } from './MissionResultModal';

interface MissionArenaProps {
  config: IMissionConfig;
  onReturnToCastle: () => void;
  onReturnToMissions: () => void;
}

export const MissionArena: React.FC<MissionArenaProps> = ({
  config,
  onReturnToCastle,
  onReturnToMissions,
}) => {
  // Khởi tạo Unified Mission Engine
  const [engine] = useState(() => new MissionEngine(config));
  const [runState, setRunState] = useState<IMissionRunState>(() => engine.getState());
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<unknown>(null);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setRunState(newState);
      // Reset lựa chọn khi qua câu hỏi mới
      setSelectedOption(null);
      setShowHint(false);
    });
    return () => unsubscribe();
  }, [engine]);

  // Đọc đề bài bằng giọng tiếng Việt (Phase 6: không spoil đáp án & chống spam)
  const handleSpeakQuestion = () => {
    if (runState.currentQuestion) {
      soundManager.playTap();
      VoiceSystem.narrateQuestion(runState.currentQuestion.questionText);
    }
  };

  // Bật/tắt gợi ý sư phạm
  const handleToggleHint = () => {
    soundManager.playTap();
    setShowHint((prev) => !prev);
    if (!showHint && runState.currentQuestion?.hint) {
      VoiceSystem.speakCharacter('queen', runState.currentQuestion.hint.text);
    }
  };

  // Trả lời câu hỏi
  const handleSelectOption = (opt: unknown) => {
    if (runState.isActionAnimating || runState.state !== 'PLAYING') return;
    setSelectedOption(opt);
    engine.submitAnswer(opt);
  };

  // Chọn Visual Controller phù hợp
  const renderGameplayController = () => {
    switch (config.gameplayType) {
      case 'RESCUE_ROPE':
        return <RescueRopeController runState={runState} />;
      case 'PUSH_BACK_MONSTER':
        return <PushMonsterController runState={runState} />;
      case 'BRIDGE_CROSSING':
        return <BridgeCrossingController runState={runState} />;
      case 'TREASURE_CHEST':
        return <TreasureChestController runState={runState} />;
      case 'SHUTDOWN_MACHINE':
        return <ShutdownMachineController runState={runState} />;
      case 'MATH_RACING':
        return <MathRacingController runState={runState} />;
      default:
        return <RescueRopeController runState={runState} />;
    }
  };

  const currentQ = runState.currentQuestion;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-sky-400 via-indigo-950 to-slate-950 flex flex-col justify-between p-3 sm:p-5 select-none overflow-x-hidden">
      {/* CÁC ĐÁM MÂY & ÁNH SAO HUYỀN ẢO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 left-6 text-5xl opacity-40 animate-pulse">☁️</div>
        <div className="absolute top-8 right-10 text-5xl opacity-40">☁️</div>
        <div className="absolute top-36 left-12 text-3xl opacity-60 animate-bounce">✨</div>
        <div className="absolute top-48 right-16 text-3xl opacity-60 animate-spin">🌟</div>
      </div>

      {/* 1. TOP HUD BAR */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-2.5 rounded-3xl border-3 border-amber-300 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.4)] z-30">
        {/* NÚT THOÁT / TẠM DỪNG */}
        <button
          onClick={() => engine.pause()}
          className="p-2 sm:px-3 bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:translate-y-1 text-white rounded-2xl flex items-center gap-1.5 text-xs font-comic font-black cursor-pointer shadow-[0_3px_0_#334155] border border-slate-600"
          title="Tạm dừng"
        >
          <Pause className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Tạm dừng</span>
        </button>

        {/* THÔNG TIN NHIỆM VỤ & TIẾN TRÌNH */}
        <div className="flex-1 flex flex-col items-center mx-2 max-w-xs sm:max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-comic font-black text-amber-300 truncate drop-shadow-sm">
              {config.title}
            </span>
            <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-comic font-black rounded-full shadow-sm">
              {config.region}
            </span>
          </div>

          {/* THANH TIẾN ĐỘ 100% */}
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border-2 border-amber-400/60 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${runState.progress}%` }}
            />
          </div>
        </div>

        {/* SỐ LẦN SAI CÒN LẠI (TRÁI TIM) */}
        <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-rose-500/40">
          {Array.from({ length: config.maxMistakes }).map((_, idx) => {
            const isBroken = idx < runState.mistakesCount;
            return (
              <span key={idx} className="text-base sm:text-lg animate-pulse">
                {isBroken ? '🖤' : '❤️'}
              </span>
            );
          })}
        </div>
      </div>

      {/* 2. KHU VỰC GAMEPLAY VISUAL (TRỰC QUAN HÓA TƯƠNG TÁC) */}
      <div className="w-full max-w-4xl mx-auto my-3 z-20">
        {renderGameplayController()}
      </div>

      {/* 3. KHU VỰC TƯƠNG TÁC CÂU HỎI TOÁN HỌC */}
      <div className="w-full max-w-4xl mx-auto z-20">
        {/* NẾU ĐANG Ở GIAI ĐOẠN INTRO (MỞ ĐẦU NHIỆM VỤ) */}
        {runState.state === 'INTRO' && (
          <div className="w-full bg-gradient-to-b from-pink-50 to-amber-50 rounded-3xl p-5 sm:p-6 border-4 border-pink-300 shadow-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="shrink-0 flex items-center gap-2">
              <QueenNhiMamiAvatar size="md" state="greeting" variant="photo" />
              <RonieAvatar size="md" state="idle" variant="photo" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-comic font-black text-rose-600 mb-1">
                Lệnh Hoàng Gia từ Nữ Hoàng Nhi Mami:
              </h3>
              <p className="text-xs sm:text-sm font-comic font-bold text-slate-700 leading-relaxed mb-3">
                "{config.dialogue.intro}"
              </p>
              <button
                onClick={() => {
                  soundManager.playTap();
                  engine.startPlaying();
                }}
                className="py-3 px-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-95 text-white font-comic font-black text-sm rounded-2xl shadow-xl border-2 border-white cursor-pointer transition-all animate-bounce"
              >
                🚀 BẮT ĐẦU NHIỆM VỤ NGAY!
              </button>
            </div>
          </div>
        )}

        {/* NẾU ĐANG CHƠI (PLAYING / PAUSED) */}
        {(runState.state === 'PLAYING' || runState.state === 'PAUSED') && currentQ && (
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-4 border-amber-300 shadow-2xl flex flex-col items-center">
            {/* THANH ĐIỀU KHIỂN CÂU HỎI: SỐ THỨ TỰ, ÂM THANH & GỢI Ý */}
            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-comic font-black rounded-full text-xs">
                  Câu hỏi {runState.currentQuestionIndex + 1} / {config.questionCount}
                </span>
                <span className="text-[10px] font-comic font-bold text-slate-500">
                  {currentQ.curriculumReference}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* NÚT NGHE ĐỀ BÀI */}
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow font-comic font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-90"
                  title="Đọc to đề bài"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Nghe đề</span>
                </button>

                {/* NÚT GỢI Ý */}
                <button
                  type="button"
                  onClick={handleToggleHint}
                  className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow font-comic font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-90"
                  title="Gợi ý sư phạm"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Gợi ý</span>
                </button>
              </div>
            </div>

            {/* ĐỀ BÀI CÂU HỎI */}
            <h3 className="text-base sm:text-xl font-comic font-black text-slate-800 text-center leading-snug my-2">
              {currentQ.questionText}
            </h3>

            {/* MINH HỌA TRỰC QUAN HÓA TOÁN HỌC DÀNH CHO TRẺ LỚP 1 */}
            {currentQ.visualData && (
              <div className="w-full min-h-[70px] bg-sky-50/80 rounded-2xl p-2.5 my-2 border-2 border-sky-100 flex flex-wrap items-center justify-center gap-2">
                {/* 1. Đếm vật thể */}
                {currentQ.visualData.items && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {currentQ.visualData.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl shadow-sm border border-sky-100">
                        {Array.from({ length: item.count }).map((_, i) => (
                          <span key={i} className="text-2xl sm:text-3xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                            {item.emoji}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. So sánh 2 biểu thức / số */}
                {currentQ.visualData.comparisonValues && (
                  <div className="flex items-center gap-4 text-2xl font-comic font-black text-indigo-900 bg-white px-4 py-1.5 rounded-2xl shadow-sm border border-indigo-200">
                    <span className="text-3xl text-rose-600">{currentQ.visualData.comparisonValues.left}</span>
                    <span className="px-3 py-1 bg-amber-300 rounded-xl text-amber-950 text-xl font-black">?</span>
                    <span className="text-3xl text-emerald-600">{currentQ.visualData.comparisonValues.right}</span>
                  </div>
                )}

                {/* 3. Hình học */}
                {currentQ.visualData.shapes && (
                  <div className="flex items-center gap-3">
                    {currentQ.visualData.shapes.map((s, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className="w-12 h-12 flex items-center justify-center border-2 border-white shadow-md"
                          style={{
                            backgroundColor: s.color,
                            borderRadius: s.type === 'circle' ? '9999px' : s.type === 'square' ? '12px' : '6px',
                          }}
                        >
                          <span className="text-white font-comic font-black text-xs uppercase">{s.type[0]}</span>
                        </div>
                        {s.label && <span className="text-[10px] font-comic font-bold text-slate-600 mt-1">{s.label}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Đo độ dài Ruler cm */}
                {currentQ.visualData.rulerCm && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{currentQ.visualData.rulerCm.objectEmoji}</span>
                    <div className="flex items-center bg-amber-200 px-3 py-1 rounded-lg border border-amber-400 font-comic font-black text-xs text-amber-950">
                      📏 Thước đo: {currentQ.visualData.rulerCm.objectName} dài ? cm
                    </div>
                  </div>
                )}

                {/* 5. Đồng hồ giờ đúng */}
                {currentQ.visualData.clockTime && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl shadow-sm border border-slate-200">
                    <span className="text-3xl">⏰</span>
                    <span className="font-comic font-black text-slate-800 text-sm">
                      Đồng hồ chỉ mấy giờ đúng?
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* GỢI Ý SƯ PHẠM (KHI BẬT) */}
            {showHint && currentQ.hint && (
              <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 my-2 text-left animate-fade-in">
                <span className="text-xs font-comic font-black text-amber-900 block mb-0.5">
                  💡 Gợi ý của Nhi Mami:
                </span>
                <span className="text-xs font-comic font-bold text-slate-700">
                  {currentQ.hint.text}
                </span>
              </div>
            )}

            {/* CÁC NÚT ĐÁP ÁN LỰA CHỌN 3D VUI NHỘN */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const colors = [
                  'from-rose-400 via-rose-500 to-rose-600 border-rose-300 text-white shadow-[0_6px_0_#9f1239]',
                  'from-amber-400 via-amber-500 to-amber-600 border-amber-200 text-amber-950 shadow-[0_6px_0_#92400e]',
                  'from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300 text-white shadow-[0_6px_0_#065f46]',
                  'from-sky-400 via-sky-500 to-sky-600 border-sky-300 text-white shadow-[0_6px_0_#0369a1]',
                ];
                const colorTheme = colors[idx % colors.length];

                return (
                  <button
                    key={idx}
                    disabled={runState.isActionAnimating}
                    onClick={() => handleSelectOption(option)}
                    className={`relative py-3.5 sm:py-4 px-3 rounded-2xl font-comic font-black text-xl sm:text-2xl border-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 text-amber-950 border-white shadow-[0_6px_0_#b45309] scale-105'
                        : `bg-gradient-to-b ${colorTheme} active:translate-y-1 active:shadow-none hover:scale-105`
                    } ${runState.isActionAnimating ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <div className="absolute top-1 inset-x-2 h-2.5 bg-white/30 rounded-full pointer-events-none" />
                    <span className="relative z-10 drop-shadow-sm">{option.toString()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. MODALS TẠM DỪNG & KẾT QUẢ */}
      <MissionPauseModal
        isOpen={runState.state === 'PAUSED'}
        onResume={() => engine.resume()}
        onRetry={() => engine.retry()}
        onReturnToCastle={onReturnToCastle}
        onReturnToMissions={onReturnToMissions}
      />

      <MissionResultModal
        config={config}
        runState={runState}
        onRetry={() => engine.retry()}
        onReturnToCastle={onReturnToCastle}
        onReturnToMissions={onReturnToMissions}
      />
    </div>
  );
};
