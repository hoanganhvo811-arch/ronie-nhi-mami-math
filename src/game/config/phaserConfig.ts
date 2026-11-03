// src/game/config/phaserConfig.ts
// Cấu hình Phaser 3 tối ưu cho Web & Mobile / Tablet

import Phaser from 'phaser';
import { WorldMapScene } from '../scenes/WorldMapScene';

export function createPhaserConfig(parentContainerId: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: parentContainerId,
    width: 1280,
    height: 720,
    backgroundColor: '#0F172A', // Slate 900
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [WorldMapScene],
  };
}
