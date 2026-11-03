// src/app/AppShell.tsx
// Shell trung tâm kết nối toàn bộ hệ thống React UI, HUD, Modals và Phaser Game Canvas (Phase 1)

import React, { useState, useEffect } from 'react';
import type { GameScreen, IMathQuestion, IMission } from '../types/game';
import { SplashScreen } from '../features/splash/SplashScreen';
import { MainMenu } from '../features/main-menu/MainMenu';
import { RoyalCastle } from '../features/castle/RoyalCastle';
import { MissionSelection } from '../features/missions/MissionSelection';
import { ToyRoom } from '../features/toy-room/ToyRoom';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { PhaserGameContainer } from '../game/PhaserGameContainer';
import { VisualMathQuiz } from '../features/math-engine/VisualMathQuiz';
import { MissionArena } from '../features/mission-gameplay/MissionArena';
import type { IMissionConfig } from '../mission-engine';
import { RewardModal } from '../features/rewards/RewardModal';
import { DefeatEncouragementModal } from '../features/rewards/DefeatEncouragementModal';
import { ParentDashboardModal } from '../features/parent-dashboard/ParentDashboardModal';
import { CharacterShowcaseModal } from '../features/character/CharacterShowcaseModal';
import { NavigationHeader } from '../components/NavigationHeader';
import { LoadingScreen } from '../components/LoadingScreen';
import { gameBridge } from '../game/bridge/GameBridgeService';
import { generateQuestionForZone } from '../features/math-engine/mathGenerator';
import { ZONES_CONFIG } from '../features/quests/questData';
import { soundManager } from '../services/audio/AudioManager';
import { initializeDefaultProfile, saveStageProgress, recordMathSession, DEFAULT_PROFILE_ID } from '../services/storage/db';

