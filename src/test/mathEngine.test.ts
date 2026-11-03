// src/test/mathEngine.test.ts
// Kiểm thử toàn diện Standalone Mathematics Engine & Question Bank Toán Lớp 1 (Phase 3)

import { describe, it, expect } from 'vitest';
import {
  QUESTION_BANK,
  getQuestionsByTopic,
  getQuestionsByDifficulty,
  getQuestionsByTopicAndDifficulty,
  getQuestionDistribution,
  getRandomQuestions,
  QuestionValidator,
  QuestionGenerator,
  QuestionSessionTracker,
  EvaluationEngine,
  HintEngine,
} from '../math-engine';

describe('1. Ngân Hàng Câu Hỏi Kiểm Định (Verified Question Bank >= 200 câu)', () => {
  it('ngân hàng câu hỏi có tối thiểu 200 câu đã được biên soạn và thẩm định', () => {
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(200);
  });

  it('bộ QuestionValidator kiểm định 100% câu hỏi đều đạt chuẩn, 0 lỗi', () => {
    const summary = QuestionValidator.validateBank(QUESTION_BANK);
    if (!summary.isValid) {
      console.error('Validation issues:', summary.issues);
    }
    expect(summary.isValid).toBe(true);
    expect(summary.invalidCount).toBe(0);
    expect(summary.validCount).toBe(QUESTION_BANK.length);
  });

  it('tất cả câu hỏi đều có ID duy nhất và không bị trùng lặp', () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('mọi câu hỏi đều có đáp án đúng nằm trong danh sách options', () => {
    QUESTION_BANK.forEach((q) => {
      const correctStr = String(q.correctAnswer).trim();
      const hasCorrect = q.options.some((opt) => String(opt).trim() === correctStr);
      expect(hasCorrect, `Câu ${q.id} không có đáp án đúng trong options`).toBe(true);
    });
  });

  it('không có câu hỏi nào có đáp án nhiễu trùng với đáp án đúng', () => {
    QUESTION_BANK.forEach((q) => {
      const correctStr = String(q.correctAnswer).trim();
      q.wrongAnswers.forEach((wrong) => {
        expect(String(wrong).trim(), `Câu ${q.id} có đáp án nhiễu trùng đáp án đúng`).not.toBe(correctStr);
      });
    });
  });

  it('tất cả các phép tính trừ đều có kết quả không âm (a >= b >= 0)', () => {
    const ops = getQuestionsByTopic('operations');
    ops.forEach((q) => {
      if (typeof q.correctAnswer === 'number') {
        expect(q.correctAnswer, `Câu ${q.id} có kết quả âm`).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

describe('2. Phân Bố Đề Thi & Báo Cáo Phân Phối (Distribution Report)', () => {
  it('phân bố đầy đủ trên cả 5 nhóm chủ đề (A: Số học, B: Phép tính, C: Hình học, D: Đo lường, E: Lời văn)', () => {
    const report = getQuestionDistribution();
    expect(report.totalQuestions).toBeGreaterThanOrEqual(200);

    // Mỗi nhóm chủ đề có tối thiểu 30 câu hỏi
    expect(report.byTopic.numbers).toBeGreaterThanOrEqual(30);
    expect(report.byTopic.operations).toBeGreaterThanOrEqual(30);
    expect(report.byTopic.geometry).toBeGreaterThanOrEqual(30);
    expect(report.byTopic.measurement_time).toBeGreaterThanOrEqual(30);
    expect(report.byTopic.word_problems).toBeGreaterThanOrEqual(30);
  });

  it('phân bố đầy đủ trên cả 4 mức độ nhận thức (Làm quen, Cơ bản, Vận dụng, Thử thách)', () => {
    const report = getQuestionDistribution();
    expect(report.byDifficulty[1]).toBeGreaterThanOrEqual(20);
    expect(report.byDifficulty[2]).toBeGreaterThanOrEqual(20);
    expect(report.byDifficulty[3]).toBeGreaterThanOrEqual(20);
    expect(report.byDifficulty[4]).toBeGreaterThanOrEqual(15);
  });

  it('hỗ trợ rút trích câu hỏi ngẫu nhiên và loại trừ các câu đã làm (getRandomQuestions)', () => {
    const sampled = getRandomQuestions({ topic: 'numbers', count: 5 });
    expect(sampled.length).toBe(5);
    sampled.forEach((q) => expect(q.topic).toBe('numbers'));

    // Loại trừ
    const excludeIds = [sampled[0].id, sampled[1].id];
    const newSampled = getRandomQuestions({
      topic: 'numbers',
      count: 5,
      excludeIds,
    });
    newSampled.forEach((q) => {
      expect(excludeIds.includes(q.id)).toBe(false);
    });
  });
});

describe('3. Question Generator (Bộ Sinh Câu Hỏi Động Có Kiểm Soát)', () => {
  it('sinh phép cộng trong phạm vi chuẩn và đáp án nhiễu hợp lý', () => {
    for (let diff = 1; diff <= 4; diff++) {
      const q = QuestionGenerator.generateAddition(diff as any);
      expect(q.topic).toBe('operations');
      expect(typeof q.correctAnswer).toBe('number');
      expect(q.options).toContain(q.correctAnswer);
      expect(q.wrongAnswers).not.toContain(q.correctAnswer);
    }
  });

  it('sinh phép trừ luôn đảm bảo không âm (a >= b >= 0)', () => {
    for (let i = 0; i < 20; i++) {
      const q = QuestionGenerator.generateSubtraction(2);
      expect((q.correctAnswer as number)).toBeGreaterThanOrEqual(0);
      expect(q.wrongAnswers).not.toContain(q.correctAnswer);
    }
  });

  it('sinh câu hỏi so sánh số với đầy đủ dấu >, <, =', () => {
    const q = QuestionGenerator.generateComparison(2);
    expect(q.topic).toBe('numbers');
    expect(['>', '<', '=']).toContain(q.correctAnswer);
  });

  it('sinh câu hỏi đếm vật thể trực quan', () => {
    const q = QuestionGenerator.generateVisualCount(1);
    expect(q.questionType).toBe('count_objects');
    expect(q.visualData?.items?.[0].count).toBe(q.correctAnswer);
  });

  it('QuestionSessionTracker theo dõi và ngăn chặn sinh trùng lặp trong phiên', () => {
    const tracker = new QuestionSessionTracker();
    expect(tracker.getServedCount()).toBe(0);

    tracker.markAsServed('Q_01');
    tracker.markAsServed('Q_02');
    expect(tracker.hasBeenServed('Q_01')).toBe(true);
    expect(tracker.hasBeenServed('Q_03')).toBe(false);
    expect(tracker.getServedCount()).toBe(2);

    tracker.reset();
    expect(tracker.getServedCount()).toBe(0);
  });
});

describe('4. Evaluation Engine (Chấm Điểm & Đánh Giá Sư Phạm)', () => {
  const sampleQuestion = QUESTION_BANK[0]; // Q_NUM_001 (correctAnswer: 3)

  it('đánh giá đúng khi người chơi trả lời chính xác số hoặc chuỗi', () => {
    const res1 = EvaluationEngine.evaluate(sampleQuestion, 3);
    expect(res1.isCorrect).toBe(true);
    expect(res1.score).toBeGreaterThan(0);
    expect(res1.errorType).toBe('none');

    const res2 = EvaluationEngine.evaluate(sampleQuestion, '3');
    expect(res2.isCorrect).toBe(true);
  });

  it('tính điểm số giảm dần theo số lần thử nhưng không phạt điểm âm', () => {
    const score1 = EvaluationEngine.calculateScore(2, 1);
    const score2 = EvaluationEngine.calculateScore(2, 2);
    const score3 = EvaluationEngine.calculateScore(2, 3);
    const score4 = EvaluationEngine.calculateScore(2, 5);

    expect(score1).toBe(20);
    expect(score2).toBe(14); // 70%
    expect(score3).toBe(8);  // 40%
    expect(score4).toBeGreaterThanOrEqual(2); // Điểm nỗ lực
  });

  it('xử lý an toàn khi người chơi chưa chọn đáp án', () => {
    const res = EvaluationEngine.evaluate(sampleQuestion, '');
    expect(res.isCorrect).toBe(false);
    expect(res.errorType).toBe('invalid_input');
  });

  it('so sánh mảng chính xác cho dạng câu hỏi sắp xếp thứ tự (number_ordering)', () => {
    const isOrderCorrect = EvaluationEngine.compareAnswers([1, 4, 7], '1, 4, 7');
    expect(isOrderCorrect).toBe(true);

    const isOrderWrong = EvaluationEngine.compareAnswers([7, 4, 1], '1, 4, 7');
    expect(isOrderWrong).toBe(false);
  });
});

describe('5. Hint Engine (Hệ Thống Gợi Ý Trực Quan Sư Phạm)', () => {
  it('tạo gợi ý từng bước gộp nhóm trực quan cho phép cộng', () => {
    const addQ = QUESTION_BANK.find((q) => q.id === 'Q_OPS_001')!;
    const hint = HintEngine.generateHint(addQ);

    expect(hint.steps.length).toBeGreaterThanOrEqual(3);
    expect(hint.steps[0].title).toContain('Bước 1');
    expect(hint.steps[1].title).toContain('Bước 2');
    expect(hint.steps[2].title).toContain('Bước 3');
  });

  it('tạo gợi ý từng bước bớt đi cho phép trừ', () => {
    const subQ = QUESTION_BANK.find((q) => q.id === 'Q_OPS_003')!;
    const hint = HintEngine.generateHint(subQ);

    expect(hint.steps.length).toBeGreaterThanOrEqual(3);
    expect(hint.steps[1].title).toContain('Bớt đi');
  });
});
