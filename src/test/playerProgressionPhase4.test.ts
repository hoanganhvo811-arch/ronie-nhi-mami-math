// src/test/playerProgressionPhase4.test.ts
// Bộ kiểm thử tự động toàn diện cho PHASE 4: PLAYER PROGRESSION & REWARD SYSTEM

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ProgressionEngine,
  PLAYER_RANKS,
  LEVEL_TABLE,
  ACHIEVEMENTS_LIST,
} from '../features/progression/progressionEngine';
import { StarRatingEngine } from '../features/progression/StarRatingEngine';
import { DailyAdventureEngine } from '../features/progression/DailyAdventureEngine';
import {
  REWARD_ITEMS_CATALOG,
  ALL_REWARDS_LIST,
  getRewardsByCategory,
  getRewardItemById,
  MISSION_REWARD_MAP,
} from '../features/rewards/rewardCatalog';
import { RewardEngine } from '../features/rewards/RewardEngine';
import type { IPlayerProgression } from '../types/progression';

// Mock audio
vi.mock('../services/audio/AudioManager', () => ({
  soundManager: {
    playTap: vi.fn(),
    playCorrect: vi.fn(),
    playCelebration: vi.fn(),
    speakVietnamese: vi.fn(),
    speakDialogue: vi.fn(),
  },
}));

describe('PHASE 4 - TEST 1: CẤP BẬC NGƯỜI CHƠI & TÍNH EXP ĐA CHIỀU', () => {
  it('hỗ trợ đầy đủ 5 danh hiệu cấp bậc người chơi chính thức theo yêu cầu', () => {
    expect(PLAYER_RANKS.length).toBe(5);

    const rankTitles = PLAYER_RANKS.map((r) => r.rank);
    expect(rankTitles).toContain('Bé tập sự');
    expect(rankTitles).toContain('Hiệp sĩ toán học');
    expect(rankTitles).toContain('Chiến binh số học');
    expect(rankTitles).toContain('Siêu nhân toán học');
    expect(rankTitles).toContain('Huyền thoại vương quốc');
  });

  it('hàm getPlayerRank ánh xạ chính xác điểm EXP vào 5 cấp bậc', () => {
    // 0 - 299 XP: Bé tập sự
    expect(ProgressionEngine.getPlayerRank(0).rank).toBe('Bé tập sự');
    expect(ProgressionEngine.getPlayerRank(150).rank).toBe('Bé tập sự');
    expect(ProgressionEngine.getPlayerRank(299).rank).toBe('Bé tập sự');

    // 300 - 799 XP: Hiệp sĩ toán học
    expect(ProgressionEngine.getPlayerRank(300).rank).toBe('Hiệp sĩ toán học');
    expect(ProgressionEngine.getPlayerRank(600).rank).toBe('Hiệp sĩ toán học');

    // 800 - 1599 XP: Chiến binh số học
    expect(ProgressionEngine.getPlayerRank(800).rank).toBe('Chiến binh số học');
    expect(ProgressionEngine.getPlayerRank(1200).rank).toBe('Chiến binh số học');

    // 1600 - 2799 XP: Siêu nhân toán học
    expect(ProgressionEngine.getPlayerRank(1600).rank).toBe('Siêu nhân toán học');
    expect(ProgressionEngine.getPlayerRank(2500).rank).toBe('Siêu nhân toán học');

    // 2800+ XP: Huyền thoại vương quốc
    expect(ProgressionEngine.getPlayerRank(2800).rank).toBe('Huyền thoại vương quốc');
    expect(ProgressionEngine.getPlayerRank(5000).rank).toBe('Huyền thoại vương quốc');
  });

  it('tính toán EXP đa chiều: xét tiến độ, câu đúng, chuỗi đúng, số sao và nỗ lực vượt khó', () => {
    // Trường hợp 1: Hoàn thành xuất sắc (100% đúng, streak 4, 3 sao)
    const perfectRun = ProgressionEngine.calculateExpReward({
      baseExp: 150,
      progress: 100,
      totalQuestions: 4,
      correctCount: 4,
      mistakesCount: 0,
      streak: 4,
      starsEarned: 3,
    });

    expect(perfectRun.baseCompletionXp).toBe(150);
    expect(perfectRun.accuracyBonus).toBe(50); // 100% * 50
    expect(perfectRun.streakBonus).toBe(32); // 4 * 8
    expect(perfectRun.starBonus).toBe(60); // 3 sao -> 60
    expect(perfectRun.effortBonus).toBe(0);
    expect(perfectRun.totalExpGained).toBe(150 + 50 + 32 + 60);

    // Trường hợp 2: Có sai sót nhưng kiên trì hoàn thành (được cộng điểm nỗ lực effortBonus)
    const effortRun = ProgressionEngine.calculateExpReward({
      baseExp: 150,
      progress: 100,
      totalQuestions: 4,
      correctCount: 3,
      mistakesCount: 2,
      streak: 2,
      starsEarned: 2,
      isRetryImprovement: true,
    });

    expect(effortRun.effortBonus).toBeGreaterThan(0); // Được cộng điểm vì kiên trì + cải thiện
    expect(effortRun.totalExpGained).toBeGreaterThan(150);
  });
});

