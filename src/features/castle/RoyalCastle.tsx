// src/features/castle/RoyalCastle.tsx
// Lâu Đài Hoàng Gia (Royal Castle) - Ngai vàng, Nữ hoàng Nhi Mami, Khu giao nhiệm vụ & Trao thưởng

import React, { useState } from 'react';
import { Crown, Sparkles, Award, ArrowRight, Volume2, Gift, CheckCircle } from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';
import { ALL_MISSIONS_LIST, type IMissionConfig } from '../../mission-engine';

interface RoyalCastleProps {
  onBack: () => void;
  onHome: () => void;
  onSelectMission: (zoneId: number, stageId: number) => void;
  onSelectMissionConfig?: (config: IMissionConfig) => void;
  onOpenToyRoom: () => void;
  totalStars?: number;
}

export const RoyalCastle: React.FC<RoyalCastleProps> = ({
  onBack,
  onHome,
  onSelectMission,
  onSelectMissionConfig,
  onOpenToyRoom,
  totalStars = 12,
}) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'rewards'>('quests');
  const [claimedReward, setClaimedReward] = useState<boolean>(false);

  const queenMessage =
    activeTab === 'quests'
      ? 'Hôm nay con đã hoàn thành rất nhiều bài toán xuất sắc! Hãy chọn nhiệm vụ tiếp theo để giải cứu muôn loài nhé Ronie!'
      : 'Những Ngôi Sao Tri Thức con mang về đang làm sáng rực cả Vương Quốc! Mẹ có món quà đặc biệt dành riêng cho con này!';

  const handleSpeakQueen = () => {
    soundManager.playTap();
    soundManager.speakVietnamese(queenMessage);
  };

  const handleClaimReward = () => {
    soundManager.playCelebration();
    setClaimedReward(true);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-purple-200 via-pink-100 to-amber-50 select-none overflow-y-auto">
      {/* THANH ĐIỀU HƯỚNG */}
      <NavigationHeader
        title="Lâu Đài Hoàng Gia"
        subtitle="Yết kiến Nữ hoàng Nhi Mami"
        onBack={onBack}
        onHome={onHome}
        totalStars={totalStars}
      />

      {/* KHU VỰC TRUNG TÂM: NGAI VÀNG & HOẠT ẢNH NỮ HOÀNG & RONIE */}
      <main className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col my-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* CỘT TRÁI (5 CỘT): NGAI VÀNG & NỮ HOÀNG & RONIE */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            {/* NGAI VÀNG & NỮ HOÀNG */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Vòng hào quang hoàng kim */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/40 via-purple-300/30 to-pink-300/40 blur-2xl animate-pulse" />

              {/* Ngai vàng cách điệu */}
              <div className="absolute bottom-2 w-48 h-40 bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 rounded-t-3xl border-4 border-amber-600 shadow-xl flex flex-col items-center justify-start pt-2">
                <Crown className="w-10 h-10 text-amber-900 drop-shadow-sm" />
              </div>

              {/* Nữ hoàng Nhi Mami ngồi / đứng uy nghiêm dịu dàng */}
              <div className="relative z-10">
                <QueenNhiMamiAvatar size="xl" speaking={true} variant="photo" />
              </div>

              {/* Ronie đứng chắp tay hào hứng bên cạnh ngai */}
              <div className="absolute -bottom-2 -right-4 z-20">
                <RonieAvatar size="md" state="celebrating" variant="photo" />
              </div>
            </div>

            {/* DANH HIỆU NỮ HOÀNG */}
            <div className="mt-2">
              <span className="px-4 py-1 bg-purple-700 text-white font-comic font-black text-xs md:text-sm rounded-full shadow-md">
                👑 Nữ Hoàng Nhi Mami
              </span>
              <p className="text-xs font-bold text-purple-900 mt-1">Biểu tượng Tình Mẹ & Tri Thức</p>
            </div>

            {/* LỜI THOẠI ẤM ÁP CỦA NỮ HOÀNG */}
            <div className="mt-3 relative bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-purple-300 shadow-md text-left flex items-start gap-3 w-full max-w-sm">
              <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed flex-1">
                "{queenMessage}"
              </p>
              <button
                type="button"
                onClick={handleSpeakQueen}
                className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl transition-all cursor-pointer flex-shrink-0"
                title="Nghe lời Nữ hoàng"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CỘT PHẢI (7 CỘT): KHU VỰC GIAO NHIỆM VỤ & KHU VỰC TRAO THƯỞNG */}
          <div className="lg:col-span-7 flex flex-col">
            {/* TABS CHUYỂN ĐỔI: NHIỆM VỤ HOÀNG GIA vs PHẦN THƯỞNG */}
            <div className="flex gap-2 mb-4 bg-white/60 p-1.5 rounded-2xl border border-white/80 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setActiveTab('quests');
                }}
                className={`flex-1 py-3 rounded-xl font-comic font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'quests'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-900 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Nhiệm Vụ Hoàng Gia</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setActiveTab('rewards');
                }}
                className={`flex-1 py-3 rounded-xl font-comic font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'rewards'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Award className="w-5 h-5 text-amber-600" />
                <span>Khu Vực Trao Thưởng</span>
              </button>
            </div>

            {/* TAB 1: KHU VỰC GIAO NHIỆM VỤ - 6 NHIỆM VỤ CỐT LÕI PHASE 4 */}
            {activeTab === 'quests' && (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {ALL_MISSIONS_LIST.map((m, idx) => {
                  const iconMap: Record<string, string> = {
                    RESCUE_ROPE: '🧗',
                    PUSH_BACK_MONSTER: '🍪',
                    BRIDGE_CROSSING: '🌈',
                    TREASURE_CHEST: '🗝️',
                    SHUTDOWN_MACHINE: '⚙️',
                    MATH_RACING: '🏎️',
                  };
                  const badgeMap: Record<string, string> = {
                    RESCUE_ROPE: 'Kéo Tơ Cứu Hộ',
                    PUSH_BACK_MONSTER: 'Đẩy Lùi Quái Vật',
                    BRIDGE_CROSSING: 'Vượt Cầu Đá',
                    TREASURE_CHEST: 'Mở Rương Kho Báu',
                    SHUTDOWN_MACHINE: 'Tắt Cỗ Máy Kẹo',
                    MATH_RACING: 'Đua Xe Tốc Độ',
                  };

                  return (
                    <div
                      key={m.id}
                      className="bg-white/95 rounded-3xl p-4 md:p-5 border-3 border-purple-200 hover:border-purple-400 shadow-md flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-300 text-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
                          {iconMap[m.gameplayType] || '⭐'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                              {m.region}
                            </span>
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              ⚡ {badgeMap[m.gameplayType]}
                            </span>
                          </div>
                          <h4 className="text-sm md:text-base font-comic font-black text-slate-800 mt-0.5">
                            {idx + 1}. {m.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{m.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playTap();
                          if (onSelectMissionConfig) {
                            onSelectMissionConfig(m);
                          } else {
                            onSelectMission(idx + 1, 1);
                          }
                        }}
                        className="px-4 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-comic font-black text-xs md:text-sm rounded-2xl shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all"
                      >
                        <span>Làm Ngay</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: KHU VỰC TRAO THƯỞNG HOÀNG GIA */}
            {activeTab === 'rewards' && (
              <div className="bg-white/95 rounded-3xl p-6 border-3 border-amber-300 shadow-lg flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-amber-500 shadow-xl flex items-center justify-center text-4xl mb-3 animate-bounce">
                  🎁
                </div>

                <h3 className="text-xl md:text-2xl font-comic font-black text-slate-850">
                  HỘP QUÀ TRI THỨC HOÀNG GIA
                </h3>
                <p className="text-xs md:text-sm text-slate-600 max-w-md my-2">
                  Dành riêng cho Ronie khi tích lũy đủ 10 Ngôi Sao Tri Thức! Bạn hiện có{' '}
                  <strong className="text-amber-600">{totalStars} Sao</strong>.
                </p>

                <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 my-4 flex items-center justify-around">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">👑</span>
                    <span className="text-xs font-bold text-slate-700 mt-1">Vương Miện Nhí</span>
                  </div>
                  <div className="text-2xl font-black text-amber-500">+</div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🧥</span>
                    <span className="text-xs font-bold text-slate-700 mt-1">Áo Choàng Sao Vàng</span>
                  </div>
                  <div className="text-2xl font-black text-amber-500">+</div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">⭐</span>
                    <span className="text-xs font-bold text-slate-700 mt-1">Huy Hiệu Dũng Cảm</span>
                  </div>
                </div>

                {claimedReward ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-comic font-black text-base py-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>Đã Nhận Thưởng! Mời bé ghé Phòng Đồ Chơi để mặc thử nhé!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleClaimReward}
                    className="w-full max-w-xs py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:brightness-110 text-slate-950 font-comic font-black text-base md:text-lg rounded-2xl border-2 border-amber-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Gift className="w-6 h-6" />
                    <span>MỞ QUÀ HOÀNG GIA!</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    onOpenToyRoom();
                  }}
                  className="mt-3 text-xs md:text-sm font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  👉 Đi đến Phòng Đồ Chơi của Ronie
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
