// src/math-engine/QuestionValidator.ts
// Bộ kiểm định chất lượng sư phạm và tính toàn vẹn của ngân hàng câu hỏi (Math Question Validator)

import type {
  IGrade1Question,
  MathDifficulty,
  MathTopic,
  CoreMathTopic,
  AdvancedMathTopic,
} from './types';

export interface IValidationIssue {
  questionId: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface IValidationSummary {
  totalChecked: number;
  validCount: number;
  invalidCount: number;
  issues: IValidationIssue[];
  isValid: boolean;
}

export class QuestionValidator {
  public static readonly CORE_TOPICS: CoreMathTopic[] = [
    'numbers',
    'operations',
    'geometry',
    'measurement_time',
    'word_problems',
  ];

  public static readonly ADVANCED_TOPICS_12: AdvancedMathTopic[] = [
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

  public static readonly VALID_TOPICS: MathTopic[] = [
    'numbers',
    'operations',
    'geometry',
    'measurement_time',
    'word_problems',
    'counting_recognition',
    'number_comparison',
    'addition',
    'subtraction',
    'missing_numbers',
    'number_composition',
    'tens_and_ones',
    'number_patterns',
    'logical_thinking',
  ];

  public static readonly VALID_DIFFICULTIES: MathDifficulty[] = [1, 2, 3, 4, 5];

  /**
   * Kiểm định một câu hỏi đơn lẻ
   */
  public static validateQuestion(q: IGrade1Question, seenIds?: Set<string>): IValidationIssue[] {
    const issues: IValidationIssue[] = [];
    const qId = q.id || q.questionId || 'UNKNOWN';

    // 1. Kiểm tra ID / questionId
    if (!q.id || typeof q.id !== 'string' || q.id.trim() === '') {
      issues.push({
        questionId: qId,
        field: 'id',
        message: 'Mã câu hỏi (ID) không được rỗng.',
        severity: 'error',
      });
    } else if (seenIds && seenIds.has(q.id)) {
      issues.push({
        questionId: q.id,
        field: 'id',
        message: `Trùng lặp ID câu hỏi: ${q.id}`,
        severity: 'error',
      });
    }

    if (q.questionId && q.id && q.questionId !== q.id) {
      issues.push({
        questionId: q.id,
        field: 'questionId',
        message: `questionId (${q.questionId}) không khớp với id (${q.id}).`,
        severity: 'warning',
      });
    }

    // 2. Kiểm tra chủ đề (Topic)
    if (!this.VALID_TOPICS.includes(q.topic)) {
      issues.push({
        questionId: qId,
        field: 'topic',
        message: `Chủ đề '${q.topic}' không hợp lệ. Phải thuộc 5 Core Topics hoặc 12 Advanced Topics.`,
        severity: 'error',
      });
    }

    // 3. Kiểm tra độ khó (Difficulty 1..5)
    if (!this.VALID_DIFFICULTIES.includes(q.difficulty)) {
      issues.push({
        questionId: qId,
        field: 'difficulty',
        message: `Mức độ khó ${q.difficulty} không hợp lệ (chỉ cho phép 1, 2, 3, 4, 5).`,
        severity: 'error',
      });
    }

    // 4. Kiểm tra nội dung câu hỏi (Question Text)
    if (!q.questionText || q.questionText.trim().length < 5) {
      issues.push({
        questionId: qId,
        field: 'questionText',
        message: 'Nội dung câu hỏi quá ngắn hoặc rỗng.',
        severity: 'error',
      });
    }

    // 5. Kiểm tra đáp án chính xác (Correct Answer)
    if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '') {
      issues.push({
        questionId: qId,
        field: 'correctAnswer',
        message: 'Đáp án chính xác không được để trống.',
        severity: 'error',
      });
    }

    // 6. Kiểm tra đáp án nhiễu (Wrong Answers)
    if (!Array.isArray(q.wrongAnswers) || q.wrongAnswers.length === 0) {
      issues.push({
        questionId: qId,
        field: 'wrongAnswers',
        message: 'Danh sách đáp án nhiễu phải là một mảng không rỗng.',
        severity: 'error',
      });
    } else {
      // Đáp án nhiễu không được trùng với đáp án đúng
      const stringCorrect = String(q.correctAnswer).trim();
      for (const wrong of q.wrongAnswers) {
        if (String(wrong).trim() === stringCorrect) {
          issues.push({
            questionId: qId,
            field: 'wrongAnswers',
            message: `Đáp án nhiễu (${wrong}) bị trùng với đáp án đúng (${q.correctAnswer})!`,
            severity: 'error',
          });
        }
      }

      // Các đáp án nhiễu không được trùng nhau
      const uniqueWrongs = new Set(q.wrongAnswers.map((w) => String(w).trim()));
      if (uniqueWrongs.size !== q.wrongAnswers.length) {
        issues.push({
          questionId: qId,
          field: 'wrongAnswers',
          message: 'Tồn tại các đáp án nhiễu trùng lặp lẫn nhau.',
          severity: 'error',
        });
      }
    }

    // 7. Kiểm tra Options chứa đáp án đúng duy nhất 1 lần
    if (Array.isArray(q.options)) {
      const stringCorrect = String(q.correctAnswer).trim();
      const occurrences = q.options.filter((opt) => String(opt).trim() === stringCorrect).length;

      if (occurrences === 0) {
        issues.push({
          questionId: qId,
          field: 'options',
          message: `Danh sách options không chứa đáp án chính xác (${q.correctAnswer})!`,
          severity: 'error',
        });
      } else if (occurrences > 1) {
        issues.push({
          questionId: qId,
          field: 'options',
          message: `Đáp án chính xác (${q.correctAnswer}) xuất hiện nhiều hơn 1 lần trong options!`,
          severity: 'error',
        });
      }

      // Các phương án trong options không được trùng lặp nhau
      const uniqueOptions = new Set(q.options.map((opt) => String(opt).trim()));
      if (uniqueOptions.size !== q.options.length) {
        issues.push({
          questionId: qId,
          field: 'options',
          message: 'Tồn tại các lựa chọn trùng lặp trong mảng options.',
          severity: 'error',
        });
      }
    }

    // 8. Kiểm tra sư phạm: Gợi ý và Giải thích
    const hasBaseHint = q.hint && q.hint.text && q.hint.text.trim() !== '';
    const hasTieredHint = Boolean(q.hintLevel1 && q.hintLevel1.trim() !== '');

    if (!hasBaseHint && !hasTieredHint) {
      issues.push({
        questionId: qId,
        field: 'hint',
        message: 'Câu hỏi thiếu gợi ý sư phạm (hint.text hoặc hintLevel1).',
        severity: 'warning',
      });
    }

    if (!q.explanation || q.explanation.trim() === '') {
      issues.push({
        questionId: qId,
        field: 'explanation',
        message: 'Câu hỏi thiếu lời giải thích (explanation).',
        severity: 'warning',
      });
    }

    // Kiểm tra tính hợp lệ của các cấp gợi ý chi tiết (nếu có)
    if (q.hintLevel1 !== undefined && (typeof q.hintLevel1 !== 'string' || q.hintLevel1.trim() === '')) {
      issues.push({
        questionId: qId,
        field: 'hintLevel1',
        message: 'hintLevel1 không được để chuỗi rỗng.',
        severity: 'warning',
      });
    }
    if (q.hintLevel2 !== undefined && (typeof q.hintLevel2 !== 'string' || q.hintLevel2.trim() === '')) {
      issues.push({
        questionId: qId,
        field: 'hintLevel2',
        message: 'hintLevel2 không được để chuỗi rỗng.',
        severity: 'warning',
      });
    }
    if (q.hintLevel3 !== undefined && (typeof q.hintLevel3 !== 'string' || q.hintLevel3.trim() === '')) {
      issues.push({
        questionId: qId,
        field: 'hintLevel3',
        message: 'hintLevel3 không được để chuỗi rỗng.',
        severity: 'warning',
      });
    }

    // Kiểm tra estimatedTime
    if (q.estimatedTime !== undefined && (typeof q.estimatedTime !== 'number' || q.estimatedTime <= 0)) {
      issues.push({
        questionId: qId,
        field: 'estimatedTime',
        message: 'estimatedTime phải là số dương lớn hơn 0.',
        severity: 'warning',
      });
    }

    // 9. Kiểm tra phạm vi phép tính số học (Grade 1 bounds: 0..100 & không âm)
    const isArithmeticTopic = ['operations', 'addition', 'subtraction', 'missing_numbers', 'number_composition'].includes(q.topic);
    if (isArithmeticTopic && typeof q.correctAnswer === 'number') {
      if (q.correctAnswer < 0) {
        issues.push({
          questionId: qId,
          field: 'correctAnswer',
          message: `Kết quả phép tính không được âm (${q.correctAnswer}) trong chương trình Lớp 1!`,
          severity: 'error',
        });
      }
      if (q.correctAnswer > 100) {
        issues.push({
          questionId: qId,
          field: 'correctAnswer',
          message: `Kết quả ${q.correctAnswer} vượt quá phạm vi 100 của lớp 1.`,
          severity: 'warning',
        });
      }
    }

    return issues;
  }

