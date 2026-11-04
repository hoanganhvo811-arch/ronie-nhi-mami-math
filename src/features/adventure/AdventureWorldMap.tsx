// src/features/adventure/AdventureWorldMap.tsx
// Bản Đồ Quần Đảo Phiêu Lưu 2.5D & 6 Chương Cốt Truyện Dài Hạn (Image 4 Reference)
// Biến bản đồ thành một quần đảo hoạt hình rực rỡ trong làn nước biển xanh biếc

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
  Play,
  X,
  Volume2,
} from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';
import { AdventureEngine } from './adventureEngine';
import { ChapterStoryModal } from './ChapterStoryModal';
import { RandomEventModal } from './RandomEventModal';
import { CartoonButton } from '../../design-system/CartoonButton';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
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

// Tọa độ 2.5D phần trăm cho 6 hòn đảo trên biển (Theo bố cục Image 4 Reference)
const ISLAND_COORDINATES: Record<string, { x: number; y: number; islandType: string }> = {
  castle: { x: 50, y: 36, islandType: 'castle' },       // Lâu đài đá hoàng gia ở trung tâm
  forest: { x: 18, y: 72, islandType: 'forest' },       // Đảo rừng nấm & nhà chân gà góc dưới trái
  valley: { x: 38, y: 84, islandType: 'valley' },       // Đảo thung lũng trái cây & đoàn tàu
  rainbow: { x: 82, y: 48, islandType: 'rainbow' },     // Đảo bánh kẹo & kem ốc quế góc phải
  cave: { x: 26, y: 24, islandType: 'cave' },          // Đảo núi lửa & hang pha lê góc trên trái
  time_city: { x: 72, y: 82, islandType: 'time_city' }, // Đảo tàu ngầm & tháp đồng hồ góc dưới phải
};

