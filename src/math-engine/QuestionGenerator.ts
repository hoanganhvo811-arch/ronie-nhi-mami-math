// src/math-engine/QuestionGenerator.ts
// Bộ sinh câu hỏi động có kiểm soát sư phạm chặt chẽ (Grade 1 Dynamic Question Generator)

import type { IGrade1Question, MathDifficulty } from './types';

export class QuestionGenerator {
  private static readonly EMOJIS = [
    { emoji: '🍎', name: 'quả táo đỏ' },
    { emoji: '🍓', name: 'quả dâu tây' },
    { emoji: '🍊', name: 'quả cam vàng' },
    { emoji: '🥕', name: 'củ cà rốt' },
    { emoji: '⭐', name: 'ngôi sao' },
    { emoji: '🎈', name: 'quả bóng bay' },
    { emoji: '🍭', name: 'chiếc kẹo mút' },
    { emoji: '🐟', name: 'chú cá nhỏ' },
  ];

  /**
   * Sinh các đáp án nhiễu thông minh quanh đáp án đúng
   */
  public static generateDistractors(
    correct: number,
    count: number = 3,
    minVal: number = 0,
    maxVal: number = 20
  ): number[] {
    const distractors = new Set<number>();
    const offsets = [1, -1, 2, -2, 3, -3, 10, -10];

    // Thử các độ lệch nhỏ (học sinh lớp 1 hay tính nhầm lệch 1 hoặc 2)
    for (const offset of offsets) {
      if (distractors.size >= count) break;
      const candidate = correct + offset;
      if (candidate >= minVal && candidate <= maxVal && candidate !== correct) {
        distractors.add(candidate);
      }
    }

    // Nếu vẫn chưa đủ, lấp đầy bằng số ngẫu nhiên trong khoảng
    let attempts = 0;
    while (distractors.size < count && attempts < 50) {
      attempts++;
      const rand = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      if (rand !== correct) {
        distractors.add(rand);
      }
    }

    return Array.from(distractors).slice(0, count);
  }

  /**
   * 1. Sinh phép cộng có kiểm soát độ khó
   */
  public static generateAddition(difficulty: MathDifficulty = 2): IGrade1Question {
    const id = `GEN_ADD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let a: number;
    let b: number;
    let semester: 1 | 2 = 1;

    if (difficulty === 1) {
      // Phạm vi 5
      a = Math.floor(Math.random() * 4) + 1; // 1..4
      b = Math.floor(Math.random() * (5 - a)) + 1;
    } else if (difficulty === 2) {
      // Phạm vi 10
      a = Math.floor(Math.random() * 8) + 1; // 1..8
      b = Math.floor(Math.random() * (10 - a)) + 1;
    } else if (difficulty === 3) {
      // Dạng 10 + a hoặc cộng trong phạm vi 20 không nhớ
      semester = 2;
      a = Math.floor(Math.random() * 8) + 10; // 10..17
      b = Math.floor(Math.random() * (20 - a)) + 1;
    } else {
      // Mức 4: Cộng tròn chục đến 100
      semester = 2;
      const tensA = Math.floor(Math.random() * 4) + 1; // 1..4 chục
      const tensB = Math.floor(Math.random() * (9 - tensA)) + 1;
      a = tensA * 10;
      b = tensB * 10;
    }

    const sum = a + b;
    const item = this.EMOJIS[Math.floor(Math.random() * this.EMOJIS.length)];
    const wrongs = this.generateDistractors(sum, 3, 0, difficulty === 4 ? 100 : 20);
    const options = [sum, ...wrongs].sort(() => Math.random() - 0.5);

    return {
      id,
      topic: 'operations',
      subtopic: 'addition_generated',
      grade: 1,
      semester,
      difficulty,
      questionType: 'multiple_choice',
      questionText: `Tính: ${a} + ${b} = ?`,
      audioPrompt: `${a} cộng ${b} bằng bao nhiêu con?`,
      visualData: {
        visualType: 'ADDITION_VISUAL',
        groupA: { emoji: item.emoji, count: a <= 10 ? a : Math.min(a, 10), name: item.name },
        groupB: { emoji: item.emoji, count: b <= 10 ? b : Math.min(b, 10), name: item.name },
      },
      correctAnswer: sum,
      wrongAnswers: wrongs,
      options,
      hint: {
        text: `Bé hãy đếm tiếp từ ${a}: thêm ${b} đơn vị nữa nhé!`,
      },
      explanation: `${a} + ${b} = ${sum}.`,
      curriculumReference: 'GDPT 2018 - Toán 1: Phép cộng sinh động',
      tags: ['phép cộng', 'sinh ngẫu nhiên'],
    };
  }

  /**
   * 2. Sinh phép trừ (Tuyệt đối KHÔNG ÂM: a >= b)
   */
  public static generateSubtraction(difficulty: MathDifficulty = 2): IGrade1Question {
    const id = `GEN_SUB_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let a: number;
    let b: number;
    let semester: 1 | 2 = 1;

    if (difficulty === 1) {
      // Phạm vi 5: a từ 1..5, b <= a
      a = Math.floor(Math.random() * 5) + 1;
      b = Math.floor(Math.random() * a) + 1;
    } else if (difficulty === 2) {
      // Phạm vi 10: a từ 2..10, b <= a
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * a) + 1;
    } else if (difficulty === 3) {
      // Phạm vi 20 không nhớ: a từ 11..19, b <= hàng đơn vị của a hoặc trừ tròn chục
      semester = 2;
      const tens = 10;
      const unit = Math.floor(Math.random() * 8) + 1; // 1..8
      a = tens + unit;
      b = Math.floor(Math.random() * unit) + 1; // b <= unit để không nhớ
    } else {
      // Trừ số tròn chục: a từ 20..90, b <= a
      semester = 2;
      const tensA = Math.floor(Math.random() * 8) + 2; // 2..9 chục
      const tensB = Math.floor(Math.random() * tensA) + 1; // 1..tensA chục
      a = tensA * 10;
      b = tensB * 10;
    }

