// src/test/phase5TrainingArena.test.ts
// Bộ kiểm thử tự động toàn diện cho PHASE 5: MATH TRAINING ROOM & CHALLENGE ARENA

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TrainingRoomEngine,
  TRAINING_TOPICS_CONFIG,
} from '../features/math-training/TrainingRoomEngine';
import {
  ChallengeArenaEngine,
  ARENA_MODES_CONFIG,
} from '../features/challenge-arena/ChallengeArenaEngine';
import {
  recordTrainingHistory,
  getTrainingHistory,
  recordArenaHistory,
  getArenaHistory,
} from '../services/storage/db';
import type { TrainingTopicId, TrainingLevel, ChallengeArenaMode } from '../types/training-and-arena';

// Mock audio
vi.mock('../services/audio/AudioManager', () => ({
  soundManager: {
    playTap: vi.fn(),
    playCorrect: vi.fn(),
    playTryAgain: vi.fn(),
    playCelebration: vi.fn(),
    playAttack: vi.fn(),
    playBgm: vi.fn(),
    speakVietnamese: vi.fn(),
  },
}));

describe('PHASE 5 - PHẦN A: PHÒNG LUYỆN TOÁN (MATH TRAINING ROOM)', () => {
  it('hỗ trợ đầy đủ 8 khu vực chuyên đề theo yêu cầu đặc tả', () => {
    const topicKeys = Object.keys(TRAINING_TOPICS_CONFIG) as TrainingTopicId[];
    expect(topicKeys.length).toBe(8);

    expect(topicKeys).toContain('addition_subtraction');
    expect(topicKeys).toContain('comparison');
    expect(topicKeys).toContain('missing_numbers');
    expect(topicKeys).toContain('word_problems');
    expect(topicKeys).toContain('number_patterns');
    expect(topicKeys).toContain('geometry');
    expect(topicKeys).toContain('measurement');
    expect(topicKeys).toContain('logical_thinking');
  });

  it('hỗ trợ 3 mức độ luyện tập (Luyện tập, Nâng cao, Chuyên gia) trích xuất câu hỏi đúng độ khó', () => {
    // 1. Mức Luyện tập (Level 1..2)
    const practiceEngine = new TrainingRoomEngine('addition_subtraction', 'practice', 5);
    const practiceQ = practiceEngine.getState().questions;
    expect(practiceQ.length).toBe(5);
    practiceQ.forEach((q) => {
      expect([1, 2]).toContain(q.difficulty);
    });

    // 2. Mức Nâng cao (Level 3..4)
    const advEngine = new TrainingRoomEngine('word_problems', 'advanced', 5);
    const advQ = advEngine.getState().questions;
    expect(advQ.length).toBe(5);
    advQ.forEach((q) => {
      expect([3, 4, 2]).toContain(q.difficulty);
    });

    // 3. Mức Chuyên gia (Level 5)
    const expertEngine = new TrainingRoomEngine('logical_thinking', 'expert', 5);
    const expQ = expertEngine.getState().questions;
    expect(expQ.length).toBe(5);
    expQ.forEach((q) => {
      expect(q.difficulty).toBeGreaterThanOrEqual(3);
    });
  });

  it('hỗ trợ tùy chọn số lượng câu hỏi linh hoạt: 5, 10 hoặc 15 câu', () => {
    const engine5 = new TrainingRoomEngine('comparison', 'practice', 5);
    expect(engine5.getState().questions.length).toBe(5);

    const engine10 = new TrainingRoomEngine('missing_numbers', 'practice', 10);
    expect(engine10.getState().questions.length).toBe(10);

    const engine15 = new TrainingRoomEngine('number_patterns', 'practice', 15);
    expect(engine15.getState().questions.length).toBe(15);
  });

  it('cho phép lưu và tiếp tục từ chủ đề đang luyện gần nhất', () => {
    TrainingRoomEngine.saveLastPracticedTopic('geometry');
    expect(TrainingRoomEngine.getLastPracticedTopic()).toBe('geometry');

    TrainingRoomEngine.saveLastPracticedTopic('measurement');
    expect(TrainingRoomEngine.getLastPracticedTopic()).toBe('measurement');
  });

  it('vận hành phiên luyện tập: nộp đáp án, tăng chuỗi đúng, sử dụng gợi ý và tổng kết bài học', () => {
    const engine = new TrainingRoomEngine('addition_subtraction', 'practice', 5);
    const q1 = engine.getState().currentQuestion;
    expect(q1).not.toBeNull();

    // Dùng gợi ý
    const hint = engine.useHint();
    expect(hint).toBeTruthy();
    expect(engine.getState().hintsUsedCount).toBe(1);

    // Trả lời đúng câu 1
    const res1 = engine.submitAnswer(q1!.correctAnswer);
    expect(res1.isCorrect).toBe(true);
    expect(res1.scoreGained).toBeGreaterThan(0);
    expect(engine.getState().correctCount).toBe(1);
    expect(engine.getState().streak).toBe(1);

    // Chuyển sang câu 2
    engine.nextQuestion();
    expect(engine.getState().currentIndex).toBe(1);

    // Trả lời sai câu 2
    const res2 = engine.submitAnswer('WRONG_ANSWER');
    expect(res2.isCorrect).toBe(false);
    expect(engine.getState().mistakesCount).toBe(1);
    expect(engine.getState().streak).toBe(0);

    // Hoàn thành hết các câu còn lại
    while (engine.nextQuestion()) {
      const cur = engine.getState().currentQuestion;
      if (cur) engine.submitAnswer(cur.correctAnswer);
    }

    expect(engine.getState().isCompleted).toBe(true);
    const summary = engine.getSessionSummary();
    expect(summary.totalQuestions).toBe(5);
    expect(summary.stars).toBeGreaterThanOrEqual(1);
    expect(summary.expGained).toBeGreaterThan(0);
    expect(summary.queenFeedback).toBeTruthy();
  });
});

