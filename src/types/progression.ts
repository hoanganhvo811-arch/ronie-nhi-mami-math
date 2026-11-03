// src/types/progression.ts
// Định nghĩa cấu trúc chuẩn cho Hệ Thống Tiến Trình Nhân Vật (Phase 5)

export interface ICharacterLevelInfo {
  level: number;
  title: string;
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
  category: 'missions' | 'math' | 'collection' | 'room';
  xpReward: number;
}

export interface IPlayerProgression {
  profileId: string;
  xp: number;
  level: number;
  title: string;
  totalMissionsCompleted: number;
  totalCorrectAnswers: number;
  totalStars: number;
  unlockedAchievements: string[];
  lastLevelUpAt?: number;
  updatedAt: number;
}
