// src/test/mathGenerator.test.ts
import { describe, it, expect } from 'vitest';
import { generateQuestionForZone } from '../features/math-engine/mathGenerator';

describe('Math Question Engine (Chuẩn GDPT 2018 Lớp 1)', () => {
  it('sinh câu hỏi Vùng 1 (Đếm 0-10 và So sánh >, <, =)', () => {
    for (let i = 0; i < 15; i++) {
      const q = generateQuestionForZone(1, i);
      expect(q.zoneId).toBe(1);
      expect(q.questionText).toBeTruthy();
      expect(q.hint).toBeTruthy();
      expect(q.options).toContain(q.correctAnswer);
      expect(new Set(q.options).size).toBe(q.options.length); // Không trùng lặp đáp án
    }
  });

  it('sinh câu hỏi Vùng 2 (Phép cộng trong phạm vi 10 & 20)', () => {
    for (let i = 0; i < 10; i++) {
      const q = generateQuestionForZone(2, i);
      expect(q.zoneId).toBe(2);
      expect(q.topicKey).toBe('addition_within_10');
      expect(typeof q.correctAnswer).toBe('number');
      expect(q.correctAnswer).toBeGreaterThanOrEqual(2);
      expect(q.options).toContain(q.correctAnswer);
    }
  });

  it('sinh câu hỏi Vùng 3 (Phép trừ trong phạm vi 10 & cán cân)', () => {
    for (let i = 0; i < 10; i++) {
      const q = generateQuestionForZone(3, i);
      expect(q.zoneId).toBe(3);
      expect(q.topicKey).toBe('subtraction_within_10');
      expect(typeof q.correctAnswer).toBe('number');
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.options).toContain(q.correctAnswer);
    }
  });

  it('sinh câu hỏi Vùng 4 (Hình học phẳng, khối không gian, thước cm, đồng hồ)', () => {
    for (let i = 0; i < 15; i++) {
      const q = generateQuestionForZone(4, i);
      expect(q.zoneId).toBe(4);
      expect(['flat_shapes', 'length_centimeter', 'clock_reading']).toContain(q.topicKey);
      expect(q.options).toContain(q.correctAnswer);
    }
  });

  it('sinh câu hỏi Vùng 5 (Số tròn chục và phép tính tới 100)', () => {
    for (let i = 0; i < 10; i++) {
      const q = generateQuestionForZone(5, i);
      expect(q.zoneId).toBe(5);
      expect(q.topicKey).toBe('numbers_to_100');
      expect(typeof q.correctAnswer).toBe('number');
      expect((q.correctAnswer as number) % 10).toBe(0); // Luôn là số tròn chục
      expect(q.options).toContain(q.correctAnswer);
    }
  });
});
