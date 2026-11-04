// src/design-system/CartoonButton.tsx
// Nút bấm hoạt hình 3D nổi khối (Chunky 3D Cartoon Button) cho trẻ 6-7 tuổi

import React from 'react';
import { soundManager } from '../services/audio/AudioManager';

export type ButtonColor =
  | 'amber'
  | 'emerald'
  | 'rose'
  | 'purple'
  | 'sky'
  | 'indigo'
  | 'slate'
  | 'green'
  | 'pink'
  | 'orange';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface CartoonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  pulsing?: boolean;
}

export const CartoonButton: React.FC<CartoonButtonProps> = ({
  color = 'amber',
  size = 'md',
  icon,
  children,
  fullWidth = false,
  pulsing = false,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const colorStyles: Record<ButtonColor, { bg: string; shadow: string; border: string; text: string }> = {
    amber: {
      bg: 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500',
      shadow: 'shadow-[0_6px_0_#b45309,0_10px_15px_rgba(180,83,9,0.4)]',
      border: 'border-2 border-amber-200',
      text: 'text-amber-950 font-black',
    },
    emerald: {
      bg: 'bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-500',
      shadow: 'shadow-[0_6px_0_#047857,0_10px_15px_rgba(4,120,87,0.4)]',
      border: 'border-2 border-emerald-200',
      text: 'text-white font-black',
    },
    rose: {
      bg: 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600',
      shadow: 'shadow-[0_6px_0_#be123c,0_10px_15px_rgba(190,18,60,0.4)]',
      border: 'border-2 border-rose-300',
      text: 'text-white font-black',
    },
    purple: {
      bg: 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600',
      shadow: 'shadow-[0_6px_0_#6b21a8,0_10px_15px_rgba(107,33,168,0.4)]',
      border: 'border-2 border-purple-300',
      text: 'text-white font-black',
    },
    sky: {
      bg: 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500',
      shadow: 'shadow-[0_6px_0_#0369a1,0_10px_15px_rgba(3,105,161,0.4)]',
      border: 'border-2 border-sky-200',
      text: 'text-slate-900 font-black',
    },
    indigo: {
      bg: 'bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-600',
      shadow: 'shadow-[0_6px_0_#3730a3,0_10px_15px_rgba(55,48,163,0.4)]',
      border: 'border-2 border-indigo-300',
      text: 'text-white font-black',
    },
    slate: {
      bg: 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800',
      shadow: 'shadow-[0_6px_0_#1e293b,0_10px_15px_rgba(30,41,59,0.4)]',
      border: 'border-2 border-slate-500',
      text: 'text-slate-100 font-bold',
    },
    green: {
      bg: 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600',
      shadow: 'shadow-[0_6px_0_#065f46,0_10px_15px_rgba(4,120,87,0.4)]',
      border: 'border-2 border-emerald-300',
      text: 'text-white font-black',
    },
    pink: {
      bg: 'bg-gradient-to-b from-pink-400 via-rose-500 to-pink-600',
      shadow: 'shadow-[0_6px_0_#9f1239,0_10px_15px_rgba(159,18,57,0.4)]',
      border: 'border-2 border-pink-300',
      text: 'text-white font-black',
    },
    orange: {
      bg: 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600',
      shadow: 'shadow-[0_6px_0_#92400e,0_10px_15px_rgba(146,64,14,0.4)]',
      border: 'border-2 border-amber-300',
      text: 'text-amber-950 font-black',
    },
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'py-2 px-3 text-xs md:text-sm rounded-xl min-h-[40px]',
    md: 'py-2.5 px-5 text-sm md:text-base rounded-2xl min-h-[48px]',
    lg: 'py-3.5 px-7 text-base md:text-lg rounded-2xl min-h-[56px]',
    xl: 'py-4 px-9 text-lg md:text-2xl rounded-3xl min-h-[64px]',
  };

  const currentTheme = colorStyles[color];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundManager.playTap();
    if (onClick) onClick(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 select-none font-comic transition-all cursor-pointer ${
        currentTheme.bg
      } ${currentTheme.border} ${currentTheme.text} ${sizeStyles[size]} ${
        disabled
          ? 'opacity-60 cursor-not-allowed filter grayscale shadow-none translate-y-1'
          : `${currentTheme.shadow} active:translate-y-1.5 active:shadow-[0_1px_0_rgba(0,0,0,0.3)] hover:brightness-105`
      } ${fullWidth ? 'w-full' : ''} ${pulsing ? 'animate-bounce' : ''} ${className}`}
    >
      {/* Vệt sáng bóng 3D trên đỉnh nút */}
      <span className="absolute top-1 left-2 right-2 h-1/3 bg-white/30 rounded-t-xl pointer-events-none" />
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="relative z-10 drop-shadow-sm">{children}</span>
    </button>
  );
};
