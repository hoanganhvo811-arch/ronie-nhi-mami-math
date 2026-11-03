// src/app/AppShell.tsx
// Shell trung tâm kết nối toàn bộ hệ thống React UI, HUD, Modals và Phaser Game Canvas

import React, { useState, useEffect } from 'react';
import { Home, Shirt, Shield, Volume2, VolumeX, Star, MapPin } from 'lucide-react';
import type { GameScreen, IMathQuestion } from '../types/game';
import { MainMenu } from '../features/main-menu/MainMenu';
import { PhaserGameContainer } from '../game/PhaserGameContainer';
import { VisualMathQuiz } from '../features/math-engine/VisualMathQuiz';
import { DialogueOverlay } from '../features/dialogue/DialogueOverlay';
import { RewardModal } from '../features/rewards/RewardModal';
import { InventoryModal } from '../features/inventory/InventoryModal';
import { ParentDashboardModal } from '../features/parent-dashboard/ParentDashboardModal';
import { RonieAvatar } from '../features/character/RonieAvatar';
import { gameBridge } from '../game/bridge/GameBridgeService';
import { generateQuestionForZone } from '../features/math-engine/mathGenerator';
import { ZONES_CONFIG } from '../features/quests/questData';
import { soundManager } from '../services/audio/AudioManager';
import { initializeDefaultProfile, saveStageProgress, recordMathSession, DEFAULT_PROFILE_ID } from '../services/storage/db';

