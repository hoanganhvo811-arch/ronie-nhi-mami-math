// src/test/adaptiveDifficultyEngine.test.ts
// Kiểm thử tự động Hệ thống Điều chỉnh Độ khó Thích ứng (Phase 2 - Adaptive Difficulty Engine)

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AdaptiveDifficultyEngine,
  AdaptiveStorageService,
  type IQuestionAttemptRecord,
  type MasteryLevel,
} from '../math-engine/adaptive';

describe('PHASE 2: ADAPTIVE DIFFICULTY ENGINE', () => {
  let engine: AdaptiveDifficultyEngine;

  beforeEach(() => {
    engine = new AdaptiveDifficultyEngine('profile_test_ronie', 'story');
  });

  // 1. KIỂM TRA BÉ LÀM ĐÚNG LIÊN TỤC 5 CÂU KHÔNG CẦN GỢI Ý
  it('1. Tăng độ khó 1 mức khi bé trả lời đúng 5 câu liên tiếp KHÔNG dùng gợi ý', () => {
    const comp = engine.getOrCreateTopicCompetence('addition');
    expect(comp.currentDifficulty).toBe(1);

    // 4 câu đúng đầu tiên -> vẫn duy trì độ khó 1
    for (let i = 1; i <= 4; i++) {
      const evalRes = engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: `Q_ADD_00${i}`,
        topic: 'addition',
        difficulty: 1,
        isCorrect: true,
        hintsUsed: 0,
        responseTimeMs: 8000,
        attemptsCount: 1,
        timestamp: Date.now() + i * 1000,
        gameMode: 'story',
      });
      expect(evalRes.adjustment).toBe('MAINTAIN');
      expect(evalRes.newDifficulty).toBe(1);
    }

    // Câu thứ 5 đúng không dùng gợi ý -> Tăng lên độ khó 2
    const fifthEval = engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_ADD_005',
      topic: 'addition',
      difficulty: 1,
      isCorrect: true,
      hintsUsed: 0,
      responseTimeMs: 7000,
      attemptsCount: 1,
      timestamp: Date.now() + 5000,
      gameMode: 'story',
    });

    expect(fifthEval.adjustment).toBe('UP');
    expect(fifthEval.newDifficulty).toBe(2);
    expect(fifthEval.reason).toContain('đúng liên tiếp 5 câu');

    // Kiểm tra độ khó của chủ đề đã cập nhật lên 2
    const updatedComp = engine.getOrCreateTopicCompetence('addition');
    expect(updatedComp.currentDifficulty).toBe(2);
  });

  // 2. KIỂM TRA BÉ DÙNG GỢI Ý THÌ KHÔNG THĂNG HẠNG TỰ ĐỘNG
  it('2. Không tăng độ khó nếu bé làm đúng nhưng có sử dụng gợi ý (yêu cầu tự chủ)', () => {
    const comp = engine.getOrCreateTopicCompetence('subtraction');
    expect(comp.currentDifficulty).toBe(1);

    // 4 câu đúng không gợi ý
    for (let i = 1; i <= 4; i++) {
      engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: `Q_SUB_00${i}`,
        topic: 'subtraction',
        difficulty: 1,
        isCorrect: true,
        hintsUsed: 0,
        responseTimeMs: 9000,
        attemptsCount: 1,
        timestamp: Date.now() + i * 1000,
        gameMode: 'story',
      });
    }

    // Câu thứ 5 đúng nhưng bé dùng 1 gợi ý
    const fifthEval = engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_SUB_005',
      topic: 'subtraction',
      difficulty: 1,
      isCorrect: true,
      hintsUsed: 1, // Bé dùng gợi ý
      responseTimeMs: 12000,
      attemptsCount: 1,
      timestamp: Date.now() + 5000,
      gameMode: 'story',
    });

    // Không được tăng độ khó vì có dùng gợi ý
    expect(fifthEval.adjustment).toBe('MAINTAIN');
    expect(fifthEval.newDifficulty).toBe(1);
  });

  // 3. KIỂM TRA BÉ LÀM SAI LIÊN TỤC 2 CÂU
  it('3. Giảm độ khó 1 mức và bật hỗ trợ trực quan khi bé trả lời sai 2 câu liên tiếp', () => {
    // Cho bé bắt đầu ở độ khó 3
    const comp = engine.getOrCreateTopicCompetence('missing_numbers');
    comp.currentDifficulty = 3;

    // Câu 1 sai
    const firstWrong = engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_MIS_001',
      topic: 'missing_numbers',
      difficulty: 3,
      isCorrect: false,
      hintsUsed: 0,
      responseTimeMs: 15000,
      attemptsCount: 2,
      timestamp: Date.now(),
      gameMode: 'story',
    });
    expect(firstWrong.adjustment).toBe('MAINTAIN');
    expect(firstWrong.newDifficulty).toBe(3);

    // Câu 2 sai tiếp
    const secondWrong = engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_MIS_002',
      topic: 'missing_numbers',
      difficulty: 3,
      isCorrect: false,
      hintsUsed: 1,
      responseTimeMs: 20000,
      attemptsCount: 3,
      timestamp: Date.now() + 2000,
      gameMode: 'story',
    });

    expect(secondWrong.adjustment).toBe('DOWN');
    expect(secondWrong.newDifficulty).toBe(2);
    expect(secondWrong.needsVisualSupport).toBe(true);
    expect(secondWrong.reason).toContain('Level 2');
  });

  // 4. KIỂM TRA ĐỘ KHÓ KHÔNG GIẢM DƯỚI 1 VÀ KHÔNG VƯỢT QUÁ 5
  it('4. Độ khó được chặn cận an toàn: Tối thiểu là 1 và Tối đa là 5 (không thay đổi bất thường)', () => {
    const comp = engine.getOrCreateTopicCompetence('geometry');
    comp.currentDifficulty = 1;

    // Sai 2 câu liên tiếp khi đang ở Level 1
    engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_GEO_001',
      topic: 'geometry',
      difficulty: 1,
      isCorrect: false,
      hintsUsed: 0,
      responseTimeMs: 10000,
      attemptsCount: 1,
      timestamp: Date.now(),
      gameMode: 'story',
    });
    const resUnderflow = engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_GEO_002',
      topic: 'geometry',
      difficulty: 1,
      isCorrect: false,
      hintsUsed: 0,
      responseTimeMs: 10000,
      attemptsCount: 1,
      timestamp: Date.now() + 1000,
      gameMode: 'story',
    });

    expect(resUnderflow.newDifficulty).toBe(1); // Không bao giờ tụt xuống 0

    // Đặt độ khó lên tối đa 5
    comp.currentDifficulty = 5;
    // Đúng 5 câu liên tiếp
    for (let i = 1; i <= 5; i++) {
      engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: `Q_GEO_00${i + 2}`,
        topic: 'geometry',
        difficulty: 5,
        isCorrect: true,
        hintsUsed: 0,
        responseTimeMs: 8000,
        attemptsCount: 1,
        timestamp: Date.now() + i * 2000,
        gameMode: 'story',
      });
    }

    expect(comp.currentDifficulty).toBe(5); // Không bao giờ vượt quá 5
  });

  // 5. NGUYÊN TẮC SƯ PHẠM: KHÔNG PHẠT VÌ BÉ LÀM CHẬM
  it('5. Trả lời đúng nhưng thời gian lâu (60s) vẫn được công nhận đầy đủ và không bị phạt độ khó', () => {
    const comp = engine.getOrCreateTopicCompetence('word_problems');

    const slowCorrect = engine.recordAttempt({
      profileId: 'profile_test_ronie',
      questionId: 'Q_WRD_001',
      topic: 'word_problems',
      difficulty: 1,
      isCorrect: true,
      hintsUsed: 0,
      responseTimeMs: 65000, // 65 giây (bé suy nghĩ kỹ hoặc đếm ngón tay)
      attemptsCount: 1,
      timestamp: Date.now(),
      gameMode: 'story',
    });

    expect(slowCorrect.adjustment).not.toBe('DOWN');
    expect(comp.correctCount).toBe(1);
    expect(comp.averageResponseTimeMs).toBe(65000);
    // Điểm mastery vẫn tăng trưởng dương
    expect(slowCorrect.masteryScore).toBeGreaterThan(0);
  });

  // 6. TÍNH ĐỘC LẬP GIỮA CÁC CHỦ ĐỀ & ƯU TIÊN CHỦ ĐỀ YẾU
  it('6. Năng lực độc lập theo từng chủ đề; Tự động ưu tiên chủ đề bé đang yếu', () => {
    // Chủ đề 1: addition -> bé rất giỏi (đúng nhiều câu)
    for (let i = 1; i <= 6; i++) {
      engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: `ADV_ADD_00${i}`,
        topic: 'addition',
        difficulty: (Math.min(3, Math.floor(i / 2) + 1)) as any,
        isCorrect: true,
        hintsUsed: 0,
        responseTimeMs: 5000,
        attemptsCount: 1,
        timestamp: Date.now() + i * 1000,
        gameMode: 'story',
      });
    }

    // Chủ đề 2: missing_numbers -> bé gặp khó khăn (sai nhiều câu)
    for (let i = 1; i <= 4; i++) {
      engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: `ADV_MIS_00${i}`,
        topic: 'missing_numbers',
        difficulty: 1,
        isCorrect: false,
        hintsUsed: 2,
        responseTimeMs: 15000,
        attemptsCount: 2,
        timestamp: Date.now() + 10000 + i * 1000,
        gameMode: 'story',
      });
    }

    const addComp = engine.getOrCreateTopicCompetence('addition');
    const misComp = engine.getOrCreateTopicCompetence('missing_numbers');

    // Năng lực hai chủ đề hoàn toàn độc lập
    expect(addComp.accuracy).toBe(100);
    expect(misComp.accuracy).toBe(0);
    expect(addComp.masteryScore).toBeGreaterThan(misComp.masteryScore);

    // Hệ thống nhận diện đúng chủ đề cần cải thiện
    const state = engine.getState();
    expect(state.topicsNeedingImprovement).toContain('missing_numbers');
    expect(state.topicsNeedingImprovement).not.toContain('addition');

    // Trong Chế độ Luyện tập (Practice Mode), khuyến nghị tự động chọn chủ đề yếu
    engine.setGameMode('practice');
    const rec = engine.getNextQuestionRecommendation({ gameMode: 'practice' });
    expect(rec.recommendedTopic).toBe('missing_numbers');
    expect(rec.needsVisualSupport).toBe(true);
  });

  // 7. KIỂM TRA 3 CHẾ ĐỘ CHƠI (STORY, PRACTICE, CHALLENGE)
  describe('7. Kiểm tra 3 Chế độ chơi chuyên biệt', () => {
    it('Chế độ Story Mode: Điều chỉnh độ khó theo tiến trình câu chuyện', () => {
      engine.setGameMode('story');
      const rec = engine.getNextQuestionRecommendation();
      expect(rec.gameMode).toBe('story');
      expect(rec.candidateQuestion).toBeDefined();
    });

    it('Chế độ Practice Mode: Bé tự chọn chủ đề và độ khó tùy chỉnh', () => {
      engine.setGameMode('practice');
      const rec = engine.getNextQuestionRecommendation({
        forcedTopic: 'geometry',
        forcedDifficulty: 3,
      });

      expect(rec.recommendedTopic).toBe('geometry');
      expect(rec.recommendedDifficulty).toBe(3);
    });

    it('Chế độ Challenge Mode: Khởi đầu ở độ khó cao và KHÔNG tự giảm độ khó khi sai', () => {
      engine.setGameMode('challenge');
      const comp = engine.getOrCreateTopicCompetence('logical_thinking');
      expect(comp.currentDifficulty).toBe(4);

      // Bé trả lời sai 2 câu liên tiếp trong Challenge Mode
      engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: 'ADV_LOG_001',
        topic: 'logical_thinking',
        difficulty: 4,
        isCorrect: false,
        hintsUsed: 0,
        responseTimeMs: 12000,
        attemptsCount: 1,
        timestamp: Date.now(),
        gameMode: 'challenge',
      });
      const secondWrongInChallenge = engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: 'ADV_LOG_002',
        topic: 'logical_thinking',
        difficulty: 4,
        isCorrect: false,
        hintsUsed: 1,
        responseTimeMs: 14000,
        attemptsCount: 2,
        timestamp: Date.now() + 2000,
        gameMode: 'challenge',
      });

      // KHÔNG tự giảm độ khó (duy trì mức 4), nhưng bật gợi ý hỗ trợ
      expect(secondWrongInChallenge.adjustment).toBe('MAINTAIN');
      expect(secondWrongInChallenge.newDifficulty).toBe(4);
      expect(secondWrongInChallenge.needsVisualSupport).toBe(true);
      expect(secondWrongInChallenge.reason).toContain('Chế độ Thử thách');
    });
  });

  // 8. KIỂM TRA THANG NĂNG LỰC MASTERY SYSTEM (0–100)
  describe('8. Thang năng lực 0–100 và Nhãn sư phạm tích cực', () => {
    it('Phân loại đúng 5 bậc năng lực theo thang điểm', () => {
      expect(engine.getMasteryLevel(25)).toBe('needs_practice');
      expect(engine.getMasteryLevel(45)).toBe('progressing');
      expect(engine.getMasteryLevel(70)).toBe('proficient');
      expect(engine.getMasteryLevel(88)).toBe('mastered');
      expect(engine.getMasteryLevel(98)).toBe('exemplary');
    });

    it('Nhãn hiển thị tiếng Việt sư phạm tích cực, không mang tính trừng phạt', () => {
      expect(AdaptiveDifficultyEngine.getMasteryLabelVi('needs_practice')).toBe('Cần luyện tập thêm');
      expect(AdaptiveDifficultyEngine.getMasteryLabelVi('progressing')).toBe('Đang tiến bộ tích cực');
      expect(AdaptiveDifficultyEngine.getMasteryLabelVi('proficient')).toBe('Làm bài khá tốt');
      expect(AdaptiveDifficultyEngine.getMasteryLabelVi('mastered')).toBe('Thành thạo tự tin');
      expect(AdaptiveDifficultyEngine.getMasteryLabelVi('exemplary')).toBe('Xuất sắc tuyệt đỉnh');
    });

    it('Mastery không đạt mức thành thạo chỉ sau 1 câu trả lời đơn lẻ (cần tích lũy mẫu)', () => {
      const comp = engine.getOrCreateTopicCompetence('measurement_time');

      // Bé chỉ mới làm đúng 1 câu duy nhất
      engine.recordAttempt({
        profileId: 'profile_test_ronie',
        questionId: 'ADV_MEA_001',
        topic: 'measurement_time',
        difficulty: 1,
        isCorrect: true,
        hintsUsed: 0,
        responseTimeMs: 6000,
        attemptsCount: 1,
        timestamp: Date.now(),
        gameMode: 'story',
      });

      // Điểm số chưa thể đạt mastered (80+) sau 1 câu duy nhất
      expect(comp.masteryScore).toBeLessThan(60);
      expect(comp.masteryLevel).not.toBe('mastered');
      expect(comp.masteryLevel).not.toBe('exemplary');
    });
  });

  // 9. LƯU TRỮ VÀ KHÔI PHỤC TIẾN TRÌNH THÍCH ỨNG
  it('9. AdaptiveStorageService lưu và khôi phục trạng thái toàn vẹn, bảo toàn dữ liệu cũ', async () => {
    const playerEngine = new AdaptiveDifficultyEngine('profile_saved_player', 'story');

    // Ghi nhận một số dữ liệu
    playerEngine.recordAttempt({
      profileId: 'profile_saved_player',
      questionId: 'ADV_ADD_001',
      topic: 'addition',
      difficulty: 1,
      isCorrect: true,
      hintsUsed: 0,
      responseTimeMs: 5000,
      attemptsCount: 1,
      timestamp: Date.now(),
      gameMode: 'story',
    });

    const stateToSave = playerEngine.getState();
    await AdaptiveStorageService.saveAdaptiveState(stateToSave);

    const loadedState = await AdaptiveStorageService.loadAdaptiveState('profile_saved_player');
    expect(loadedState.profileId).toBe('profile_saved_player');
    expect(loadedState.totalQuestionsAllTime).toBe(1);
    expect(loadedState.competenceByTopic.addition).toBeDefined();
    expect(loadedState.competenceByTopic.addition?.correctCount).toBe(1);
  });
});
