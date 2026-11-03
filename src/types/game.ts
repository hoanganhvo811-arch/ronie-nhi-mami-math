// src/types/game.ts
// Các cấu trúc trạng thái và sự kiện kết nối React và Phaser (Phase 1)

import type { MathTopicKey } from './database';
export * from './character';
export * from './dialogue';
export * from '../math-engine/types';

export type GameScreen =
  | 'SPLASH'
  | 'MAIN_MENU'
  | 'ROYAL_CASTLE'
  | 'WORLD_MAP'
  | 'MISSION_SELECTION'
  | 'TOY_ROOM'
  | 'PROFILE'
  | 'MATH_ARENA'
  | 'PARENT_DASHBOARD';

export type RonieAnimationState =
  | 'idle'
  | 'walking'
  | 'celebrating'
  | 'thinking'
  | 'jumping'
  | 'swinging';

export type ZoneStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type MissionStatus = 'not_started' | 'in_progress' | 'completed';

export interface IMission {
  id: string;
  zoneId: number;
  stageId: number;
  title: string;
  subtitle: string;
  mathTopic: string;
  difficulty: MissionDifficulty;
  status: MissionStatus;
  starsEarned: number;
  maxStars: number;
  icon: string;
  illustration: string;
  description: string;
  rewardExp: number;
}

export interface IZoneInfo {
  id: number;
  title: string;
  subtitle: string;
  topicKey: MathTopicKey;
  color: string;
  pastelColor: string;
  accentColor: string;
  bgGradient: string;
  icon: string;
  requiredStars: number;
  description: string;
  status: ZoneStatus;
  missionsCount: number;
  completedMissionsCount: number;
  missions?: IMission[];
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