export const AppShell: React.FC = () => {
  // Trạng thái màn hình chính
  const [screen, setScreen] = useState<GameScreen>('MAIN_MENU');

  // Modals phụ
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showParentDashboard, setShowParentDashboard] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [showIntroDialogue, setShowIntroDialogue] = useState<boolean>(false);

  // Tiến trình và điểm số
  const [totalStars, setTotalStars] = useState<number>(12);
  const [currentScore, setCurrentScore] = useState<number>(150);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());

  // Câu hỏi toán học hiện tại
  const [activeZoneId, setActiveZoneId] = useState<number>(1);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<IMathQuestion | null>(null);

  // Khởi tạo cơ sở dữ liệu Dexie khi ứng dụng khởi chạy
  useEffect(() => {
    initializeDefaultProfile().catch((err) => {
      console.warn('Lỗi khởi tạo hồ sơ Dexie:', err);
    });
  }, []);

  // Lắng nghe sự kiện từ Phaser Canvas
  useEffect(() => {
    const unsubMathTrigger = gameBridge.on('MATH_TRIGGERED', (data) => {
      setActiveZoneId(data.zoneId);
      setActiveStageId(data.stageId);
      const q = generateQuestionForZone(data.zoneId, data.stageId);
      setCurrentQuestion(q);
      setScreen('MATH_ARENA');
      soundManager.playTap();
    });

    return () => {
      unsubMathTrigger();
    };
  }, []);

  const handleStartAdventure = () => {
    setScreen('WORLD_MAP');
    setShowIntroDialogue(true);
  };

  const handleAnswerQuestion = async (correct: boolean) => {
    if (!currentQuestion) return;

    if (correct) {
      const earnedStars = 3;
      const scoreGain = 100;
      setTotalStars((prev) => prev + earnedStars);
      setCurrentScore((prev) => prev + scoreGain);

      // Lưu vào cơ sở dữ liệu Dexie
      try {
        await saveStageProgress(DEFAULT_PROFILE_ID, activeZoneId, activeStageId, earnedStars, scoreGain);
        await recordMathSession(
          DEFAULT_PROFILE_ID,
          currentQuestion.topicKey,
          1,
          1,
          0,
          25
        );
      } catch (err) {
        console.warn('Lỗi ghi dữ liệu Dexie:', err);
      }

      setShowRewardModal(true);
    }
  };

  const handleNextStage = () => {
    setShowRewardModal(false);
    const nextQ = generateQuestionForZone(activeZoneId, activeStageId + 1);
    setCurrentQuestion(nextQ);
  };

  const handleReturnToMap = () => {
    setShowRewardModal(false);
    setCurrentQuestion(null);
    setScreen('WORLD_MAP');
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const activeZone = ZONES_CONFIG.find((z) => z.id === activeZoneId) || ZONES_CONFIG[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* 1. MÀN HÌNH MENU CHÍNH */}
      {screen === 'MAIN_MENU' && (
        <MainMenu
          onStartAdventure={handleStartAdventure}
          onOpenInventory={() => setShowInventory(true)}
          onOpenParentDashboard={() => setShowParentDashboard(true)}
          totalStars={totalStars}
        />
      )}

      {/* 2. MÀN HÌNH BẢN ĐỒ THẾ GIỚI PHASER */}
      {screen === 'WORLD_MAP' && (
        <div className="relative w-full h-full flex flex-col">
          {/* TOP IN-GAME HUD OVERLAY */}
          <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 md:p-4 pointer-events-none">
            {/* THÔNG TIN RONIE */}
            <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/40 shadow-xl pointer-events-auto">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setScreen('MAIN_MENU');
                }}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Về Menu Chính"
              >
                <Home className="w-5 h-5 text-amber-300" />
              </button>

              <div className="h-6 w-px bg-slate-700" />

              <div className="flex items-center gap-2">
                <RonieAvatar size="sm" state="idle" />
                <div>
                  <div className="text-white text-xs font-black">Bé Ronie</div>
                  <div className="text-amber-300 text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
                    <span>{totalStars} Sao</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VÙNG ĐẤT HIỆN TẠI & HÀNH ĐỘNG */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-cyan-300 rounded-xl border border-cyan-400/30 text-xs font-bold">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Bản Đồ 5 Vùng Đất</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setShowInventory(true);
                }}
                className="p-2.5 bg-slate-900/85 hover:bg-slate-800 text-amber-300 rounded-2xl border border-amber-400/40 shadow-lg transition-all active:scale-95 cursor-pointer"
                title="Tủ đồ Ronie"
              >
                <Shirt className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleToggleSound}
                className="p-2.5 bg-slate-900/85 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700 shadow-lg transition-all active:scale-95 cursor-pointer"
                title="Bật/Tắt âm thanh"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setShowParentDashboard(true);
                }}
                className="p-2.5 bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 rounded-2xl border border-indigo-400/40 shadow-lg transition-all active:scale-95 cursor-pointer"
                title="Khu vực phụ huynh"
              >
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* PHASER 3 GAME CANVAS CONTAINER */}
          <div className="w-full h-full flex-1">
            <PhaserGameContainer />
          </div>

          {/* LỜI THOẠI HƯỚNG DẪN ĐẦU TIÊN CỦA NỮ HOÀNG */}
          {showIntroDialogue && (
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4">
              <DialogueOverlay
                speaker="queen"
                message="Ronie ơi! Hãy bấm vào một Vùng Đất trên bản đồ để bắt đầu thử thách toán học nhé!"
                actionText="Con đã hiểu!"
                onNext={() => setShowIntroDialogue(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. MÀN HÌNH ĐẤU TRƯỜNG TOÁN HỌC (MATH ARENA MODAL) */}
      {screen === 'MATH_ARENA' && currentQuestion && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950 overflow-y-auto">
          {/* NÚT THOÁT VỀ BẢN ĐỒ */}
          <button
            type="button"
            onClick={handleReturnToMap}
            className="absolute top-4 left-4 z-30 px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-600 font-bold text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-amber-300" />
            <span>Về Bản Đồ</span>
          </button>

          <VisualMathQuiz
            question={currentQuestion}
            onAnswer={handleAnswerQuestion}
            onClose={handleReturnToMap}
          />
        </div>
      )}

      {/* 4. MODAL TRAO THƯỞNG 3 SAO */}
      {showRewardModal && (
        <RewardModal
          stars={3}
          score={currentScore}
          zoneTitle={activeZone.title}
          onNextStage={handleNextStage}
          onReturnToMap={handleReturnToMap}
        />
      )}

      {/* 5. MODAL TỦ ĐỒ */}
      {showInventory && <InventoryModal onClose={() => setShowInventory(false)} />}

      {/* 6. MODAL PHỤ HUYNH */}
      {showParentDashboard && <ParentDashboardModal onClose={() => setShowParentDashboard(false)} />}
    </div>
  );
};
