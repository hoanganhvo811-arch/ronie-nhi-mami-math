// src/features/progression/progressionEngine.ts
// Bộ Điều Phối Tiến Trình Nhân Vật (Level, XP, 5 Cấp Bậc, Sao & Thành Tích) - Phase 4

import type {
  ICharacterLevelInfo,
  IAchievementDefinition,
  IPlayerProgression,
  IPlayerRankInfo,
  PlayerRankTitle,
  IExpCalculationBreakdown,
} from '../../types/progression';

/**
 * 5 CẤP BẬC NGƯỜI CHƠI CHÍNH THỨC (PHASE 4 SPECIFICATION)
 */
export const PLAYER_RANKS: IPlayerRankInfo[] = [
  {
    rank: 'Bé tập sự',
    tier: 1,
    minXp: 0,
    maxXp: 299,
    icon: '🌱',
    badgeName: 'Mầm Xanh Tri Thức',
    perkDescription: 'Làm quen với các con số, hình khối cơ bản và đếm đồ vật cùng thỏ trắng.',
  },
  {
    rank: 'Hiệp sĩ toán học',
    tier: 2,
    minXp: 300,
    maxXp: 799,
    icon: '🛡️',
    badgeName: 'Hiệp Sĩ Quả Cảm',
    perkDescription: 'Thành thạo phép cộng trừ trong phạm vi 10, mở khóa Xe Đua Tơ Nhện.',
  },
  {
    rank: 'Chiến binh số học',
    tier: 3,
    minXp: 800,
    maxXp: 1599,
    icon: '⚔️',
    badgeName: 'Chiến Binh Tinh Anh',
    perkDescription: 'Đẩy lùi quái vật bánh quy, chinh phục dãy số và phép tính phạm vi 20.',
  },
  {
    rank: 'Siêu nhân toán học',
    tier: 4,
    minXp: 1600,
    maxXp: 2799,
    icon: '⚡',
    badgeName: 'Siêu Anh Hùng Nhện Nhí',
    perkDescription: 'Giải nhanh toán lời văn nhiều bước, thời gian và đo lường centimet.',
  },
  {
    rank: 'Huyền thoại vương quốc',
    tier: 5,
    minXp: 2800,
    maxXp: 99999,
    icon: '👑',
    badgeName: 'Vương Miện Vĩnh Cửu',
    perkDescription: 'Bậc thầy toán học Lớp 1 GDPT 2018, bảo vệ toàn vẹn Vương Quốc Toán Học.',
  },
];

/**
 * BẢNG 10 CẤP ĐỘ CHI TIẾT
 */
export const LEVEL_TABLE: ICharacterLevelInfo[] = [
  { level: 1, title: 'Hiệp Sĩ Tập Sự', rankTitle: 'Bé tập sự', minXp: 0, maxXp: 99, badgeIcon: '🌱' },
  { level: 2, title: 'Bé Đếm Số Cừ Khôi', rankTitle: 'Bé tập sự', minXp: 100, maxXp: 249, badgeIcon: '🔢', unlockedFeature: 'Mở khóa Xe Đua Tơ Nhện' },
  { level: 3, title: 'Thợ Săn Phép Tính', rankTitle: 'Hiệp sĩ toán học', minXp: 250, maxXp: 449, badgeIcon: '🏹', unlockedFeature: 'Mở khóa Huy Hiệu Dũng Cảm' },
  { level: 4, title: 'Dũng Sĩ Rừng Xanh', rankTitle: 'Hiệp sĩ toán học', minXp: 450, maxXp: 699, badgeIcon: '🌲' },
  { level: 5, title: 'Nhà Thám Hiểm Hình Học', rankTitle: 'Chiến binh số học', minXp: 700, maxXp: 999, badgeIcon: '📐', unlockedFeature: 'Mở khóa Huy Hiệu Nhà Toán Học' },
  { level: 6, title: 'Bậc Thầy Đo Lường', rankTitle: 'Chiến binh số học', minXp: 1000, maxXp: 1399, badgeIcon: '📏', unlockedFeature: 'Mở khóa Bộ Giáp Nhện Hoàng Kim' },
  { level: 7, title: 'Tay Đua Siêu Tốc', rankTitle: 'Siêu nhân toán học', minXp: 1400, maxXp: 1899, badgeIcon: '🏎️' },
  { level: 8, title: 'Chiến Binh Toán Học', rankTitle: 'Siêu nhân toán học', minXp: 1900, maxXp: 2499, badgeIcon: '⚔️' },
  { level: 9, title: 'Đại Hiệp Sĩ Tri Thức', rankTitle: 'Huyền thoại vương quốc', minXp: 2500, maxXp: 3199, badgeIcon: '🌟' },
  { level: 10, title: 'Huyền Thoại Vương Quốc', rankTitle: 'Huyền thoại vương quốc', minXp: 3200, maxXp: 99999, badgeIcon: '👑', unlockedFeature: 'Vương miện Tinh Tú Vĩnh Cửu' },
];