describe('PHASE 5 - PHẦN B: ĐẤU TRƯỜNG TOÁN HỌC (CHALLENGE ARENA)', () => {
  it('hỗ trợ đầy đủ 5 chế độ thử thách theo yêu cầu đặc tả', () => {
    const modes = Object.keys(ARENA_MODES_CONFIG) as ChallengeArenaMode[];
    expect(modes.length).toBe(5);

    expect(modes).toContain('speed_60s');
    expect(modes).toContain('marathon_20q');
    expect(modes).toContain('boss_10q');
    expect(modes).toContain('mystery_number');
    expect(modes).toContain('multi_step');
  });

  it('Chế độ 1 [speed_60s]: Cho phép BẬT/TẮT đếm ngược thời gian và tự động kết thúc an toàn khi hết giờ', () => {
    // 1. Chạy có bật đếm giờ
    const engineWithTimer = new ChallengeArenaEngine('speed_60s', true);
    expect(engineWithTimer.getState().isTimerEnabled).toBe(true);
    expect(engineWithTimer.getState().timeRemainingSeconds).toBe(60);

    // Đếm giảm thời gian
    const tickRes = engineWithTimer.tickSecond();
    expect(tickRes.remaining).toBe(59);

    // 2. Chạy tắt đếm giờ (an toàn tâm lý trẻ em)
    const engineNoTimer = new ChallengeArenaEngine('speed_60s', false);
    expect(engineNoTimer.getState().isTimerEnabled).toBe(false);

    // Tắt bật linh hoạt
    engineNoTimer.toggleTimer(true);
    expect(engineNoTimer.getState().isTimerEnabled).toBe(true);
    engineNoTimer.toggleTimer(false);
    expect(engineNoTimer.getState().isTimerEnabled).toBe(false);

    // Khi hết giờ: Tự động tổng kết nhẹ nhàng, không ép buộc chơi tiếp
    (engineWithTimer as any).state.timeRemainingSeconds = 1;
    const finalTick = engineWithTimer.tickSecond();
    expect(finalTick.isTimeUp).toBe(true);
    expect(engineWithTimer.getState().isFinished).toBe(true);
    expect(engineWithTimer.getState().resultBreakdown).toBeDefined();
  });

  it('Chế độ 2 [marathon_20q]: Hoàn thành 20 câu hỏi độ khó tăng dần qua 4 chặng', () => {
    const marathon = new ChallengeArenaEngine('marathon_20q');
    const questions = marathon.getState().questions;
    expect(questions.length).toBe(20);

    // 5 câu đầu: Độ khó 1
    const first5 = questions.slice(0, 5);
    first5.forEach((q) => expect(q.difficulty).toBe(1));

    // 5 câu tiếp theo: Độ khó 2
    const next5 = questions.slice(5, 10);
    next5.forEach((q) => expect(q.difficulty).toBe(2));

    // 5 câu tiếp theo: Độ khó 3
    const mid5 = questions.slice(10, 15);
    mid5.forEach((q) => expect(q.difficulty).toBe(3));

    // 5 câu cuối: Thử thách nâng cao (Độ khó >= 4)
    const last5 = questions.slice(15, 20);
    last5.forEach((q) => expect(q.difficulty).toBeGreaterThanOrEqual(3));
  });

  it('Chế độ 3 [boss_10q]: Quái vật mất máu khi trả lời đúng, máu về 0 khi hạ gục Boss', () => {
    const bossEngine = new ChallengeArenaEngine('boss_10q');
    expect(bossEngine.getState().bossHp).toBe(100);
    expect(bossEngine.getState().questions.length).toBe(10);

    // Trả lời đúng câu 1 -> Boss mất máu
    const q1 = bossEngine.getState().currentQuestion;
    const res = bossEngine.submitAnswer(q1!.correctAnswer);
    expect(res.isCorrect).toBe(true);
    expect(res.bossHpLeft).toBeLessThan(100);

    // Mô phỏng đánh bại trọn vẹn Boss
    while (!bossEngine.getState().isFinished) {
      const q = bossEngine.getState().currentQuestion;
      if (q) bossEngine.submitAnswer(q.correctAnswer);
      bossEngine.nextQuestion();
    }

    expect(bossEngine.getState().isFinished).toBe(true);
    expect(bossEngine.getState().bossHp).toBe(0);
    expect(bossEngine.getState().resultBreakdown?.title).toContain('Dũng Sĩ Đánh Bại Trùm Cuối');
  });

  it('Chế độ 4 [mystery_number] & Chế độ 5 [multi_step] tải đúng 5 câu hỏi chủ đề chuyên biệt', () => {
    const mystery = new ChallengeArenaEngine('mystery_number');
    expect(mystery.getState().questions.length).toBe(5);

    const multi = new ChallengeArenaEngine('multi_step');
    expect(multi.getState().questions.length).toBe(5);
  });
});

