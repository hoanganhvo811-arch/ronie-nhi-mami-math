// src/math-engine/QuestionValidator.ts
// Bộ kiểm định chất lượng sư phạm và tính toàn vẹn của ngân hàng câu hỏi (Math Question Validator)

import type { IGrade1Question, MathDifficulty, MathTopic } from './types';

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
  private static readonly VALID_TOPICS: MathTopic[] = [
    'numbers',
    'operations',
    'geometry',
    'measurement_time',
    'word_problems',
  ];

  private static readonly VALID_DIFFICULTIES: MathDifficulty[] = [1, 2, 3, 4];

  /**
   * Kiểm định một câu hỏi đơn lẻ
   */
  public static validateQuestion(q: IGrade1Question, seenIds?: Set<string>): IValidationIssue[] {
    const issues: IValidationIssue[] = [];

    // 1. Kiểm tra ID
    if (!q.id || typeof q.id !== 'string' || q.id.trim() === '') {
      issues.push({
        questionId: q.id || 'UNKNOWN',
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

    // 2. Kiểm tra chủ đề (Topic)
    if (!this.VALID_TOPICS.includes(q.topic)) {
      issues.push({
        questionId: q.id,
        field: 'topic',
        message: `Chủ đề ${q.topic} không hợp lệ. Phải thuộc 5 nhóm A-E.`,
        severity: 'error',
      });
    }

    // 3. Kiểm tra độ khó (Difficulty)
    if (!this.VALID_DIFFICULTIES.includes(q.difficulty)) {
      issues.push({
        questionId: q.id,
        field: 'difficulty',
        message: `Mức độ khó ${q.difficulty} không hợp lệ (chỉ cho phép 1, 2, 3, 4).`,
        severity: 'error',
      });
    }

    // 4. Kiểm tra nội dung câu hỏi (Question Text)
    if (!q.questionText || q.questionText.trim().length < 5) {
      issues.push({
        questionId: q.id,
        field: 'questionText',
        message: 'Nội dung câu hỏi quá ngắn hoặc rỗng.',
        severity: 'error',
      });
    }

    // 5. Kiểm tra đáp án chính xác (Correct Answer)
    if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '') {
      issues.push({
        questionId: q.id,
        field: 'correctAnswer',
        message: 'Đáp án chính xác không được để trống.',
        severity: 'error',
      });
    }

    // 6. Kiểm tra đáp án nhiễu (Wrong Answers)
    if (!Array.isArray(q.wrongAnswers) || q.wrongAnswers.length === 0) {
      issues.push({
        questionId: q.id,
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
            questionId: q.id,
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
          questionId: q.id,
          field: 'wrongAnswers',
          message: 'Tồn tại các đáp án nhiễu trùng lặp lẫn nhau.',
          severity: 'error',
        });
      }
    }

    // 7. Kiểm tra Options chứa đáp án đúng
    if (Array.isArray(q.options)) {
      const stringCorrect = String(q.correctAnswer).trim();
      const hasCorrect = q.options.some((opt) => String(opt).trim() === stringCorrect);
      if (!hasCorrect) {
        issues.push({
          questionId: q.id,
          field: 'options',
          message: `Danh sách options không chứa đáp án chính xác (${q.correctAnswer})!`,
          severity: 'error',
        });
      }
    }

    // 8. Kiểm tra sư phạm: Gợi ý và Giải thích
    if (!q.hint || !q.hint.text || q.hint.text.trim() === '') {
      issues.push({
        questionId: q.id,
        field: 'hint',
        message: 'Câu hỏi thiếu gợi ý sư phạm (hint.text).',
        severity: 'warning',
      });
    }
    if (!q.explanation || q.explanation.trim() === '') {
      issues.push({
        questionId: q.id,
        field: 'explanation',
        message: 'Câu hỏi thiếu lời giải thích (explanation).',
        severity: 'warning',
      });
    }

    // 9. Kiểm tra phạm vi phép tính số học (Grade 1 bounds & không âm)
    if (q.topic === 'operations' && typeof q.correctAnswer === 'number') {
      if (q.correctAnswer < 0) {
        issues.push({
          questionId: q.id,
          field: 'correctAnswer',
          message: `Kết quả phép tính không được âm (${q.correctAnswer}) trong chương trình Lớp 1!`,
          severity: 'error',
        });
      }
      if (q.correctAnswer > 100) {
        issues.push({
          questionId: q.id,
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
}
