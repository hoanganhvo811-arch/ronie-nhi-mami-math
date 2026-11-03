// src/features/adventure/adventureEngine.ts
// Bộ máy quản lý Tiến trình Khám phá Thế giới, Mở khóa Vùng đất, Cốt truyện 6 Chương & Sự kiện ngẫu nhiên (Phase 8)

import type {
  IAdventureRegion,
  IChapterStory,
  IRandomWorldEvent,
  IDailyAdventureTask,
  RegionId,
} from '../../types/adventure';
import {
  ADVENTURE_REGIONS,
  CHAPTERS_CATALOG,
  RANDOM_WORLD_EVENTS,
  DAILY_QUEST_TEMPLATES,
} from './adventureCatalog';

export class AdventureEngine {
  private static dynamicRegions: IAdventureRegion[] = [...ADVENTURE_REGIONS];

  /**
   * Lấy danh sách toàn bộ các vùng đất phiêu lưu (hỗ trợ mở rộng động)
   */
  public static getAllRegions(): IAdventureRegion[] {
    return AdventureEngine.dynamicRegions;
  }

  /**
   * Bổ sung một vùng đất mới vào thế giới một cách linh hoạt mà KHÔNG cần viết lại Mission Engine
   */
  public static registerCustomRegion(newRegion: IAdventureRegion): void {
    const existingIdx = this.dynamicRegions.findIndex((r) => r.id === newRegion.id);
    if (existingIdx >= 0) {
      this.dynamicRegions[existingIdx] = newRegion;
    } else {
      this.dynamicRegions.push(newRegion);
    }
  }

  /**
   * Kiểm tra điều kiện mở khóa linh hoạt cho một vùng đất
   * NGUYÊN TẮC: Mở khóa bằng:
   * 1. Số sao tích lũy (Stars)
   * 2. HOẶC Hoàn thành nhiệm vụ cơ bản của vùng trước (Basic Mission)
   * 3. HOẶC Sở hữu huy hiệu danh dự (Badge)
   * Tuyệt đối không ép buộc bé phải làm toàn bộ nhiệm vụ khó!
   */
  public static checkRegionUnlocked(
    region: IAdventureRegion,
    playerStars: number,
    completedMissionIds: string[] = [],
    playerBadges: string[] = []
  ): {
    isUnlocked: boolean;
    reason: string;
  } {
    // Vùng Lâu đài kinh đô luôn mở sẵn
    if (region.id === 'castle' || region.numericId === 1) {
      return { isUnlocked: true, reason: 'Vùng đất kinh đô hoàng gia luôn rộng mở đón Ronie.' };
    }

    // 1. Kiểm tra theo số sao tích lũy
    if (playerStars >= region.requiredStars) {
      return {
        isUnlocked: true,
        reason: `Bé đã thu thập đủ ${playerStars}/${region.requiredStars} Ngôi Sao Tri Thức.`,
      };
    }

    // 2. Kiểm tra theo nhiệm vụ cơ bản của vùng trước
    const prevRegion = this.dynamicRegions.find((r) => r.numericId === region.numericId - 1);
    if (prevRegion) {
      const basicMissions = prevRegion.missions.filter((m) => m.isBasic);
      const hasCompletedAtLeastOneBasic = basicMissions.some((m) =>
        completedMissionIds.includes(m.id)
      );

      if (hasCompletedAtLeastOneBasic) {
        return {
          isUnlocked: true,
          reason: `Bé đã hoàn thành nhiệm vụ cơ bản tại ${prevRegion.name}.`,
        };
      }
    }

    // 3. Kiểm tra theo huy hiệu danh dự nếu có yêu cầu
    if (region.badgeRequired && playerBadges.includes(region.badgeRequired)) {
      return {
        isUnlocked: true,
        reason: `Bé sở hữu Huy Hiệu Danh Dự mở khóa vùng đất này!`,
      };
    }

    return {
      isUnlocked: false,
      reason: `Cần đạt ${region.requiredStars} sao hoặc hoàn thành 1 nhiệm vụ cơ bản ở vùng trước.`,
    };
  }

  /**
   * Lấy danh sách 6 chương cốt truyện
   */
  public static getChapters(): IChapterStory[] {
    return CHAPTERS_CATALOG;
  }

  /**
   * Đánh giá trạng thái từng chương cốt truyện
   */
  public static evaluateChapterStatus(
    chapter: IChapterStory,
    playerStars: number,
    completedChapterIds: string[] = []
  ): 'locked' | 'available' | 'completed' {
    if (completedChapterIds.includes(chapter.id)) {
      return 'completed';
    }

    if (chapter.chapterNumber === 1) {
      return 'available';
    }

    // Mở chương tiếp theo nếu chương trước đã hoàn thành hoặc đạt đủ số sao
    const prevChapterId = `chapter_${chapter.chapterNumber - 1}`;
    if (completedChapterIds.includes(prevChapterId) || playerStars >= (chapter.chapterNumber - 1) * 3) {
      return 'available';
    }

    return 'locked';
  }

  /**
   * Kích hoạt một sự kiện thế giới ngẫu nhiên không gây mất dữ liệu
   */
  public static getRandomWorldEvent(): IRandomWorldEvent {
    const events = RANDOM_WORLD_EVENTS;
    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
  }

  /**
   * Lấy nhiệm vụ nhỏ mỗi ngày (Gentle Daily Quest)
   * NGUYÊN TẮC: Hoàn toàn không áp dụng chuỗi streak ép buộc hay hình thức phạt khi bỏ chơi!
   */
  public static getTodayDailyQuest(now: Date = new Date()): IDailyAdventureTask {
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    // Chọn template theo ngày trong tuần
    const dayIndex = now.getDay() % DAILY_QUEST_TEMPLATES.length;
    const template = DAILY_QUEST_TEMPLATES[dayIndex];

    let isCompleted = false;
    let currentCount = 0;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`ronie_daily_quest_${dateKey}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          isCompleted = parsed.isCompleted;
          currentCount = parsed.currentCount;
        }
      } catch {
        // Fallback
      }
    }

    return {
      id: `daily_${dateKey}`,
      dateKey,
      title: template.title,
      description: template.description,
      targetCount: template.targetCount,
      currentCount,
      rewardStars: template.rewardStars,
      isCompleted,
      encouragingNote: template.encouragingNote,
    };
  }

  /**
   * Đánh dấu hoàn thành nhiệm vụ hàng ngày
   */
  public static markDailyQuestCompleted(dateKey: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `ronie_daily_quest_${dateKey}`,
          JSON.stringify({ isCompleted: true, currentCount: 1, completedAt: Date.now() })
        );
      } catch {
        // Fallback
      }
    }
  }
}
