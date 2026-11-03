// src/test/rewardEngine.test.ts
// Bộ kiểm thử tự động toàn diện cho Hệ Thống Phần Thưởng, Kho Đồ & Tiến Trình (Phase 5)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  REWARD_ITEMS_CATALOG,
  ALL_REWARDS_LIST,
  getRewardsByCategory,
  getRewardItemById,
  MISSION_REWARD_MAP,
} from '../features/rewards/rewardCatalog';
import { RewardEngine } from '../features/rewards/RewardEngine';
import { ProgressionEngine, LEVEL_TABLE, ACHIEVEMENTS_LIST } from '../features/progression/progressionEngine';
import {
  db,
  grantRewardItem,
  getInventory,
  equipCostumeItem,
  getEquippedCostumes,
  getRoomDecoration,
  saveRoomDecoration,
  getProgression,
  updateProgression,
  DEFAULT_PROFILE_ID,
} from '../services/storage/db';

// Mock audio manager
vi.mock('../services/audio/AudioManager', () => ({
  soundManager: {
    playTap: vi.fn(),
    playCorrect: vi.fn(),
    playCelebration: vi.fn(),
    speakVietnamese: vi.fn(),
    speakDialogue: vi.fn(),
  },
}));

describe('1. Danh Mục Phần Thưởng Đầy Đủ Theo Đặc Tả Phase 5', () => {
  it('danh mục có tối thiểu 20 vật phẩm phần thưởng', () => {
    expect(ALL_REWARDS_LIST.length).toBeGreaterThanOrEqual(20);
  });

  it('nhóm A: có đầy đủ 6 món đồ chơi (gấu bông, robot, ô tô, búp bê, khủng long, nhện)', () => {
    const toys = getRewardsByCategory('toy');
    expect(toys.length).toBe(6);

    const ids = toys.map((t) => t.id);
    expect(ids).toContain('toy_teddy_bear'); // Gấu bông
    expect(ids).toContain('toy_mini_robot'); // Robot
    expect(ids).toContain('toy_race_car'); // Ô tô
    expect(ids).toContain('toy_princess_doll'); // Búp bê
    expect(ids).toContain('toy_dino'); // Khủng long
    expect(ids).toContain('toy_spider'); // Đồ chơi nhện
  });

  it('nhóm B: có đầy đủ 4 loại kẹo (kẹo mút, kẹo dẻo, socola, bánh quy)', () => {
    const candies = getRewardsByCategory('candy');
    expect(candies.length).toBe(4);

    const ids = candies.map((c) => c.id);
    expect(ids).toContain('candy_lollipop'); // Kẹo mút
    expect(ids).toContain('candy_gummy'); // Kẹo dẻo
    expect(ids).toContain('candy_chocolate'); // Socola
    expect(ids).toContain('candy_cookie'); // Bánh quy
  });

  it('nhóm C: có đầy đủ 5 huy hiệu (dũng cảm, siêu trí tuệ, nhà toán học nhí, người cứu hộ, chiến binh toán học)', () => {
    const badges = getRewardsByCategory('badge');
    expect(badges.length).toBe(5);

    const ids = badges.map((b) => b.id);
    expect(ids).toContain('badge_bravery'); // Dũng cảm
    expect(ids).toContain('badge_super_intellect'); // Siêu trí tuệ
    expect(ids).toContain('badge_junior_mathematician'); // Nhà toán học nhí
    expect(ids).toContain('badge_rescuer'); // Người cứu hộ
    expect(ids).toContain('badge_math_warrior'); // Chiến binh toán học
  });

  it('nhóm D: có đầy đủ 5 trang phục (áo choàng, mặt nạ, giày, mũ, bộ trang phục đặc biệt)', () => {
    const costumes = getRewardsByCategory('costume');
    expect(costumes.length).toBe(5);

    const ids = costumes.map((c) => c.id);
    expect(ids).toContain('costume_star_cloak'); // Áo choàng
    expect(ids).toContain('costume_spider_mask'); // Mặt nạ
    expect(ids).toContain('costume_speed_boots'); // Giày
    expect(ids).toContain('costume_crown_hat'); // Mũ / Vương miện
    expect(ids).toContain('costume_super_spider'); // Bộ giáp đặc biệt
  });

  it('mỗi trang phục đều có costumeSlot tương ứng rõ ràng', () => {
    const costumes = getRewardsByCategory('costume');
    costumes.forEach((c) => {
      expect(['cloak', 'mask', 'boots', 'hat', 'suit']).toContain(c.costumeSlot);
    });
  });

  it('ánh xạ phần thưởng đặc trưng cho 6 nhiệm vụ Phase 4 chính xác', () => {
    expect(MISSION_REWARD_MAP.mission_01_rescue_girl).toBe('toy_princess_doll');
    expect(MISSION_REWARD_MAP.mission_02_cookie_monster).toBe('candy_cookie');
    expect(MISSION_REWARD_MAP.mission_03_bridge_crossing).toBe('costume_speed_boots');
    expect(MISSION_REWARD_MAP.mission_04_treasure_chest).toBe('costume_crown_hat');
    expect(MISSION_REWARD_MAP.mission_05_candy_machine).toBe('candy_chocolate');
    expect(MISSION_REWARD_MAP.mission_06_math_racing).toBe('toy_mini_robot');
  });
});

