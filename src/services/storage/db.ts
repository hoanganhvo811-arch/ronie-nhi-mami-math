// src/services/storage/db.ts
// Cơ sở dữ liệu Dexie.js chuẩn hóa Offline-First cho Vương Quốc Toán Học

import Dexie, { type Table } from 'dexie';
import type {
  IPlayerProfile,
  IProgressRecord,
  IMathSession,
  IInventoryItem,
  IQuestRecord,
  IParentSettings,
  MathTopicKey,
} from '../../types/database';

export class MathKingdomDatabase extends Dexie {
  profiles!: Table<IPlayerProfile, string>;
  progress!: Table<IProgressRecord, string>;
  mathSessions!: Table<IMathSession, string>;
  inventory!: Table<IInventoryItem, string>;
  quests!: Table<IQuestRecord, string>;
  parentSettings!: Table<IParentSettings, string>;

  constructor() {
    super('MathKingdomDB_v1');

    this.version(1).stores({
      profiles: 'id, name, lastPlayedAt',
      progress: 'id, profileId, zoneId, stageId, completed, [profileId+zoneId]',
      mathSessions: 'id, profileId, topicKey, timestamp, [profileId+topicKey]',
      inventory: 'id, profileId, itemType, itemId, isEquipped, [profileId+itemType]',
      quests: 'id, profileId, questId, status',
      parentSettings: 'profileId',
    });
  }
}

export const db = new MathKingdomDatabase();

// ID mặc định của người chơi chính
export const DEFAULT_PROFILE_ID = 'profile_ronie_default';

/**
 * Khởi tạo dữ liệu người chơi mặc định nếu lần đầu truy cập
 */
export async function initializeDefaultProfile(): Promise<IPlayerProfile> {
  const existing = await db.profiles.get(DEFAULT_PROFILE_ID);
  if (existing) {
    return existing;
  }

  const defaultProfile: IPlayerProfile = {
    id: DEFAULT_PROFILE_ID,
    name: 'Bé Ronie',
    avatarId: 'ronie_spider_classic',
    age: 6,
    favoriteColor: '#E11D48',
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };

  await db.transaction('rw', [db.profiles, db.progress, db.inventory, db.parentSettings], async () => {
    await db.profiles.add(defaultProfile);

    // Mở khóa Vùng 1 Màn 1 mặc định
    const initialProgress: IProgressRecord = {
      id: `${DEFAULT_PROFILE_ID}_1_1`,
      profileId: DEFAULT_PROFILE_ID,
      zoneId: 1,
      stageId: 1,
      starsEarned: 0,
      bestScore: 0,
      unlocked: true,
      completed: false,
    };
    await db.progress.add(initialProgress);

    // Trang bị mặc định cho Ronie
    const defaultCostume: IInventoryItem = {
      id: `${DEFAULT_PROFILE_ID}_item_costume_classic`,
      profileId: DEFAULT_PROFILE_ID,
      itemType: 'costume',
      itemId: 'costume_spider_classic',
      name: 'Bộ Giáp Nhện Nhí Khám Phá',
      description: 'Bộ trang phục tơ sao đỏ thắm dũng cảm của bé Ronie.',
      icon: '🕷️',
      isEquipped: true,
      unlockedAt: Date.now(),
    };
    await db.inventory.add(defaultCostume);

    // Huy hiệu khởi đầu
    const welcomeBadge: IInventoryItem = {
      id: `${DEFAULT_PROFILE_ID}_badge_welcome`,
      profileId: DEFAULT_PROFILE_ID,
      itemType: 'badge',
      itemId: 'badge_star_initiate',
      name: 'Hiệp Sĩ Tập Sự',
      description: 'Nữ hoàng Nhi Mami trao tặng khi bước chân vào Vương Quốc.',
      icon: '⭐',
      isEquipped: false,
      unlockedAt: Date.now(),
    };
    await db.inventory.add(welcomeBadge);

    // Cài đặt phụ huynh mặc định
    const defaultParentSettings: IParentSettings = {
      profileId: DEFAULT_PROFILE_ID,
      pinCode: '2018',
      dailyLimitMinutes: 20,
      soundEffects: true,
      musicEnabled: true,
      difficultyBias: 'auto',
    };
    await db.parentSettings.add(defaultParentSettings);
  });

  return defaultProfile;
}

/**
 * Lưu tiến trình sau khi hoàn thành màn chơi
 */
export async function saveStageProgress(
  profileId: string,
  zoneId: number,
  stageId: number,
  starsEarned: number,
  score: number
): Promise<void> {
  const recordId = `${profileId}_${zoneId}_${stageId}`;
  const existing = await db.progress.get(recordId);

  const bestStars = existing ? Math.max(existing.starsEarned, starsEarned) : starsEarned;
  const bestScore = existing ? Math.max(existing.bestScore, score) : score;

  await db.progress.put({
    id: recordId,
    profileId,
    zoneId,
    stageId,
    starsEarned: bestStars,
    bestScore,
    unlocked: true,
    completed: true,
    completedAt: Date.now(),
  });

  // Tự động mở khóa màn tiếp theo
  const nextStageId = stageId + 1;
  const nextRecordId = `${profileId}_${zoneId}_${nextStageId}`;
  const nextExisting = await db.progress.get(nextRecordId);
  if (!nextExisting) {
    await db.progress.put({
      id: nextRecordId,
      profileId,
      zoneId,
      stageId: nextStageId,
      starsEarned: 0,
      bestScore: 0,
      unlocked: true,
      completed: false,
    });
  }

  // Cập nhật thời gian chơi gần nhất
  await db.profiles.update(profileId, { lastPlayedAt: Date.now() });
}

/**
 * Ghi nhận phiên học toán để phân tích năng lực phụ huynh
 */
export async function recordMathSession(
  profileId: string,
  topicKey: MathTopicKey,
  totalQuestions: number,
  correctQuestions: number,
  hintUsedCount: number,
  durationSeconds: number
): Promise<void> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  await db.mathSessions.add({
    id: sessionId,
    profileId,
    topicKey,
    totalQuestions,
    correctQuestions,
    hintUsedCount,
    durationSeconds,
    timestamp: Date.now(),
  });
}
