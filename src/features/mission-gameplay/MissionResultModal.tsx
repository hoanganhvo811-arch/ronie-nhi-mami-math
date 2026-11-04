// src/features/mission-gameplay/MissionResultModal.tsx
// Modal Kết quả Nhiệm vụ (Chiến thắng / Thất bại) với điều hướng về Lâu Đài Hoàng Gia

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Award, RotateCcw, Castle, Compass, Sparkles } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import type { IMissionConfig, IMissionRunState } from '../../mission-engine/types';
import { TreasureChestCelebration } from '../../design-system/TreasureChestCelebration';
import { CartoonButton } from '../../design-system/CartoonButton';

interface MissionResultModalProps {
  config: IMissionConfig;
  runState: IMissionRunState;
  onRetry: () => void;
  onReturnToCastle: () => void;
  onReturnToMissions: () => void;
}

export const MissionResultModal: React.FC<MissionResultModalProps> = ({
  config,
  runState,
  onRetry,
  onReturnToCastle,
  onReturnToMissions,
}) => {
  const isVictory = runState.state === 'VICTORY';
  const isDefeat = runState.state === 'DEFEAT';

  // Tính số sao thưởng
  const starsEarned = isVictory
    ? runState.mistakesCount === 0
      ? 3
      : runState.mistakesCount <= 2
      ? 2
      : 1
    : 0;

  useEffect(() => {
    if (isVictory) {
      // Bắn pháo hoa ăn mừng chiến thắng
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isVictory]);

  if (!isVictory && !isDefeat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl text-center flex flex-col items-center border-4 ${
          isVictory
            ? 'bg-gradient-to-b from-amber-50 via-pink-50 to-purple-50 border-amber-400'
            : 'bg-gradient-to-b from-slate-100 to-sky-50 border-sky-400'
        }`}
      >
        {isVictory ? (
          <>
            {/* RƯƠNG BÁU PHÁT SÁNG & HÀO QUANG MẶT TRỜI (Image 3 Reference) */}
            <TreasureChestCelebration stars={starsEarned} score={config.reward.exp}>
              <div className="flex items-center justify-center gap-3 my-1">
                <QueenNhiMamiAvatar size="sm" state="clapping" variant="photo" />
                <RonieAvatar size="lg" state="victory" variant="photo" />
              </div>
            </TreasureChestCelebration>

            <h2 className="text-2xl sm:text-3xl font-comic font-black text-rose-600 mb-1 drop-shadow-sm animate-bounce">
              🎉 CHIẾN THẮNG HOÀNG GIA! 🎉
            </h2>

            {/* PHẦN THƯỞNG NHIỆM VỤ */}
            <div className="w-full bg-white/90 border-3 border-amber-300 rounded-2xl p-3 my-2 shadow-inner flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-comic font-bold text-slate-500">ĐIỂM KINH NGHIỆM</span>
                <span className="text-base font-comic font-black text-indigo-600">+{config.reward.exp} EXP</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-comic font-bold text-slate-500">VẬT PHẨM KHO BÁU</span>
                <span className="text-xs font-comic font-black text-pink-600 flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  {config.reward.itemReward}
                </span>
              </div>
            </div>

            {/* LỜI KHEN TỪ NỮ HOÀNG */}
            <p className="text-xs font-comic font-bold text-slate-700 italic bg-amber-100/70 p-2.5 rounded-xl border border-amber-300 mb-4">
              "{config.dialogue.victory}"
            </p>
          </>
        ) : (
          <>
            <div className="-mt-14 mb-2 flex items-end justify-center">
              <RonieAvatar size="lg" state="sad" variant="photo" />
            </div>
            <h2 className="text-2xl font-comic font-black text-sky-800 mb-2">
              💪 CỐ GẮNG LÊN BÉ YÊU!
            </h2>
            <p className="text-xs font-comic font-bold text-slate-600 mb-3">
              "{config.dialogue.defeat}"
            </p>
            <div className="w-full bg-sky-100/80 border border-sky-300 rounded-xl p-3 mb-4 text-left">
              <span className="text-[11px] font-comic font-black text-sky-900 block mb-1">
                💡 Lời khuyên của Nữ hoàng:
              </span>
              <span className="text-[10px] font-comic font-semibold text-slate-600">
                {config.dialogue.hintPrompt}
              </span>
            </div>
          </>
        )}

        {/* NÚT BẤM ĐIỀU HƯỚNG 3D */}
        <div className="w-full flex flex-col gap-2.5">
          {/* NÚT VỀ LÂU ĐÀI */}
          <CartoonButton
            color="pink"
            size="md"
            icon={<Castle className="w-5 h-5" />}
            onClick={onReturnToCastle}
            className="w-full"
          >
            Về Lâu Đài Hoàng Gia 🏰
          </CartoonButton>

          {/* NÚT CHƠI LẠI */}
          <CartoonButton
            color="orange"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRetry}
            className="w-full"
          >
            {isVictory ? 'Chơi Lại Màn Này 🔄' : 'Thử Lại Ngay Nào 🚀'}
          </CartoonButton>

          {/* CHỌN NHIỆM VỤ KHÁC */}
          <button
            onClick={onReturnToMissions}
            className="w-full py-2 px-4 bg-slate-200/90 hover:bg-slate-300 active:scale-95 text-slate-700 font-comic font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Chọn Nhiệm Vụ Khác</span>
          </button>
        </div>
      </div>
    </div>
  );
};
