// src/features/character/QueenNhiMamiAvatar.tsx
// Hình tượng Nữ hoàng Tri thức Nhi Mami (Queen Nhi Mami)

import React from 'react';

interface QueenNhiMamiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speaking?: boolean;
  className?: string;
}

export const QueenNhiMamiAvatar: React.FC<QueenNhiMamiAvatarProps> = ({
  size = 'md',
  speaking = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${speaking ? 'animate-pulse' : ''} ${className}`}
      title="Nữ hoàng Nhi Mami - Biểu tượng Tri thức Vương Quốc Toán Học"
    >
      {/* Vòng hào quang vàng kim hoàng gia */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400/30 to-amber-300/40 blur-md transform scale-110" />

      {/* SVG Vector độc quyền của Nữ hoàng Nhi Mami */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mái tóc dài mềm mại màu hạt dẻ óng ả */}
        <path d="M 24 45 C 20 70 26 95 36 98 C 42 70 38 48 34 38 Z" fill="#78350F" />
        <path d="M 76 45 C 80 70 74 95 64 98 C 58 70 62 48 66 38 Z" fill="#78350F" />

        {/* Cổ & Khuôn mặt thanh tú dịu dàng */}
        <circle cx="50" cy="50" r="23" fill="#FFEDD5" />

        {/* Vương miện đính ngọc toán học rực rỡ */}
        <path d="M 32 34 L 38 18 L 50 25 L 62 18 L 68 34 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <circle cx="50" cy="20" r="3.5" fill="#8B5CF6" />
        <circle cx="38" cy="22" r="2.5" fill="#EF4444" />
        <circle cx="62" cy="22" r="2.5" fill="#10B981" />

        {/* Đôi mắt biết cười và hàng mi cong */}
        <path d="M 39 48 Q 44 44 49 48" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 51 48 Q 56 44 61 48" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Nụ cười hiền hậu */}
        <path d="M 45 59 Q 50 64 55 59" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Má hồng phấn dịu dàng */}
        <circle cx="36" cy="55" r="3" fill="#FDA4AF" opacity="0.7" />
        <circle cx="64" cy="55" r="3" fill="#FDA4AF" opacity="0.7" />

        {/* Áo dạ hội hoàng gia tím oải hương viền vàng */}
        <path d="M 32 75 C 32 70 42 66 50 66 C 58 66 68 70 68 75 L 75 98 L 25 98 Z" fill="#8B5CF6" />
        <path d="M 42 68 L 50 82 L 58 68" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
        <circle cx="50" cy="80" r="3" fill="#FBBF24" />
      </svg>
    </div>
  );
};
