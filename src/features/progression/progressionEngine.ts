// src/features/progression/progressionEngine.ts
// Bộ Điều Phối Tiến Trình Nhân Vật (Level, XP, Danh Hiệu & Thành Tích) - Phase 5

import type {
  ICharacterLevelInfo,
  IAchievementDefinition,
  IPlayerProgression,
} from '../../types/progression';

export const LEVEL_TABLE: ICharacterLevelInfo[] = [
  { level: 1, title: 'Hiệp Sĩ Tập Sự', minXp: 0, maxXp: 99, badgeIcon: '🌱' },
  { level: 2, title: 'Bé Đếm Số Cừ Khôi', minXp: 100, maxXp: 249, badgeIcon: '🔢', unlockedFeature: 'Mở khóa Xe Đua Tơ Nhện' },
  { level: 3, title: 'Thợ Săn Phép Tính', minXp: 250, maxXp: 449, badgeIcon: '🏹', unlockedFeature: 'Mở khóa Huy Hiệu Dũng Cảm' },
  { level: 4, title: 'Dũng Sĩ Rừng Xanh', minXp: 450, maxXp: 699, badgeIcon: '🌲' },
  { level: 5, title: 'Nhà Thám Hiểm Hình Học', minXp: 700, maxXp: 999, badgeIcon: '📐', unlockedFeature: 'Mở khóa Huy Hiệu Nhà Toán Học' },
  { level: 6, title: 'Bậc Thầy Đo Lường', minXp: 1000, maxXp: 1399, badgeIcon: '📏', unlockedFeature: 'Mở khóa Bộ Giáp Nhện Hoàng Kim' },
  { level: 7, title: 'Tay Đua Siêu Tốc', minXp: 1400, maxXp: 1899, badgeIcon: '🏎️' },
  { level: 8, title: 'Chiến Binh Toán Học', minXp: 1900, maxXp: 2499, badgeIcon: '⚔️' },
  { level: 9, title: 'Đại Hiệp Sĩ Tri Thức', minXp: 2500, maxXp: 3199, badgeIcon: '🌟' },
  { level: 10, title: 'Huyền Thoại Vương Quốc', minXp: 3200, maxXp: 99999, badgeIcon: '👑', unlockedFeature: 'Vương miện Tinh Tú Vĩnh Cửu' },
];

export const ACHIEVEMENTS_LIST: IAchievementDefinition[] = [
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
];

export class ProgressionEngine {
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
    hasCandyCount: number
  ): IAchievementDefinition[] {
    const alreadyUnlocked = new Set(progression.unlockedAchievements);
    const newlyUnlocked: IAchievementDefinition[] = [];

    ACHIEVEMENTS_LIST.forEach((ach) => {
      if (alreadyUnlocked.has(ach.id)) return;

      let isConditionMet = false;
      switch (ach.id) {
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
      }

      if (isConditionMet) {
        newlyUnlocked.push(ach);
      }
    });

    return newlyUnlocked;
  }
}
