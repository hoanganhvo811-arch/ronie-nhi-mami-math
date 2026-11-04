// src/features/character/QueenNhiMamiAvatar.tsx
// Hình tượng Nữ hoàng Tri thức Nhi Mami (Queen Nhi Mami) - 8 Trạng Thái Biểu Cảm & Hoạt Ảnh

import React from 'react';
import type { QueenAnimationState } from '../../types/character';

interface QueenNhiMamiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  state?: QueenAnimationState;
  speaking?: boolean; // Tương thích ngược
  className?: string;
  showLabel?: boolean;
  variant?: 'vector' | 'photo';
}

export const QueenNhiMamiAvatar: React.FC<QueenNhiMamiAvatarProps> = ({
  size = 'md',
  state = 'idle',
  speaking = false,
  className = '',
  showLabel = false,
  variant = 'photo',
}) => {
  // Chuẩn hóa trạng thái nếu truyền speaking cũ
  const currentState: QueenAnimationState = speaking && state === 'idle' ? 'talking' : state;

  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
    '2xl': 'w-56 h-56',
  };

  const animMap: Record<QueenAnimationState, string> = {
    idle: 'animate-pulse',
    greeting: 'scale-105 animate-pulse',
    talking: 'scale-105',
    laughing: 'animate-bounce',
    surprised: 'scale-110 animate-pulse',
    clapping: 'animate-bounce',
    rewarding: 'scale-110 drop-shadow-xl animate-pulse',
    encouraging: 'scale-105',
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${sizeMap[size]} ${animMap[currentState] || ''} ${className}`}
      title={`Nữ Hoàng Nhi Mami - ${currentState}`}
    >
      {/* VÒNG HÀO QUANG HOÀNG GIA */}
      <div
        className={`absolute inset-0 rounded-full blur-md transform scale-115 pointer-events-none transition-all ${
          currentState === 'rewarding' || currentState === 'clapping'
            ? 'bg-amber-300/40 animate-spin'
            : currentState === 'laughing'
            ? 'bg-pink-300/40'
            : 'bg-purple-300/30'
        }`}
      />

      {/* HIỂN THỊ ẢNH 3D CHÍNH THỨC HOẶC VECTOR ĐỘC QUYỀN */}
      {variant === 'photo' ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/assets/queen-nhi-mami-official.png"
            alt="Nữ Hoàng Nhi Mami"
            className="w-full h-full object-contain filter drop-shadow-2xl"
            loading="lazy"
          />

          {/* QUYỀN TRƯỢNG & VƯƠNG MIỆN KHI REWARDING HOẶC GREETING */}
          {(currentState === 'rewarding' || currentState === 'greeting') && (
            <div className="absolute -top-3 -right-2 text-2xl animate-bounce pointer-events-none">
              👑
            </div>
          )}

          {/* TRÁI TIM YÊU THƯƠNG KHI KHÍCH LỆ (ENCOURAGING) HOẶC LAUGHING */}
          {(currentState === 'encouraging' || currentState === 'laughing') && (
            <div className="absolute -top-3 left-0 text-2xl animate-pulse pointer-events-none">
              💖
            </div>
          )}

          {/* HÀO QUANG KHI VỖ TAY HOẶC THÁN PHỤC */}
          {(currentState === 'clapping' || currentState === 'surprised') && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl animate-spin pointer-events-none">
              ✨
            </div>
          )}

          {/* HIỆU ỨNG NÓI CHUYỆN */}
          {currentState === 'talking' && (
            <div className="absolute -bottom-2 right-0 text-lg animate-pulse pointer-events-none">
              💬
            </div>
          )}
        </div>
      ) : (
        /* SVG VECTOR ĐỘC QUYỀN NỮ HOÀNG NHI MAMI (VÁY HỒNG PASTEL & VƯƠNG MIỆN VÀNG) */
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        {/* QUYỀN TRƯỢNG TRI THỨC KHI REWARDING HOẶC GREETING */}
        {(currentState === 'rewarding' || currentState === 'greeting') && (
          <g>
            <line x1="78" y1="35" x2="88" y2="90" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="77" cy="32" r="7" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
            <polygon points="77,28 78,31 81,32 78.5,34 79.5,37 77,35 74.5,37 75.5,34 73,32 76,31" fill="#FFFFFF" />
          </g>
        )}

        {/* TRÁI TIM YÊU THƯƠNG KHI KHÍCH LỆ (ENCOURAGING) HOẶC LAUGHING */}
        {(currentState === 'encouraging' || currentState === 'laughing') && (
          <path
            d="M 22 28 C 18 20 28 15 32 24 C 36 15 46 20 42 28 L 32 37 Z"
            fill="#F472B6"
            className="animate-bounce"
            style={{ transformOrigin: '32px 26px' }}
          />
        )}

        {/* 1. MÁI TÓC DÀI BỒNG BỀNH MÀU HẠT DẺ ÓNG Ả */}
        <path d="M 24 45 C 18 68 24 94 35 98 C 42 70 38 48 34 38 Z" fill="#78350F" />
        <path d="M 76 45 C 82 68 76 94 65 98 C 58 70 62 48 66 38 Z" fill="#78350F" />
        {/* Lọn tóc mái uốn duyên dáng */}
        <path d="M 28 38 Q 42 42 50 36 Q 58 42 72 38" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* 2. KHUÔN MẶT THANH TÚ DỊU DÀNG */}
        <circle cx="50" cy="50" r="23" fill="#FFEDD5" />

        {/* 3. VƯƠNG MIỆN VÀNG RỰC RỠ ĐÍNH NGỌC TOÁN HỌC */}
        <path d="M 32 34 L 38 18 L 50 25 L 62 18 L 68 34 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <circle cx="50" cy="20" r="3.5" fill="#EC4899" />
        <circle cx="38" cy="22" r="2.5" fill="#38BDF8" />
        <circle cx="62" cy="22" r="2.5" fill="#10B981" />

        {/* 4. ĐÔI MẮT BIỂU CẢM THEO TRẠNG THÁI */}
        {currentState === 'laughing' || currentState === 'clapping' ? (
          // Mắt cười híp cong hình nụ cười ^_^
          <>
            <path d="M 38 49 Q 44 42 49 49" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 51 49 Q 56 42 62 49" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : currentState === 'surprised' ? (
          // Mắt ngạc nhiên mở to tròn
          <>
            <circle cx="43" cy="48" r="5.5" fill="#451A03" />
            <circle cx="41.5" cy="46.5" r="2" fill="#FFFFFF" />
            <circle cx="57" cy="48" r="5.5" fill="#451A03" />
            <circle cx="55.5" cy="46.5" r="2" fill="#FFFFFF" />
          </>
        ) : (
          // Mắt dịu dàng nhìn bé trìu mến
          <>
            <path d="M 39 47 Q 44 43 49 47" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 51 47 Q 56 43 61 47" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="44" cy="50" r="3" fill="#451A03" />
            <circle cx="43" cy="49" r="1.2" fill="#FFFFFF" />
            <circle cx="56" cy="50" r="3" fill="#451A03" />
            <circle cx="55" cy="49" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* 5. NỤ CƯỜI THEO TRẠNG THÁI */}
        {currentState === 'talking' ? (
          // Miệng mấp máy nói chuyện tròn
          <ellipse cx="50" cy="61" rx="4.5" ry="3.5" fill="#BE185D" />
        ) : currentState === 'laughing' ? (
          // Cười toe toét hạnh phúc
          <path d="M 44 58 Q 50 67 56 58 Z" fill="#BE185D" />
        ) : currentState === 'surprised' ? (
          // Miệng chữ O ngạc nhiên
          <circle cx="50" cy="61" r="3.5" fill="#BE185D" />
        ) : (
          // Mỉm cười hiền hậu
          <path d="M 45 59 Q 50 64 55 59" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Má hồng phấn dịu dàng */}
        <circle cx="36" cy="55" r="3.5" fill="#FBCFE8" opacity="0.9" />
        <circle cx="64" cy="55" r="3.5" fill="#FBCFE8" opacity="0.9" />

        {/* 6. VÁY DẠ HỘI HỒNG PASTEL XINH ĐẸP CỦA NỮ HOÀNG */}
        <path d="M 32 75 C 32 68 42 66 50 66 C 58 66 68 68 68 75 L 76 98 L 24 98 Z" fill="#F472B6" />
        {/* Lớp ren voan trắng kem trang trí ở ngực */}
        <path d="M 42 66 L 50 78 L 58 66" stroke="#FEF3C7" strokeWidth="3" fill="none" />
        {/* Nơ ngọc vàng ở eo */}
        <circle cx="50" cy="78" r="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      </svg>
      )}

      {/* NHÃN TRẠNG THÁI (OPTIONAL) */}
      {showLabel && (
        <span className="mt-1 px-2.5 py-0.5 bg-purple-900/80 text-white font-comic font-black text-[10px] rounded-full shadow-sm capitalize">
          {currentState}
        </span>
      )}
    </div>
  );
};
