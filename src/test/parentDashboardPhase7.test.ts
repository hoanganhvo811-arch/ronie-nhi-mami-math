// src/test/parentDashboardPhase7.test.ts
// Kiểm thử Bảng Quản Lý Phụ Huynh, Phân Tích Năng Lực Học Tập & Sao Lưu (Phase 7)

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AnalyticsEngine,
  TOPIC_META_MAP,
} from '../features/parent-dashboard/analyticsEngine';
import { screenTimeTracker } from '../services/time/ScreenTimeTracker';
import {
  exportBackupData,
  importBackupData,
  getParentSettings,
  updateParentSettings,
  DEFAULT_PROFILE_ID,
} from '../services/storage/db';
import type { IMathSession, IProgressRecord, IProgressionRecord } from '../types/database';

describe('Phase 7: Parent Dashboard & Learning Analytics', () => {
  const sampleSessions: IMathSession[] = [
    {
      id: 's1',
      profileId: DEFAULT_PROFILE_ID,
      topicKey: 'counting_to_10',
      totalQuestions: 10,
      correctQuestions: 9,
      hintUsedCount: 1,
      durationSeconds: 45,
      timestamp: Date.now() - 1000 * 60 * 30, // 30 phút trước (hôm nay)
    },
    {
      id: 's2',
      profileId: DEFAULT_PROFILE_ID,
      topicKey: 'addition_within_10',
      totalQuestions: 10,
      correctQuestions: 8,
      hintUsedCount: 2,
      durationSeconds: 55,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 ngày trước
    },
    {
      id: 's3',
      profileId: DEFAULT_PROFILE_ID,
      topicKey: 'subtraction_within_10',
      totalQuestions: 10,
      correctQuestions: 6,
      hintUsedCount: 3,
      durationSeconds: 70,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 ngày trước
    },
    {
      id: 's4',
      profileId: DEFAULT_PROFILE_ID,
      topicKey: 'flat_shapes',
      totalQuestions: 5,
      correctQuestions: 5,
      hintUsedCount: 0,
      durationSeconds: 20,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 40, // 40 ngày trước
    },
  ];

  beforeEach(() => {
    screenTimeTracker.resetForTesting();
  });

  describe('1. Analytics Engine & Accuracy Calculation', () => {
    it('tính toán chính xác tổng thời gian, câu hỏi, câu đúng và tỷ lệ %', () => {
      const progressList: IProgressRecord[] = [
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
      ];

      const progression: IProgressionRecord = {
        profileId: DEFAULT_PROFILE_ID,
        level: 2,
        xp: 350,
        totalMissions: 2,
        totalCorrect: 28,
        achievements: [],
        updatedAt: Date.now(),
      };

      const overview = AnalyticsEngine.calculateOverview(sampleSessions, progressList, progression);

      // Tổng số câu: 10 + 10 + 10 + 5 = 35 câu
      expect(overview.totalQuestionsAnswered).toBe(35);
      // Số câu đúng: 9 + 8 + 6 + 5 = 28 câu
      expect(overview.totalCorrectAnswers).toBe(28);
      // Tỷ lệ đúng: (28 / 35) * 100 = 80%
      expect(overview.accuracyPercentage).toBe(80);
      expect(overview.totalMissionsCompleted).toBe(2);
      expect(overview.totalPlaytimeMinutes).toBeGreaterThanOrEqual(3);
    });

    it('an toàn khi danh sách phiên học rỗng (không chia cho 0)', () => {
      const overview = AnalyticsEngine.calculateOverview([], [], null);
      expect(overview.totalQuestionsAnswered).toBe(0);
      expect(overview.totalCorrectAnswers).toBe(0);
      expect(overview.accuracyPercentage).toBe(0);
      expect(overview.totalPlaytimeMinutes).toBe(0);
      expect(overview.curriculumProgressPercentage).toBe(0);
    });
  });

  describe('2. Timeframe Filtering (Hôm nay, 7 ngày, 30 ngày, Tất cả)', () => {
    it('lọc chính xác theo mốc thời gian', () => {
      // 1. All time
      const all = AnalyticsEngine.filterSessionsByTimeframe(sampleSessions, 'all_time');
      expect(all.length).toBe(4);

      // 2. Hôm nay (chỉ s1)
      const today = AnalyticsEngine.filterSessionsByTimeframe(sampleSessions, 'today');
      expect(today.length).toBe(1);
      expect(today[0].id).toBe('s1');

      // 3. 7 ngày (s1 và s2)
      const sevenDays = AnalyticsEngine.filterSessionsByTimeframe(sampleSessions, '7_days');
      expect(sevenDays.length).toBe(2);
      expect(sevenDays.map((s) => s.id)).toEqual(['s1', 's2']);

      // 4. 30 ngày (s1, s2, s3; không có s4 vì s4 là 40 ngày trước)
      const thirtyDays = AnalyticsEngine.filterSessionsByTimeframe(sampleSessions, '30_days');
      expect(thirtyDays.length).toBe(3);
      expect(thirtyDays.map((s) => s.id)).toEqual(['s1', 's2', 's3']);
    });
  });

  describe('3. Topic Breakdown & Positive Diagnostics', () => {
    it('thống kê đầy đủ các mạch chủ đề chuẩn GDPT 2018', () => {
      const breakdown = AnalyticsEngine.calculateTopicBreakdown(sampleSessions);
      expect(breakdown.length).toBe(Object.keys(TOPIC_META_MAP).length);

      const countingTopic = breakdown.find((t) => t.topicKey === 'counting_to_10');
      expect(countingTopic).toBeDefined();
      expect(countingTopic?.totalQuestions).toBe(10);
      expect(countingTopic?.correctQuestions).toBe(9);
      expect(countingTopic?.accuracy).toBe(90);
      expect(countingTopic?.status).toBe('mastered'); // >= 80%
    });

    it('tuyệt đối KHÔNG sử dụng từ ngữ tiêu cực (kém, yếu, dốt) trong nhận xét sư phạm', () => {
      const breakdown = AnalyticsEngine.calculateTopicBreakdown(sampleSessions);
      const diagnostics = AnalyticsEngine.generatePositiveDiagnostics(breakdown, sampleSessions);

      const allText = [
        ...diagnostics.strengths,
        ...diagnostics.needsPractice,
        diagnostics.speedFeedback,
        diagnostics.hintTendency,
        diagnostics.progressTrend,
      ].join(' ');

      // Kiểm tra danh sách từ cấm
      const forbiddenWords = ['kém', 'yếu', 'dốt', 'thấp kém', 'hỏng', 'tệ'];
      forbiddenWords.forEach((word) => {
        expect(allText.toLowerCase()).not.toContain(word);
      });

      // Kiểm tra có lời khen và lời động viên rèn luyện thêm
      expect(diagnostics.strengths.length).toBeGreaterThan(0);
      expect(diagnostics.needsPractice.length).toBeGreaterThan(0);
      expect(diagnostics.needsPractice[0]).toContain('đang rèn luyện thêm');
    });
  });

  describe('4. Screen Time Tracker & Health Management', () => {
    it('không giới hạn nếu tắt cấu hình (isLimitEnabled = false)', () => {
      screenTimeTracker.setConfig({
        isLimitEnabled: false,
        dailyLimitMinutes: 15,
      });

      expect(screenTimeTracker.isLimitReached()).toBe(false);
    });

    it('cho phép phụ huynh cấp thêm thời gian khi cần', () => {
      screenTimeTracker.setConfig({
        isLimitEnabled: true,
        dailyLimitMinutes: 20,
      });

      // Cấp thêm 15 phút
      screenTimeTracker.grantExtraMinutes(15);
      const config = screenTimeTracker.getConfig();
      expect(config.dailyLimitMinutes).toBe(20);
      // Đã cấp thêm thì không vượt ngưỡng
      expect(screenTimeTracker.isLimitReached()).toBe(false);
    });
  });

  describe('5. Database Parent Settings & Backup/Restore', () => {
    it('lấy và cập nhật cấu hình phụ huynh trong IndexedDB', async () => {
      const settings = await getParentSettings(DEFAULT_PROFILE_ID);
      expect(settings).toBeDefined();
      expect(settings.dailyLimitMinutes).toBeGreaterThan(0);
      expect(settings.contentConfig?.enabledTopics.length).toBeGreaterThan(0);

      // Cập nhật giới hạn thời gian
      await updateParentSettings(DEFAULT_PROFILE_ID, { dailyLimitMinutes: 30 });
      const updated = await getParentSettings(DEFAULT_PROFILE_ID);
      expect(updated.dailyLimitMinutes).toBe(30);
    });

    it('xuất và khôi phục dữ liệu sao lưu JSON an toàn', async () => {
      const backupJson = await exportBackupData(DEFAULT_PROFILE_ID);
      expect(typeof backupJson).toBe('string');

      const parsed = JSON.parse(backupJson);
      expect(parsed.appId).toBe('ronie-nhi-mami-math');
      expect(parsed.data).toBeDefined();
      expect(parsed.profileId).toBe(DEFAULT_PROFILE_ID);

      // Khôi phục từ chính bản sao lưu
      const restoreResult = await importBackupData(backupJson, DEFAULT_PROFILE_ID);
      expect(restoreResult.success).toBe(true);

      // Thử nạp file giả mạo hoặc hỏng
      const fakeResult = await importBackupData(JSON.stringify({ appId: 'fake_app' }));
      expect(fakeResult.success).toBe(false);
      expect(fakeResult.error).toBe('INVALID_APP_ID');
    });
  });
});
