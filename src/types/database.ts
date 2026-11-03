// src/types/database.ts
// Các cấu trúc dữ liệu lưu trữ IndexedDB qua Dexie.js

export type MathTopicKey =
  | 'counting_to_10'        // Số và đếm trong phạm vi 10
  | 'comparison_operators'  // So sánh lớn hơn (>), bé hơn (<), bằng nhau (=)
  | 'addition_within_10'    // Phép cộng trong phạm vi 10
  | 'subtraction_within_10' // Phép trừ trong phạm vi 10
  | 'numbers_to_20'         // Số và phép tính phạm vi 20
  | 'flat_shapes'           // Hình vuông, tròn, tam giác, chữ nhật
  | 'spatial_shapes'        // Khối lập phương, khối hộp chữ nhật
  | 'length_centimeter'     // Đo độ dài bằng thước xăng-ti-mét
  | 'clock_reading'         // Xem đồng hồ kim đúng giờ
  | 'numbers_to_100';       // Số tròn chục và phép tính tới 100 không nhớ

export type ItemType = 'toy' | 'candy' | 'badge' | 'costume' | 'trophy';
export type QuestStatus = 'active' | 'completed' | 'claimed';
export type CostumeSlot = 'cloak' | 'mask' | 'boots' | 'hat' | 'suit';

export interface IEquippedCostumes {
  cloak?: string;
  mask?: string;
  boots?: string;
  hat?: string;
  suit?: string;
}

export interface IClaimedRewardRecord {
  id: string; // `${profileId}_${missionId}_${rewardItemId}`
  profileId: string;
  missionId: string;
  rewardItemId: string;
  claimedAt: number;
}

export interface IRoomDecorationRecord {
  profileId: string;
  shelfSlots: (string | null)[];
  wallpaperColor: string;
  carpetColor: string;
  updatedAt: number;
}

export interface IProgressionRecord {
  profileId: string;
  xp: number;
  level: number;
  totalMissions: number;
  totalCorrect: number;
  achievements: string[];
  updatedAt: number;
}

export interface IPlayerProfile {
  id: string;
  name: string;
  avatarId: string;
  age: number;
  favoriteColor: string;
  createdAt: number;
  lastPlayedAt: number;
}

export interface IProgressRecord {
  id: string; // `${profileId}_${zoneId}_${stageId}`
  profileId: string;
  zoneId: number;
  stageId: number;
  starsEarned: number; // 0..3
  bestScore: number;
  unlocked: boolean;
  completed: boolean;
  completedAt?: number;
}

export interface IMathSession {
  id: string;
  profileId: string;
  topicKey: MathTopicKey;
  totalQuestions: number;
  correctQuestions: number;
  hintUsedCount: number;
  durationSeconds: number;
  timestamp: number;
}

export interface IInventoryItem {
  id: string;
  profileId: string;
  itemType: ItemType;
  itemId: string;
  name: string;
  description: string;
  icon: string;
  isEquipped: boolean;
  unlockedAt: number;
}

export interface IQuestRecord {
  id: string;
  profileId: string;
  questId: string;
  title: string;
  description: string;
  zoneId: number;
  targetCount: number;
  currentCount: number;
  rewardStars: number;
  status: QuestStatus;
  updatedAt: number;
}

export type ParentDifficulty = 'easy' | 'standard' | 'challenge';

export interface IParentContentConfig {
  enabledTopics: MathTopicKey[];
  questionsPerMission: number;
  difficulty: ParentDifficulty;
  maxMistakesAllowed: number;
}

export interface IParentSettings {
  profileId: string;
  pinCode: string;
  dailyLimitMinutes: number;
  soundEffects: boolean;
  musicEnabled: boolean;
  difficultyBias: 'auto' | 'gentle' | 'challenge';
  // Bổ sung Phase 7:
  isTimeLimitEnabled?: boolean;
  breakReminderMinutes?: number;
  contentConfig?: IParentContentConfig;
}
