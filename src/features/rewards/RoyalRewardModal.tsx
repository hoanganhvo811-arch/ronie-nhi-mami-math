// src/features/rewards/RoyalRewardModal.tsx
// Modal Trao Thưởng Hoàng Gia Tương Tác (Interactive Chest & Royal Ceremony - Phase 5)

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, Gift, ArrowRight, Volume2, Home, Castle } from 'lucide-react';
import type { IRewardItem } from '../../types/rewards';
import { RewardEngine } from './RewardEngine';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface RoyalRewardModalProps {
  rewardItem: IRewardItem;
  xpGained: number;
  didLevelUp: boolean;
  newLevel: number;
  onGoToToyRoom: () => void;
  onGoToCastle: () => void;
}

export const RoyalRewardModal: React.FC<RoyalRewardModalProps> = ({
  rewardItem,
  xpGained,
  didLevelUp,
  newLevel,
  onGoToToyRoom,
  onGoToCastle,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const queenMessage = RewardEngine.getQueenCongratulationMessage(rewardItem);

  const handleOpenChest = () => {
    if (isOpened) return;
    setIsOpened(true);
    soundManager.playCelebration();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const handleSpeakQueen = () => {
    soundManager.playTap();
    soundManager.speakVietnamese(queenMessage);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 border-amber-300';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-300';
      case 'rare':
        return 'bg-gradient-to-r from-sky-400 to-blue-500 text-white border-sky-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'toy':
        return '🧸 Đồ Chơi Phòng Riêng';
      case 'candy':
        return '🍭 Kẹo Ngọt Năng Lượng';
      case 'badge':
        return '🛡️ Huy Hiệu Vinh Dự';
      case 'costume':
        return '👗 Trang Phục Hiệp Sĩ';
      default:
        return '⭐ Quà Tặng Hoàng Gia';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 rounded-3xl border-4 border-amber-400 p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* HÀO QUANG ÁNH SÁNG */}
        <div className="absolute -inset-10 bg-amber-400/20 blur-3xl rounded-full pointer-events-none animate-pulse" />

        {/* HOẠT CẢNH NỮ HOÀNG VÀ RONIE */}
        <div className="-mt-14 mb-2 flex items-end justify-center gap-3 z-10">
          <QueenNhiMamiAvatar size="md" state="clapping" variant="photo" />
          <RonieAvatar size="md" state="celebrate" variant="photo" />
        </div>

        {/* TIÊU ĐỀ NGHI THỨC HOÀNG GIA */}
        <div className="flex items-center gap-1.5 text-amber-300 font-comic font-black text-xs uppercase tracking-widest mb-1 z-10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Nghi Thức Trao Thưởng Hoàng Gia</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-comic font-black text-white mb-2 z-10 drop-shadow-md">
          {isOpened ? '🎉 MÓN QUÀ XỨNG ĐÁNG! 🎉' : 'RƯƠNG QUÀ HOÀNG GIA'}
        </h2>

        {/* LỜI NÓI CỦA NỮ HOÀNG */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 my-2 text-left flex items-start gap-2.5 z-10">
          <p className="text-xs font-comic font-bold text-pink-200 leading-relaxed flex-1">
            "{queenMessage}"
          </p>
          <button
            type="button"
            onClick={handleSpeakQueen}
            className="p-1.5 bg-pink-500/30 hover:bg-pink-500/50 text-pink-200 rounded-lg cursor-pointer shrink-0 active:scale-90 transition-all"
            title="Nghe Nữ hoàng chúc mừng"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* GIAI ĐOẠN 1: RƯƠNG QUÀ ĐANG ĐÓNG - CHẠM ĐỂ MỞ */}
        {!isOpened ? (
          <div
            onClick={handleOpenChest}
            className="my-5 cursor-pointer flex flex-col items-center transform transition-transform hover:scale-105 active:scale-95 group z-10"
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 border-4 border-amber-300 shadow-2xl flex items-center justify-center text-6xl animate-bounce shadow-amber-500/50">
              🎁
            </div>
            <span className="mt-3 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-comic font-black text-xs rounded-full shadow-lg border border-white/40 animate-pulse">
              👉 Chạm vào hộp quà để mở!
            </span>
          </div>
        ) : (
          /* GIAI ĐOẠN 2: HỘP QUÀ ĐÃ MỞ - HIỂN THỊ CHI TIẾT VẬT PHẨM */
          <div className="w-full my-3 flex flex-col items-center z-10 animate-scaleUp">
            {/* THẺ VẬT PHẨM 3D PASTEL */}
            <div className="w-full bg-white/95 rounded-2xl p-4 border-3 border-amber-300 shadow-xl flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-inner border-2 border-white shrink-0 animate-bounce"
                style={{ backgroundColor: rewardItem.colorAccent || '#FEF3C7' }}
              >
                {rewardItem.icon}
              </div>

              <div className="text-left flex-1">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className="text-[9px] font-comic font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                    {getCategoryLabel(rewardItem.category)}
                  </span>
                  <span
                    className={`text-[9px] font-comic font-black px-2 py-0.5 rounded-full border ${getRarityBadge(
                      rewardItem.rarity
                    )}`}
                  >
                    {rewardItem.rarity.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-comic font-black text-slate-800 leading-tight">
                  {rewardItem.name}
                </h3>
                <p className="text-[11px] font-comic font-medium text-slate-600 mt-0.5 leading-snug">
                  {rewardItem.description}
                </p>
              </div>
            </div>

            {/* THÔNG BÁO EXP & LÊN CẤP */}
            <div className="flex items-center gap-3 my-2.5">
              <span className="px-3 py-1 bg-indigo-500/40 text-amber-300 font-comic font-black text-xs rounded-full border border-amber-400/40">
                ⭐ +{xpGained} EXP
              </span>
              {didLevelUp && (
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-comic font-black text-xs rounded-full shadow-lg border border-white animate-bounce">
                  🎉 LÊN CẤP {newLevel}!
                </span>
              )}
            </div>
          </div>
        )}

        {/* NÚT BẤM ĐIỀU HƯỚNG */}
        {isOpened && (
          <div className="w-full flex flex-col gap-2.5 mt-2 z-10 animate-fade-in">
            {/* CẤT VÀO PHÒNG ĐỒ CHƠI */}
            <button
              onClick={() => {
                soundManager.playTap();
                onGoToToyRoom();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 active:scale-95 text-white font-comic font-black text-sm rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>🧸 Cất Vào Phòng Đồ Chơi Ngay!</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* VỀ LÂU ĐÀI HOÀNG GIA */}
            <button
              onClick={() => {
                soundManager.playTap();
                onGoToCastle();
              }}
              className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-amber-200 font-comic font-bold text-xs rounded-xl border border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Castle className="w-4 h-4" />
              <span>Yết Kiến Nữ Hoàng Tại Lâu Đài</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
