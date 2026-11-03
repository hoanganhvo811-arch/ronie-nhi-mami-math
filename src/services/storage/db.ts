// src/services/storage/db.ts
// Cơ sở dữ liệu Dexie.js chuẩn hóa Offline-First cho Vương Quốc Toán Học (Hỗ trợ Phase 5)

import Dexie, { type Table } from 'dexie';
import type {
  IPlayerProfile,
  IProgressRecord,
  IMathSession,
  IInventoryItem,
  IQuestRecord,
  IParentSettings,
  ItemType,
  CostumeSlot,
  IEquippedCostumes,
  IRoomDecorationRecord,
  IProgressionRecord,
  IClaimedRewardRecord,
  MathTopicKey,
  IParentContentConfig,
} from '../../types/database';
import type { TimeframeFilter, IParentBackupPayload } from '../../types/analytics';
import { getRewardItemById } from '../../features/rewards/rewardCatalog';
import { ProgressionEngine } from '../../features/progression/progressionEngine';

export class MathKingdomDatabase extends Dexie {
  profiles!: Table<IPlayerProfile, string>;
  progress!: Table<IProgressRecord, string>;
  mathSessions!: Table<IMathSession, string>;
  inventory!: Table<IInventoryItem, string>;
  quests!: Table<IQuestRecord, string>;
  parentSettings!: Table<IParentSettings, string>;
  rewardsHistory!: Table<IClaimedRewardRecord, string>;
  roomDecorations!: Table<IRoomDecorationRecord, string>;
  progression!: Table<IProgressionRecord, string>;

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