  /**
   * Kiểm định toàn bộ ngân hàng câu hỏi
   */
  public static validateBank(questions: IGrade1Question[]): IValidationSummary {
    const allIssues: IValidationIssue[] = [];
    const seenIds = new Set<string>();

    for (const q of questions) {
      const issues = this.validateQuestion(q, seenIds);
      if (issues.length > 0) {
        allIssues.push(...issues);
      }
      if (q.id) {
        seenIds.add(q.id);
      }
    }

    const errorCount = allIssues.filter((i) => i.severity === 'error').length;
    const invalidQuestions = new Set(allIssues.filter((i) => i.severity === 'error').map((i) => i.questionId)).size;

    return {
      totalChecked: questions.length,
      validCount: questions.length - invalidQuestions,
      invalidCount: invalidQuestions,
      issues: allIssues,
      isValid: errorCount === 0,
    };
  }

  /**
   * Kiểm tra mức độ bao phủ của 12 nhóm kiến thức và 5 mức độ khó
   */
  public static validateTopicDistribution(questions: IGrade1Question[]): {
    coveredTopics: string[];
    missingTopics: string[];
    coveredDifficulties: number[];
    missingDifficulties: number[];
    isFullCoverage: boolean;
  } {
    const coveredTopics = Array.from(new Set(questions.map((q) => q.topic)));
    const missingTopics = this.ADVANCED_TOPICS_12.filter((t) => !coveredTopics.includes(t));

    const coveredDifficulties = Array.from(new Set(questions.map((q) => q.difficulty))).sort((a, b) => a - b);
    const missingDifficulties = this.VALID_DIFFICULTIES.filter((d) => !coveredDifficulties.includes(d));

    return {
      coveredTopics,
      missingTopics,
      coveredDifficulties,
      missingDifficulties,
      isFullCoverage: missingTopics.length === 0 && missingDifficulties.length === 0,
    };
  }

  /**
   * Báo cáo phân bố chi tiết số câu hỏi theo từng chủ đề và độ khó
   */
  public static getDetailedTopicReport(questions: IGrade1Question[]): Record<string, Record<MathDifficulty, number>> {
    const report: Record<string, Record<MathDifficulty, number>> = {};

    for (const topic of this.VALID_TOPICS) {
      report[topic] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    for (const q of questions) {
      if (!report[q.topic]) {
        report[q.topic] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      report[q.topic][q.difficulty] = (report[q.topic][q.difficulty] || 0) + 1;
    }

    return report;
  }
}
