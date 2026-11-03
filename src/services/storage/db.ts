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
} from '../../types/database';
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
