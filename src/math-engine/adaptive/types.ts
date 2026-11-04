// src/math-engine/adaptive/types.ts
// Các cấu trúc dữ liệu cho Hệ thống Điều chỉnh Độ khó Tự động (Adaptive Difficulty Engine) - Phase 2

import type { MathTopic, MathDifficulty, IGrade1Question } from '../types';

/**
 * 3 Chế độ chơi chính của game
 */
export type GameMode = 'story' | 'practice' | 'challenge';

/**
 * 5 Thang đo năng lực thuần thục (Mastery Levels)
 */
export type MasteryLevel =
  | 'needs_practice' // 0 - 39: Cần luyện tập
  | 'progressing'    // 40 - 59: Đang tiến bộ
  | 'proficient'     // 60 - 79: Khá tốt
  | 'mastered'       // 80 - 94: Thành thạo
  | 'exemplary';     // 95 - 100: Xuất sắc

/**
 * Tóm tắt một lượt trả lời câu hỏi của bé
 */
export interface IQuestionAttemptRecord {
  id?: string;
  profileId: string;
  questionId: string;
  topic: MathTopic;
  difficulty: MathDifficulty;
  isCorrect: boolean;
  hintsUsed: number; // 0 = tự làm, 1 = gợi ý 1, 2 = gợi ý 2, 3 = gợi ý 3
  responseTimeMs: number;
  attemptsCount: number;
  timestamp: number;
  gameMode: GameMode;
}

/**
 * Năng lực và tiến trình theo từng chủ đề toán học
 */
export interface ITopicCompetence {
  topic: MathTopic;
  totalQuestions: number;
  correctCount: number;
  accuracy: number; // 0..100 (%)
  consecutiveCorrect: number; // Chuỗi đúng liên tiếp hiện tại
  consecutiveWrong: number;   // Chuỗi sai liên tiếp hiện tại
  consecutiveCorrectWithoutHint: number; // Chuỗi đúng liên tiếp không gợi ý (dùng để thăng hạng)
  totalHintsUsed: number;
  totalAttempts: number;
  averageResponseTimeMs: number;
  masteryScore: number; // 0..100
  masteryLevel: MasteryLevel;
  currentDifficulty: MathDifficulty; // 1..5
  highestPassedDifficulty: MathDifficulty; // Mức khó cao nhất đã vượt qua
  lastUpdated: number;
}

/**
 * Kết quả phân tích và điều chỉnh sau một câu trả lời
 */
export interface IAdaptiveEvaluation {
  topic: MathTopic;
  previousDifficulty: MathDifficulty;
  newDifficulty: MathDifficulty;
  adjustment: 'UP' | 'DOWN' | 'MAINTAIN';
  reason: string;
  needsVisualSupport: boolean;
  masteryScore: number;
  masteryLevel: MasteryLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}

/**
 * Khuyến nghị lựa chọn câu hỏi tiếp theo
 */
export interface IAdaptiveRecommendation {
  recommendedTopic: MathTopic;
  recommendedDifficulty: MathDifficulty;
  gameMode: GameMode;
  needsVisualSupport: boolean;
  reason: string;
  candidateQuestion?: IGrade1Question;
}

/**
 * Toàn bộ trạng thái năng lực học tập của người chơi
 */
export interface IPlayerAdaptiveState {
  profileId: string;
  activeGameMode: GameMode;
  competenceByTopic: Partial<Record<MathTopic, ITopicCompetence>>;
  topicsNeedingImprovement: MathTopic[]; // Danh sách chủ đề cần cải thiện (Mastery < 60)
  strongTopics: MathTopic[]; // Danh sách chủ đề thế mạnh (Mastery >= 80)
  longestStreak: number;
  totalCorrectAllTime: number;
  totalQuestionsAllTime: number;
  recentAttempts: IQuestionAttemptRecord[];
  lastSessionTimestamp: number;
}
