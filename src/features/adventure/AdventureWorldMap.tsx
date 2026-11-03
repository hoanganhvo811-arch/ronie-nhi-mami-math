// src/features/adventure/AdventureWorldMap.tsx
// Bản Đồ Khám Phá 6 Vùng Đất & Cốt Truyện 6 Chương Dài Hạn (Phase 8)

import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  Star,
  BookOpen,
  Compass,
  Gift,
  CheckCircle2,
  Dice5,
  Calendar,
  ChevronRight,
  Shield,
  Heart,
} from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';
import {
  ADVENTURE_REGIONS,
  CHAPTERS_CATALOG,
} from './adventureCatalog';
import { AdventureEngine } from './adventureEngine';
import { ChapterStoryModal } from './ChapterStoryModal';
import { RandomEventModal } from './RandomEventModal';
import type { IAdventureRegion, IChapterStory, IRandomWorldEvent } from '../../types/adventure';

interface AdventureWorldMapProps {
  onBack: () => void;
  onHome: () => void;
  totalStars?: number;
  completedMissionIds?: string[];
  playerBadges?: string[];
  onSelectRegion: (region: IAdventureRegion) => void;
  onOpenParentDashboard?: () => void;
}

export const AdventureWorldMap: React.FC<AdventureWorldMapProps> = ({
  onBack,
  onHome,
  totalStars = 12,
  completedMissionIds = ['m_1_1', 'm_2_1'],
  playerBadges = ['badge_bravery'],
  onSelectRegion,
  onOpenParentDashboard,
}) => {
  const [viewMode, setViewMode] = useState<'REGIONS' | 'CHAPTERS'>('REGIONS');
  const [activeStoryChapter, setActiveStoryChapter] = useState<IChapterStory | null>(null);
  const [randomEvent, setRandomEvent] = useState<IRandomWorldEvent | null>(null);

  // Nhiệm vụ hàng ngày dịu dàng (Gentle Daily Quest)
  const [dailyQuest, setDailyQuest] = useState(() => AdventureEngine.getTodayDailyQuest());
  const [currentStars, setCurrentStars] = useState<number>(totalStars);

  const regions = AdventureEngine.getAllRegions();
  const chapters = AdventureEngine.getChapters();

  const handleTriggerRandomEvent = () => {
    soundManager.playTap();
    const evt = AdventureEngine.getRandomWorldEvent();
    setRandomEvent(evt);
  };

  const handleClaimDailyQuest = () => {
    if (dailyQuest.isCompleted) return;
    soundManager.playCorrect();
    VoiceSystem.givePositiveFeedback('Chúc mừng bé hoàn thành nhiệm vụ hàng ngày!');
    AdventureEngine.markDailyQuestCompleted(dailyQuest.dateKey);
    setDailyQuest((prev) => ({ ...prev, isCompleted: true, currentCount: prev.targetCount }));
    setCurrentStars((prev) => prev + dailyQuest.rewardStars);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-x-hidden select-none">
      {/* HEADER ĐIỀU HƯỚNG */}
      <NavigationHeader
        title="Bản Đồ Vương Quốc Toán Học"
        subtitle="Hành trình khám phá 6 Vùng Đất & 6 Chương Cốt Truyện"
        onBack={onBack}
        onHome={onHome}
        onOpenSettings={onOpenParentDashboard}
        totalStars={currentStars}
        rightAddon={
          <button
            type="button"
            onClick={handleTriggerRandomEvent}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-rose-400 hover:brightness-110 active:scale-90 text-slate-950 font-comic font-black text-xs rounded-xl shadow-md border border-white flex items-center gap-1.5 cursor-pointer transition-all"
            title="Khám phá sự kiện bất ngờ"
          >
            <Dice5 className="w-4 h-4 text-slate-950 animate-spin" />
            <span className="hidden sm:inline">Sự Kiện Bất Ngờ</span>
          </button>
        }
      />

      {/* BANNER NHIỆM VỤ HÀNG NGÀY & CHUYỂN TAB */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-3 z-20">
        {/* BANNER NHIỆM VỤ HÀNG NGÀY KHÔNG GÂY ÁP LỰC */}
        <div className="w-full bg-gradient-to-r from-pink-500/20 via-amber-500/20 to-indigo-500/20 backdrop-blur-md rounded-2xl p-3 border-2 border-amber-300/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-comic font-black text-lg shadow shrink-0">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-comic font-black text-amber-300">
                  Nhiệm Vụ Nhỏ Hôm Nay:
                </span>
                <span className="text-xs font-comic font-bold text-white">
                  {dailyQuest.title}
                </span>
              </div>
              <p className="text-[11px] font-comic font-bold text-slate-300">
                {dailyQuest.encouragingNote}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClaimDailyQuest}
            disabled={dailyQuest.isCompleted}
            className={`px-4 py-2 rounded-xl text-xs font-comic font-black flex items-center gap-1.5 transition-all shadow cursor-pointer shrink-0 ${
              dailyQuest.isCompleted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 hover:brightness-110 active:scale-95'
            }`}
          >
            {dailyQuest.isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Đã Hoàn Thành (+{dailyQuest.rewardStars} ⭐)</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Nhận Thưởng +{dailyQuest.rewardStars} Sao</span>
              </>
            )}
          </button>
        </div>

        {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ XEM: 6 VÙNG ĐẤT / 6 CHƯƠNG */}
        <div className="flex justify-center mb-3">
          <div className="bg-slate-800/90 p-1 rounded-2xl border border-slate-700 flex gap-1 shadow-md">
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                setViewMode('REGIONS');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-comic font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'REGIONS'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Bản Đồ 6 Vùng Đất</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                setViewMode('CHAPTERS');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-comic font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'CHAPTERS'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Cốt Truyện 6 Chương</span>
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH 6 VÙNG ĐẤT (VIEW MODE: REGIONS) */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-6 overflow-y-auto">
        {viewMode === 'REGIONS' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region) => {
              const unlockInfo = AdventureEngine.checkRegionUnlocked(
                region,
                currentStars,
                completedMissionIds,
                playerBadges
              );

              return (
                <div
                  key={region.id}
                  className={`relative rounded-3xl p-5 border-3 transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
                    unlockInfo.isUnlocked
                      ? 'bg-slate-900/90 border-amber-300/80 hover:border-amber-400 hover:scale-[1.02]'
                      : 'bg-slate-900/50 border-slate-800 opacity-80'
                  }`}
                >
                  {/* BACKGROUND BANNER MINI THEO VÙNG */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-r ${region.bgGradient} opacity-30 pointer-events-none`}
                  />

                  {/* THÔNG TIN CHÍNH CỦA VÙNG */}
                  <div className="relative z-10 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{region.icon}</span>
                        <div>
                          <span className="text-[10px] font-comic font-bold text-amber-300 uppercase">
                            Vùng {region.numericId} • {region.curriculumCategory}
                          </span>
                          <h4 className="text-lg font-comic font-black text-white leading-tight">
                            {region.name}
                          </h4>
                        </div>
                      </div>

                      {/* ICON KHÓA / MỞ */}
                      <div
                        className={`p-1.5 rounded-xl text-xs font-comic font-black flex items-center gap-1 ${
                          unlockInfo.isUnlocked
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {unlockInfo.isUnlocked ? (
                          <Unlock className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-comic font-bold text-slate-300 leading-snug mb-2">
                      {region.subtitle}
                    </p>

                    <p className="text-[11px] font-comic text-slate-400 leading-relaxed italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 mb-2">
                      "{region.shortLore}"
                    </p>

                    {/* NHÂN VẬT & PHẦN THƯỞNG RIÊNG */}
                    <div className="flex items-center justify-between text-[11px] font-comic font-bold text-slate-300 border-t border-slate-800 pt-2">
                      <span className="text-amber-300">
                        👤 {region.primaryCharacter.name}
                      </span>
                      <span className="text-pink-300 flex items-center gap-1">
                        🎁 {region.uniqueReward.name}
                      </span>
                    </div>
                  </div>

                  {/* NÚT THAO TÁC / LỜI NHẮC MỞ KHÓA */}
                  <div className="relative z-10 pt-2 border-t border-slate-800">
                    {unlockInfo.isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playTap();
                          onSelectRegion(region);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-rose-400 hover:brightness-110 active:scale-95 text-slate-950 font-comic font-black text-xs rounded-2xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Khám Phá Vùng Đất 🚀</span>
                      </button>
                    ) : (
                      <div className="text-center py-2 px-3 bg-slate-800/80 rounded-2xl text-[11px] font-comic font-bold text-slate-400">
                        🔒 {unlockInfo.reason}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DANH SÁCH 6 CHƯƠNG CỐT TRUYỆN (VIEW MODE: CHAPTERS) */
          <div className="space-y-3">
            {chapters.map((chap) => {
              const status = AdventureEngine.evaluateChapterStatus(
                chap,
                currentStars,
                ['chapter_1'] // Ví dụ chương 1 đã xong
              );

              return (
                <div
                  key={chap.id}
                  className="bg-slate-900/90 rounded-3xl p-4 sm:p-5 border-3 border-indigo-500/40 hover:border-amber-400/80 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/60 border border-indigo-400 text-amber-300 font-comic font-black text-lg flex items-center justify-center shadow shrink-0">
                      {chap.chapterNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className="text-[10px] font-comic font-black text-amber-300 uppercase">
                          CHƯƠNG {chap.chapterNumber}
                        </span>
                        {status === 'completed' && (
                          <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-comic font-bold rounded-full border border-emerald-500/50">
                            ✓ Hoàn thành
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-lg font-comic font-black text-white">
                        {chap.title}
                      </h4>
                      <p className="text-xs font-comic font-bold text-slate-400 italic">
                        "{chap.openingDialogue.text.slice(0, 75)}..."
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setActiveStoryChapter(chap);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-comic font-black text-xs rounded-2xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Xem Cốt Truyện & Thử Thách</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL CỐT TRUYỆN CHƯƠNG */}
      <ChapterStoryModal
        chapter={activeStoryChapter}
        isOpen={Boolean(activeStoryChapter)}
        isCompleted={activeStoryChapter?.chapterNumber === 1}
        onClose={() => setActiveStoryChapter(null)}
        onStartChapter={(chap) => {
          setActiveStoryChapter(null);
          // Tìm vùng đất tương ứng và bắt đầu
          const targetRegion = regions.find((r) => r.id === chap.regionId) || regions[0];
          onSelectRegion(targetRegion);
        }}
      />

      {/* MODAL SỰ KIỆN BẤT NGỜ NGẪU NHIÊN */}
      <RandomEventModal
        event={randomEvent}
        onClose={() => setRandomEvent(null)}
        onClaimReward={(stars) => {
          setCurrentStars((prev) => prev + stars);
        }}
      />
    </div>
  );
};