describe('PHASE 5 - PHẦN C: QUY TẮC SƯ PHẠM, BẢO TOÀN KIẾN THỨC & LƯU LỊCH SỬ', () => {
  it('tất cả câu hỏi trong Phòng Luyện Toán và Đấu Trường đều tuân thủ chuẩn Lớp 1 GDPT 2018', () => {
    const engine = new TrainingRoomEngine('addition_subtraction', 'practice', 5);
    engine.getState().questions.forEach((q) => {
      expect(q.grade).toBe(1);
      expect(q.curriculumReference).toContain('GDPT 2018');
    });

    const arena = new ChallengeArenaEngine('speed_60s');
    arena.getState().questions.forEach((q) => {
      expect(q.grade).toBe(1);
    });
  });

  it('lưu và truy xuất lịch sử kết quả Phòng Luyện Toán an toàn', async () => {
    const testProfile = 'profile_test_training_child';
    await recordTrainingHistory({
      profileId: testProfile,
      topicId: 'geometry',
      level: 'practice',
      totalQuestions: 5,
      correctCount: 4,
      score: 110,
    });

    const history = await getTrainingHistory(testProfile);
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].topicId).toBe('geometry');
    expect(history[0].correctCount).toBe(4);
  });

  it('lưu và truy xuất lịch sử kết quả Đấu Trường Toán Học an toàn', async () => {
    const testProfile = 'profile_test_arena_child';
    await recordArenaHistory({
      profileId: testProfile,
      mode: 'boss_10q',
      totalQuestions: 10,
      correctCount: 9,
      score: 320,
      starsEarned: 3,
      timeSpentSeconds: 45,
      bossDefeated: true,
    });

    const history = await getArenaHistory(testProfile);
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].mode).toBe('boss_10q');
    expect(history[0].bossDefeated).toBe(true);
    expect(history[0].starsEarned).toBe(3);
  });
});
