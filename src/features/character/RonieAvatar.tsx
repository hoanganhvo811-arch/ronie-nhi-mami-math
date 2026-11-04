// src/features/character/RonieAvatar.tsx
// Hình tượng nguyên bản Hiệp Sĩ Nhện Nhí Ronie (Original IP) - 12 Trạng Thái Biểu Cảm & Hoạt Ảnh

import React, { useState } from 'react';
import type { RonieAnimationState } from '../../types/character';
import type { IEquippedCostumes } from '../../types/rewards';
import ronieOfficialImg from '../../assets/ronie-official.png';

interface RonieAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  state?: RonieAnimationState;
  className?: string;
  showLabel?: boolean;
  variant?: 'vector' | 'photo';
  costumes?: IEquippedCostumes;
}

export const RonieAvatar: React.FC<RonieAvatarProps> = ({
  size = 'md',
  state = 'idle',
  className = '',
  showLabel = false,
  variant = 'photo',
  costumes,
}) => {
  const [imgError, setImgError] = useState(false);
  const showPhoto = variant === 'photo' && !imgError;

  // Chuẩn hóa trạng thái tương thích ngược
  const normalizedState: RonieAnimationState =
    state === 'walking'
      ? 'walk'
      : state === 'celebrating'
      ? 'celebrate'
      : state === 'jumping'
      ? 'jump'
      : state;

  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
    '2xl': 'w-56 h-56',
  };

  // Hoạt ảnh CSS tương ứng cho 12 trạng thái
  const animMap: Record<RonieAnimationState, string> = {
    idle: 'animate-pulse',
    walk: 'animate-bounce',
    run: 'animate-bounce skew-x-3',
    jump: '-translate-y-5 transition-transform duration-300',
    celebrate: 'animate-bounce scale-110',
    sad: 'translate-y-1 opacity-90',
    surprised: 'scale-105 animate-pulse',
    attack: 'translate-x-2 -skew-x-6 transition-transform',
    web_shoot: 'scale-105',
    pull: '-translate-x-2 skew-x-3 transition-transform',
    victory: 'scale-110 drop-shadow-xl animate-pulse',
    defeat: 'rotate-3 opacity-85',
    // Fallback
    walking: 'animate-bounce',
    celebrating: 'animate-bounce scale-110',
    thinking: 'animate-pulse',
    jumping: '-translate-y-4 transition-transform',
    swinging: 'animate-bounce -translate-y-2',
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${sizeMap[size]} ${animMap[normalizedState] || ''} ${className}`}
      title={`Bé Ronie - ${normalizedState}`}
    >
      {/* HIỆU ỨNG HÀO QUANG PHÍA SAU THEO TRẠNG THÁI */}
      <div
        className={`absolute inset-0 rounded-full blur-md transform scale-115 pointer-events-none transition-all ${
          normalizedState === 'celebrate' || normalizedState === 'victory'
            ? 'bg-amber-400/40 animate-spin'
            : normalizedState === 'attack' || normalizedState === 'web_shoot'
            ? 'bg-sky-400/35'
            : normalizedState === 'sad' || normalizedState === 'defeat'
            ? 'bg-slate-400/25'
            : 'bg-rose-500/25'
        }`}
      />

      {/* HIỆN THỊ ẢNH 3D CHÍNH THỨC HOẶC VECTOR ĐỘC QUYỀN */}
      {showPhoto ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={ronieOfficialImg}
            onError={() => setImgError(true)}
            alt="Bé Ronie"
            className="w-full h-full object-contain filter drop-shadow-xl"
            loading="eager"
          />

          {/* SỢI TƠ BẮN RA (CHỈ Ở WEB_SHOOT HOẶC PULL) */}
          {(normalizedState === 'web_shoot' || normalizedState === 'pull') && (
            <div className="absolute right-0 top-1/4 animate-pulse pointer-events-none">
              <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
                <path d="M 0 15 Q 30 0 60 15" stroke="#FDE047" strokeWidth="4" strokeDasharray="5 3" />
                <circle cx="58" cy="15" r="3" fill="#F59E0B" />
              </svg>
            </div>
          )}

          {/* TIA SÁNG CHIẾN THẮNG / NGÔI SAO TRÊN ĐẦU */}
          {(normalizedState === 'celebrate' || normalizedState === 'victory') && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-spin pointer-events-none">
              ⭐
            </div>
          )}

          {/* DẤU BỐI RỐI KHI SAD / DEFEAT */}
          {(normalizedState === 'sad' || normalizedState === 'defeat') && (
            <div className="absolute -top-2 right-1 text-xl animate-bounce pointer-events-none">
              💧
            </div>
          )}

          {/* DẤU CHẤM THAN KHI SURPRISED */}
          {normalizedState === 'surprised' && (
            <div className="absolute -top-3 right-1 text-2xl font-black text-amber-500 animate-bounce pointer-events-none">
              ❗
            </div>
          )}

          {/* TIA ĐẤM TƠ SAO KHI ATTACK */}
          {normalizedState === 'attack' && (
            <div className="absolute -top-1 -right-2 text-xl animate-ping pointer-events-none">
              💥
            </div>
          )}

          {/* TRANG BỊ TRANG PHỤC THỜI TRANG ĐƯỢC MẶC (PHASE 5) */}
          {costumes?.hat && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce pointer-events-none z-30 drop-shadow-md">
              👑
            </div>
          )}
          {costumes?.cloak && (
            <div className="absolute -top-1 -left-2 text-xl animate-pulse pointer-events-none z-30 drop-shadow-md">
              🌟
            </div>
          )}
          {costumes?.mask && (
            <div className="absolute top-2 right-0 text-sm bg-rose-600/80 p-0.5 rounded-full text-white pointer-events-none z-30 shadow-sm">
              🎭
            </div>
          )}
          {costumes?.boots && (
            <div className="absolute -bottom-2 right-0 text-base animate-bounce pointer-events-none z-30">
              ⚡
            </div>
          )}
          {costumes?.suit && (
            <div className="absolute inset-0 border-3 border-amber-300 rounded-full animate-pulse pointer-events-none z-20 shadow-lg shadow-amber-400/40" />
          )}
        </div>
      ) : (
        /* SVG VECTOR ĐỘC QUYỀN CHIBI NGUYÊN BẢN CỦA RONIE */
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
        {/* SỢI TƠ BẮN RA (CHỈ Ở WEB_SHOOT HOẶC PULL) */}
        {(normalizedState === 'web_shoot' || normalizedState === 'pull') && (
          <path
            d={normalizedState === 'web_shoot' ? 'M 72 72 Q 86 60 98 48' : 'M 25 75 Q 10 65 2 55'}
            stroke="#FDE047"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            className="animate-pulse"
          />
        )}

        {/* TIA SÁNG CHIẾN THẮNG / NGÔI SAO TRÊN ĐẦU */}
        {(normalizedState === 'celebrate' || normalizedState === 'victory') && (
          <g className="animate-spin" style={{ transformOrigin: '50px 10px' }}>
            <polygon points="50,2 52,8 58,8 53,12 55,18 50,14 45,18 47,12 42,8 48,8" fill="#FBBF24" />
          </g>
        )}

        {/* DẤU CHẤM THÀNH ! KHI NGẠC NHIÊN (SURPRISED) */}
        {normalizedState === 'surprised' && (
          <g>
            <rect x="47" y="2" width="6" height="12" rx="3" fill="#F59E0B" />
            <circle cx="50" cy="18" r="3" fill="#F59E0B" />
          </g>
        )}

        {/* 1. TAI NHỆN CHIBI TRÊN MŨ HOODIE */}
        <ellipse cx="27" cy="22" rx="7.5" ry="13" fill="#E11D48" stroke="#9F1239" strokeWidth="2.5" />
        <ellipse cx="73" cy="22" rx="7.5" ry="13" fill="#E11D48" stroke="#9F1239" strokeWidth="2.5" />
        {/* Đệm tai màu xanh navy đặc trưng */}
        <ellipse cx="27" cy="23" rx="4" ry="7.5" fill="#1E3A8A" />
        <ellipse cx="73" cy="23" rx="4" ry="7.5" fill="#1E3A8A" />

        {/* 2. ĐẦU HƠI LỚN TỶ LỆ CHIBI HOẠT HÌNH */}
        <circle cx="50" cy="46" r="32" fill="#E11D48" stroke="#9F1239" strokeWidth="3" />

        {/* 3. KHUÔN MẶT BÉ TRÒN TRỊA ĐÁNG YÊU */}
        <ellipse cx="50" cy="52" rx="23.5" ry="20" fill="#FED7AA" />

        {/* 4. MẮT BIỂU CẢM THEO 12 TRẠNG THÁI */}
        {normalizedState === 'sad' ? (
          // Mắt buồn rũ xuống đáng yêu
          <>
            <path d="M 37 53 Q 42 48 47 54" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 53 54 Q 58 48 63 53" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Giọt mồ hôi nhỏ */}
            <circle cx="68" cy="48" r="2.5" fill="#38BDF8" />
          </>
        ) : normalizedState === 'defeat' ? (
          // Mắt xoay nhẹ kiểu hài hước >_<
          <>
            <path d="M 36 48 L 46 54 M 36 54 L 46 48" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 54 48 L 64 54 M 54 54 L 64 48" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : normalizedState === 'attack' ? (
          // Mắt sắc sảo tập trung quyết tâm
          <>
            <polygon points="36,46 47,52 38,55" fill="#0F172A" />
            <polygon points="64,46 53,52 62,55" fill="#0F172A" />
            <circle cx="43" cy="50" r="1.5" fill="#FFFFFF" />
            <circle cx="57" cy="50" r="1.5" fill="#FFFFFF" />
          </>
        ) : normalizedState === 'surprised' ? (
          // Mắt to tròn xoe ngạc nhiên
          <>
            <circle cx="41" cy="49" r="6.5" fill="#0F172A" />
            <circle cx="39" cy="47" r="2.5" fill="#FFFFFF" />
            <circle cx="59" cy="49" r="6.5" fill="#0F172A" />
            <circle cx="57" cy="47" r="2.5" fill="#FFFFFF" />
          </>
        ) : normalizedState === 'celebrate' || normalizedState === 'victory' ? (
          // Mắt cười tít cong hình cầu vồng ^_^
          <>
            <path d="M 36 51 Q 41 43 46 51" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 54 51 Q 59 43 64 51" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          // Mắt to tròn thân thiện chuẩn (Idle, Walk, Run, Jump, Web_Shoot, Pull)
          <>
            <ellipse cx="41" cy="50" rx="5.5" ry="7" fill="#0F172A" />
            <circle cx="39" cy="47.5" r="2" fill="#FFFFFF" />
            <circle cx="42" cy="52" r="1" fill="#FFFFFF" />
            <ellipse cx="59" cy="50" rx="5.5" ry="7" fill="#0F172A" />
            <circle cx="57" cy="47.5" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="52" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* 5. KHUÔN MIỆNG THEO TRẠNG THÁI */}
        {normalizedState === 'sad' ? (
          <path d="M 45 64 Q 50 59 55 64" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : normalizedState === 'surprised' ? (
          <ellipse cx="50" cy="62" rx="4" ry="5.5" fill="#9F1239" />
        ) : normalizedState === 'celebrate' || normalizedState === 'victory' ? (
          <path d="M 43 59 Q 50 69 57 59 Z" fill="#E11D48" />
        ) : (
          <path d="M 44 61 Q 50 66 56 61" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Má hồng ửng dễ thương */}
        <circle cx="34" cy="56" r="3.5" fill="#FDA4AF" opacity="0.8" />
        <circle cx="66" cy="56" r="3.5" fill="#FDA4AF" opacity="0.8" />

        {/* 6. THÂN HÌNH NHỎ ĐÁNG YÊU (ÁO ĐỎ & XANH NAVY) */}
        {/* Áo đỏ ruby kết hợp xanh navy */}
        <path d="M 32 75 C 32 70 41 68 50 68 C 59 68 68 70 68 75 L 72 96 L 28 96 Z" fill="#E11D48" />
        {/* Vạt áo xanh navy hai bên sườn */}
        <path d="M 30 78 L 38 96 L 28 96 Z" fill="#1E3A8A" />
        <path d="M 70 78 L 62 96 L 72 96 Z" fill="#1E3A8A" />

        {/* 7. BIỂU TƯỢNG NHỆN NHÍ ĐỘC QUYỀN TRƯỚC NGỰC */}
        {/* Ngôi sao vàng kim trung tâm và 4 tia tơ nhỏ */}
        <circle cx="50" cy="82" r="5" fill="#FBBF24" />
        <polygon points="50,78 51.5,81 55,82 52,84.5 53,88 50,86 47,88 48,84.5 45,82 48.5,81" fill="#FEF08A" />
        {/* Các chân tơ nhện nhí cách điệu màu xanh navy */}
        <path d="M 45 81 Q 40 79 38 82" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
        <path d="M 45 84 Q 39 86 38 90" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
        <path d="M 55 81 Q 60 79 62 82" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
        <path d="M 55 84 Q 61 86 62 90" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* TRANG BỊ TRANG PHỤC TRÊN BẢN VECTOR */}
      {costumes?.hat && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce pointer-events-none z-30 drop-shadow-md">
          👑
        </div>
      )}
      {costumes?.cloak && (
        <div className="absolute -top-1 -left-2 text-xl animate-pulse pointer-events-none z-30 drop-shadow-md">
          🌟
        </div>
      )}
      {costumes?.mask && (
        <div className="absolute top-2 right-0 text-sm bg-rose-600/80 p-0.5 rounded-full text-white pointer-events-none z-30 shadow-sm">
          🎭
        </div>
      )}
      {costumes?.boots && (
        <div className="absolute -bottom-2 right-0 text-base animate-bounce pointer-events-none z-30">
          ⚡
        </div>
      )}
      {costumes?.suit && (
        <div className="absolute inset-0 border-3 border-amber-300 rounded-full animate-pulse pointer-events-none z-20 shadow-lg shadow-amber-400/40" />
      )}
    </div>
  )}

      {/* NHÃN TRẠNG THÁI (OPTIONAL) */}
      {showLabel && (
        <span className="mt-1 px-2.5 py-0.5 bg-slate-900/80 text-white font-comic font-black text-[10px] rounded-full shadow-sm capitalize">
          {normalizedState}
        </span>
      )}
    </div>
  );
};