describe('PHASE 4 - TEST 2: HỆ THỐNG ĐÁNH GIÁ 3 SAO', () => {
  it('1 sao khi hoàn thành nhiệm vụ nhưng có nhiều lỗi sai', () => {
    // 4 câu, đúng 2, sai 3 (vừa đủ chạm ngưỡng qua màn)
    const res = StarRatingEngine.evaluateStars(100, 4, 2, 3, 1);
    expect(res.stars).toBe(1);
    expect(res.details.star1.achieved).toBe(true);
    expect(res.details.star2.achieved).toBe(false);
    expect(res.details.star3.achieved).toBe(false);
    expect(res.feedback).toContain('1 Ngôi Sao Tri Thức');
  });

  it('2 sao khi kết quả tốt (độ chính xác >= 70%, ít lỗi sai)', () => {
    // 4 câu, đúng 3, sai 1 (độ chính xác 75%)
    const res = StarRatingEngine.evaluateStars(100, 4, 3, 1, 1);
    expect(res.stars).toBe(2);
    expect(res.details.star1.achieved).toBe(true);
    expect(res.details.star2.achieved).toBe(true);
    expect(res.details.star3.achieved).toBe(false);
    expect(res.feedback).toContain('2 Ngôi Sao Tri Thức');
  });

  it('3 sao khi hoàn thành xuất sắc (chuẩn xác cao, 0 lỗi sai hoặc tối đa 1 lỗi ở độ khó cao)', () => {
    // Cấp độ 1: 4/4 đúng, 0 lỗi -> 3 sao
    const res1 = StarRatingEngine.evaluateStars(100, 4, 4, 0, 1, 0);
    expect(res1.stars).toBe(3);
    expect(res1.details.star1.achieved).toBe(true);
    expect(res1.details.star2.achieved).toBe(true);
    expect(res1.details.star3.achieved).toBe(true);
    expect(res1.feedback).toContain('3 Ngôi Sao Tri Thức');

    // Cấp độ 4 (Thử thách khó): 5 câu, đúng 4, chỉ 1 lỗi nhỏ -> vẫn đạt 3 sao nhờ quy chế độ khó linh hoạt
    const resHard = StarRatingEngine.evaluateStars(100, 5, 4, 1, 4, 1);
    expect(resHard.stars).toBe(3);
  });
});

