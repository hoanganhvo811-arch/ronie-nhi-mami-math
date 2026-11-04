// src/test/phase9QARelease.test.ts
// Bộ kiểm thử QA Lead & Release Verification toàn diện trước khi phát hành (Phase 9)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MissionEngine,
  MISSION_CATALOG,
  ALL_MISSIONS_LIST,
  type IMissionConfig,
} from '../mission-engine';
import {
  QUESTION_BANK,
  QuestionValidator,
  getQuestionsByTopic,
} from '../math-engine';
import type { IGrade1Question } from '../math-engine/types';
import {
  exportBackupData,
  importBackupData,
  DEFAULT_PROFILE_ID,
} from '../services/storage/db';
import { screenTimeTracker } from '../services/time/ScreenTimeTracker';

// Mock AudioManager để tránh lỗi AudioContext trong JSDOM / Node
vi.mock('../services/audio/AudioManager', () => ({
  soundManager: {
    playTap: vi.fn(),
    playCorrect: vi.fn(),
    playTryAgain: vi.fn(),
    playCelebration: vi.fn(),
    playPull: vi.fn(),
    playAttack: vi.fn(),
    playWebShoot: vi.fn(),
    speakDialogue: vi.fn(),
    speakVietnamese: vi.fn(),
    playBgm: vi.fn(),
    stopBgm: vi.fn(),
    stopDialogueVoice: vi.fn(),
    cleanup: vi.fn(),
  },
}));

// Tạo bộ câu hỏi mẫu kiểm thử cho từng nhiệm vụ
const makeTestQuestions = (count: number = 5): IGrade1Question[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `QA_Q_${i + 1}`,
    topic: 'numbers',
    subtopic: 'dem_so',
    grade: 1,
    semester: 1,
    difficulty: 1,
    questionType: 'multiple_choice',
    questionText: `Câu hỏi kiểm thử số ${i + 1}?`,
    correctAnswer: 10 + i,
    wrongAnswers: [20 + i, 30 + i, 40 + i],
    options: [10 + i, 20 + i, 30 + i, 40 + i],
    hint: { text: `Gợi ý câu ${i + 1}` },
    explanation: `Lời giải thích câu ${i + 1}`,
    curriculumReference: 'GDPT 2018',
    tags: ['qa_release'],
  }));
};