export const ACHIEVEMENTS_LIST: IAchievementDefinition[] = [
  // 1. Thành tích cốt lõi ban đầu (giữ nguyên để bảo toàn test cũ)
  {
    id: 'ach_first_win',
    title: 'Bước Đi Đầu Tiên',
    description: 'Hoàn thành nhiệm vụ giải toán đầu tiên cùng Nữ hoàng.',
    icon: '🚀',
    category: 'missions',
    xpReward: 50,
  },
  {
    id: 'ach_math_10',
    title: 'Bộ Não Thần Tốc',
    description: 'Trả lời đúng tổng cộng 10 câu hỏi toán học.',
    icon: '⚡',
    category: 'math',
    xpReward: 80,
  },
  {
    id: 'ach_collector_3',
    title: 'Nhà Sưu Tầm Nhí',
    description: 'Sở hữu từ 3 món đồ chơi đáng yêu trong kho.',
    icon: '🧸',
    category: 'collection',
    xpReward: 100,
  },
  {
    id: 'ach_fashion',
    title: 'Nhà Thiết Kế Đáng Yêu',
    description: 'Trang bị ít nhất 1 trang phục mới cho bé Ronie.',
    icon: '👗',
    category: 'room',
    xpReward: 50,
  },
  {
    id: 'ach_room_decorator',
    title: 'Kiến Trúc Sư Tí Hon',
    description: 'Đặt đồ chơi lên kệ hoặc đổi màu trang trí phòng.',
    icon: '🎨',
    category: 'room',
    xpReward: 60,
  },
  {
    id: 'ach_candy_lover',
    title: 'Tiệc Kẹo Ngọt Ngào',
    description: 'Sưu tầm ít nhất 2 loại kẹo thơm ngon.',
    icon: '🍬',
    category: 'collection',
    xpReward: 70,
  },
  {
    id: 'ach_hero_rescuer',
    title: 'Bàn Tay Cứu Trợ',
    description: 'Hoàn thành nhiệm vụ giải cứu cô bé khỏi vực sâu.',
    icon: '🛟',
    category: 'missions',
    xpReward: 70,
  },
  {
    id: 'ach_star_master',
    title: 'Kho Tàng Tri Thức',
    description: 'Tích lũy từ 12 Ngôi Sao Tri Thức trở lên.',
    icon: '⭐',
    category: 'missions',
    xpReward: 150,
  },

  // 2. CÁC THÀNH TÍCH MỚI CỦA PHASE 4 (SPECIFICATION REQUIREMENTS)
  {
    id: 'ach_math_add_10',
    title: 'Bậc Thầy Phép Cộng',
    description: 'Hoàn thành 10 phép tính cộng chuẩn xác.',
    icon: '➕',
    category: 'math',
    xpReward: 90,
    targetCount: 10,
  },
  {
    id: 'ach_three_stars_streak_3',
    title: 'Chuỗi Sao Lấp Lánh',
    description: 'Đạt 3 sao trong 3 nhiệm vụ liên tiếp không mắc sai sót.',
    icon: '🌟',
    category: 'missions',
    xpReward: 120,
    targetCount: 3,
  },
  {
    id: 'ach_word_problems_5',
    title: 'Thám Tử Toán Lời Văn',
    description: 'Giải thành công 5 bài toán có lời văn phong phú.',
    icon: '📖',
    category: 'math',
    xpReward: 100,
    targetCount: 5,
  },
  {
    id: 'ach_hard_mission_win',
    title: 'Vượt Qua Thử Thách Lớn',
    description: 'Hoàn thành một nhiệm vụ toán học cấp độ khó (Difficulty 4–5).',
    icon: '🏆',
    category: 'missions',
    xpReward: 130,
  },
  {
    id: 'ach_improve_weak_topic',
    title: 'Vươn Lên Mạnh Mẽ',
    description: 'Cải thiện kết quả học tập ở chủ đề toán bé từng còn yếu.',
    icon: '🌱',
    category: 'math',
    xpReward: 110,
  },
  {
    id: 'ach_daily_explorer',
    title: 'Nhà Thám Hiểm Kiên Trì',
    description: 'Hoàn thành một chuyến phiêu lưu Daily Adventure trong ngày.',
    icon: '🧭',
    category: 'daily',
    xpReward: 80,
  },
];

