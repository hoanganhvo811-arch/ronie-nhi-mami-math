// src/design-system/CartoonSpeechBubble.tsx
// Bong bóng hội thoại hoạt hình dễ thương (Storybook Cartoon Speech Bubble)

import React from 'react';

interface CartoonSpeechBubbleProps {
  speakerName: string;
  speakerRole?: string;
  badgeColor?: 'pink' | 'purple' | 'amber' | 'blue';
  direction?: 'left' | 'right' | 'top';
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export const CartoonSpeechBubble: React.FC<CartoonSpeechBubbleProps> = ({
  speakerName,
  speakerRole,
  badgeColor = 'purple',
  direction = 'left',
  children,
  actionButton,
  className = '',
}) => {
  const badgeThemes = {
    pink: 'bg-rose-500 text-white border-rose-300',
    purple: 'bg-purple-600 text-white border-purple-300',
    amber: 'bg-amber-400 text-amber-950 border-amber-200',
    blue: 'bg-sky-500 text-white border-sky-300',
  };

  return (
    <div
      className={`relative bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-4 border-amber-300 shadow-[0_12px_24px_rgba(0,0,0,0.15)] flex flex-col gap-2 animate-fadeIn select-none ${className}`}
    >
      {/* HUY HIỆU TÊN NHÂN VẬT PHÍA TRÊN BONG BÓNG */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm font-comic font-black text-xs sm:text-sm tracking-wide ${badgeThemes[badgeColor]}">
          <span>{speakerName}</span>
          {speakerRole && (
            <span className="text-[10px] font-bold opacity-90 pl-1 border-l border-white/40">
              {speakerRole}
            </span>
          )}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>

      {/* NỘI DUNG LỜI NÓI TO RÕ */}
      <div className="font-comic font-black text-slate-800 text-sm sm:text-base md:text-lg leading-relaxed pt-1">
        {children}
      </div>

      {/* ĐUÔI BONG BÓNG CHỈ VÀO NHÂN VẬT */}
      {direction === 'left' && (
        <div className="absolute top-6 -left-3 w-0 h-0 border-t-[10px] border-t-transparent border-r-[14px] border-r-amber-300 border-b-[10px] border-b-transparent" />
      )}
      {direction === 'right' && (
        <div className="absolute top-6 -right-3 w-0 h-0 border-t-[10px] border-t-transparent border-l-[14px] border-l-amber-300 border-b-[10px] border-b-transparent" />
      )}
      {direction === 'top' && (
        <div className="absolute -top-3 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-b-[14px] border-b-amber-300 border-r-[10px] border-r-transparent" />
      )}
    </div>
  );
};
