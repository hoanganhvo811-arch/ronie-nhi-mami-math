// src/types/game.ts
// Các cấu trúc trạng thái và sự kiện kết nối React và Phaser

import type { MathTopicKey } from './database';

export type GameScreen =
  | 'SPLASH'
  | 'MAIN_MENU'
  | 'WORLD_MAP'
  | 'MATH_ARENA'
  | 'INVENTORY'
  | 'PARENT_DASHBOARD'
  | 'PROFILE_SELECT';

export type RonieAnimationState =
  | 'idle'
  | 'walking'
  | 'celebrating'
  | 'thinking'
  | 'jumping';

export interface IZoneInfo {
  id: number;
  title: string;
  subtitle: string;
  topicKey: MathTopicKey;
  color: string;
  bgGradient: string;
  icon: string;
  requiredStars: number;
  description: string;
}

export interface IMathQuestion {
  id: string;
  zoneId: number;
  topicKey: MathTopicKey;
  questionText: string;
  visualType: 'COUNTING' | 'ADDITION_VISUAL' | 'SUBTRACTION_VISUAL' | 'COMPARISON' | 'GEOMETRY' | 'RULER_CM' | 'CLOCK';
  visualData: {
    countItems?: { emoji: string; count: number; name: string };
    groupA?: { emoji: string; count: number };
    groupB?: { emoji: string; count: number };
    comparisonValues?: { left: number; right: number };
    shapes?: { name: string; type: 'square' | 'circle' | 'triangle' | 'rectangle' | 'cube'; color: string }[];
    measurement?: { objectName: string; lengthCm: number };
    clockTime?: { hour: number; minute: number };
  };
  options: (string | number)[];
  correctAnswer: string | number;
  hint: string;
}

export type GameBridgeEventMap = {
  SCENE_READY: { sceneKey: string };
  ZONE_SELECTED: { zoneId: number };
  MATH_TRIGGERED: { zoneId: number; stageId: number };
  MATH_ANSWER_SUBMITTED: { correct: boolean; score: number };
  CHANGE_SCREEN: { screen: GameScreen };
  RONIE_MOVED: { x: number; y: number };
  AUDIO_PLAY_SFX: { sfxKey: string };
};
