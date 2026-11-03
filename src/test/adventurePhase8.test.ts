// src/test/adventurePhase8.test.ts
// Kiểm thử Hệ Thống Bản Đồ 6 Vùng Đất, Cốt Truyện 6 Chương, Sự Kiện Ngẫu Nhiên & Nhiệm Vụ Hàng Ngày (Phase 8)

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ADVENTURE_REGIONS,
  CHAPTERS_CATALOG,
  RANDOM_WORLD_EVENTS,
} from '../features/adventure/adventureCatalog';
import { AdventureEngine } from '../features/adventure/adventureEngine';
import type { IAdventureRegion, RegionId } from '../types/adventure';

describe('Phase 8: World Progression & Adventure Content', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. Hệ thống 6 Vùng Đất Bản Đồ Thế Giới', () => {
    it('định nghĩa đầy đủ 6 vùng đất chính theo đúng yêu cầu đề bài', () => {
      const regions = AdventureEngine.getAllRegions();
      expect(regions.length).toBeGreaterThanOrEqual(6);

      const requiredRegionIds: RegionId[] = [
        'castle',
        'forest',
        'valley',
        'rainbow',
        'cave',
        'time_city',
      ];

      requiredRegionIds.forEach((id) => {
        const found = regions.find((r) => r.id === id);
        expect(found).toBeDefined();
        expect(found?.name).toBeTruthy();
        expect(found?.subtitle).toBeTruthy();
        expect(found?.bgGradient).toBeTruthy();
        expect(found?.mathTopic).toBeTruthy();
        expect(found?.primaryCharacter.name).toBeTruthy();
        expect(found?.primaryCharacter.quote).toBeTruthy();
        expect(found?.uniqueReward.name).toBeTruthy();
        expect(found?.shortLore.length).toBeGreaterThan(15);
      });
    });

    it('mỗi vùng đất đều có danh sách nhiệm vụ với cờ nhiệm vụ cơ bản (isBasic)', () => {
      const regions = AdventureEngine.getAllRegions();
      regions.forEach((reg) => {
        expect(reg.missions.length).toBeGreaterThanOrEqual(2);
        const hasBasic = reg.missions.some((m) => m.isBasic);
        expect(hasBasic).toBe(true);
      });
    });
  });

  describe('2. Cơ chế Mở Khóa Vùng Đất Linh Hoạt', () => {
    it('Lâu Đài Nhi Mami luôn mở sẵn từ đầu', () => {
      const castle = ADVENTURE_REGIONS.find((r) => r.id === 'castle')!;
      const result = AdventureEngine.checkRegionUnlocked(castle, 0, [], []);
      expect(result.isUnlocked).toBe(true);
    });

    it('mở khóa được bằng số sao tích lũy', () => {
      const forest = ADVENTURE_REGIONS.find((r) => r.id === 'forest')!;
      // Yêu cầu 2 sao
      const lockedResult = AdventureEngine.checkRegionUnlocked(forest, 1, [], []);
      expect(lockedResult.isUnlocked).toBe(false);

      const unlockedResult = AdventureEngine.checkRegionUnlocked(forest, 2, [], []);
      expect(unlockedResult.isUnlocked).toBe(true);
      expect(unlockedResult.reason).toContain('Ngôi Sao');
    });

    it('mở khóa được bằng việc hoàn thành nhiệm vụ cơ bản ở vùng trước (không ép làm hết bài khó)', () => {
      const valley = ADVENTURE_REGIONS.find((r) => r.id === 'valley')!;
      // Valley cần 5 sao, bé chỉ có 1 sao nhưng đã hoàn thành nhiệm vụ cơ bản 'm_1_1' của Forest
      const unlockByBasic = AdventureEngine.checkRegionUnlocked(valley, 1, ['m_1_1'], []);
      expect(unlockByBasic.isUnlocked).toBe(true);
      expect(unlockByBasic.reason).toContain('nhiệm vụ cơ bản');
    });

    it('mở khóa được bằng huy hiệu danh dự nếu có', () => {
      const customRegion: IAdventureRegion = {
        ...ADVENTURE_REGIONS[3],
        id: 'rainbow',
        requiredStars: 20,
        badgeRequired: 'badge_bravery',
      };

      // Bé chỉ có 0 sao nhưng có Huy Hiệu Dũng Cảm
      const unlockByBadge = AdventureEngine.checkRegionUnlocked(
        customRegion,
        0,
        [],
        ['badge_bravery']
      );
      expect(unlockByBadge.isUnlocked).toBe(true);
      expect(unlockByBadge.reason).toContain('Huy Hiệu Danh Dự');
    });
  });

  describe('3. Nhiệm Vụ Theo 6 Chương Cốt Truyện', () => {
    it('đầy đủ 6 chương cốt truyện có mở đầu, thử thách trùm cuối và phần thưởng', () => {
      const chapters = AdventureEngine.getChapters();
      expect(chapters).toHaveLength(6);

      const expectedTitles = [
        'Lời Gọi Từ Nữ Hoàng',
        'Giải Cứu Khu Rừng',
        'Quái Vật Bánh Quy',
        'Bí Mật Hang Kho Báu',
        'Thành Phố Kẹo & Thời Gian',
        'Đại Hội Siêu Anh Hùng Toán Học',
      ];

      chapters.forEach((chap, idx) => {
        expect(chap.chapterNumber).toBe(idx + 1);
        expect(chap.title).toBe(expectedTitles[idx]);
        expect(chap.openingDialogue.text.length).toBeGreaterThan(15);
        expect(chap.missionSequence.length).toBeGreaterThanOrEqual(2);
        expect(chap.bossChallenge.bossName).toBeTruthy();
        expect(chap.bossChallenge.targetScore).toBeGreaterThan(0);
        expect(chap.rewardItem.name).toBeTruthy();
        expect(chap.endingScene.text.length).toBeGreaterThan(15);
      });
    });

    it('đánh giá trạng thái chương chính xác (chương 1 mở sẵn, chương sau mở khi hoàn thành trước)', () => {
      const chapters = AdventureEngine.getChapters();
      const chap1 = chapters[0];
      const chap2 = chapters[1];

      expect(AdventureEngine.evaluateChapterStatus(chap1, 0, [])).toBe('available');
      expect(AdventureEngine.evaluateChapterStatus(chap2, 0, [])).toBe('locked');

      // Khi hoàn thành chương 1 -> chương 2 mở
      expect(AdventureEngine.evaluateChapterStatus(chap2, 0, ['chapter_1'])).toBe('available');
    });
  });

  describe('4. Sự Kiện Thế Giới Ngẫu Nhiên & An Toàn', () => {
    it('định nghĩa đủ 5 dạng sự kiện bất ngờ phong phú', () => {
      expect(RANDOM_WORLD_EVENTS.length).toBeGreaterThanOrEqual(5);

      const types = RANDOM_WORLD_EVENTS.map((e) => e.type);
      expect(types).toContain('help_friend');
      expect(types).toContain('secret_item');
      expect(types).toContain('surprise_gift');
      expect(types).toContain('funny_npc');
      expect(types).toContain('quick_challenge');
    });

    it('getRandomWorldEvent trả về một sự kiện hợp lệ có nhân vật và lời thoại', () => {
      const evt = AdventureEngine.getRandomWorldEvent();
      expect(evt).toBeDefined();
      expect(evt.title).toBeTruthy();
      expect(evt.character.name).toBeTruthy();
      expect(evt.character.quote).toBeTruthy();
      expect(evt.reward.text).toBeTruthy();
    });
  });

  describe('5. Nhiệm Vụ Nhỏ Hàng Ngày (Không Áp Lực Streak)', () => {
    it('tạo nhiệm vụ hàng ngày với lời khuyên động viên tích cực', () => {
      const todayQuest = AdventureEngine.getTodayDailyQuest(new Date(2026, 10, 4));
      expect(todayQuest.id).toContain('daily_2026-11-04');
      expect(todayQuest.title).toBeTruthy();
      expect(todayQuest.rewardStars).toBeGreaterThan(0);
      expect(todayQuest.encouragingNote.length).toBeGreaterThan(10);
      expect(todayQuest.isCompleted).toBe(false);
    });

    it('cho phép đánh dấu hoàn thành nhiệm vụ hàng ngày', () => {
      const dateKey = '2026-11-04';
      AdventureEngine.markDailyQuestCompleted(dateKey);
      const updatedQuest = AdventureEngine.getTodayDailyQuest(new Date(2026, 10, 4));
      expect(updatedQuest.isCompleted).toBe(true);
    });
  });

  describe('6. Khả Năng Mở Rộng Kiến Trúc Không Cần Sửa Mission Engine', () => {
    it('cho phép đăng ký một vùng đất mới (Vùng 7) động mà không phá vỡ logic cũ', () => {
      const initialCount = AdventureEngine.getAllRegions().length;

      const region7: IAdventureRegion = {
        id: 'castle', // ID placeholder
        numericId: 7,
        name: 'Đảo Bay Thiên Hà Số',
        subtitle: 'Khám phá các vì sao toán học',
        icon: '🌌',
        color: '#6366F1',
        accentColor: '#4F46E5',
        bgGradient: 'from-indigo-600 to-purple-800',
        mathTopic: 'Toán đố thiên hà',
        curriculumCategory: 'Mở rộng sáng tạo',
        primaryCharacter: {
          name: 'Bé Ronie Phi Hành Gia',
          role: 'Hiệp Sĩ Vũ Trụ',
          avatarId: 'ronie_astronaut',
          avatarType: 'ronie',
          quote: 'Vút bay lên các vì sao tri thức!',
        },
        shortLore: 'Hòn đảo bay lơ lửng giữa vũ trụ ngập tràn ánh sao số học.',
        uniqueReward: {
          id: 'toy_star_rocket',
          name: 'Tên Lửa Tơ Nhện',
          category: 'toy',
          icon: '🚀',
          description: 'Mô hình tên lửa bay lượn.',
        },
        requiredStars: 25,
        missions: [
          {
            id: 'm_7_1',
            title: 'Hạ Cánh Thiên Hà',
            subtitle: 'Đếm các chòm sao',
            mathTopic: 'Đếm 1 - 20',
            difficulty: 'medium',
            isBasic: true,
            rewardExp: 100,
          },
        ],
      };

      AdventureEngine.registerCustomRegion(region7);
      const allRegs = AdventureEngine.getAllRegions();
      expect(allRegs.length).toBeGreaterThanOrEqual(initialCount);

      const found = allRegs.find((r) => r.numericId === 7);
      expect(found?.name).toBe('Đảo Bay Thiên Hà Số');
    });
  });
});