export class ProgressionEngine {
  /**
   * Lấy thông tin Cấp Bậc Danh Hiệu (1 trong 5 Cấp Bậc cốt lõi Phase 4)
   */
  public static getPlayerRank(xp: number): IPlayerRankInfo {
    for (let i = PLAYER_RANKS.length - 1; i >= 0; i--) {
      if (xp >= PLAYER_RANKS[i].minXp) {
        return PLAYER_RANKS[i];
      }
    }
    return PLAYER_RANKS[0];
  }

  /**
   * Tính toán cấp độ tương ứng theo điểm kinh nghiệm (XP)
   */
  public static getLevelInfo(xp: number): ICharacterLevelInfo {
    for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_TABLE[i].minXp) {
        return LEVEL_TABLE[i];
      }
    }
    return LEVEL_TABLE[0];
  }

  /**
   * Tính toán điểm thưởng EXP toàn diện dựa trên tiến bộ, độ chính xác, chuỗi và nỗ lực
   */
  public static calculateExpReward(params: {
    baseExp: number;
    progress: number;
    totalQuestions: number;
    correctCount: number;
    mistakesCount: number;
    streak: number;
    starsEarned: number;
    isRetryImprovement?: boolean;
  }): IExpCalculationBreakdown {
    const isCompleted = params.progress >= 100;
    const baseCompletionXp = isCompleted
      ? params.baseExp
      : Math.round((Math.max(0, params.progress) / 100) * params.baseExp);

    // Điểm thưởng độ chính xác
    const accuracy = params.totalQuestions > 0 ? params.correctCount / params.totalQuestions : 0;
    const accuracyBonus = Math.round(accuracy * 50);

    // Điểm thưởng chuỗi câu đúng
    const streakBonus = Math.min(40, params.streak * 8);

    // Điểm thưởng theo số sao
    const starBonus = params.starsEarned === 3 ? 60 : params.starsEarned === 2 ? 30 : 10;

    // Điểm thưởng nỗ lực & tiến bộ (không phạt khi sai, luôn ghi nhận công sức)
    let effortBonus = 0;
    if (params.mistakesCount > 0 && isCompleted) {
      effortBonus += 20; // Kiên trì không nản chí
    }
    if (params.isRetryImprovement) {
      effortBonus += 30; // Có tiến bộ vượt bậc so với lần trước
    }

    const totalExpGained = baseCompletionXp + accuracyBonus + streakBonus + starBonus + effortBonus;

    return {
      baseCompletionXp,
      accuracyBonus,
      streakBonus,
      starBonus,
      effortBonus,
      totalExpGained,
    };
  }

  /**
   * Tính phần trăm tiến trình đến cấp tiếp theo
   */
  public static calculateNextLevelProgress(xp: number): {
    currentLevel: number;
    title: string;
    currentXpInLevel: number;
    neededXpForNext: number;
    percentage: number;
  } {
    const currentLevelInfo = this.getLevelInfo(xp);
    const nextLevelInfo = LEVEL_TABLE.find((lvl) => lvl.level === currentLevelInfo.level + 1);

    if (!nextLevelInfo) {
      // Đã đạt cấp tối đa
      return {
        currentLevel: currentLevelInfo.level,
        title: currentLevelInfo.title,
        currentXpInLevel: xp - currentLevelInfo.minXp,
        neededXpForNext: 0,
        percentage: 100,
      };
    }

    const range = nextLevelInfo.minXp - currentLevelInfo.minXp;
    const progressInCurrent = Math.max(0, xp - currentLevelInfo.minXp);
    const percentage = Math.min(100, Math.round((progressInCurrent / range) * 100));

    return {
      currentLevel: currentLevelInfo.level,
      title: currentLevelInfo.title,
      currentXpInLevel: progressInCurrent,
      neededXpForNext: range,
      percentage,
    };
  }

  /**
   * Kiểm tra điều kiện mở khóa các thành tích mới
   */
  public static evaluateAchievements(
    progression: IPlayerProgression,
    inventoryItemCount: number,
    hasPlacedToy: boolean,
    hasEquippedCostume: boolean,
    hasCandyCount: number,
    extraMetrics?: {
      additionCount?: number;
      threeStarStreak?: number;
      wordProblemsCount?: number;
      hasCompletedHardMission?: boolean;
      hasImprovedWeakTopic?: boolean;
      hasCompletedDailyAdventure?: boolean;
    }
  ): IAchievementDefinition[] {
    const alreadyUnlocked = new Set(progression.unlockedAchievements);
    const newlyUnlocked: IAchievementDefinition[] = [];

    const additionCount = extraMetrics?.additionCount ?? 0;
    const threeStarStreak = extraMetrics?.threeStarStreak ?? 0;
    const wordProblemsCount = extraMetrics?.wordProblemsCount ?? 0;
    const hasCompletedHardMission = extraMetrics?.hasCompletedHardMission ?? false;
    const hasImprovedWeakTopic = extraMetrics?.hasImprovedWeakTopic ?? false;
    const hasCompletedDailyAdventure = extraMetrics?.hasCompletedDailyAdventure ?? false;

    ACHIEVEMENTS_LIST.forEach((ach) => {
      if (alreadyUnlocked.has(ach.id)) return;

      let isConditionMet = false;
      switch (ach.id) {
        // Nhóm thành tích ban đầu
        case 'ach_first_win':
          isConditionMet = progression.totalMissionsCompleted >= 1;
          break;
        case 'ach_math_10':
          isConditionMet = progression.totalCorrectAnswers >= 10;
          break;
        case 'ach_collector_3':
          isConditionMet = inventoryItemCount >= 3;
          break;
        case 'ach_fashion':
          isConditionMet = hasEquippedCostume;
          break;
        case 'ach_room_decorator':
          isConditionMet = hasPlacedToy;
          break;
        case 'ach_candy_lover':
          isConditionMet = hasCandyCount >= 2;
          break;
        case 'ach_hero_rescuer':
          isConditionMet = progression.totalMissionsCompleted >= 1;
          break;
        case 'ach_star_master':
          isConditionMet = progression.totalStars >= 12;
          break;

        // Nhóm thành tích mới Phase 4
        case 'ach_math_add_10':
          isConditionMet = additionCount >= 10;
          break;
        case 'ach_three_stars_streak_3':
          isConditionMet = threeStarStreak >= 3;
          break;
        case 'ach_word_problems_5':
          isConditionMet = wordProblemsCount >= 5;
          break;
        case 'ach_hard_mission_win':
          isConditionMet = hasCompletedHardMission;
          break;
        case 'ach_improve_weak_topic':
          isConditionMet = hasImprovedWeakTopic;
          break;
        case 'ach_daily_explorer':
          isConditionMet = hasCompletedDailyAdventure;
          break;
      }

      if (isConditionMet) {
        newlyUnlocked.push(ach);
      }
    });

    return newlyUnlocked;
  }
}
