// src/features/missions/MissionSelection.tsx
// Màn hình chọn nhiệm vụ (Mission Selection) với các Thẻ Nhiệm Vụ Lớn cho trẻ 6-7 tuổi

import React from 'react';
import { Play, Star, CheckCircle2, Clock, Sparkles, Swords, Zap } from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { ZONES_CONFIG, MISSIONS_DATA } from '../quests/questData';
import { soundManager } from '../../services/audio/AudioManager';
import type { IMission } from '../../types/game';
import { ALL_MISSIONS_LIST, type IMissionConfig } from '../../mission-engine';

interface MissionSelectionProps {
  zoneId: number;
  onBack: () => void;
  onHome: () => void;
  onStartMission: (mission: IMission) => void;
  onStartMissionConfig?: (config: IMissionConfig) => void;
  totalStars?: number;
}

export const MissionSelection: React.FC<MissionSelectionProps> = ({
  zoneId,
  onBack,
  onHome,
  onStartMission,
  onStartMissionConfig,
  totalStars = 12,
}) => {
  const currentZone = ZONES_CONFIG.find((z) => z.id === zoneId) || ZONES_CONFIG[0];
  const missions = MISSIONS_DATA[zoneId] || [];

  // Tìm nhiệm vụ Gameplay tương ứng với vùng hiện tại
  const matchingCoreMission = ALL_MISSIONS_LIST[(zoneId - 1) % ALL_MISSIONS_LIST.length] || ALL_MISSIONS_LIST[0];

  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-comic font-black text-xs flex items-center gap-1">
            ⭐ Dễ
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-comic font-black text-xs flex items-center gap-1">
            ⭐⭐ Vừa
          </span>
        );
      case 'hard':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-comic font-black text-xs flex items-center gap-1">
            ⭐⭐⭐ Thử Thách
          </span>
        );
    }
  };

  const getStatusBadge = (status: 'not_started' | 'in_progress' | 'completed', starsEarned: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-comic font-black text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã hoàn thành</span>
            <span className="text-amber-600 ml-1">({starsEarned}/3 ⭐)</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-900 rounded-full font-comic font-black text-xs">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Đang thực hiện</span>
          </div>
        );
      case 'not_started':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-comic font-black text-xs">
            Chưa làm
          </span>
        );
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-sky-100 via-pink-50 to-amber-50 select-none overflow-y-auto">
      {/* THANH ĐIỀU HƯỚNG */}
      <NavigationHeader
        title={currentZone.title}
        subtitle={currentZone.subtitle}
        onBack={onBack}
        onHome={onHome}
        totalStars={totalStars}
      />

      {/* DANH SÁCH THẺ NHIỆM VỤ LỚN */}
      <main className="w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col my-auto z-10">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 border-2 border-amber-300 text-slate-850 font-comic font-black text-xs md:text-sm shadow-sm mb-1">
            <span>{currentZone.icon}</span>
            <span>CHỌN NHIỆM VỤ ĐỂ CÙNG BÉ RONIE GIẢI TOÁN</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-slate-600">{currentZone.description}</p>
        </div>

        {/* BANNER NHIỆM VỤ GAMEPLAY TƯƠNG TÁC (PHASE 4) */}
        {onStartMissionConfig && (
          <div className="mb-5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-white/60">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
                ⚡
              </div>
              <div>
                <span className="text-[10px] font-comic font-black bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full uppercase">
                  Nhiệm Vụ Gameplay Cốt Lõi • {matchingCoreMission.gameplayType}
                </span>
                <h3 className="text-base sm:text-lg font-comic font-black mt-0.5">
                  {matchingCoreMission.title}
                </h3>
                <p className="text-xs text-white/90 line-clamp-1">
                  {matchingCoreMission.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onStartMissionConfig(matchingCoreMission);
              }}
              className="px-5 py-3 bg-white text-rose-600 hover:bg-amber-100 font-comic font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current text-amber-500" />
              <span>CHƠI GAMEPLAY NGAY</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {missions.map((mission, idx) => (
            <div
              key={mission.id}
              className={`bg-white/95 rounded-3xl p-5 border-3 transition-all flex flex-col justify-between shadow-lg transform hover:-translate-y-1.5 ${
                mission.status === 'completed'
                  ? 'border-emerald-300 bg-gradient-to-b from-white to-emerald-50/50'
                  : mission.status === 'in_progress'
                  ? 'border-sky-300 bg-gradient-to-b from-white to-sky-50/50'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* HÀNG TRÊN: ICON & ĐỘ KHÓ */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                    {mission.icon}
                  </div>
                  {getDifficultyBadge(mission.difficulty)}
                </div>

                {/* TÊN & CHỦ ĐỀ TOÁN */}
                <div className="mb-2">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    📖 {mission.mathTopic}
                  </span>
                  <h3 className="font-comic font-black text-lg md:text-xl text-slate-900 leading-tight">
                    {idx + 1}. {mission.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              </div>

              {/* HÀNG DƯỚI: TRẠNG THÁI & NÚT BẮT ĐẦU */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {getStatusBadge(mission.status, mission.starsEarned)}
                  <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    +{mission.rewardExp} EXP
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    onStartMission(mission);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-comic font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 ${
                    mission.status === 'completed'
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-amber-300'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-white border-2 border-emerald-300'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{mission.status === 'completed' ? 'Chơi Lại Lấy 3 Sao' : 'BẮT ĐẦU NHIỆM VỤ'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
