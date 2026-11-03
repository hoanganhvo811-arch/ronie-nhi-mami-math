// src/features/mission-gameplay/MissionResultModal.tsx
// Modal Kết quả Nhiệm vụ (Chiến thắng / Thất bại) với điều hướng về Lâu Đài Hoàng Gia

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Award, RotateCcw, Castle, Compass, Sparkles } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import type { IMissionConfig, IMissionRunState } from '../../mission-engine/types';

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
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center border-4 ${
          isVictory
            ? 'bg-gradient-to-b from-amber-50 via-pink-50 to-indigo-50 border-amber-400'
            : 'bg-gradient-to-b from-slate-100 to-sky-50 border-sky-400'
        }`}
      >
        {/* AVATAR NHÂN VẬT & HUY HIỆU */}
        <div className="-mt-16 mb-2 flex items-end justify-center gap-2">
          {isVictory ? (
            <>
              <QueenNhiMamiAvatar size="sm" state="clapping" variant="photo" />
              <div className="scale-110">
                <RonieAvatar size="lg" state="victory" variant="photo" />
              </div>
            </>
          ) : (
            <RonieAvatar size="lg" state="sad" variant="photo" />
          )}
        </div>

        {/* TIÊU ĐỀ CHIẾN THẮNG HOẶC THỬ LẠI */}
        {isVictory ? (
          <>
            <div className="flex items-center gap-1.5 text-amber-500 font-comic font-black text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Nhiệm Vụ Hoàn Thành Xuất Sắc</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-comic font-black text-rose-600 mb-2 drop-shadow-sm">
              🎉 CHIẾN THẮNG! 🎉
            </h2>

            {/* SỐ SAO THƯỞNG */}
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-9 h-9 transition-transform duration-500 ${
                    starIdx <= starsEarned
                      ? 'fill-amber-400 text-amber-500 scale-110 animate-bounce'
                      : 'text-slate-300'
                  }`}
                  style={{ animationDelay: `${starIdx * 150}ms` }}
                />
              ))}
            </div>

            {/* PHẦN THƯỞNG NHIỆM VỤ */}
            <div className="w-full bg-white/80 border-2 border-amber-300 rounded-2xl p-3 my-3 shadow-inner flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-comic font-bold text-slate-500">ĐIỂM KINH NGHIỆM</span>
                <span className="text-base font-comic font-black text-indigo-600">+{config.reward.exp} EXP</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-comic font-bold text-slate-500">VẬT PHẨM</span>
                <span className="text-xs font-comic font-black text-pink-600 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {config.reward.itemReward}
                </span>
              </div>
            </div>

            {/* LỜI KHEN TỪ NỮ HOÀNG HOẶC NHÂN VẬT */}
            <p className="text-xs font-comic font-bold text-slate-700 italic bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80 mb-5">
              "{config.dialogue.victory}"
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-comic font-black text-sky-800 mb-2">
              💪 CỐ GẮNG LÊN BÉ NHÉ!
            </h2>
            <p className="text-xs font-comic font-bold text-slate-600 mb-3">
              "{config.dialogue.defeat}"
            </p>
            <div className="w-full bg-sky-100/80 border border-sky-300 rounded-xl p-3 mb-5 text-left">
              <span className="text-[11px] font-comic font-black text-sky-900 block mb-1">
                💡 Lời khuyên của Nữ hoàng:
              </span>
              <span className="text-[10px] font-comic font-semibold text-slate-600">
                {config.dialogue.hintPrompt}
              </span>
            </div>
          </>
        )}

        {/* NÚT BẤM ĐIỀU HƯỚNG */}
        <div className="w-full flex flex-col gap-2.5">
          {/* NÚT VỀ LÂU ĐÀI (CRITERION 10: KHI NHIỆM VỤ KẾT THÚC PHẢI CHUYỂN ĐƯỢC VỀ LÂU ĐÀI) */}
          <button
            onClick={onReturnToCastle}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 active:scale-95 text-white font-comic font-black text-sm rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Castle className="w-5 h-5" />
            <span>Về Lâu Đài Hoàng Gia 🏰</span>
          </button>

          {/* NÚT CHƠI LẠI HOẶC THỬ LẠI */}
          <button
            onClick={onRetry}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-amber-950 font-comic font-black text-xs rounded-xl shadow-md border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isVictory ? 'Chơi Lại Màn Này' : 'Thử Lại Ngay Nào'}</span>
          </button>

          {/* CHỌN NHIỆM VỤ KHÁC */}
          <button
            onClick={onReturnToMissions}
            className="w-full py-2 px-4 bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-700 font-comic font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Chọn Nhiệm Vụ Khác</span>
          </button>
        </div>
      </div>
    </div>
  );
};