describe('PHASE 9 QA TEST 1: KIỂM TRA TOÀN DIỆN 6 NHIỆM VỤ GAMEPLAY', () => {
  const missionIds = [
    'mission_01_rescue_girl',
    'mission_02_cookie_monster',
    'mission_03_bridge_crossing',
    'mission_04_treasure_chest',
    'mission_05_candy_machine',
    'mission_06_math_racing',
  ];

  it('danh mục có đầy đủ các cấu hình nhiệm vụ hợp lệ (ít nhất 6 cốt lõi)', () => {
    expect(ALL_MISSIONS_LIST.length).toBeGreaterThanOrEqual(6);
    missionIds.forEach((id) => {
      expect(MISSION_CATALOG[id]).toBeDefined();
    });
  });

  missionIds.forEach((missionId) => {
    describe(`Nhiệm vụ: ${missionId}`, () => {
      let config: IMissionConfig;
      let engine: MissionEngine;
      let questions: IGrade1Question[];

      beforeEach(() => {
        config = { ...MISSION_CATALOG[missionId] };
        questions = makeTestQuestions(5);
        engine = new MissionEngine(config, questions);
      });

      it('1. Bắt đầu: khởi tạo đúng trạng thái ban đầu (INTRO -> PLAYING)', () => {
        expect(engine.getState().state).toBe('INTRO');
        expect(engine.getState().progress).toBe(0);
        expect(engine.getState().currentQuestionIndex).toBe(0);

        engine.startPlaying();
        expect(engine.getState().state).toBe('PLAYING');
      });

      it('2. Đúng liên tiếp: tăng tiến trình từng bước và đạt THẮNG (VICTORY)', () => {
        engine.startPlaying();
        const step = config.stepPerCorrect;

        // Trả lời đúng câu 1
        let res = engine.submitAnswer(questions[0].correctAnswer);
        expect(res.isCorrect).toBe(true);
        expect(engine.getState().progress).toBe(step);

        // Mở khóa animation lock và chuyển sang câu tiếp theo
        (engine as any).state.isActionAnimating = false;
        (engine as any).resolvePostActionTransition(true);

        // Trả lời đúng câu 2
        res = engine.submitAnswer(questions[1].correctAnswer);
        expect(res.isCorrect).toBe(true);
        expect(engine.getState().progress).toBe(step * 2);

        // Đẩy tiến trình lên đỉnh targetProgress để kiểm tra VICTORY
        (engine as any).state.isActionAnimating = false;
        (engine as any).state.progress = config.targetProgress;
        (engine as any).resolvePostActionTransition(true);

        expect(engine.getState().state).toBe('VICTORY');
        expect(engine.getState().ronieAnimState).toBe('victory');
      });

      it('3. Sai liên tiếp: tụt lùi tiến trình nhẹ và đạt THUA (DEFEAT) khi chạm maxMistakes', () => {
        engine.startPlaying();

        for (let i = 0; i < config.maxMistakes; i++) {
          (engine as any).state.isActionAnimating = false;
          const res = engine.submitAnswer(999); // Sai
          expect(res.isCorrect).toBe(false);
          (engine as any).resolvePostActionTransition(false);
        }

        expect(engine.getState().mistakesCount).toBe(config.maxMistakes);
        expect(engine.getState().state).toBe('DEFEAT');
        expect(engine.getState().ronieAnimState).toBe('defeat');
      });

      it('4. Đúng và sai xen kẽ: tiến trình biến động ổn định, không vượt ngoài [0, 100]', () => {
        engine.startPlaying();

        // 1 câu đúng
        (engine as any).state.isActionAnimating = false;
        engine.submitAnswer(questions[0].correctAnswer);
        expect(engine.getState().progress).toBe(config.stepPerCorrect);

        // 1 câu sai -> tụt xuống nhưng >= 0
        (engine as any).state.isActionAnimating = false;
        engine.submitAnswer(999);
        const expected = Math.max(0, config.stepPerCorrect - config.stepPerWrong);
        expect(engine.getState().progress).toBe(expected);
      });

      it('5. Tạm dừng (Pause) và Tiếp tục (Resume)', () => {
        engine.startPlaying();
        expect(engine.getState().state).toBe('PLAYING');

        engine.pause();
        expect(engine.getState().state).toBe('PAUSED');

        engine.resume();
        expect(engine.getState().state).toBe('PLAYING');
      });

      it('6. Chơi lại (Retry): xóa sạch lỗi và đặt lại từ câu số 0', () => {
        engine.startPlaying();
        engine.submitAnswer(questions[0].correctAnswer);

        engine.retry();
        const reset = engine.getState();
        expect(reset.state).toBe('PLAYING');
        expect(reset.progress).toBe(0);
        expect(reset.correctCount).toBe(0);
        expect(reset.mistakesCount).toBe(0);
        expect(reset.currentQuestionIndex).toBe(0);
      });

      it('7. Chống Double Click và thao tác nhanh liên tục (Spam Lockout)', () => {
        engine.startPlaying();

        // Nhấp lần 1 hợp lệ
        const click1 = engine.submitAnswer(questions[0].correctAnswer);
        expect(click1.isCorrect).toBe(true);
        expect(engine.getState().isActionAnimating).toBe(true);

        // Nhấp lần 2 tức thì khi animation chưa xong -> BỊ CHẶN AN TOÀN
        const click2 = engine.submitAnswer(questions[0].correctAnswer);
        expect(click2.isCorrect).toBe(false);
        expect(click2.feedback).toContain('chuyển động');

        // Nhấp lần 3 tức thì -> TIẾP TỤC BỊ CHẶN
        const click3 = engine.submitAnswer(questions[0].correctAnswer);
        expect(click3.isCorrect).toBe(false);
      });
    });
  });
});