export const AppShell: React.FC = () => {
  // Trạng thái màn hình chính
  const [screen, setScreen] = useState<GameScreen>('SPLASH');
  const [previousScreen, setPreviousScreen] = useState<GameScreen>('MAIN_MENU');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals phụ
  const [showParentDashboard, setShowParentDashboard] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [showCharacterShowcase, setShowCharacterShowcase] = useState<boolean>(false);

  // Điểm số & tiến trình
  const [totalStars, setTotalStars] = useState<number>(12);
  const [currentScore, setCurrentScore] = useState<number>(150);

  // Vùng đất & Nhiệm vụ đang chọn
  const [activeZoneId, setActiveZoneId] = useState<number>(1);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<IMathQuestion | null>(null);
  const [activeMissionConfig, setActiveMissionConfig] = useState<IMissionConfig | null>(null);
  const [pendingRewardMission, setPendingRewardMission] = useState<IMissionConfig | null>(null);
  const [showDefeatComfort, setShowDefeatComfort] = useState<boolean>(false);

  // Khởi tạo cơ sở dữ liệu Dexie khi ứng dụng khởi chạy
  useEffect(() => {
    initializeDefaultProfile().catch((err) => {
      console.warn('Lỗi khởi tạo hồ sơ Dexie:', err);
    });
  }, []);

  // Lắng nghe sự kiện từ Phaser Canvas
  useEffect(() => {
    const unsubZoneSelected = gameBridge.on('ZONE_SELECTED', (data) => {
      setActiveZoneId(data.zoneId);
      navigateTo('MISSION_SELECTION');
    });

    const unsubMathTrigger = gameBridge.on('MATH_TRIGGERED', (data) => {
      setActiveZoneId(data.zoneId);
      setActiveStageId(data.stageId);
      const q = generateQuestionForZone(data.zoneId, data.stageId);
      setCurrentQuestion(q);
      navigateTo('MATH_ARENA');
      soundManager.playTap();
    });

    const unsubAudioSfx = gameBridge.on('AUDIO_PLAY_SFX', (data) => {
      if (data.sfxKey === 'tap') soundManager.playTap();
      if (data.sfxKey === 'try_again') soundManager.playTryAgain();
    });

    return () => {
      unsubZoneSelected();
      unsubMathTrigger();
      unsubAudioSfx();
    };
  }, [screen]);

  // Quản lý BGM đa kênh tự động theo bối cảnh màn hình (Phase 6)
  useEffect(() => {
    switch (screen) {
      case 'ROYAL_CASTLE':
      case 'MAIN_MENU':
        soundManager.playBgm('castle');
        break;
      case 'WORLD_MAP':
      case 'MISSION_SELECTION':
      case 'MATH_ARENA':
        soundManager.playBgm('adventure');
        break;
      case 'MISSION_ARENA':
        soundManager.playBgm('battle');
        break;
      case 'TOY_ROOM':
        soundManager.playBgm('toy_room');
        break;
      case 'SPLASH':
      default:
        soundManager.stopBgm();
        break;
    }

    return () => {
      // Dừng giọng nói khi chuyển màn hình để tránh chồng âm
      soundManager.stopDialogueVoice();
    };
  }, [screen]);

  // Dọn dẹp tài nguyên âm thanh khi unmount
  useEffect(() => {
    return () => {
      soundManager.cleanup();
    };
  }, []);

  // Hàm chuyển đổi màn hình có hiệu ứng chuyển cảnh
  const navigateTo = (targetScreen: GameScreen, withLoading: boolean = false) => {
    setPreviousScreen(screen);
    if (withLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setScreen(targetScreen);
        setIsLoading(false);
      }, 500);
    } else {
      setScreen(targetScreen);
    }
  };

  const handleBack = () => {
    if (screen === 'MISSION_SELECTION') {
      navigateTo('WORLD_MAP');
    } else if (screen === 'MATH_ARENA') {
      navigateTo('MISSION_SELECTION');
    } else if (screen === 'MISSION_ARENA') {
      navigateTo('ROYAL_CASTLE');
    } else if (screen === 'ROYAL_CASTLE' || screen === 'TOY_ROOM' || screen === 'PROFILE' || screen === 'WORLD_MAP') {
      navigateTo('MAIN_MENU');
    } else {
      navigateTo(previousScreen || 'MAIN_MENU');
    }
  };

  const handleHome = () => {
    navigateTo('MAIN_MENU');
  };

  // Khởi động nhiệm vụ Gameplay Cốt Lõi (Phase 4)
  const handleStartMissionConfig = (config: IMissionConfig) => {
    setActiveMissionConfig(config);
    navigateTo('MISSION_ARENA', true);
  };

  // Khởi động nhiệm vụ từ Mission Selection hoặc Royal Castle
  const handleStartMission = (mission: IMission) => {
    setActiveZoneId(mission.zoneId);
    setActiveStageId(mission.stageId);
    const q = generateQuestionForZone(mission.zoneId, mission.stageId);
    setCurrentQuestion(q);
    navigateTo('MATH_ARENA', true);
  };

  const handleSelectMissionDirect = (zoneId: number, stageId: number) => {
    setActiveZoneId(zoneId);
    setActiveStageId(stageId);
    const q = generateQuestionForZone(zoneId, stageId);
    setCurrentQuestion(q);
    navigateTo('MATH_ARENA', true);
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

  const handleReturnToMissions = () => {
    setShowRewardModal(false);
    setCurrentQuestion(null);
    navigateTo('MISSION_SELECTION');
  };

  const activeZone = ZONES_CONFIG.find((z) => z.id === activeZoneId) || ZONES_CONFIG[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* LOADING CHUYỂN CẢNH KHI CẦN THIẾT */}
      {isLoading && <LoadingScreen />}

      {/* 1. MÀN HÌNH KHỞI ĐỘNG (SPLASH SCREEN) */}
      {screen === 'SPLASH' && (
        <SplashScreen onStart={() => navigateTo('MAIN_MENU', true)} />
      )}

      {/* 2. MÀN HÌNH CHÍNH (MAIN MENU) */}
      {screen === 'MAIN_MENU' && (
        <MainMenu
          onStartAdventure={() => navigateTo('WORLD_MAP', true)}
          onOpenCastle={() => navigateTo('ROYAL_CASTLE')}
          onOpenToyRoom={() => navigateTo('TOY_ROOM')}
          onOpenProfile={() => navigateTo('PROFILE')}
          onOpenMathCorner={() => {
            setActiveZoneId(1);
            navigateTo('MISSION_SELECTION');
          }}
          onOpenSettings={() => setShowParentDashboard(true)}
          onOpenShowcase={() => setShowCharacterShowcase(true)}
          totalStars={totalStars}
        />
      )}

      {/* 3. LÂU ĐÀI HOÀNG GIA (ROYAL CASTLE) */}
      {screen === 'ROYAL_CASTLE' && (
        <RoyalCastle
          onBack={handleBack}
          onHome={handleHome}
          onSelectMission={handleSelectMissionDirect}
          onSelectMissionConfig={handleStartMissionConfig}
          onOpenToyRoom={() => navigateTo('TOY_ROOM')}
          totalStars={totalStars}
          pendingRewardMission={pendingRewardMission}
          onRewardClaimed={() => setPendingRewardMission(null)}
        />
      )}

      {/* 4. BẢN ĐỒ THẾ GIỚI (WORLD MAP - PHASER 3) */}
      {screen === 'WORLD_MAP' && (
        <div className="relative w-full h-full flex flex-col">
          {/* HEADER TRÊN CÙNG */}
          <NavigationHeader
            title="Bản Đồ Vương Quốc Toán Học"
            subtitle="Chạm vào một Vùng Đất để mở nhiệm vụ"
            onBack={handleBack}
            onHome={handleHome}
            onOpenSettings={() => setShowParentDashboard(true)}
            totalStars={totalStars}
          />

          {/* PHASER 3 GAME CANVAS CONTAINER */}
          <div className="w-full h-full flex-1 relative">
            <PhaserGameContainer />
          </div>
        </div>
      )}

      {/* 5. MÀN HÌNH CHỌN NHIỆM VỤ (MISSION SELECTION) */}
      {screen === 'MISSION_SELECTION' && (
        <MissionSelection
          zoneId={activeZoneId}
          onBack={() => navigateTo('WORLD_MAP')}
          onHome={handleHome}
          onStartMission={handleStartMission}
          onStartMissionConfig={handleStartMissionConfig}
          totalStars={totalStars}
        />
      )}

      {/* 6. PHÒNG ĐỒ CHƠI (TOY ROOM) */}
      {screen === 'TOY_ROOM' && (
        <ToyRoom
          onBack={handleBack}
          onHome={handleHome}
          totalStars={totalStars}
        />
      )}

      {/* 7. HỒ SƠ RONIE (PROFILE) */}
      {screen === 'PROFILE' && (
        <ProfileScreen
          onBack={handleBack}
          onHome={handleHome}
          totalStars={totalStars}
        />
      )}

      {/* 8. ĐẤU TRƯỜNG TOÁN HỌC (MATH ARENA) */}
      {screen === 'MATH_ARENA' && currentQuestion && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950 overflow-y-auto">
          {/* NÚT QUAY LẠI CHỌN NHIỆM VỤ */}
          <button
            type="button"
            onClick={handleReturnToMissions}
            className="absolute top-4 left-4 z-30 px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-600 font-bold text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <span>👈 Quay Lại Nhiệm Vụ</span>
          </button>

          <VisualMathQuiz
            question={currentQuestion}
            onAnswer={handleAnswerQuestion}
            onClose={handleReturnToMissions}
          />
        </div>
      )}

      {/* 9. ĐẤU TRƯỜNG NHIỆM VỤ GAMEPLAY TƯƠNG TÁC (MISSION ARENA - PHASE 4) */}
      {screen === 'MISSION_ARENA' && activeMissionConfig && (
        <MissionArena
          config={activeMissionConfig}
          onReturnToCastle={() => {
            setPendingRewardMission(activeMissionConfig);
            navigateTo('ROYAL_CASTLE');
          }}
          onReturnToMissions={() => navigateTo('MISSION_SELECTION')}
        />
      )}

      {/* MODAL TRAO THƯỞNG 3 SAO */}
      {showRewardModal && (
        <RewardModal
          stars={3}
          score={currentScore}
          zoneTitle={activeZone.title}
          onNextStage={handleNextStage}
          onReturnToMap={handleReturnToMissions}
        />
      )}

      {/* MODAL ĐỘNG VIÊN AN ỦI CỦA NỮ HOÀNG KHI THẤT BẠI (PHASE 5) */}
      {showDefeatComfort && (
        <DefeatEncouragementModal
          onRetry={() => {
            setShowDefeatComfort(false);
            if (activeMissionConfig) {
              navigateTo('MISSION_ARENA', true);
            }
          }}
          onChooseEasier={() => {
            setShowDefeatComfort(false);
            navigateTo('MISSION_SELECTION');
          }}
          onGoToToyRoom={() => {
            setShowDefeatComfort(false);
            navigateTo('TOY_ROOM');
          }}
        />
      )}

      {/* MODAL SÂN KHẤU NHÂN VẬT & HỘI THOẠI (PHASE 2) */}
      {showCharacterShowcase && (
        <CharacterShowcaseModal onClose={() => setShowCharacterShowcase(false)} />
      )}

      {/* MODAL PHỤ HUYNH / CÀI ĐẶT */}
      {showParentDashboard && (
        <ParentDashboardModal onClose={() => setShowParentDashboard(false)} />
      )}
    </div>
  );
};
