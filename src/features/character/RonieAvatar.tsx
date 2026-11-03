// src/features/character/RonieAvatar.tsx
// Hình tượng nguyên bản Hiệp Sĩ Nhện Nhí Ronie (Original IP)

import React from 'react';
import type { RonieAnimationState } from '../../types/game';

interface RonieAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: RonieAnimationState;
  className?: string;
}

export const RonieAvatar: React.FC<RonieAvatarProps> = ({
  size = 'md',
  state = 'idle',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const animMap: Record<RonieAnimationState, string> = {
    idle: 'animate-pulse',
    walking: 'animate-bounce',
    celebrating: 'animate-bounce scale-110',
    thinking: '',
    jumping: '-translate-y-4 transition-transform',
    swinging: 'animate-bounce -translate-y-2',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${animMap[state]} ${className}`}
      title="Bé Ronie - Hiệp Sĩ Nhện Nhí"
    >
      {/* Vòng hào quang năng lượng tơ sao */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-400/30 blur-md transform scale-110" />

      {/* SVG Vector độc quyền của Ronie */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tai nhện ngộ nghĩnh trên mũ hoodie */}
        <ellipse cx="28" cy="22" rx="7" ry="12" fill="#E11D48" stroke="#9F1239" strokeWidth="2.5" />
        <ellipse cx="72" cy="22" rx="7" ry="12" fill="#E11D48" stroke="#9F1239" strokeWidth="2.5" />
        <ellipse cx="28" cy="23" rx="4" ry="7" fill="#0284C7" />
        <ellipse cx="72" cy="23" rx="4" ry="7" fill="#0284C7" />

        {/* Mũ trùm hoodie đầu tròn */}
        <circle cx="50" cy="46" r="32" fill="#E11D48" stroke="#9F1239" strokeWidth="3" />

        {/* Khung mặt bé chibi */}
        <ellipse cx="50" cy="52" rx="23" ry="20" fill="#FED7AA" />

        {/* Mắt to tròn biểu cảm thân thiện */}
        {state === 'thinking' ? (
          <>
            <circle cx="41" cy="48" r="4.5" fill="#0F172A" />
            <path d="M 57 48 Q 63 44 69 48" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="41" cy="50" rx="5" ry="6.5" fill="#0F172A" />
            <circle cx="39" cy="48" r="2" fill="#FFFFFF" />
            <ellipse cx="59" cy="50" rx="5" ry="6.5" fill="#0F172A" />
            <circle cx="57" cy="48" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Nụ cười vui tươi */}
        <path d="M 44 61 Q 50 67 56 61" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Má hồng ửng dễ thương */}
        <circle cx="34" cy="56" r="3.5" fill="#FDA4AF" opacity="0.8" />
        <circle cx="66" cy="56" r="3.5" fill="#FDA4AF" opacity="0.8" />

        {/* Họa tiết mạng tơ sao may mắn trước ngực áo */}
        <path d="M 50 78 L 50 94" stroke="#0284C7" strokeWidth="2" />
        <polygon points="50,76 53,82 59,82 54,86 56,92 50,88 44,92 46,86 41,82 47,82" fill="#F59E0B" />
      </svg>
    </div>
  );
};
