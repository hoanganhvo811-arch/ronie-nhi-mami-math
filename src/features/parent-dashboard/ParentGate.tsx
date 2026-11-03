// src/features/parent-dashboard/ParentGate.tsx
// Cổng xác thực người lớn an toàn (Phép tính 2 chữ số hoặc Nhấn giữ 3 giây) (Phase 7)

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, RefreshCw, Hand, Calculator, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../services/audio/AudioManager';

interface ParentGateProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export const ParentGate: React.FC<ParentGateProps> = ({ onUnlock, onCancel }) => {
  const [mode, setMode] = useState<'MATH' | 'HOLD'>('MATH');

  // 1. Phép tính người lớn ngẫu nhiên (Adult Math Challenge)
  const [numA, setNumA] = useState<number>(() => Math.floor(Math.random() * 25) + 20);
  const [numB, setNumB] = useState<number>(() => Math.floor(Math.random() * 25) + 15);
  const [gateAnswer, setGateAnswer] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const refreshMathProblem = () => {
    soundManager.playTap();
    setNumA(Math.floor(Math.random() * 25) + 20);
    setNumB(Math.floor(Math.random() * 25) + 15);
    setGateAnswer('');
    setIsError(false);
  };

  const handleVerifyMath = (e: React.FormEvent) => {
    e.preventDefault();
    const correctSum = numA + numB;
    if (parseInt(gateAnswer, 10) === correctSum) {
      soundManager.playCorrect();
      onUnlock();
    } else {
      soundManager.playTryAgain();
      setIsError(true);
      setGateAnswer('');
    }
  };

  // 2. Thao tác giữ nút 3 giây (Hold for 3 seconds)
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdIntervalRef = useRef<any>(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const stepMs = 30;
    const totalMs = 3000;
    let elapsed = 0;

    holdIntervalRef.current = setInterval(() => {
      elapsed += stepMs;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setHoldProgress(pct);

      if (pct >= 100) {
        clearInterval(holdIntervalRef.current);
        soundManager.playCorrect();
        onUnlock();
      }
    }, stepMs);
  };

  const cancelHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-center py-4 select-none animate-fadeIn">
      {/* ICON KHIÊN BẢO VỆ */}
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
        <ShieldCheck className="w-9 h-9" />
      </div>

      <h3 className="text-xl sm:text-2xl font-comic font-black text-amber-300 mb-1">
        CỔNG BẢO VỆ PHỤ HUYNH
      </h3>
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
        Khu vực bảo mật dành riêng cho cha mẹ. Vui lòng hoàn thành thao tác để tiếp tục:
      </p>

      {/* CHUYỂN ĐỔI CHẾ ĐỘ XÁC THỰC: TÍNH TOÁN HOẶC GIỮ NÚT */}
      <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 mb-5">
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            setMode('MATH');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-comic font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            mode === 'MATH' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Phép Tính</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            setMode('HOLD');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-comic font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            mode === 'HOLD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Hand className="w-4 h-4" />
          <span>Giữ 3 Giây</span>
        </button>
      </div>

      {/* CHẾ ĐỘ 1: PHÉP TÍNH */}
      {mode === 'MATH' && (
        <form onSubmit={handleVerifyMath} className="w-full max-w-xs flex flex-col items-center gap-3">
          <div className="relative w-full text-2xl font-comic font-black text-white bg-slate-800/90 py-3.5 px-6 rounded-2xl border border-slate-700 flex items-center justify-center shadow-inner">
            <span>
              {numA} + {numB} = ?
            </span>
            <button
              type="button"
              onClick={refreshMathProblem}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-amber-300 rounded-lg cursor-pointer"
              title="Đổi phép tính khác"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <input
            type="number"
            value={gateAnswer}
            onChange={(e) => setGateAnswer(e.target.value)}
            placeholder="Nhập kết quả..."
            className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl text-center text-xl font-comic font-black text-amber-300 outline-none shadow"
            autoFocus
          />

          {isError && (
            <span className="text-xs font-comic font-bold text-rose-400 animate-shake">
              Kết quả chưa chính xác, xin vui lòng tính lại nhé!
            </span>
          )}

          <div className="flex gap-2 w-full mt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-comic font-bold text-xs rounded-2xl cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-comic font-black text-sm rounded-2xl shadow-lg cursor-pointer transition-all"
            >
              Xác Nhận Mở
            </button>
          </div>
        </form>
      )}

      {/* CHẾ ĐỘ 2: GIỮ NÚT 3 GIÂY */}
      {mode === 'HOLD' && (
        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <p className="text-xs font-comic text-slate-400">
            Nhấn và giữ ngón tay vào nút bên dưới trong <strong>3 giây</strong> liên tục:
          </p>

          <button
            type="button"
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className={`relative w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all select-none cursor-pointer ${
              isHolding
                ? 'bg-indigo-700/80 border-indigo-400 scale-95 shadow-2xl'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-600'
            }`}
          >
            {/* VÒNG TIẾN TRÌNH TRỰC QUAN */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-700 fill-none"
              />
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray="502"
                strokeDashoffset={502 - (502 * holdProgress) / 100}
                strokeLinecap="round"
                className="text-amber-400 fill-none transition-all duration-75"
              />
            </svg>

            <Hand className={`w-10 h-10 mb-1 ${isHolding ? 'text-amber-300 animate-bounce' : 'text-slate-400'}`} />
            <span className="text-xs font-comic font-black text-slate-200">
              {isHolding ? `${holdProgress}%` : 'Giữ 3 Giây'}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-comic font-bold cursor-pointer"
          >
            Hủy Bỏ
          </button>
        </div>
      )}
    </div>
  );
};
