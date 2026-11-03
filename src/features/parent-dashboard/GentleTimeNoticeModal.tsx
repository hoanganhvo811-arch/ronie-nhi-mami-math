// src/features/parent-dashboard/GentleTimeNoticeModal.tsx
// Thông báo hết thời gian chơi nhẹ nhàng, vỗ về yêu thương không gây ức chế (Phase 7)

import React, { useState } from 'react';
import { Clock, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';
import { screenTimeTracker } from '../../services/time/ScreenTimeTracker';

interface GentleTimeNoticeModalProps {
  isOpen: boolean;
  onRestNow: () => void;
  onGrantExtraTime?: () => void;
}

export const GentleTimeNoticeModal: React.FC<GentleTimeNoticeModalProps> = ({
  isOpen,
  onRestNow,
  onGrantExtraTime,
}) => {
  const [showParentGrant, setShowParentGrant] = useState<boolean>(false);
  const [gateAnswer, setGateAnswer] = useState<string>('');
  const [gateError, setGateError] = useState<boolean>(false);

  // Phép tính xác thực người lớn
  const [numA] = useState<number>(() => Math.floor(Math.random() * 20) + 25);
  const [numB] = useState<number>(() => Math.floor(Math.random() * 20) + 15);
  const correctSum = numA + numB;

  if (!isOpen) return null;

  const handleVerifyParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateAnswer, 10) === correctSum) {
      soundManager.playCorrect();
      screenTimeTracker.grantExtraMinutes(10);
      screenTimeTracker.setNotified(true);
      if (onGrantExtraTime) onGrantExtraTime();
    } else {
      soundManager.playTryAgain();
      setGateError(true);
      setGateAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-pink-50 via-amber-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center flex flex-col items-center">
        {/* AVATAR NỮ HOÀNG & RONIE */}
        <div className="-mt-16 mb-2 flex items-end justify-center gap-3">
          <QueenNhiMamiAvatar size="md" state="rewarding" variant="photo" />
          <RonieAvatar size="md" state="celebrate" variant="photo" />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-comic font-black mb-2 shadow-sm">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>GIỜ NGHỈ NGƠI HOÀNG GIA</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-comic font-black text-rose-600 mb-2">
          Đôi Mắt Bé Cần Thư Giãn Rồi!
        </h3>

        <p className="text-xs sm:text-sm font-comic font-bold text-slate-700 leading-relaxed mb-6 max-w-md">
          👑 <strong>Nữ Hoàng Nhi Mami:</strong> "Hôm nay bé Ronie đã hoàn thành xuất sắc các thử thách toán học rồi! Hiệp sĩ nhí hãy tạm nghỉ mắt, uống một ly nước ấm và tập thể dục cùng mẹ nhé!"
        </p>

        {!showParentGrant ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onRestNow();
              }}
              className="w-full sm:w-auto flex-1 py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-white font-comic font-black text-sm rounded-2xl shadow-lg border-2 border-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
              <span>Bé Đi Nghỉ Ngơi Ngay 🌟</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                setShowParentGrant(true);
              }}
              className="py-2.5 px-4 text-xs font-comic font-bold text-slate-500 hover:text-indigo-600 underline cursor-pointer"
            >
              Ba Mẹ xin thêm 10 phút
            </button>
          </div>
        ) : (
          /* CỔNG PHỤ HUYNH CHO PHÉP THÊM GIỜ */
          <form onSubmit={handleVerifyParent} className="w-full max-w-xs flex flex-col items-center gap-2.5 p-3 bg-white/90 rounded-2xl border-2 border-indigo-200 shadow-sm animate-scale-up">
            <span className="text-xs font-comic font-bold text-indigo-900">
              Xác thực Phụ Huynh: {numA} + {numB} = ?
            </span>
            <input
              type="number"
              value={gateAnswer}
              onChange={(e) => setGateAnswer(e.target.value)}
              placeholder="Nhập kết quả..."
              className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 focus:border-indigo-500 rounded-xl text-center text-lg font-black text-indigo-900 outline-none"
              autoFocus
            />
            {gateError && (
              <span className="text-[11px] font-bold text-rose-500">
                Chưa chính xác, thử lại nhé!
              </span>
            )}
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => setShowParentGrant(false)}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-comic font-bold text-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-comic font-black cursor-pointer shadow"
              >
                +10 Phút
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
