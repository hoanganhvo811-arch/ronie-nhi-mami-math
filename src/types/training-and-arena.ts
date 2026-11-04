// src/types/training-and-arena.ts
// Định nghĩa kiểu dữ liệu cho Phòng Luyện Toán (Math Training Room) & Đấu Trường Toán Học (Challenge Arena) - Phase 5

import type { IGrade1Question } from '../math-engine/types';

// 8 Khu vực chuyên đề của Phòng Luyện Toán
export type TrainingTopicId =
  | 'addition_subtraction' // 1. Cộng và trừ
  | 'comparison' // 2. So sánh số
  | 'missing_numbers' // 3. Tìm số bí mật / điền số
  | 'word_problems' // 4. Toán có lời văn
  | 'number_patterns' // 5. Quy luật số
  | 'geometry' // 6. Hình học
  | 'measurement' // 7. Đo lường & thời gian
  | 'logical_thinking'; // 8. Tư duy logic

// 3 Mức độ luyện tập
export type TrainingLevel = 'practice' | 'advanced' | 'expert';

export interface ITrainingTopicConfig {
  id: TrainingTopicId;
  name: string;
  description: string;
  icon: string;
  colorAccent: string;
  bgGradient: string;
  stationName: string;
  mathEngineTopics: string[];
}

export interface ITrainingSessionState {
  topicId: TrainingTopicId;
  level: TrainingLevel;
  questionCount: 5 | 10 | 15;
  currentIndex: number;
  questions: IGrade1Question[];
  currentQuestion: IGrade1Question | null;
  selectedOption: unknown | null;
  correctCount: number;
  mistakesCount: number;
  streak: number;
  score: number;
  hintsUsedCount: number;
  isCompleted: boolean;
  startTime: number;
  elapsedSeconds: number;
}

// 5 Chế độ chơi của Đấu Trường Toán Học
export type ChallengeArenaMode =
  | 'speed_60s' // 1. Thử thách 60 giây
  | 'marathon_20q' // 2. Siêu thử thách Marathon 20 câu
  | 'boss_10q' // 3. Đối đầu Trùm cuối 10 câu
  | 'mystery_number' // 4. Đi tìm số bí mật
  | 'multi_step'; // 5. Thử thách nhiều bước giải

export interface IArenaModeConfig {
  id: ChallengeArenaMode;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  badgeName: string;
  accentColor: string;
  bannerGradient: string;
  totalQuestions: number;
  hasTimer: boolean;
  defaultTimeSeconds: number;
  rewardExp: number;
  rewardStars: number;
}

export interface IArenaSessionState {
  mode: ChallengeArenaMode;
  isTimerEnabled: boolean; // Có thể bật / tắt thời gian
  timeRemainingSeconds: number;
  totalTimeSpentSeconds: number;
  questions: IGrade1Question[];
  currentIndex: number;
  currentQuestion: IGrade1Question | null;
  selectedOption: unknown | null;
  correctCount: number;
  mistakesCount: number;
  streak: number;
  score: number;
  bossHp: number; // Dành riêng cho boss_10q (0 - 100)
  maxBossHp: number;
  isFinished: boolean;
  resultBreakdown?: {
    accuracy: number;
    starsEarned: number;
    expEarned: number;
    title: string;
    queenFeedback: string;
  };
}

export interface ITrainingHistoryRecord {
  id: string;
  profileId: string;
  topicId: TrainingTopicId;
  level: TrainingLevel;
  totalQuestions: number;
  correctCount: number;
  score: number;
  timestamp: number;
}

export interface IArenaHistoryRecord {
  id: string;
  profileId: string;
  mode: ChallengeArenaMode;
  totalQuestions: number;
  correctCount: number;
  score: number;
  starsEarned: number;
  timeSpentSeconds: number;
  bossDefeated?: boolean;
  timestamp: number;
}
