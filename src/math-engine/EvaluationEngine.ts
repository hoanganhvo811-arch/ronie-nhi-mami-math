// src/math-engine/EvaluationEngine.ts
// Bộ kiểm tra đáp án và chấm điểm sư phạm khuyến khích (Grade 1 Evaluation Engine)

import type { IGrade1Question, IEvaluationResult, MathDifficulty } from './types';

export interface IEvaluationOptions {
  timeSpentMs?: number;
  attemptsCount?: number;
  hintTriggered?: boolean;
}

export class EvaluationEngine {
  /**
   * Tính điểm số sư phạm dựa trên độ khó và số lần thử
   * Khuyến khích trẻ, không trừ điểm âm:
   * - Lần 1: 100% điểm cơ bản của độ khó
   * - Lần 2: 70%
   * - Lần 3: 40%
   * - Lần 4+: 20% (điểm nỗ lực kiên trì)
   */
  public static calculateScore(difficulty: MathDifficulty, attempts: number): number {
    const baseScoreByDifficulty: Record<MathDifficulty, number> = {
      1: 10,
      2: 20,
      3: 30,
      4: 40,
      5: 50,
    };

    const base = baseScoreByDifficulty[difficulty] || 10;
    if (attempts <= 1) return base;
    if (attempts === 2) return Math.round(base * 0.7);
    if (attempts === 3) return Math.round(base * 0.4);
    return Math.max(2, Math.round(base * 0.2));
  }

  /**
   * So sánh hai giá trị câu trả lời một cách an toàn và linh hoạt
   */
  public static compareAnswers(
    userAnswer: unknown,
    correctAnswer: unknown,
    questionType?: string
  ): boolean {
    if (userAnswer === undefined || userAnswer === null) {
      return false;
    }

    // Trường hợp so sánh mảng (VD: number_ordering hoặc drag_and_drop sắp xếp)
    if (Array.isArray(correctAnswer)) {
      if (!Array.isArray(userAnswer)) return false;
      if (userAnswer.length !== correctAnswer.length) return false;

      // Nếu là number_ordering thì kiểm tra chính xác thứ tự
      return userAnswer.every((val, idx) => {
        return String(val).trim().toLowerCase() === String(correctAnswer[idx]).trim().toLowerCase();
      });
    }

    // Trường hợp đáp án là chuỗi danh sách ngăn cách dấu phẩy (VD: "1, 4, 7")
    if (typeof correctAnswer === 'string' && correctAnswer.includes(',')) {
      const normCorrect = correctAnswer
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .join(', ');

      if (Array.isArray(userAnswer)) {
        const normUser = userAnswer.map((s) => String(s).trim().toLowerCase()).join(', ');
        return normUser === normCorrect;
      }

      const normUserStr = String(userAnswer)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .join(', ');
      return normUserStr === normCorrect;
    }

    // So sánh số học (cho phép "5" == 5 hoặc 5.0 == 5)
    if (typeof correctAnswer === 'number') {
      const parsedUser = Number(userAnswer);
      if (!isNaN(parsedUser)) {
        return parsedUser === correctAnswer;
      }
    }

    // So sánh chuỗi ký tự chuẩn hóa (bỏ khoảng trắng thừa, không phân biệt hoa thường)
    const strUser = String(userAnswer).trim().toLowerCase();
    const strCorrect = String(correctAnswer).trim().toLowerCase();

    return strUser === strCorrect;
  }

  /**
   * Đánh giá câu trả lời của bé
   */
  public static evaluate(
    question: IGrade1Question,
    userAnswer: unknown,
    options: IEvaluationOptions = {}
  ): IEvaluationResult {
    const timeSpentMs = Math.max(0, options.timeSpentMs || 0);
    const attemptsCount = Math.max(1, options.attemptsCount || 1);
    const hintTriggered = options.hintTriggered || false;

    // Kiểm tra tính hợp lệ của dữ liệu đầu vào
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      return {
        isCorrect: false,
        score: 0,
        difficulty: question.difficulty,
        timeSpentMs,
        attemptsCount,
        feedbackMessage: 'Bé hãy chọn một đáp án trước khi bấm kiểm tra nhé!',
        hintTriggered,
        errorType: 'invalid_input',
      };
    }

    // Kiểm tra câu trả lời
    const isCorrect = this.compareAnswers(userAnswer, question.correctAnswer, question.questionType);

    if (isCorrect) {
      const score = this.calculateScore(question.difficulty, attemptsCount);
      let feedback = 'Hoan hô! Bé trả lời rất chính xác!';
      if (attemptsCount === 1) {
        feedback = 'Tuyệt vời! Bé giải đúng ngay lần đầu tiên!';
      } else if (attemptsCount === 2) {
        feedback = 'Rất giỏi! Bé đã tự sửa đúng rồi!';
      } else {
        feedback = 'Bé kiên trì tuyệt vời lắm, kết quả đúng rồi nè!';
      }

      return {
        isCorrect: true,
        score,
        difficulty: question.difficulty,
        timeSpentMs,
        attemptsCount,
        feedbackMessage: feedback,
        hintTriggered,
        errorType: 'none',
      };
    }

    // Trả lời chưa đúng (không phạt điểm, động viên thử lại)
    return {
      isCorrect: false,
      score: 0,
      difficulty: question.difficulty,
      timeSpentMs,
      attemptsCount,
      feedbackMessage: 'Chưa chính xác rồi. Bé thử suy nghĩ lại hoặc bấm Gợi ý xem sao nhé!',
      hintTriggered,
      errorType: 'player_wrong_answer',
    };
  }
}
