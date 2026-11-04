// src/types/progression.ts
// Định nghĩa cấu trúc chuẩn cho Hệ Thống Tiến Trình Nhân Vật, Cấp Bậc, Sao & Daily Adventure - Phase 4

export type PlayerRankTitle =
  | 'Bé tập sự'
  | 'Hiệp sĩ toán học'
  | 'Chiến binh số học'
  | 'Siêu nhân toán học'
  | 'Huyền thoại vương quốc';

export interface IPlayerRankInfo {
  rank: PlayerRankTitle;
  tier: number; // 1 to 5
  minXp: number;
  maxXp: number;
  icon: string;
  badgeName: string;
  perkDescription: string;
}

export interface ICharacterLevelInfo {
  level: number;
  title: string;
  rankTitle?: PlayerRankTitle;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  unlockedFeature?: string;
}

export interface IAchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'missions' | 'math' | 'collection' | 'room' | 'daily';
  xpReward: number;
  targetCount?: number;
}

export interface IStarCriteriaConfig {
  minAccuracyFor2Stars: number; // Ví dụ: 70%
  maxMistakesFor2Stars: number; // Tối đa 2 lỗi
  minAccuracyFor3Stars: number; // Ví dụ: 90%
  maxMistakesFor3Stars: number; // Tối đa 1 lỗi
  maxHintsFor3Stars?: number;
}

export interface IStarEvaluationResult {
  stars: 1 | 2 | 3;
  details: {
    star1: { achieved: boolean; label: string; desc: string };
    star2: { achieved: boolean; label: string; desc: string };
    star3: { achieved: boolean; label: string; desc: string };
  };
  feedback: string;
}

export interface IExpCalculationBreakdown {
  baseCompletionXp: number;
  accuracyBonus: number;
  streakBonus: number;
  starBonus: number;
  effortBonus: number;
  totalExpGained: number;
}

export interface IDailyAdventureQuest {
  id: string; // VD: 'daily_2026-11-04'
  dateStr: string; // '2026-11-04'
  title: string;
  description: string;
  queenEncouragement: string;
  mathTopic: string;
  targetCount: number; // Ví dụ: 3 câu toán nhỏ
  reward: {
    exp: number;
    stars: number;
    rewardItemId?: string;
    candyReward?: string;
  };
}

export interface IPlayerProgression {
  profileId: string;
  xp: number;
  level: number;
  title: string;
  rankTitle?: PlayerRankTitle;
  totalMissionsCompleted: number;
  totalCorrectAnswers: number;
  totalStars: number;
  unlockedAchievements: string[];
  lastLevelUpAt?: number;
  updatedAt: number;
}
