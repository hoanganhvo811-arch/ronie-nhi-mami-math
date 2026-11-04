// src/test/phase6ParentDashboard.test.ts
// Kiểm thử toàn diện Phase 6: Bảng Theo Dõi Học Tập & Phân Tích Năng Lực Phụ Huynh

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AnalyticsEngine,
  PHASE6_TOPICS_META,
  mapToPhase6TopicKey,
} from '../features/parent-dashboard/analyticsEngine';
import {
  recordMathSession,
  getMathSessions,
  getParentSettings,
  updateParentSettings,
  resetProfileData,
  DEFAULT_PROFILE_ID,
  inMemoryMathSessions,
} from '../services/storage/db';
import type { IMathSession, IProgressRecord, IProgressionRecord } from '../types/database';

describe('PHASE 6: Parent Dashboard & Learning Analytics', () => {
  beforeEach(async () => {
    await resetProfileData(DEFAULT_PROFILE_ID);
  });

  describe('1. Tổng Quan Học Tập (Real-Data Overview)', () => {
    it('khi chưa có phiên học nào, trả về dữ liệu 0 chuẩn xác, tuyệt đối không bịa số liệu', () => {
      const emptySessions: IMathSession[] = [];
      const emptyProgress: IProgressRecord[] = [];
      const emptyProgression: IProgressionRecord = {
        profileId: DEFAULT_PROFILE_ID,
        level: 1,
        xp: 0,
        totalMissions: 0,
        totalCorrect: 0,
        achievements: [],
        updatedAt: Date.now(),
      };

      const ov = AnalyticsEngine.calculateOverview(emptySessions, emptyProgress, emptyProgression);

      expect(ov.totalPlaytimeMinutes).toBe(0);
      expect(ov.totalMissionsCompleted).toBe(0);
      expect(ov.totalQuestionsAnswered).toBe(0);
      expect(ov.totalCorrectAnswers).toBe(0);
      expect(ov.accuracyPercentage).toBe(0);
      expect(ov.masteredTopicsCount).toBe(0);
      expect(ov.curriculumProgressPercentage).toBe(0);
    });

    it('tính toán chính xác tổng thời gian, số nhiệm vụ, tổng số câu hỏi, câu đúng, tỷ lệ % và số chủ đề thành thạo', () => {
      const sampleSessions: IMathSession[] = [
        {
          id: 's1',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'addition_within_10',
          totalQuestions: 10,
          correctQuestions: 9, // 90% -> mastered
          hintUsedCount: 0,
          durationSeconds: 120, // 2 phút
          timestamp: Date.now() - 1000 * 60 * 60 * 2,
        },
        {
          id: 's2',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'subtraction_within_10',
          totalQuestions: 10,
          correctQuestions: 5, // 50% -> needs_practice
          hintUsedCount: 2,
          durationSeconds: 180, // 3 phút
          timestamp: Date.now() - 1000 * 60 * 60 * 1,
        },
        {
          id: 's3',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'comparison_operators',
          totalQuestions: 10,
          correctQuestions: 8, // 80% -> mastered
          hintUsedCount: 1,
          durationSeconds: 120, // 2 phút
          timestamp: Date.now() - 1000 * 60 * 30,
        },
      ];

      const sampleProgress: IProgressRecord[] = [
        {
          id: 'p1',
          profileId: DEFAULT_PROFILE_ID,
          zoneId: 1,
          stageId: 1,
          starsEarned: 3,
          bestScore: 100,
          unlocked: true,
          completed: true,
        },
        {
          id: 'p2',
          profileId: DEFAULT_PROFILE_ID,
          zoneId: 1,
          stageId: 2,
          starsEarned: 2,
          bestScore: 80,
          unlocked: true,
          completed: true,
        },
        {
          id: 'p3',
          profileId: DEFAULT_PROFILE_ID,
          zoneId: 1,
          stageId: 3,
          starsEarned: 3,
          bestScore: 100,
          unlocked: true,
          completed: true,
        },
      ];

      const sampleProgression: IProgressionRecord = {
        profileId: DEFAULT_PROFILE_ID,
        level: 2,
        xp: 450,
        totalMissions: 3,
        totalCorrect: 22,
        achievements: [],
        updatedAt: Date.now(),
      };

      const ov = AnalyticsEngine.calculateOverview(sampleSessions, sampleProgress, sampleProgression);

      // Tổng thời gian: (120 + 180 + 120) / 60 = 420 / 60 = 7 phút
      expect(ov.totalPlaytimeMinutes).toBe(7);
      expect(ov.totalMissionsCompleted).toBe(3);
      expect(ov.totalQuestionsAnswered).toBe(30);
      expect(ov.totalCorrectAnswers).toBe(22);
      // Tỷ lệ: 22 / 30 = 73.33% -> 73%
      expect(ov.accuracyPercentage).toBe(73);
      // 2 chủ đề thành thạo (addition 90%, comparison 80%)
      expect(ov.masteredTopicsCount).toBe(2);
      // 3 / 15 màn chuẩn = 20%
      expect(ov.curriculumProgressPercentage).toBe(20);
    });
  });

  describe('2. Phân Tích 8 Chủ Đề Toán Học Chuẩn Phase 6', () => {
    it('đảm bảo đầy đủ 8 chủ đề toán học theo đúng yêu cầu', () => {
      const keys = Object.keys(PHASE6_TOPICS_META);
      expect(keys).toEqual([
        'addition',
        'subtraction',
        'comparison',
        'missing_numbers',
        'word_problems',
        'logical_thinking',
        'geometry',
        'measurement',
      ]);
    });

    it('ánh xạ linh hoạt các mã bài tập cũ và mới vào đúng 8 chủ đề chính', () => {
      expect(mapToPhase6TopicKey('addition_within_10')).toBe('addition');
      expect(mapToPhase6TopicKey('subtraction_within_10')).toBe('subtraction');
      expect(mapToPhase6TopicKey('comparison_operators')).toBe('comparison');
      expect(mapToPhase6TopicKey('missing_numbers')).toBe('missing_numbers');
      expect(mapToPhase6TopicKey('word_problems')).toBe('word_problems');
      expect(mapToPhase6TopicKey('number_patterns')).toBe('logical_thinking');
      expect(mapToPhase6TopicKey('flat_shapes')).toBe('geometry');
      expect(mapToPhase6TopicKey('spatial_shapes')).toBe('geometry');
      expect(mapToPhase6TopicKey('length_centimeter')).toBe('measurement');
      expect(mapToPhase6TopicKey('clock_reading')).toBe('measurement');
    });

    it('tính toán chính xác cấp độ hiện tại, tỷ lệ đúng, số lượt và nội dung cần luyện thêm cho từng chủ đề', () => {
      const sessions: IMathSession[] = [
        {
          id: 's_add_1',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'addition',
          totalQuestions: 12,
          correctQuestions: 11, // 92%
          hintUsedCount: 0,
          durationSeconds: 90,
          timestamp: Date.now() - 1000 * 60 * 10,
        },
        {
          id: 's_sub_1',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'subtraction',
          totalQuestions: 8,
          correctQuestions: 4, // 50%
          hintUsedCount: 2,
          durationSeconds: 110,
          timestamp: Date.now() - 1000 * 60 * 5,
        },
      ];

      const breakdown = AnalyticsEngine.calculateTopicBreakdownPhase6(sessions);
      expect(breakdown).toHaveLength(8);

      const addTopic = breakdown.find((t) => t.topicKey === 'addition');
      expect(addTopic).toBeDefined();
      expect(addTopic?.totalQuestions).toBe(12);
      expect(addTopic?.accuracy).toBe(92);
      expect(addTopic?.status).toBe('mastered');
      expect(addTopic?.currentLevel).toBe(4); // >=80% and >=10 questions -> Level 4
      expect(addTopic?.practiceSessionsCount).toBe(1);

      const subTopic = breakdown.find((t) => t.topicKey === 'subtraction');
      expect(subTopic).toBeDefined();
      expect(subTopic?.totalQuestions).toBe(8);
      expect(subTopic?.accuracy).toBe(50);
      expect(subTopic?.status).toBe('needs_practice');
      expect(subTopic?.focusAreas).toContain('phép trừ');

      const unplayedTopic = breakdown.find((t) => t.topicKey === 'word_problems');
      expect(unplayedTopic?.totalQuestions).toBe(0);
      expect(unplayedTopic?.statusText).toBe('Chưa luyện tập');
    });

    it('nhận diện xu hướng tiến bộ (improving / stable / needs_support) khi có nhiều phiên học', () => {
      // Phiên cũ: đúng 5/10 (50%), Phiên mới: đúng 9/10 (90%) -> Tăng dần (+40%)
      const sessions: IMathSession[] = [
        {
          id: 's_new',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'addition',
          totalQuestions: 10,
          correctQuestions: 9,
          hintUsedCount: 0,
          durationSeconds: 60,
          timestamp: Date.now() - 1000 * 60, // Mới nhất
        },
        {
          id: 's_old',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'addition',
          totalQuestions: 10,
          correctQuestions: 5,
          hintUsedCount: 1,
          durationSeconds: 80,
          timestamp: Date.now() - 1000 * 60 * 60 * 24, // Cũ
        },
      ];

      const breakdown = AnalyticsEngine.calculateTopicBreakdownPhase6(sessions);
      const addTopic = breakdown.find((t) => t.topicKey === 'addition');
      expect(addTopic?.trend).toBe('improving');
      expect(addTopic?.trendText).toContain('Tăng dần ↗️');
    });
  });

  describe('3. Đề Xuất Luyện Tập Thông Minh (Smart Recommendations)', () => {
    it('đưa ra phân tích và đề xuất chính xác theo đúng kịch bản đề bài (Làm tốt phép cộng, Cần luyện phép trừ, Cần cải thiện toán lời văn)', () => {
      const sampleSessions: IMathSession[] = [
        // Làm rất tốt phép cộng: 10/10 đúng (100%)
        {
          id: 's1',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'addition',
          totalQuestions: 10,
          correctQuestions: 10,
          hintUsedCount: 0,
          durationSeconds: 70,
          timestamp: Date.now() - 1000 * 60 * 30,
        },
        // Phép trừ cần luyện thêm: 5/10 đúng (50%)
        {
          id: 's2',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'subtraction',
          totalQuestions: 10,
          correctQuestions: 5,
          hintUsedCount: 3,
          durationSeconds: 120,
          timestamp: Date.now() - 1000 * 60 * 20,
        },
        // Toán có lời văn chưa làm hoặc thấp: 3/10 đúng (30%)
        {
          id: 's3',
          profileId: DEFAULT_PROFILE_ID,
          topicKey: 'word_problems',
          totalQuestions: 10,
          correctQuestions: 3,
          hintUsedCount: 4,
          durationSeconds: 150,
          timestamp: Date.now() - 1000 * 60 * 10,
        },
      ];

      const topicStats = AnalyticsEngine.calculateTopicBreakdownPhase6(sampleSessions);
      const result = AnalyticsEngine.generateSmartRecommendations(topicStats, sampleSessions);

      // 1. Phân tích điểm mạnh
      expect(result.strengths.some((s) => s.includes('Phép cộng'))).toBe(true);

      // 2. Phân tích điểm cần luyện thêm
      expect(result.needsPractice.some((np) => np.includes('Phép trừ'))).toBe(true);
      expect(result.needsPractice.some((np) => np.includes('Toán có lời văn'))).toBe(true);

      // 3. Đề xuất hành động cụ thể
      expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
      const weakRecs = result.recommendations.filter((r) => r.priority === 'high');
      expect(weakRecs.some((r) => r.topicKey === 'subtraction' || r.topicKey === 'word_problems')).toBe(true);

      // 4. Đề xuất thử thách nâng cao cho chủ đề mạnh
      const strongRec = result.recommendations.find((r) => r.topicKey === 'addition');
      expect(strongRec).toBeDefined();
      expect(strongRec?.activityTitle).toContain('Đấu Trường Toán Học');

      // 5. Chuỗi tóm tắt
      expect(result.summary).toContain('Phép cộng');
      expect(result.summary).toContain('Phép trừ');
    });
  });

  describe('4. Thiết Lập Của Phụ Huynh (Parent Settings)', () => {
    it('lưu trữ và cập nhật thành công các thiết lập nâng cao, giới hạn phiên và thử thách thời gian', async () => {
      const initialSettings = await getParentSettings(DEFAULT_PROFILE_ID);
      expect(initialSettings.dailyLimitMinutes).toBe(20);
      expect(initialSettings.enableAdvancedQuestions).toBe(true);
      expect(initialSettings.enableTimedChallenges).toBe(true);

      // Cập nhật cài đặt phụ huynh
      await updateParentSettings(DEFAULT_PROFILE_ID, {
        dailyLimitMinutes: 30,
        sessionLimitMinutes: 15,
        enableAdvancedQuestions: false,
        enableTimedChallenges: false,
        contentConfig: {
          ...initialSettings.contentConfig!,
          enabledTopics: ['addition', 'subtraction', 'comparison'],
          enableAdvancedQuestions: false,
          enableTimedChallenges: false,
        },
      });

      const updated = await getParentSettings(DEFAULT_PROFILE_ID);
      expect(updated.dailyLimitMinutes).toBe(30);
      expect(updated.sessionLimitMinutes).toBe(15);
      expect(updated.enableAdvancedQuestions).toBe(false);
      expect(updated.enableTimedChallenges).toBe(false);
      expect(updated.contentConfig?.enabledTopics).toEqual(['addition', 'subtraction', 'comparison']);
    });
  });

  describe('5. Lịch Sử Học Tập (Learning History)', () => {
    it('định dạng đúng các trường thông tin trong nhật ký học tập', async () => {
      await recordMathSession(DEFAULT_PROFILE_ID, 'addition', 10, 9, 1, 65);
      await recordMathSession(DEFAULT_PROFILE_ID, 'subtraction', 8, 7, 0, 45);

      const sessions = await getMathSessions(DEFAULT_PROFILE_ID);
      expect(sessions.length).toBe(2);

      const formatted = AnalyticsEngine.formatLearningHistory(sessions);
      expect(formatted).toHaveLength(2);
      expect(formatted[0].topicName).toBe('Phép trừ');
      expect(formatted[0].totalQuestions).toBe(8);
      expect(formatted[0].correctQuestions).toBe(7);
      expect(formatted[0].accuracy).toBe(88); // 7/8 = 87.5% -> 88%
      expect(formatted[0].durationSeconds).toBe(45);
      expect(formatted[0].dateFormatted).toBeTruthy();
    });
  });

  describe('6. Bảo Mật Cổng Phụ Huynh (Security & COPPA)', () => {
    it('mã PIN mặc định là 2018 và có cơ chế bảo vệ trước trẻ nhỏ', async () => {
      const settings = await getParentSettings(DEFAULT_PROFILE_ID);
      expect(settings.pinCode).toBe('2018');
    });

    it('không lưu trữ thông tin nhận dạng cá nhân nhạy cảm (COPPA Safe)', async () => {
      const settings = await getParentSettings(DEFAULT_PROFILE_ID);
      // Đảm bảo không có các trường dữ liệu nhạy cảm
      expect((settings as any).childFullName).toBeUndefined();
      expect((settings as any).childEmail).toBeUndefined();
      expect((settings as any).phoneNumber).toBeUndefined();
      expect((settings as any).gpsLocation).toBeUndefined();
    });
  });
});