export const AdventureWorldMap: React.FC<AdventureWorldMapProps> = ({
  onBack,
  onHome,
  totalStars = 12,
  completedMissionIds = ['m_1_1', 'm_2_1'],
  playerBadges = ['badge_bravery'],
  onSelectRegion,
  onOpenParentDashboard,
}) => {
  const [viewMode, setViewMode] = useState<'MAP' | 'CHAPTERS'>('MAP');
  const [activeStoryChapter, setActiveStoryChapter] = useState<IChapterStory | null>(null);
  const [randomEvent, setRandomEvent] = useState<IRandomWorldEvent | null>(null);
  const [selectedRegionModal, setSelectedRegionModal] = useState<IAdventureRegion | null>(null);

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

  const handleIslandClick = (region: IAdventureRegion) => {
    soundManager.playTap();
    setSelectedRegionModal(region);
  };

  // Vẽ hình đồ họa đại diện cho từng hòn đảo (Image 4 Art Style)
  const renderIslandGraphic = (islandType: string) => {
    switch (islandType) {
      case 'castle':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Đảo đá xám nhô lên giữa biển */}
            <div className="absolute inset-x-2 bottom-0 h-14 bg-gradient-to-t from-slate-700 to-slate-500 rounded-full border-3 border-slate-800 shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            {/* Tòa lâu đài đá tráng lệ */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl sm:text-6xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)] animate-bounce">
                🏰
              </span>
              <span className="text-xl -mt-2">🚩</span>
            </div>
          </div>
        );
      case 'forest':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Thảm cỏ xanh mướt */}
            <div className="absolute inset-x-1 bottom-0 h-14 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full border-3 border-emerald-800 shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <div className="relative z-10 flex items-center justify-center gap-1">
              <span className="text-4xl sm:text-5xl drop-shadow-md">🏡</span>
              <span className="text-3xl sm:text-4xl animate-pulse">🍄</span>
            </div>
          </div>
        );
      case 'valley':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Đồi cỏ vàng & xanh */}
            <div className="absolute inset-x-1 bottom-0 h-14 bg-gradient-to-t from-lime-600 to-yellow-400 rounded-full border-3 border-lime-800 shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <div className="relative z-10 flex items-center justify-center gap-1">
              <span className="text-4xl sm:text-5xl drop-shadow-md">🚂</span>
              <span className="text-3xl sm:text-4xl">🥕</span>
            </div>
          </div>
        );
      case 'rainbow':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Bánh kem quế cuộn xốp ngọt ngào */}
            <div className="absolute inset-x-1 bottom-0 h-14 bg-gradient-to-t from-pink-600 to-pink-300 rounded-full border-3 border-pink-700 shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <div className="relative z-10 flex items-center justify-center gap-1">
              <span className="text-5xl sm:text-6xl drop-shadow-md animate-bounce">🍦</span>
              <span className="text-3xl sm:text-4xl">🍩</span>
            </div>
          </div>
        );
      case 'cave':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Núi lửa lửa & tảng băng tuyết */}
            <div className="absolute inset-x-1 bottom-0 h-14 bg-gradient-to-t from-purple-900 to-indigo-600 rounded-full border-3 border-purple-950 shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <div className="relative z-10 flex items-center justify-center gap-1">
              <span className="text-4xl sm:text-5xl drop-shadow-md">🌋</span>
              <span className="text-3xl sm:text-4xl animate-pulse">💎</span>
            </div>
          </div>
        );
      case 'time_city':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Trạm tàu ngầm tương lai đa sắc */}
            <div className="absolute inset-x-1 bottom-0 h-14 bg-gradient-to-t from-amber-600 to-cyan-400 rounded-full border-3 border-cyan-800 shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <div className="relative z-10 flex items-center justify-center gap-1">
              <span className="text-4xl sm:text-5xl drop-shadow-md">⏳</span>
              <span className="text-3xl sm:text-4xl animate-spin">⚙️</span>
            </div>
          </div>
        );
      default:
        return <span className="text-5xl">🏝️</span>;
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-sky-400 flex flex-col justify-between overflow-x-hidden select-none">
      {/* 1. HEADER ĐIỀU HƯỚNG */}
      <NavigationHeader
        title="Bản Đồ Quần Đảo Toán Học"
        subtitle="Hành trình khám phá 6 Vùng Đất Thần Tiên (Image 4 Reference)"
        onBack={onBack}
        onHome={onHome}
        onOpenSettings={onOpenParentDashboard}
        totalStars={currentStars}
        rightAddon={
          <button
            type="button"
            onClick={handleTriggerRandomEvent}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-rose-400 hover:brightness-110 active:translate-y-1 text-slate-950 font-comic font-black text-xs rounded-2xl shadow-[0_4px_0_#b45309] border border-white flex items-center gap-1.5 cursor-pointer transition-all"
            title="Khám phá sự kiện bất ngờ"
          >
            <Dice5 className="w-4 h-4 text-slate-950 animate-spin" />
            <span className="hidden sm:inline">Sự Kiện Bất Ngờ</span>
          </button>
        }
      />

      {/* 2. THANH TIỆN ÍCH: NHIỆM VỤ HÀNG NGÀY & CHUYỂN TAB */}
      <div className="w-full max-w-5xl mx-auto px-3 pt-2 z-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/85 backdrop-blur-md rounded-2xl p-2.5 border-3 border-amber-300 shadow-md">
          {/* Daily Quest mini */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <div>
              <div className="text-xs font-comic font-black text-amber-900 leading-tight">
                Hôm Nay: <span className="text-rose-600">{dailyQuest.title}</span>
              </div>
              <div className="text-[10px] font-comic font-bold text-slate-600">
                {dailyQuest.encouragingNote}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClaimDailyQuest}
              disabled={dailyQuest.isCompleted}
              className={`px-3 py-1.5 rounded-xl font-comic font-black text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                dailyQuest.isCompleted
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-amber-400 hover:bg-amber-500 text-amber-950 cursor-pointer active:scale-95'
              }`}
            >
              {dailyQuest.isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xong (+{dailyQuest.rewardStars} ⭐)</span>
                </>
              ) : (
                <>
                  <Gift className="w-3.5 h-3.5" />
                  <span>Nhận +{dailyQuest.rewardStars} Sao</span>
                </>
              )}
            </button>

            {/* TAB SELECTOR */}
            <div className="bg-slate-200/90 p-0.5 rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setViewMode('MAP');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-comic font-black cursor-pointer transition-all ${
                  viewMode === 'MAP'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏝️ Quần Đảo 2.5D
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setViewMode('CHAPTERS');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-comic font-black cursor-pointer transition-all ${
                  viewMode === 'CHAPTERS'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📖 Cốt Truyện 6 Chương
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KHU VỰC HIỂN THỊ CHÍNH (MAP 2.5D HOẶC CỐT TRUYỆN 6 CHƯƠNG) */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-2 sm:p-4 relative z-10 flex flex-col justify-center">
        {viewMode === 'MAP' ? (
          /* MÀN HÌNH BẢN ĐỒ QUẦN ĐẢO 2.5D (Image 4 Art Style) */
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[720px] bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-600 rounded-3xl border-4 border-amber-300 shadow-[0_12px_32px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* HỌA TIẾT SÓNG BIỂN RIPPLES (Image 4 Sea Foam Lines) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-1/4 left-1/3 w-32 h-6 border-2 border-white rounded-full" />
              <div className="absolute top-2/3 left-1/5 w-40 h-8 border-2 border-white rounded-full" />
              <div className="absolute top-1/2 right-1/4 w-36 h-7 border-2 border-white rounded-full" />
              <div className="absolute bottom-1/4 right-1/3 w-48 h-8 border-2 border-white rounded-full" />
            </div>

            {/* CÁC SINH VẬT BIỂN & VẬT PHẨM NỔI DỄ THƯƠNG TRÊN MẶT NƯỚC (Image 4 Critters) */}
            <div className="absolute top-16 left-6 text-3xl animate-bounce pointer-events-none" title="Cá voi xanh">
              🐳
            </div>
            <div className="absolute bottom-20 left-1/2 text-3xl animate-pulse pointer-events-none" title="Thủy quái tím hiền lành">
              🐉
            </div>
            <div className="absolute top-1/3 right-12 text-3xl animate-pulse pointer-events-none" title="Bánh donut nổi bồng bềnh">
              🍩
            </div>
            <div className="absolute top-10 right-1/3 text-2xl pointer-events-none" title="Chim cánh cụt trên tảng băng">
              🐧
            </div>
            <div className="absolute bottom-12 right-1/4 text-2xl pointer-events-none" title="Kẹo socola nổi">
              🍫
            </div>

            {/* ĐƯỜNG ĐI ĐỨT ĐOẠN ĐỎ TRẮNG NỐI CÁC ĐẢO (Image 4 Red Dashed Route) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                </filter>
              </defs>
              {/* Lớp nền trắng của vệt hải trình */}
              <path
                d="M 50% 36% C 30% 25%, 26% 24%, 26% 24% C 20% 45%, 18% 72%, 18% 72% C 26% 80%, 38% 84%, 38% 84% C 54% 88%, 72% 82%, 72% 82% C 84% 68%, 82% 48%, 82% 48% C 70% 38%, 50% 36%, 50% 36%"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Vạch kẻ đỏ đứt đoạn phong cách Candy & Thám hiểm */}
              <path
                d="M 50% 36% C 30% 25%, 26% 24%, 26% 24% C 20% 45%, 18% 72%, 18% 72% C 26% 80%, 38% 84%, 38% 84% C 54% 88%, 72% 82%, 72% 82% C 84% 68%, 82% 48%, 82% 48% C 70% 38%, 50% 36%, 50% 36%"
                fill="none"
                stroke="#EF4444"
                strokeWidth="5"
                strokeDasharray="12, 10"
                strokeLinecap="round"
                filter="url(#routeGlow)"
              />
            </svg>

            {/* 6 HÒN ĐẢO TƯƠNG TÁC ĐẶT TRÊN MẶT NƯỚC */}
            {regions.map((region) => {
              const coords = ISLAND_COORDINATES[region.id] || { x: 50, y: 50, islandType: 'castle' };
              const unlockInfo = AdventureEngine.checkRegionUnlocked(
                region,
                currentStars,
                completedMissionIds,
                playerBadges
              );
              const isCastle = region.id === 'castle';

              return (
                <div
                  key={region.id}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => handleIslandClick(region)}
                  className={`absolute z-20 flex flex-col items-center cursor-pointer group transition-transform ${
                    unlockInfo.isUnlocked ? 'hover:scale-110 active:scale-95' : 'opacity-70 grayscale-30'
                  }`}
                  title={`${region.name} - ${region.curriculumCategory}`}
                >
                  {/* HÌNH ẢNH 2.5D CỦA HÒN ĐẢO */}
                  <div className="relative">
                    {renderIslandGraphic(coords.islandType)}

                    {/* VỊ TRÍ HIỆN TẠI CỦA BÉ RONIE (Image 4 Ronie Pin) */}
                    {isCastle && (
                      <div className="absolute -top-6 -right-2 z-30 animate-bounce">
                        <div className="relative flex flex-col items-center">
                          <RonieAvatar size="sm" state="jumping" variant="photo" />
                          <div className="text-[10px] px-1.5 py-0.2 bg-rose-500 text-white font-comic font-black rounded-full shadow-md whitespace-nowrap">
                            Bé ở đây!
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BIỂU TƯỢNG KHÓA NẾU CHƯA MỞ */}
                    {!unlockInfo.isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center z-30">
                        <div className="p-2 bg-slate-900/80 rounded-2xl border-2 border-amber-400 text-amber-300 shadow-xl">
                          <Lock className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BẢNG TÊN BẰNG GỖ 3D NỔI TRÊN MẶT BIỂN */}
                  <div className="mt-1 px-3 py-1 bg-gradient-to-r from-amber-800 to-amber-950 text-amber-200 rounded-xl border-2 border-amber-600 shadow-[0_4px_0_#451a03] font-comic font-black text-[10px] sm:text-xs text-center flex items-center gap-1">
                    <span>{region.icon}</span>
                    <span className="truncate max-w-[100px] sm:max-w-none">{region.name}</span>
                  </div>

                  {/* SỐ SAO / YÊU CẦU MỞ KHÓA */}
                  <div className="mt-0.5 flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-full text-[9px] font-comic font-bold text-amber-300">
                    {unlockInfo.isUnlocked ? (
                      <>
                        <span>⭐</span>
                        <span>{region.missions.length * 3} Sao</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5" />
                        <span>Cần {region.requiredStars} ⭐</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DANH SÁCH 6 CHƯƠNG CỐT TRUYỆN DÀI HẠN */
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto max-h-[620px] p-2">
            {chapters.map((chapter) => (
              <div
                key={chapter.chapterNumber}
                className="bg-white/95 rounded-3xl p-4 sm:p-5 border-4 border-amber-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 font-comic font-black text-xs rounded-full">
                      Chương {chapter.chapterNumber} • {chapter.regionId.toUpperCase()}
                    </span>
                    <span className="text-xs font-comic font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      +3 Sao
                    </span>
                  </div>

                  <h3 className="font-comic font-black text-base sm:text-lg text-slate-800 leading-tight mb-1">
                    {chapter.title}
                  </h3>
                  <p className="font-comic font-bold text-xs text-rose-600 mb-2">
                    Thử Thách: "{chapter.bossChallenge.title}"
                  </p>
                  <p className="font-comic font-bold text-xs text-slate-600 leading-relaxed mb-3">
                    "{chapter.openingDialogue.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[11px] font-comic font-bold text-purple-700">
                    <span>🎁 Phần thưởng: {chapter.rewardItem.name}</span>
                  </div>
                  <CartoonButton
                    color="purple"
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    onClick={() => {
                      soundManager.playTap();
                      setActiveStoryChapter(chapter);
                    }}
                  >
                    Xem Cốt Truyện
                  </CartoonButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. MODAL CHI TIẾT HÒN ĐẢO KHI BÉ CHẠM VÀO (Storybook Island Parchment Modal) */}
      {selectedRegionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-pink-50 to-purple-50 rounded-3xl border-4 border-amber-400 p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center">
            {/* Nút đóng modal */}
            <button
              type="button"
              onClick={() => setSelectedRegionModal(null)}
              className="absolute top-3 right-3 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md cursor-pointer active:scale-90"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon lớn và Tiêu đề vùng đất */}
            <div className="text-5xl sm:text-6xl mb-2">{selectedRegionModal.icon}</div>
            <span className="px-3 py-1 bg-amber-200 text-amber-950 font-comic font-black text-xs rounded-full">
              VÙNG {selectedRegionModal.numericId} • {selectedRegionModal.curriculumCategory}
            </span>
            <h2 className="text-2xl sm:text-3xl font-comic font-black text-slate-900 mt-1">
              {selectedRegionModal.name}
            </h2>
            <p className="text-xs sm:text-sm font-comic font-bold text-rose-600 mb-3">
              {selectedRegionModal.subtitle}
            </p>

            {/* Chủ đề Toán học */}
            <div className="w-full bg-white/90 p-3 rounded-2xl border-2 border-amber-300 shadow-inner mb-3 text-left">
              <div className="text-xs font-comic font-black text-amber-900 flex items-center gap-1.5 mb-1">
                <span>📐 Chủ Đề Toán Học:</span>
                <span className="text-indigo-700">{selectedRegionModal.mathTopic}</span>
              </div>
              <p className="text-xs font-comic font-bold text-slate-600 leading-relaxed">
                {selectedRegionModal.shortLore}
              </p>
            </div>

            {/* Lời thoại bạn đồng hành */}
            <div className="w-full bg-purple-100/80 p-3 rounded-2xl border border-purple-300 flex items-center gap-3 mb-4 text-left">
              <div className="shrink-0">
                {selectedRegionModal.primaryCharacter.avatarType === 'queen' ? (
                  <QueenNhiMamiAvatar size="sm" state="greeting" variant="photo" />
                ) : (
                  <div className="text-3xl">🐰</div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-comic font-black text-purple-900">
                  {selectedRegionModal.primaryCharacter.name}:
                </div>
                <div className="text-xs font-comic font-bold text-purple-800 italic">
                  "{selectedRegionModal.primaryCharacter.quote}"
                </div>
              </div>
            </div>

            {/* Nút hành động Xuất phát */}
            <div className="w-full flex items-center justify-center gap-3">
              <CartoonButton
                color="green"
                size="lg"
                icon={<Play className="w-5 h-5 fill-current" />}
                onClick={() => {
                  soundManager.playCelebration();
                  const reg = selectedRegionModal;
                  setSelectedRegionModal(null);
                  onSelectRegion(reg);
                }}
                className="w-full"
              >
                🚀 XUẤT PHÁT NGAY!
              </CartoonButton>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL CỐT TRUYỆN CHƯƠNG CHI TIẾT */}
      {activeStoryChapter && (
        <ChapterStoryModal
          isOpen={!!activeStoryChapter}
          chapter={activeStoryChapter}
          onClose={() => setActiveStoryChapter(null)}
          onStartChapter={(chap) => {
            const foundRegion = regions.find((r) => r.id === chap.regionId) || regions[0];
            setActiveStoryChapter(null);
            onSelectRegion(foundRegion);
          }}
        />
      )}

      {/* 6. MODAL SỰ KIỆN BẤT NGỜ */}
      {randomEvent && (
        <RandomEventModal
          event={randomEvent}
          onClose={() => setRandomEvent(null)}
          onClaimReward={(bonusStars: number) => {
            setCurrentStars((prev) => prev + bonusStars);
            setRandomEvent(null);
          }}
        />
      )}
    </div>
  );
};
