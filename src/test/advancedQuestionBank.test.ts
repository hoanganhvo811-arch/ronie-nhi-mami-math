// src/test/advancedQuestionBank.test.ts
// Kiểm thử chất lượng sư phạm và toàn vẹn của Ngân hàng 12 Nhóm kiến thức Nâng cao (Phase 1)

import { describe, it, expect } from 'vitest';
import {
  ADVANCED_QUESTION_BANK_12,
  ADVANCED_TOPIC_NAMES_VI,
  getAdvancedQuestionById,
  getAdvancedQuestionsByTopic,
  getAdvancedQuestionsByDifficulty,
  getAdvancedQuestionsByTopicAndDifficulty,
} from '../math-engine/advanced-bank';
import { QUESTION_BANK, CORE_QUESTION_BANK } from '../math-engine/bank';
import { QuestionValidator } from '../math-engine/QuestionValidator';
import type { AdvancedMathTopic, MathDifficulty } from '../math-engine/types';

describe('PHASE 1: ADVANCED MATH QUESTION BANK (12 Nhóm kiến thức & 5 Mức độ)', () => {
  const topics: AdvancedMathTopic[] = [
    'counting_recognition',
    'number_comparison',
    'addition',
    'subtraction',
    'missing_numbers',
    'number_composition',
    'tens_and_ones',
    'word_problems',
    'number_patterns',
    'geometry',
    'measurement_time',
    'logical_thinking',
  ];

  it('1. Đủ 12 nhóm kiến thức chuẩn GDPT 2018 với đúng 120 câu hỏi', () => {
    expect(ADVANCED_QUESTION_BANK_12.length).toBe(120);
    expect(topics.length).toBe(12);

    topics.forEach((t) => {
      const qs = getAdvancedQuestionsByTopic(t);
      expect(qs.length).toBe(10);
      expect(ADVANCED_TOPIC_NAMES_VI[t]).toBeTruthy();
    });
  });

  it('2. Mỗi nhóm kiến thức bao phủ trọn vẹn 5 cấp độ nhận thức (Level 1..5)', () => {
    const difficulties: MathDifficulty[] = [1, 2, 3, 4, 5];

    topics.forEach((t) => {
      difficulties.forEach((d) => {
        const qs = getAdvancedQuestionsByTopicAndDifficulty(t, d);
        expect(
          qs.length,
          `Chủ đề ${t} ở độ khó ${d} phải có ít nhất 2 câu hỏi`
        ).toBeGreaterThanOrEqual(2);
      });
    });
  });

  it('3. QuestionValidator kiểm định 120 câu hỏi nâng cao đạt 100% hợp lệ không có lỗi', () => {
    const summary = QuestionValidator.validateBank(ADVANCED_QUESTION_BANK_12);
    expect(summary.isValid).toBe(true);
    expect(summary.invalidCount).toBe(0);
    expect(summary.validCount).toBe(120);

    const errors = summary.issues.filter((i) => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('4. Toàn bộ ngân hàng tích hợp 325 câu (205 Core + 120 Advanced) đạt chuẩn 100%', () => {
    expect(CORE_QUESTION_BANK.length).toBe(205);
    expect(QUESTION_BANK.length).toBe(325);

    const summary = QuestionValidator.validateBank(QUESTION_BANK);
    expect(summary.isValid).toBe(true);
    expect(summary.invalidCount).toBe(0);
    expect(summary.validCount).toBe(325);
  });

  it('5. Không có ID nào bị trùng lặp trong toàn bộ 325 câu hỏi', () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(QUESTION_BANK.length);
  });

  it('6. Mọi câu hỏi nâng cao đều có đủ 3 cấp gợi ý (hintLevel1, hintLevel2, hintLevel3) và estimatedTime', () => {
    ADVANCED_QUESTION_BANK_12.forEach((q) => {
      expect(q.hintLevel1).toBeTruthy();
      expect(q.hintLevel2).toBeTruthy();
      expect(q.hintLevel3).toBeTruthy();
      expect(q.estimatedTime).toBeGreaterThan(0);
      expect(q.explanation).toBeTruthy();
      expect(
        q.tags.length,
        `${q.id} có ít hơn 3 tags: ${JSON.stringify(q.tags)}`
      ).toBeGreaterThanOrEqual(3);
    });
  });

  it('7. Đáp án đúng xuất hiện duy nhất 1 lần trong options và các options không trùng nhau', () => {
    ADVANCED_QUESTION_BANK_12.forEach((q) => {
      const correctStr = String(q.correctAnswer).trim();
      const occurrences = q.options.filter((opt) => String(opt).trim() === correctStr).length;
      expect(occurrences).toBe(1);

      const uniqueOpts = new Set(q.options.map((opt) => String(opt).trim()));
      expect(uniqueOpts.size).toBe(q.options.length);
    });
  });

  it('8. Giới hạn toán học Lớp 1: Kết quả không âm (a >= b) và trong phạm vi 100', () => {
    ADVANCED_QUESTION_BANK_12.forEach((q) => {
      if (typeof q.correctAnswer === 'number') {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('9. Kiểm tra các dạng câu hỏi bắt buộc theo đề bài Phase 1', () => {
    it('Phép tính: 7 + 8 = 15 (ADV_ADD_003)', () => {
      const q = getAdvancedQuestionById('ADV_ADD_003')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('7 + 8');
      expect(q.correctAnswer).toBe(15);
      expect(q.difficulty).toBe(2);
    });

    it('Phép tính: 15 - 9 = 6 (ADV_SUB_003)', () => {
      const q = getAdvancedQuestionById('ADV_SUB_003')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('15 - 9');
      expect(q.correctAnswer).toBe(6);
      expect(q.difficulty).toBe(2);
    });

    it('Phép tính: 23 + 14 = 37 (ADV_ADD_007)', () => {
      const q = getAdvancedQuestionById('ADV_ADD_007')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('23 + 14');
      expect(q.correctAnswer).toBe(37);
      expect(q.difficulty).toBe(4);
    });

    it('Phép tính: 46 - 22 = 24 (ADV_SUB_007)', () => {
      const q = getAdvancedQuestionById('ADV_SUB_007')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('46 - 22');
      expect(q.correctAnswer).toBe(24);
      expect(q.difficulty).toBe(4);
    });

    it('Điền số: □ + 6 = 14 (ADV_MIS_005)', () => {
      const q = getAdvancedQuestionById('ADV_MIS_005')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('□ + 6 = 14');
      expect(q.correctAnswer).toBe(8);
      expect(q.difficulty).toBe(3);
    });

    it('Điền số: 18 - □ = 9 (ADV_MIS_006)', () => {
      const q = getAdvancedQuestionById('ADV_MIS_006')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('18 - □ = 9');
      expect(q.correctAnswer).toBe(9);
      expect(q.difficulty).toBe(3);
    });

    it('Điền số: 12 + □ = 20 (ADV_MIS_004)', () => {
      const q = getAdvancedQuestionById('ADV_MIS_004')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('12 + □ = 20');
      expect(q.correctAnswer).toBe(8);
      expect(q.difficulty).toBe(2);
    });

    it('So sánh: 17 □ 19 (ADV_CMP_003)', () => {
      const q = getAdvancedQuestionById('ADV_CMP_003')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('17 □ 19');
      expect(q.correctAnswer).toBe('<');
      expect(q.difficulty).toBe(2);
    });

    it('So sánh: 25 □ 25 (ADV_CMP_005)', () => {
      const q = getAdvancedQuestionById('ADV_CMP_005')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('25 □ 25');
      expect(q.correctAnswer).toBe('=');
      expect(q.difficulty).toBe(3);
    });

    it('Tách số: 15 = 10 + □ (ADV_COM_005)', () => {
      const q = getAdvancedQuestionById('ADV_COM_005')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('15 = 10 + □');
      expect(q.correctAnswer).toBe(5);
      expect(q.difficulty).toBe(3);
    });

    it('Tách số: 18 = □ + 8 (ADV_COM_006)', () => {
      const q = getAdvancedQuestionById('ADV_COM_006')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('18 = □ + 8');
      expect(q.correctAnswer).toBe(10);
      expect(q.difficulty).toBe(3);
    });

    it('Toán nhiều bước: Chim trên cây 12 + 5 - 4 (ADV_WRD_009)', () => {
      const q = getAdvancedQuestionById('ADV_WRD_009')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('12 con chim');
      expect(q.questionText).toContain('thêm 5 con bay đến');
      expect(q.questionText).toContain('4 con bay đi');
      expect(q.correctAnswer).toBe(13);
      expect(q.difficulty).toBe(5);
    });

    it('Dãy số quy luật: 3, 6, 9, 12, □ (ADV_PAT_007)', () => {
      const q = getAdvancedQuestionById('ADV_PAT_007')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('3, 6, 9, 12, □');
      expect(q.correctAnswer).toBe(15);
      expect(q.difficulty).toBe(4);
    });

    it('Toán lời văn kẹo Ronie & Nhi Mami & Quái vật bánh quy 8 + 5 - 3 (ADV_WRD_007)', () => {
      const q = getAdvancedQuestionById('ADV_WRD_007')!;
      expect(q).toBeDefined();
      expect(q.questionText).toContain('Bé Ronie có 8 viên kẹo');
      expect(q.questionText).toContain('Nữ hoàng Nhi Mami cho thêm 5 viên kẹo');
      expect(q.questionText).toContain('Quái vật bánh quy 3 viên');
      expect(q.correctAnswer).toBe(10);
      expect(q.difficulty).toBe(4);
    });
  });
});