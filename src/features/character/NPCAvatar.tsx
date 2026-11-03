// src/features/character/NPCAvatar.tsx
// Component hiển thị Avatar các nhân vật phụ (NPCs) phong cách 3D Cute Pastel

import React from 'react';
import type { NPCId } from '../../types/character';
import { npcRegistry } from './npcRegistry';

interface NPCAvatarProps {
  npcId: NPCId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
}

export const NPCAvatar: React.FC<NPCAvatarProps> = ({
  npcId,
  size = 'md',
  className = '',
  showName = false,
}) => {
  const npc = npcRegistry.get(npcId);

  const sizeMap = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-28 h-28 text-5xl',
    xl: 'w-36 h-36 text-6xl',
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      title={`${npc.name} - ${npc.title}`}
    >
      {/* VÒNG TRÒN NỀN PASTEL ĐỔ BÓNG 3D CUTE */}
      <div
        className={`rounded-full border-3 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${sizeMap[size]}`}
        style={{
          backgroundColor: npc.pastelColor,
          borderColor: npc.primaryColor,
        }}
      >
        <span className="animate-bounce select-none drop-shadow-md">{npc.avatarEmoji}</span>
      </div>

      {showName && (
        <span
          className="mt-1 px-2.5 py-0.5 rounded-full font-comic font-black text-xs text-white shadow-sm truncate max-w-[120px]"
          style={{ backgroundColor: npc.primaryColor }}
        >
          {npc.name}
        </span>
      )}
    </div>
  );
};