describe('PHASE 4 - TEST 3: BỘ SƯU TẬP PHẦN THƯỞNG ĐẦY ĐỦ 9 NHÓM & 4 ĐỘ HIẾM', () => {
  it('chứa đủ tất cả 9 nhóm vật phẩm theo yêu cầu', () => {
    // 1. Gấu bông
    const teddyBears = ALL_REWARDS_LIST.filter(
      (item) => item.category === 'toy' && item.toySubcategory === 'teddy_bear'
    );
    expect(teddyBears.length).toBeGreaterThanOrEqual(2);

    // 2. Robot
    const robots = ALL_REWARDS_LIST.filter(
      (item) => item.category === 'toy' && item.toySubcategory === 'robot'
    );
    expect(robots.length).toBeGreaterThanOrEqual(2);

    // 3. Xe đồ chơi
    const toyCars = ALL_REWARDS_LIST.filter(
      (item) => item.category === 'toy' && item.toySubcategory === 'toy_car'
    );
    expect(toyCars.length).toBeGreaterThanOrEqual(2);

    // 4. Kẹo
    const candies = getRewardsByCategory('candy');
    expect(candies.length).toBeGreaterThanOrEqual(4);

    // 5. Vương miện
    const crowns = getRewardsByCategory('crown');
    expect(crowns.length).toBeGreaterThanOrEqual(2);

    // 6. Huy hiệu
    const badges = getRewardsByCategory('badge');
    expect(badges.length).toBeGreaterThanOrEqual(5);

    // 7. Trang phục Ronie
    const costumes = getRewardsByCategory('costume');
    expect(costumes.length).toBeGreaterThanOrEqual(5);

    // 8. Phụ kiện cho Nhi Mami
    const queenAccessories = getRewardsByCategory('queen_accessory');
    expect(queenAccessories.length).toBeGreaterThanOrEqual(3);

    // 9. Đồ trang trí lâu đài
    const castleDecorations = getRewardsByCategory('castle_decoration');
    expect(castleDecorations.length).toBeGreaterThanOrEqual(3);
  });

  it('chứa đủ 4 độ hiếm (Common, Rare, Epic, Legendary)', () => {
    const rarities = new Set(ALL_REWARDS_LIST.map((item) => item.rarity));
    expect(rarities.has('common')).toBe(true);
    expect(rarities.has('rare')).toBe(true);
    expect(rarities.has('epic')).toBe(true);
    expect(rarities.has('legendary')).toBe(true);
  });

  it('100% vật phẩm là Free-to-play, an toàn cho trẻ em, không yêu cầu tiền thật', () => {
    ALL_REWARDS_LIST.forEach((item) => {
      expect(item.isFreePlay).toBe(true);
    });
  });
});

describe('PHASE 4 - TEST 4: ACHIEVEMENT SYSTEM (HỆ THỐNG THÀNH TÍCH)', () => {
  let baseProgression: IPlayerProgression;

  beforeEach(() => {
    baseProgression = {
      profileId: 'test_child_player',
      xp: 500,
      level: 3,
      title: 'Thợ Săn Phép Tính',
      totalMissionsCompleted: 3,
      totalCorrectAnswers: 15,
      totalStars: 9,
      unlockedAchievements: [],
      updatedAt: Date.now(),
    };
  });

  it('kích hoạt thành tích [ach_math_add_10] khi hoàn thành 10 phép cộng', () => {
    const achs = ProgressionEngine.evaluateAchievements(
      baseProgression,
      3,
      true,
      true,
      2,
      { additionCount: 10 }
    );
    const ids = achs.map((a) => a.id);
    expect(ids).toContain('ach_math_add_10');
  });

  it('kích hoạt thành tích [ach_three_stars_streak_3] khi đạt 3 sao trong 3 nhiệm vụ liên tiếp', () => {
    const achs = ProgressionEngine.evaluateAchievements(
      baseProgression,
      3,
      true,
      true,
      2,
      { threeStarStreak: 3 }
    );
    const ids = achs.map((a) => a.id);
    expect(ids).toContain('ach_three_stars_streak_3');
  });

  it('kích hoạt thành tích [ach_word_problems_5] khi giải thành công 5 bài toán lời văn', () => {
    const achs = ProgressionEngine.evaluateAchievements(
      baseProgression,
      3,
      true,
      true,
      2,
      { wordProblemsCount: 5 }
    );
    const ids = achs.map((a) => a.id);
    expect(ids).toContain('ach_word_problems_5');
  });

  it('kích hoạt thành tích [ach_hard_mission_win] khi hoàn thành nhiệm vụ cấp độ khó', () => {
    const achs = ProgressionEngine.evaluateAchievements(
      baseProgression,
      3,
      true,
      true,
      2,
      { hasCompletedHardMission: true }
    );
    const ids = achs.map((a) => a.id);
    expect(ids).toContain('ach_hard_mission_win');
  });

  it('kích hoạt thành tích [ach_improve_weak_topic] khi cải thiện chủ đề còn yếu', () => {
    const achs = ProgressionEngine.evaluateAchievements(
      baseProgression,
      3,
      true,
      true,
      2,
      { hasImprovedWeakTopic: true }
    );
    const ids = achs.map((a) => a.id);
    expect(ids).toContain('ach_improve_weak_topic');
  });
});