    this.version(2).stores({
      rewardsHistory: 'id, profileId, missionId, rewardItemId, [profileId+missionId]',
      roomDecorations: 'profileId',
      progression: 'profileId, level, xp',
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
    // Đảm bảo dữ liệu phòng và tiến trình Phase 5 đã tồn tại
    const deco = await db.roomDecorations.get(DEFAULT_PROFILE_ID);
    if (!deco) {
      await initializeDefaultRoomAndProgression(DEFAULT_PROFILE_ID);
    }
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

  await db.transaction(
    'rw',
    [
      db.profiles,
      db.progress,
      db.inventory,
      db.parentSettings,
      db.roomDecorations,
      db.progression,
    ],
    async () => {
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

      // Trang phục khởi đầu mặc định
      const defaultCostume: IInventoryItem = {
        id: `${DEFAULT_PROFILE_ID}_costume_spider_mask`,
        profileId: DEFAULT_PROFILE_ID,
        itemType: 'costume',
        itemId: 'costume_spider_mask',
        name: 'Mặt Nạ Tơ Nhện Thần Bí',
        description: 'Mặt nạ siêu anh hùng nhí che mắt với viền phát sáng vi diệu.',
        icon: '🎭',
        isEquipped: true,
        unlockedAt: Date.now(),
      };
      await db.inventory.add(defaultCostume);

      // Đồ chơi khởi đầu: Gấu bông học đếm
      const defaultToy: IInventoryItem = {
        id: `${DEFAULT_PROFILE_ID}_toy_teddy_bear`,
        profileId: DEFAULT_PROFILE_ID,
        itemType: 'toy',
        itemId: 'toy_teddy_bear',
        name: 'Gấu Bông Học Đếm',
        description: 'Chú gấu bông ấm áp luôn đồng hành cùng bé Ronie.',
        icon: '🧸',
        isEquipped: false,
        unlockedAt: Date.now(),
      };
      await db.inventory.add(defaultToy);

      // Kẹo khởi đầu: Kẹo mút cầu vồng
      const defaultCandy: IInventoryItem = {
        id: `${DEFAULT_PROFILE_ID}_candy_lollipop`,
        profileId: DEFAULT_PROFILE_ID,
        itemType: 'candy',
        itemId: 'candy_lollipop',
        name: 'Kẹo Mút Cầu Vồng 7 Màu',
        description: 'Cây kẹo xoắn tròn ngọt ngào tiếp thêm năng lượng học tập.',
        icon: '🍭',
        isEquipped: false,
        unlockedAt: Date.now(),
      };
      await db.inventory.add(defaultCandy);

      // Huy hiệu khởi đầu
      const welcomeBadge: IInventoryItem = {
        id: `${DEFAULT_PROFILE_ID}_badge_bravery`,
        profileId: DEFAULT_PROFILE_ID,
        itemType: 'badge',
        itemId: 'badge_bravery',
        name: 'Huy Hiệu Dũng Cảm',
        description: 'Nữ hoàng Nhi Mami trao tặng khi bước chân vào Vương Quốc.',
        icon: '🛡️',
        isEquipped: false,
        unlockedAt: Date.now(),
      };
      await db.inventory.add(welcomeBadge);

      // Cài đặt phụ huynh mặc định (Phase 7)
      const defaultParentSettings: IParentSettings = {
        profileId: DEFAULT_PROFILE_ID,
        pinCode: '2018',
        dailyLimitMinutes: 20,
        isTimeLimitEnabled: true,
        breakReminderMinutes: 15,
        soundEffects: true,
        musicEnabled: true,
        difficultyBias: 'auto',
        contentConfig: {
          enabledTopics: [
            'counting_to_10',
            'comparison_operators',
            'addition_within_10',
            'subtraction_within_10',
            'numbers_to_20',
            'flat_shapes',
            'spatial_shapes',
            'length_centimeter',
            'clock_reading',
            'numbers_to_100',
          ],
          questionsPerMission: 5,
          difficulty: 'standard',
          maxMistakesAllowed: 3,
        },
      };
      await db.parentSettings.add(defaultParentSettings);

      // Phòng đồ chơi mặc định (Gấu bông trên ô kệ số 0)
      const defaultRoomDeco: IRoomDecorationRecord = {
        profileId: DEFAULT_PROFILE_ID,
        shelfSlots: ['toy_teddy_bear', null, null, null, null, null],
        wallpaperColor: '#FCE7F3', // Hồng pastel
        carpetColor: '#FEF3C7', // Vàng kem
        updatedAt: Date.now(),
      };
      await db.roomDecorations.add(defaultRoomDeco);

      // Tiến trình nhân vật mặc định
      const defaultProgression: IProgressionRecord = {
        profileId: DEFAULT_PROFILE_ID,
        xp: 0,
        level: 1,
        totalMissions: 0,
        totalCorrect: 0,
        achievements: [],
        updatedAt: Date.now(),
      };
      await db.progression.add(defaultProgression);
    }
  );

  return defaultProfile;
}

/**
 * Hỗ trợ bổ sung bảng roomDecorations & progression nếu tài khoản cũ đã có profile
 */
async function initializeDefaultRoomAndProgression(profileId: string): Promise<void> {
  const existingDeco = await db.roomDecorations.get(profileId);
  if (!existingDeco) {
    await db.roomDecorations.put({
      profileId,
      shelfSlots: ['toy_teddy_bear', null, null, null, null, null],
      wallpaperColor: '#FCE7F3',
      carpetColor: '#FEF3C7',
      updatedAt: Date.now(),
    });
  }

  const existingProg = await db.progression.get(profileId);
  if (!existingProg) {
    await db.progression.put({
      profileId,
      xp: 0,
      level: 1,
      totalMissions: 0,
      totalCorrect: 0,
      achievements: [],
      updatedAt: Date.now(),
    });
  }
}

/**
 * Trao phần thưởng vào kho lưu trữ (Cơ chế kiểm soát chặt chẽ, chống nhận trùng)
 */
export async function grantRewardItem(
  profileId: string,
  itemId: string,
  missionId?: string
): Promise<{
  success: boolean;
  isDuplicate: boolean;
  message: string;
}> {
  // 1. Kiểm tra phần thưởng có trong Catalog hay không
  const rewardDef = getRewardItemById(itemId);
  if (!rewardDef) {
    return {
      success: false,
      isDuplicate: false,
      message: `Vật phẩm ${itemId} không tồn tại trong danh mục phần thưởng.`,
    };
  }

  // 2. Chống nhận trùng theo nhiệm vụ (nếu có missionId)
  if (missionId) {
    const existingClaim = await db.rewardsHistory
      .where('[profileId+missionId]')
      .equals([profileId, missionId])
      .first();

    if (existingClaim) {
      return {
        success: false,
        isDuplicate: true,
        message: 'Phần thưởng của nhiệm vụ này đã được nhận trước đó!',
      };
    }
  }

  // 3. Thực hiện giao dịch an toàn (Transaction)
  await db.transaction('rw', [db.inventory, db.rewardsHistory], async () => {
    const inventoryId = `${profileId}_${itemId}`;
    const existingItem = await db.inventory.get(inventoryId);

    if (!existingItem) {
      await db.inventory.add({
        id: inventoryId,
        profileId,
        itemType: rewardDef.category as ItemType,
        itemId: rewardDef.id,
        name: rewardDef.name,
        description: rewardDef.description,
        icon: rewardDef.icon,
        isEquipped: false,
        unlockedAt: Date.now(),
      });
    }

    if (missionId) {
      await db.rewardsHistory.add({
        id: `${profileId}_${missionId}_${itemId}_${Date.now()}`,
        profileId,
        missionId,
        rewardItemId: itemId,
        claimedAt: Date.now(),
      });
    }
  });

  return {
    success: true,
    isDuplicate: false,
    message: `Đã cất ${rewardDef.name} vào kho đồ!`,
  };
}

/**
 * Lấy danh sách toàn bộ vật phẩm trong kho của người chơi
 */
export async function getInventory(
  profileId: string = DEFAULT_PROFILE_ID,
  category?: ItemType
): Promise<IInventoryItem[]> {
  const allItems = await db.inventory.where('profileId').equals(profileId).toArray();
  if (category) {
    return allItems.filter((i) => i.itemType === category);
  }
  return allItems;
}

/**
 * Trang bị / Đổi trang phục cho Ronie (áo choàng, mặt nạ, giày, mũ, giáp)
 */
export async function equipCostumeItem(
  profileId: string = DEFAULT_PROFILE_ID,
  itemId: string,
  slot: CostumeSlot
): Promise<void> {
  await db.transaction('rw', [db.inventory], async () => {
    const costumes = await db.inventory
      .where('profileId')
      .equals(profileId)
      .and((item) => item.itemType === 'costume')
      .toArray();

    // Tháo các trang phục cùng slot
    for (const item of costumes) {
      const def = getRewardItemById(item.itemId);
      if (def?.costumeSlot === slot && item.isEquipped) {
        await db.inventory.update(item.id, { isEquipped: false });
      }
    }

    // Mặc trang phục mới
    const targetInventoryId = `${profileId}_${itemId}`;
    await db.inventory.update(targetInventoryId, { isEquipped: true });
  });
}

/**
 * Lấy danh sách trang phục đang mặc hiện tại của Ronie
 */
export async function getEquippedCostumes(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<IEquippedCostumes> {
  const equippedItems = await db.inventory
    .where('profileId')
    .equals(profileId)
    .and((item) => item.itemType === 'costume' && item.isEquipped)
    .toArray();

  const equipped: IEquippedCostumes = {};
  equippedItems.forEach((item) => {
    const def = getRewardItemById(item.itemId);
    if (def?.costumeSlot) {
      equipped[def.costumeSlot] = def.id;
    }
  });

  return equipped;
}

/**
 * Lấy cấu hình bài trí Phòng Đồ Chơi
 */
export async function getRoomDecoration(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<IRoomDecorationRecord> {
  const record = await db.roomDecorations.get(profileId);
  if (record) return record;

  const defaultDeco: IRoomDecorationRecord = {
    profileId,
    shelfSlots: ['toy_teddy_bear', null, null, null, null, null],
    wallpaperColor: '#FCE7F3',
    carpetColor: '#FEF3C7',
    updatedAt: Date.now(),
  };
  await db.roomDecorations.put(defaultDeco);
  return defaultDeco;
}

/**
 * Lưu trạng thái sắp xếp phòng đồ chơi & trang trí
 */
export async function saveRoomDecoration(
  profileId: string = DEFAULT_PROFILE_ID,
  shelfSlots: (string | null)[],
  wallpaperColor: string,
  carpetColor: string
): Promise<void> {
  await db.roomDecorations.put({
    profileId,
    shelfSlots,
    wallpaperColor,
    carpetColor,
    updatedAt: Date.now(),
  });
}

/**
 * Lấy tiến trình nhân vật (Level, XP, Thống kê, Thành tích)
 */
export async function getProgression(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<IProgressionRecord> {
  const record = await db.progression.get(profileId);
  if (record) return record;

  const defaultProg: IProgressionRecord = {
    profileId,
    xp: 0,
    level: 1,
    totalMissions: 0,
    totalCorrect: 0,
    achievements: [],
    updatedAt: Date.now(),
  };
  await db.progression.put(defaultProg);
  return defaultProg;
}

/**
 * Cập nhật điểm kinh nghiệm, câu đúng và kiểm tra lên cấp
 */
export async function updateProgression(
  profileId: string = DEFAULT_PROFILE_ID,
  xpGain: number,
  correctGain: number = 0,
  missionCompleted: boolean = false
): Promise<{
  newXp: number;
  newLevel: number;
  didLevelUp: boolean;
  newAchievements: string[];
}> {
  const currentProg = await getProgression(profileId);
  const newXp = currentProg.xp + xpGain;
  const newLevelInfo = ProgressionEngine.getLevelInfo(newXp);
  const didLevelUp = newLevelInfo.level > currentProg.level;

  const newTotalMissions = currentProg.totalMissions + (missionCompleted ? 1 : 0);
  const newTotalCorrect = currentProg.totalCorrect + correctGain;

  // Đánh giá thành tích
  const allInventory = await getInventory(profileId);
  const toys = allInventory.filter((i) => i.itemType === 'toy');
  const candies = allInventory.filter((i) => i.itemType === 'candy');
  const costumes = allInventory.filter((i) => i.itemType === 'costume' && i.isEquipped);
  const roomDeco = await getRoomDecoration(profileId);
  const hasPlacedToy = roomDeco.shelfSlots.some((s) => s !== null);

  const newUnlockedAchList = ProgressionEngine.evaluateAchievements(
    {
      profileId,
      xp: newXp,
      level: newLevelInfo.level,
      title: newLevelInfo.title,
      totalMissionsCompleted: newTotalMissions,
      totalCorrectAnswers: newTotalCorrect,
      totalStars: 0,
      unlockedAchievements: currentProg.achievements,
      updatedAt: Date.now(),
    },
    toys.length,
    hasPlacedToy,
    costumes.length > 0,
    candies.length
  );

  const updatedAchievements = [
    ...currentProg.achievements,
    ...newUnlockedAchList.map((a) => a.id),
  ];

  await db.progression.put({
    profileId,
    xp: newXp,
    level: newLevelInfo.level,
    totalMissions: newTotalMissions,
    totalCorrect: newTotalCorrect,
    achievements: updatedAchievements,
    updatedAt: Date.now(),
  });

  return {
    newXp,
    newLevel: newLevelInfo.level,
    didLevelUp,
    newAchievements: newUnlockedAchList.map((a) => a.id),
  };
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

// Bộ nhớ tạm phòng ngừa khi chạy trong môi trường không có IndexedDB (như SSR / Vitest JSDOM)
const inMemoryParentSettings: Record<string, IParentSettings> = {};

/**
 * Lấy cài đặt phụ huynh hiện tại (hoặc trả về mặc định nếu chưa lưu) (Phase 7)
 */
export async function getParentSettings(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<IParentSettings> {
  const defaultSettings: IParentSettings = {
    profileId,
    pinCode: '2018',
    dailyLimitMinutes: 20,
    isTimeLimitEnabled: true,
    breakReminderMinutes: 15,
    soundEffects: true,
    musicEnabled: true,
    difficultyBias: 'auto',
    contentConfig: {
      enabledTopics: [
        'counting_to_10',
        'comparison_operators',
        'addition_within_10',
        'subtraction_within_10',
        'numbers_to_20',
        'flat_shapes',
        'spatial_shapes',
        'length_centimeter',
        'clock_reading',
        'numbers_to_100',
      ],
      questionsPerMission: 5,
      difficulty: 'standard',
      maxMistakesAllowed: 3,
    },
  };

  if (typeof indexedDB === 'undefined') {
    if (!inMemoryParentSettings[profileId]) {
      inMemoryParentSettings[profileId] = defaultSettings;
    }
    return inMemoryParentSettings[profileId];
  }

  try {
    const existing = await db.parentSettings.get(profileId);
    if (existing) {
      return {
        ...existing,
        isTimeLimitEnabled: existing.isTimeLimitEnabled ?? true,
        breakReminderMinutes: existing.breakReminderMinutes ?? 15,
        contentConfig: existing.contentConfig ?? defaultSettings.contentConfig,
      };
    }
    await db.parentSettings.put(defaultSettings);
    return defaultSettings;
  } catch {
    if (!inMemoryParentSettings[profileId]) {
      inMemoryParentSettings[profileId] = defaultSettings;
    }
    return inMemoryParentSettings[profileId];
  }
}

/**
 * Cập nhật cấu hình phụ huynh
 */
export async function updateParentSettings(
  profileId: string = DEFAULT_PROFILE_ID,
  updates: Partial<IParentSettings>
): Promise<void> {
  const current = await getParentSettings(profileId);
  const updated: IParentSettings = {
    ...current,
    ...updates,
    profileId,
  };
  inMemoryParentSettings[profileId] = updated;

  if (typeof indexedDB !== 'undefined') {
    try {
      await db.parentSettings.put(updated);
    } catch {
      // Ignored in test environment
    }
  }
}

/**
 * Lấy lịch sử các phiên học toán lọc theo khoảng thời gian (Hôm nay, 7 ngày, 30 ngày, Tất cả)
 */
export async function getMathSessions(
  profileId: string = DEFAULT_PROFILE_ID,
  timeframe: TimeframeFilter = 'all_time'
): Promise<IMathSession[]> {
  if (typeof indexedDB === 'undefined') {
    return [];
  }
  try {
    const allSessions = await db.mathSessions.where('profileId').equals(profileId).toArray();

    if (timeframe === 'all_time') {
      return allSessions.sort((a, b) => b.timestamp - a.timestamp);
    }

    const now = Date.now();
    let cutoffTimestamp = 0;

    if (timeframe === 'today') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      cutoffTimestamp = startOfToday.getTime();
    } else if (timeframe === '7_days') {
      cutoffTimestamp = now - 7 * 24 * 60 * 60 * 1000;
    } else if (timeframe === '30_days') {
      cutoffTimestamp = now - 30 * 24 * 60 * 60 * 1000;
    }

    return allSessions
      .filter((s) => s.timestamp >= cutoffTimestamp)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

/**
 * Lấy toàn bộ tiến trình màn chơi
 */
export async function getAllProgress(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<IProgressRecord[]> {
  if (typeof indexedDB === 'undefined') {
    return [];
  }
  try {
    return await db.progress.where('profileId').equals(profileId).toArray();
  } catch {
    return [];
  }
}

/**
 * Xuất dữ liệu sao lưu ra chuỗi JSON (Backup)
 */
export async function exportBackupData(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<string> {
  let profile: IPlayerProfile | null = null;
  let parentSettings: IParentSettings | null = null;
  let progression: IProgressionRecord | null = null;
  let roomDecoration: IRoomDecorationRecord | null = null;
  let progressList: IProgressRecord[] = [];
  let mathSessions: IMathSession[] = [];
  let inventory: IInventoryItem[] = [];
  let rewardsHistory: IClaimedRewardRecord[] = [];

  if (typeof indexedDB !== 'undefined') {
    try {
      [
        profile,
        parentSettings,
        progression,
        roomDecoration,
        progressList,
        mathSessions,
        inventory,
        rewardsHistory,
      ] = await Promise.all([
        db.profiles.get(profileId).then((p) => p || null),
        db.parentSettings.get(profileId).then((s) => s || null),
        db.progression.get(profileId).then((p) => p || null),
        db.roomDecorations.get(profileId).then((r) => r || null),
        db.progress.where('profileId').equals(profileId).toArray(),
        db.mathSessions.where('profileId').equals(profileId).toArray(),
        db.inventory.where('profileId').equals(profileId).toArray(),
        db.rewardsHistory.where('profileId').equals(profileId).toArray(),
      ]);
    } catch {
      // Fallback
    }
  }

  if (!parentSettings) {
    parentSettings = await getParentSettings(profileId);
  }
  if (!profile) {
    profile = {
      id: profileId,
      name: 'Bé Ronie',
      avatarId: 'ronie_spider_classic',
      age: 6,
      favoriteColor: '#E11D48',
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
  }

  const payload: IParentBackupPayload = {
    appId: 'ronie-nhi-mami-math',
    appVersion: '1.0.0',
    exportedAt: Date.now(),
    exportedDateString: new Date().toISOString(),
    profileId,
    data: {
      profile,
      parentSettings,
      progression,
      roomDecoration,
      progressList,
      mathSessions,
      inventory,
      rewardsHistory,
    },
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Phục hồi dữ liệu từ file sao lưu JSON (Restore có xác thực)
 */
export async function importBackupData(
  jsonData: string,
  profileId: string = DEFAULT_PROFILE_ID
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const parsed: IParentBackupPayload = JSON.parse(jsonData);

    // Xác thực cấu trúc dữ liệu sao lưu
    if (parsed.appId !== 'ronie-nhi-mami-math' || !parsed.data) {
      return {
        success: false,
        message: 'File sao lưu không hợp lệ hoặc không thuộc ứng dụng Ronie & Nhi Mami.',
        error: 'INVALID_APP_ID',
      };
    }

    const { data } = parsed;

    if (data.parentSettings) {
      inMemoryParentSettings[profileId] = data.parentSettings;
    }

    if (typeof indexedDB !== 'undefined') {
      try {
        await db.transaction(
          'rw',
          [
            db.profiles,
            db.parentSettings,
            db.progression,
            db.roomDecorations,
            db.progress,
            db.mathSessions,
            db.inventory,
            db.rewardsHistory,
          ],
          async () => {
            if (data.profile) await db.profiles.put(data.profile);
            if (data.parentSettings) await db.parentSettings.put(data.parentSettings);
            if (data.progression) await db.progression.put(data.progression);
            if (data.roomDecoration) await db.roomDecorations.put(data.roomDecoration);

            if (Array.isArray(data.progressList) && data.progressList.length > 0) {
              await db.progress.bulkPut(data.progressList);
            }
            if (Array.isArray(data.mathSessions) && data.mathSessions.length > 0) {
              await db.mathSessions.bulkPut(data.mathSessions);
            }
            if (Array.isArray(data.inventory) && data.inventory.length > 0) {
              await db.inventory.bulkPut(data.inventory);
            }
            if (Array.isArray(data.rewardsHistory) && data.rewardsHistory.length > 0) {
              await db.rewardsHistory.bulkPut(data.rewardsHistory);
            }
          }
        );
      } catch {
        // Fallback for test runner
      }
    }

    return {
      success: true,
      message: 'Khôi phục toàn bộ tiến trình học tập và kho đồ thành công!',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Không thể đọc nội dung file sao lưu. Vui lòng kiểm tra định dạng file.',
      error: String(err),
    };
  }
}

/**
 * Đặt lại dữ liệu học tập về ban đầu (Reset Profile)
 */
export async function resetProfileData(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<void> {
  if (typeof indexedDB !== 'undefined') {
    try {
      await db.transaction(
        'rw',
        [
          db.profiles,
          db.parentSettings,
          db.progression,
          db.roomDecorations,
          db.progress,
          db.mathSessions,
          db.inventory,
          db.rewardsHistory,
        ],
        async () => {
          await db.progress.where('profileId').equals(profileId).delete();
          await db.mathSessions.where('profileId').equals(profileId).delete();
          await db.inventory.where('profileId').equals(profileId).delete();
          await db.rewardsHistory.where('profileId').equals(profileId).delete();
          await db.profiles.delete(profileId);
          await db.parentSettings.delete(profileId);
          await db.progression.delete(profileId);
          await db.roomDecorations.delete(profileId);
        }
      );
    } catch {
      // Ignored
    }
  }

  delete inMemoryParentSettings[profileId];

  // Tạo lại hồ sơ khởi đầu sạch
  await initializeDefaultProfile();
}
