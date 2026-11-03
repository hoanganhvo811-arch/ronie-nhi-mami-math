// src/game/PhaserGameContainer.tsx
// Component React bao bọc Phaser 3 Canvas với cơ chế quản lý vòng đời chặt chẽ

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createPhaserConfig } from './config/phaserConfig';

interface PhaserGameContainerProps {
  className?: string;
}

export const PhaserGameContainer: React.FC<PhaserGameContainerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const containerId = 'phaser-game-canvas-container';
    if (!containerRef.current || gameRef.current) return;

    // Khởi tạo Phaser Game
    const config = createPhaserConfig(containerId);
    gameRef.current = new Phaser.Game(config);

    return () => {
      // Hủy game instance và dọn dẹp WebGL context khi unmount
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="phaser-game-canvas-container"
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950 ${className}`}
    />
  );
};
