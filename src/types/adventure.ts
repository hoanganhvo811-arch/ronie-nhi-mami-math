// src/types/adventure.ts
// Cấu trúc dữ liệu Hệ thống Thế Giới, 6 Vùng Đất, 6 Chương Cốt Truyện, Sự Kiện Ngẫu Nhiên & Nhiệm Vụ Hàng Ngày (Phase 8)

export type RegionId =
  | 'castle'
  | 'forest'
  | 'valley'
  | 'rainbow'
  | 'cave'
  | 'time_city';

export interface IAdventureMissionSummary {
  id: string;
  title: string;
  subtitle: string;
  mathTopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isBasic: boolean; // Nhiệm vụ cơ bản để mở khóa vùng tiếp theo
  rewardExp: number;
}

export interface IAdventureRegion {
  id: RegionId;
  numericId: number;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  mathTopic: string;
  curriculumCategory: string;
  primaryCharacter: {
    name: string;
    role: string;
    avatarId: string;
    avatarType: 'queen' | 'ronie' | 'npc';
    quote: string;
  };
  shortLore: string; // Cốt truyện ngắn
  uniqueReward: {
    id: string;
    name: string;
    category: 'costume' | 'toy' | 'badge' | 'candy' | 'trophy';
    icon: string;
    description: string;
  };
  requiredStars: number;
  badgeRequired?: string;
  missions: IAdventureMissionSummary[];
}

export interface IChapterStory {
  chapterNumber: number; // 1 - 6
  id: string;
  title: string;
  regionId: RegionId;
  openingDialogue: {
    speaker: string;
    avatarType: 'queen' | 'ronie' | 'npc';
    text: string;
    animation: string;
  };
  missionSequence: {
    missionId: string;
    title: string;
    mathTopic: string;
  }[];
  bossChallenge: {
    title: string;
    bossName: string;
    description: string;
    mathTopic: string;
    targetScore: number;
  };
  rewardItem: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  endingScene: {
    speaker: string;
    avatarType: 'queen' | 'ronie' | 'npc';
    text: string;
    animation: string;
  };
}

export type RandomEventType =
  | 'help_friend'
  | 'secret_item'
  | 'surprise_gift'
  | 'funny_npc'
  | 'quick_challenge';

export interface IRandomWorldEvent {
  id: string;
  type: RandomEventType;
  title: string;
  description: string;
  character: {
    name: string;
    avatarEmoji: string;
    quote: string;
  };
  quickQuestion?: {
    questionText: string;
    options: (string | number)[];
    correctAnswer: string | number;
    hint: string;
  };
  reward: {
    text: string;
    icon: string;
    starsGain?: number;
  };
}

export interface IDailyAdventureTask {
  id: string;
  dateKey: string; // YYYY-MM-DD
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardStars: number;
  isCompleted: boolean;
  encouragingNote: string; // Lời nhắn không tạo áp lực chuỗi streak
}