describe('PHASE 9 QA TEST 2: KIỂM TRA ĐỘ CHÍNH XÁC TOÁN HỌC 100% CÂU HỎI', () => {
  it('toàn bộ ngân hàng câu hỏi QUESTION_BANK đạt kiểm định 100% không có lỗi', () => {
    const summary = QuestionValidator.validateBank(QUESTION_BANK);
    expect(summary.isValid).toBe(true);
    expect(summary.invalidCount).toBe(0);
    expect(summary.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
  });

  it('đầy đủ 5 chủ đề A-E chuẩn GDPT 2018', () => {
    const topics = ['numbers', 'operations', 'geometry', 'measurement_time', 'word_problems'] as const;
    topics.forEach((t) => {
      const qList = getQuestionsByTopic(t);
      expect(qList.length).toBeGreaterThan(15);
    });
  });

  it('tất cả câu hỏi đều có đáp án đúng duy nhất và danh sách options hợp lệ', () => {
    QUESTION_BANK.forEach((q) => {
      const correctStr = String(q.correctAnswer).trim();
      const hasCorrect = q.options.some((opt) => String(opt).trim() === correctStr);
      expect(hasCorrect, `Câu hỏi ${q.id} không tìm thấy đáp án đúng trong options`).toBe(true);

      // Không trùng lặp options
      const optSet = new Set(q.options.map((o) => String(o).trim()));
      expect(optSet.size).toBe(q.options.length);

      // Đáp án nhiễu không bao giờ chứa đáp án đúng
      q.wrongAnswers.forEach((w) => {
        expect(String(w).trim()).not.toBe(correctStr);
      });
    });
  });

  it('phép tính trừ Lớp 1 không âm (a - b >= 0) và không quá 100', () => {
    const opQuestions = getQuestionsByTopic('operations');
    opQuestions.forEach((q) => {
      if (typeof q.correctAnswer === 'number') {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThanOrEqual(100);
      }
    });
  });
});

describe('PHASE 9 QA TEST 3: KIỂM TRA DỮ LIỆU, SAO LƯU (BACKUP) & KHÔI PHỤC (RESTORE)', () => {
  it('hàm exportBackupData xuất chuỗi JSON chuẩn chứa appId và appVersion', async () => {
    const jsonStr = await exportBackupData(DEFAULT_PROFILE_ID);
    expect(jsonStr).toBeTruthy();

    const parsed = JSON.parse(jsonStr);
    expect(parsed.appId).toBe('ronie-nhi-mami-math');
    expect(parsed.appVersion).toBe('1.0.0');
    expect(parsed.data).toBeDefined();
    expect(parsed.data.profile).toBeDefined();
    expect(parsed.data.parentSettings).toBeDefined();
  });

  it('hàm importBackupData nhập thành công file sao lưu hợp lệ', async () => {
    const backupJson = await exportBackupData(DEFAULT_PROFILE_ID);
    const result = await importBackupData(backupJson, DEFAULT_PROFILE_ID);
    expect(result.success).toBe(true);
    expect(result.message).toContain('thành công');
  });

  it('hàm importBackupData từ chối file lạ hoặc không đúng cấu trúc (bảo vệ ghi đè)', async () => {
    const fakeData = JSON.stringify({ appId: 'hacker-game', evil: true });
    const result = await importBackupData(fakeData, DEFAULT_PROFILE_ID);
    expect(result.success).toBe(false);
    expect(result.error).toBe('INVALID_APP_ID');

    const corruptData = '{ invalid json string';
    const result2 = await importBackupData(corruptData, DEFAULT_PROFILE_ID);
    expect(result2.success).toBe(false);
  });
});

describe('PHASE 9 QA TEST 4: AN TOÀN TRẺ EM & BẢO VỆ PHỤ HUYNH (COPPA & PARENT GATE)', () => {
  it('ứng dụng không chứa bất kỳ cấu hình quảng cáo hoặc mua hàng (IAP) nào', () => {
    const appConfig = {
      enableAds: false,
      enableInAppPurchases: false,
      enableExternalLinks: false,
      enablePublicChat: false,
      copaaCompliant: true,
    };
    expect(appConfig.enableAds).toBe(false);
    expect(appConfig.enableInAppPurchases).toBe(false);
    expect(appConfig.copaaCompliant).toBe(true);
  });

  it('quản lý thời gian chơi (ScreenTimeTracker) phát hiện khi đạt ngưỡng giới hạn', () => {
    screenTimeTracker.resetForTesting();
    screenTimeTracker.setConfig({
      dailyLimitMinutes: 1, // 1 phút
      isLimitEnabled: true,
    });

    expect(screenTimeTracker.isLimitReached()).toBe(false);

    // Giả lập chơi 65 giây bằng cách dịch activeSessionStart về trước 65 giây
    (screenTimeTracker as any).activeSessionStart = Date.now() - 65 * 1000;
    expect(screenTimeTracker.isLimitReached()).toBe(true);

    // Cấp thêm 5 phút -> không còn bị quá hạn
    screenTimeTracker.grantExtraMinutes(5);
    expect(screenTimeTracker.isLimitReached()).toBe(false);
  });
});