    // Bảo đảm tuyệt đối không âm
    if (a < b) {
      [a, b] = [b, a];
    }

    const diff = a - b;
    const item = this.EMOJIS[Math.floor(Math.random() * this.EMOJIS.length)];
    const wrongs = this.generateDistractors(diff, 3, 0, difficulty === 4 ? 90 : 20);
    const options = [diff, ...wrongs].sort(() => Math.random() - 0.5);

    return {
      id,
      topic: 'operations',
      subtopic: 'subtraction_generated',
      grade: 1,
      semester,
      difficulty,
      questionType: 'multiple_choice',
      questionText: `Tính: ${a} - ${b} = ?`,
      audioPrompt: `${a} trừ ${b} bằng mấy con nhỉ?`,
      visualData: {
        visualType: 'SUBTRACTION_VISUAL',
        groupA: { emoji: item.emoji, count: a <= 10 ? a : Math.min(a, 10), name: item.name },
        subtractedCount: b <= 10 ? b : Math.min(b, 10),
      },
      correctAnswer: diff,
      wrongAnswers: wrongs,
      options,
      hint: {
        text: `Bé lấy ${a} bớt đi ${b} đơn vị: đếm lùi lại nhé!`,
      },
      explanation: `${a} - ${b} = ${diff}.`,
      curriculumReference: 'GDPT 2018 - Toán 1: Phép trừ sinh động',
      tags: ['phép trừ', 'không âm', 'sinh ngẫu nhiên'],
    };
  }

  /**
   * 3. Sinh câu hỏi so sánh hai số (<, =, >)
   */
  public static generateComparison(difficulty: MathDifficulty = 2): IGrade1Question {
    const id = `GEN_CMP_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const maxVal = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;

    const left = Math.floor(Math.random() * maxVal) + 1;
    let right = Math.floor(Math.random() * maxVal) + 1;
    // 30% tỷ lệ bằng nhau
    if (Math.random() < 0.3) {
      right = left;
    }

    let correct = '=';
    if (left > right) correct = '>';
    if (left < right) correct = '<';

    return {
      id,
      topic: 'numbers',
      subtopic: 'comparison_generated',
      grade: 1,
      semester: 1,
      difficulty,
      questionType: 'number_comparison',
      questionText: `Điền dấu thích hợp: ${left} ... ${right}`,
      audioPrompt: `Bé so sánh xem ${left} lớn hơn, bé hơn hay bằng ${right}?`,
      visualData: {
        visualType: 'COMPARISON',
        comparisonValues: { left, right },
      },
      correctAnswer: correct,
      wrongAnswers: ['>', '<', '='].filter((op) => op !== correct),
      options: ['<', '=', '>'],
      hint: {
        text: left > right ? `${left} lớn hơn ${right}.` : left < right ? `${left} bé hơn ${right}.` : `Hai số bằng nhau.`,
      },
      explanation: `${left} ${correct} ${right}.`,
      curriculumReference: 'GDPT 2018 - Toán 1: So sánh số tự nhiên',
      tags: ['so sánh', 'dấu lớn bé'],
    };
  }

  /**
   * 4. Sinh câu hỏi đếm trực quan (Count Objects)
   */
  public static generateVisualCount(difficulty: MathDifficulty = 1): IGrade1Question {
    const id = `GEN_CNT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const maxCount = difficulty === 1 ? 5 : 10;
    const count = Math.floor(Math.random() * maxCount) + 1;
    const item = this.EMOJIS[Math.floor(Math.random() * this.EMOJIS.length)];

    const wrongs = this.generateDistractors(count, 3, 1, maxCount + 2);
    const options = [count, ...wrongs].sort(() => Math.random() - 0.5);

    return {
      id,
      topic: 'numbers',
      subtopic: 'counting_generated',
      grade: 1,
      semester: 1,
      difficulty,
      questionType: 'count_objects',
      questionText: `Bé hãy đếm xem có bao nhiêu ${item.name}?`,
      audioPrompt: `Có bao nhiêu ${item.name} tất cả hả bé?`,
      visualData: {
        visualType: 'COUNTING',
        items: [{ emoji: item.emoji, count, name: item.name }],
      },
      correctAnswer: count,
      wrongAnswers: wrongs,
      options,
      hint: {
        text: `Bé chỉ ngón tay vào từng ${item.name} và đếm từ 1 đến hết nhé!`,
      },
      explanation: `Có tất cả ${count} ${item.name}.`,
      curriculumReference: 'GDPT 2018 - Toán 1: Kỹ năng đếm vật thể',
      tags: ['đếm', 'trực quan'],
    };
  }

  /**
   * 5. Sinh câu hỏi số còn thiếu trong dãy số (Missing Number)
   */
  public static generateSequence(difficulty: MathDifficulty = 2): IGrade1Question {
    const id = `GEN_SEQ_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const start = Math.floor(Math.random() * 5) + 1;
    const step = difficulty === 3 ? 2 : 1;
    const length = 5;
    const missingIndex = Math.floor(Math.random() * 3) + 1; // index 1..3

    const sequence: (number | string)[] = [];
    let missingNumber = 0;

    for (let i = 0; i < length; i++) {
      const val = start + i * step;
      if (i === missingIndex) {
        sequence.push('?');
        missingNumber = val;
      } else {
        sequence.push(val);
      }
    }

    const wrongs = this.generateDistractors(missingNumber, 3, 1, 25);
    const options = [missingNumber, ...wrongs].sort(() => Math.random() - 0.5);

    return {
      id,
      topic: 'numbers',
      subtopic: 'sequence_generated',
      grade: 1,
      semester: 1,
      difficulty,
      questionType: 'missing_number',
      questionText: `Tìm số thích hợp điền vào dấu ?: ${sequence.join(', ')}`,
      audioPrompt: `Dãy số có số nào còn thiếu ở dấu hỏi chấm hả con?`,
      visualData: {
        visualType: 'NUMBER_LINE',
        sequence,
      },
      correctAnswer: missingNumber,
      wrongAnswers: wrongs,
      options,
      hint: {
        text: `Quan sát quy luật đếm thêm ${step} đơn vị ở mỗi bước.`,
      },
      explanation: `Số còn thiếu là ${missingNumber}.`,
      curriculumReference: 'GDPT 2018 - Toán 1: Quy luật dãy số',
      tags: ['dãy số', 'tìm số'],
    };
  }
}

/**
 * Trình theo dõi phiên học tập (Session Tracker) giúp không sinh trùng câu hỏi trong phiên
 */
export class QuestionSessionTracker {
  private servedQuestionIds: Set<string> = new Set();

  public markAsServed(id: string): void {
    this.servedQuestionIds.add(id);
  }

  public hasBeenServed(id: string): boolean {
    return this.servedQuestionIds.has(id);
  }

  public getServedCount(): number {
    return this.servedQuestionIds.size;
  }

  public getServedIds(): string[] {
    return Array.from(this.servedQuestionIds);
  }

  public reset(): void {
    this.servedQuestionIds.clear();
  }
}