describe('2. Reward Engine & Cơ Chế Chống Nhận Trùng (Anti-Duplicate Guard)', () => {
  it('hàm resolveRewardForMission trả về đúng vật phẩm theo nhiệm vụ', () => {
    const item1 = RewardEngine.resolveRewardForMission('mission_01_rescue_girl');
    expect(item1.id).toBe('toy_princess_doll');

    const item2 = RewardEngine.resolveRewardForMission('mission_04_treasure_chest');
    expect(item2.id).toBe('costume_crown_hat');
  });

  it('lời khen của Nữ hoàng thay đổi ấm áp phù hợp theo từng loại vật phẩm', () => {
    const toyItem = getRewardItemById('toy_teddy_bear')!;
    const msgToy = RewardEngine.getQueenCongratulationMessage(toyItem);
    expect(msgToy).toContain('đồ chơi');

    const candyItem = getRewardItemById('candy_lollipop')!;
    const msgCandy = RewardEngine.getQueenCongratulationMessage(candyItem);
    expect(msgCandy).toContain('ngọt ngào');

    const badgeItem = getRewardItemById('badge_bravery')!;
    const msgBadge = RewardEngine.getQueenCongratulationMessage(badgeItem);
    expect(msgBadge).toContain('huy hiệu');

    const costumeItem = getRewardItemById('costume_star_cloak')!;
    const msgCostume = RewardEngine.getQueenCongratulationMessage(costumeItem);
    expect(msgCostume).toContain('tủ đồ mặc thử');
  });

  it('lời an ủi của Nữ hoàng khi thất bại cam kết giữ nguyên vật phẩm và điểm số', () => {
    const comfortMsg = RewardEngine.getQueenComfortMessage();
    expect(comfortMsg).toContain('an toàn nguyên vẹn');
    expect(comfortMsg).toContain('mẹ luôn ở bên con');
  });
});

describe('3. Progression Engine (Hệ Thống Tiến Trình, Cấp Độ & Thành Tích)', () => {
  it('bảng cấp độ gồm 10 bậc với tên danh hiệu cute cho bé', () => {
    expect(LEVEL_TABLE.length).toBe(10);
    expect(LEVEL_TABLE[0].title).toBe('Hiệp Sĩ Tập Sự');
    expect(LEVEL_TABLE[1].title).toBe('Bé Đếm Số Cừ Khôi');
    expect(LEVEL_TABLE[9].title).toBe('Huyền Thoại Vương Quốc');
  });

  it('tính toán cấp độ từ XP chính xác', () => {
    expect(ProgressionEngine.getLevelInfo(0).level).toBe(1);
    expect(ProgressionEngine.getLevelInfo(99).level).toBe(1);
    expect(ProgressionEngine.getLevelInfo(100).level).toBe(2);
    expect(ProgressionEngine.getLevelInfo(250).level).toBe(3);
    expect(ProgressionEngine.getLevelInfo(700).level).toBe(5);
    expect(ProgressionEngine.getLevelInfo(3500).level).toBe(10);
  });

  it('tính toán phần trăm tiến trình đến cấp độ tiếp theo', () => {
    // Level 1: 0 to 100 XP -> 50 XP = 50%
    const p1 = ProgressionEngine.calculateNextLevelProgress(50);
    expect(p1.currentLevel).toBe(1);
    expect(p1.percentage).toBe(50);

    // Max level: 100%
    const pMax = ProgressionEngine.calculateNextLevelProgress(4000);
    expect(pMax.currentLevel).toBe(10);
    expect(pMax.percentage).toBe(100);
  });

  it('đánh giá mở khóa thành tích khi đạt đủ điều kiện', () => {
    const mockProgression = {
      profileId: 'test_player',
      xp: 300,
      level: 3,
      title: 'Thợ Săn Phép Tính',
      totalMissionsCompleted: 2,
      totalCorrectAnswers: 12,
      totalStars: 6,
      unlockedAchievements: [],
      updatedAt: Date.now(),
    };

    const newAchs = ProgressionEngine.evaluateAchievements(
      mockProgression,
      4, // 4 đồ chơi trong kho
      true, // Đã đặt đồ chơi lên kệ
      true, // Đã trang bị trang phục
      2 // 2 loại kẹo
    );

    const achIds = newAchs.map((a) => a.id);
    expect(achIds).toContain('ach_first_win');
    expect(achIds).toContain('ach_math_10');
    expect(achIds).toContain('ach_collector_3');
    expect(achIds).toContain('ach_fashion');
    expect(achIds).toContain('ach_room_decorator');
    expect(achIds).toContain('ach_candy_lover');
  });
});