describe('PHASE 4 - TEST 5: DAILY ADVENTURE (PHIÊU LƯU HẰNG NGÀY & BẢO VỆ TÂM LÝ)', () => {
  it('tạo nhiệm vụ hằng ngày ngắn gọn (3 câu) xoay vòng tự nhiên theo ngày', () => {
    const testDate = new Date(2026, 10, 4); // 2026-11-04
    const dailyQuest = DailyAdventureEngine.getTodayDailyQuest(testDate);

    expect(dailyQuest.id).toBe('daily_2026-11-04');
    expect(dailyQuest.targetCount).toBe(3);
    expect(dailyQuest.title).toBeTruthy();
    expect(dailyQuest.queenEncouragement).toContain('Nữ hoàng Nhi Mami');
    expect(dailyQuest.reward.exp).toBe(80);
    expect(dailyQuest.reward.stars).toBe(1);
  });

  it('nguyên tắc bảo vệ tâm lý: bé nghỉ nhiều ngày KHÔNG bị trừ điểm và KHÔNG mất tiến trình', () => {
    const safetyCheck = DailyAdventureEngine.checkAbsenceSafety(5); // Nghỉ 5 ngày
    expect(safetyCheck.isSafe).toBe(true);
    expect(safetyCheck.lostProgress).toBe(false);
    expect(safetyCheck.welcomeMessage).toContain('an toàn tuyệt đối');
  });
});

describe('PHASE 4 - TEST 6: BẢO TOÀN DỮ LIỆU & ÁNH XẠ NHIỆM VỤ', () => {
  it('mọi nhiệm vụ (1 đến 10) đều có phần thưởng tương ứng hợp lệ trong Catalog', () => {
    const missionIds = [
      'mission_01_rescue_girl',
      'mission_02_cookie_monster',
      'mission_03_bridge_crossing',
      'mission_04_treasure_chest',
      'mission_05_candy_machine',
      'mission_06_math_racing',
      'mission_07_rocket_launch',
      'mission_08_magic_key',
      'mission_09_number_maze',
      'mission_10_boss_battle',
    ];

    missionIds.forEach((missionId) => {
      const rewardItem = RewardEngine.resolveRewardForMission(missionId);
      expect(rewardItem).toBeDefined();
      expect(rewardItem.id).toBeTruthy();
      expect(getRewardItemById(rewardItem.id)).toBeDefined();
    });
  });

  it('lời khen của Nữ hoàng thích ứng đúng cho các nhóm phần thưởng mới', () => {
    const crownItem = getRewardItemById('crown_royal_gold')!;
    const msgCrown = RewardEngine.getQueenCongratulationMessage(crownItem);
    expect(msgCrown).toContain('vương miện');

    const queenAcc = getRewardItemById('queen_feather_fan')!;
    const msgAcc = RewardEngine.getQueenCongratulationMessage(queenAcc);
    expect(msgAcc).toContain('Nhi Mami');

    const castleDeco = getRewardItemById('castle_red_carpet')!;
    const msgDeco = RewardEngine.getQueenCongratulationMessage(castleDeco);
    expect(msgDeco).toContain('lâu đài');
  });
});
