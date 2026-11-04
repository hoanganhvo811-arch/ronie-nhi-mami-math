// src/features/math-training/TrainingRoomEngine.ts
// Bộ Điều Khiển Phòng Luyện Toán (Math Training Room Engine) - Phase 5
// Quản lý 8 chuyên đề, 3 mức độ (Luyện tập / Nâng cao / Chuyên gia), 5-10-15 câu và tính năng tiếp tục bài học

import type {
  TrainingTopicId,
  TrainingLevel,
  ITrainingTopicConfig,
  ITrainingSessionState,
} from '../../types/training-and-arena';
import type { IGrade1Question, MathDifficulty } from '../../math-engine/types';
import { ADVANCED_QUESTION_BANK_12 } from '../../math-engine/advanced-bank';
import { QUESTION_BANK } from '../../math-engine/bank';
import { EvaluationEngine } from '../../math-engine/EvaluationEngine';
import { ProgressionEngine } from '../progression/progressionEngine';
import { StarRatingEngine } from '../progression/StarRatingEngine';

export const TRAINING_TOPICS_CONFIG: Record<TrainingTopicId, ITrainingTopicConfig> = {
  addition_subtraction: {
    id: 'addition_subtraction',
    name: 'Cộng và Trừ',
    description: 'Thành thạo các phép tính cộng, trừ trong phạm vi 10, 20 và 100 không nhớ.',
    icon: '➕➖',
    colorAccent: '#EF4444',
    bgGradient: 'from-rose-500 to-amber-500',
    stationName: 'Bàn Học Phép Tính Kỳ Diệu',
    mathEngineTopics: ['addition', 'subtraction'],
  },
  comparison: {
    id: 'comparison',
    name: 'So Sánh Số',
    description: 'Luyện tập so sánh các số và giá trị biểu thức lớn hơn (>), bé hơn (<), bằng (=).',
    icon: '⚖️',
    colorAccent: '#F59E0B',
    bgGradient: 'from-amber-500 to-emerald-500',
    stationName: 'Cân Thăng Bằng Cá Sấu Thông Thái',
    mathEngineTopics: ['number_comparison', 'comparison'],
  },
  missing_numbers: {
    id: 'missing_numbers',
    name: 'Tìm Số Bí Mật',
    description: 'Điền số còn thiếu vào ô trống □ và khám phá cấu tạo số, tách gộp số.',
    icon: '🧩',
    colorAccent: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-500',
    stationName: 'Góc Tách Gộp & Mảnh Ghép Ẩn Số',
    mathEngineTopics: ['missing_numbers', 'number_composition', 'tens_and_ones'],
  },
  word_problems: {
    id: 'word_problems',
    name: 'Toán Có Lời Văn',
    description: 'Đọc hiểu bài toán có cốt truyện sinh động cùng Ronie và Nhi Mami.',
    icon: '📖',
    colorAccent: '#3B82F6',
    bgGradient: 'from-blue-500 to-indigo-500',
    stationName: 'Kệ Sách Cổ Tích Toán Học',
    mathEngineTopics: ['word_problems'],
  },
  number_patterns: {
    id: 'number_patterns',
    name: 'Quy Luật Số',
    description: 'Khám phá bước nhảy của dãy số tăng dần, giảm dần và quy luật lặp.',
    icon: '🌀',
    colorAccent: '#8B5CF6',
    bgGradient: 'from-purple-500 to-pink-500',
    stationName: 'Thảm Cỏ Bước Nhảy Dãy Số',
    mathEngineTopics: ['number_patterns'],
  },
  geometry: {
    id: 'geometry',
    name: 'Hình Học & Không Gian',
    description: 'Nhận diện hình vuông, tròn, tam giác, chữ nhật và khối hộp chữ nhật, lập phương.',
    icon: '📐',
    colorAccent: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-500',
    stationName: 'Xưởng Xếp Hình Khối Hoàng Gia',
    mathEngineTopics: ['geometry'],
  },
  measurement: {
    id: 'measurement',
    name: 'Đo Lường & Thời Gian',
    description: 'Tập đo chiều dài centimet (cm), xem đồng hồ kim chỉ đúng giờ.',
    icon: '⏰',
    colorAccent: '#06B6D4',
    bgGradient: 'from-cyan-500 to-blue-500',
    stationName: 'Tháp Đồng Hồ & Thước Kẻ Thông Minh',
    mathEngineTopics: ['measurement_time', 'measurement'],
  },
  logical_thinking: {
    id: 'logical_thinking',
    name: 'Tư Duy Logic',
    description: 'Các câu đố suy luận nhiều bước, sắp xếp thứ tự và tư duy phản biện.',
    icon: '💡',
    colorAccent: '#6366F1',
    bgGradient: 'from-indigo-500 to-violet-500',
    stationName: 'Bàn Cờ Thần Kỳ Của Nữ Hoàng',
    mathEngineTopics: ['logical_thinking'],
  },
};

const LAST_TRAINING_TOPIC_KEY = 'ronie_last_training_topic';

export class TrainingRoomEngine {
  private state: ITrainingSessionState;

  constructor(
    topicId: TrainingTopicId = 'addition_subtraction',
    level: TrainingLevel = 'practice',
    questionCount: 5 | 10 | 15 = 5
  ) {
    this.state = this.initSession(topicId, level, questionCount);
  }

  /**
   * Lưu chuyên đề vừa luyện để hỗ trợ tính năng "Tiếp tục chủ đề đang luyện"
   */
  public static saveLastPracticedTopic(topicId: TrainingTopicId): void {
    try {
      localStorage.setItem(LAST_TRAINING_TOPIC_KEY, topicId);
    } catch {
      // Bỏ qua lỗi trong môi trường không có localStorage
    }
  }

  /**
   * Lấy chuyên đề đã luyện gần nhất
   */
  public static getLastPracticedTopic(): TrainingTopicId {
    try {
      const saved = localStorage.getItem(LAST_TRAINING_TOPIC_KEY);
      if (saved && saved in TRAINING_TOPICS_CONFIG) {
        return saved as TrainingTopicId;
      }
    } catch {
      // Fallback
    }
    return 'addition_subtraction';
  }

  /**
   * Khởi tạo phiên luyện tập mới
   */
  public initSession(
    topicId: TrainingTopicId,
    level: TrainingLevel,
    questionCount: 5 | 10 | 15
  ): ITrainingSessionState {
    TrainingRoomEngine.saveLastPracticedTopic(topicId);

    const questions = this.loadQuestionsForTopic(topicId, level, questionCount);

    return {
      topicId,
      level,
      questionCount,
      currentIndex: 0,
      questions,
      currentQuestion: questions.length > 0 ? questions[0] : null,
      selectedOption: null,
      correctCount: 0,
      mistakesCount: 0,
      streak: 0,
      score: 0,
      hintsUsedCount: 0,
      isCompleted: false,
      startTime: Date.now(),
      elapsedSeconds: 0,
    };
  }

  /**
   * Trích xuất câu hỏi chuẩn Lớp 1 GDPT 2018 theo chuyên đề và mức độ khó
   */
  private loadQuestionsForTopic(
    topicId: TrainingTopicId,
    level: TrainingLevel,
    count: number
  ): IGrade1Question[] {
    const config = TRAINING_TOPICS_CONFIG[topicId];
    const targetTopics = new Set(config.mathEngineTopics);

    // Xác định mức độ khó MathDifficulty tương ứng
    let targetDifficulties: MathDifficulty[] = [1, 2];
    if (level === 'advanced') {
      targetDifficulties = [3, 4];
    } else if (level === 'expert') {
      targetDifficulties = [4, 5];
    }

    // Kết hợp từ cả 2 nguồn: ADVANCED_QUESTION_BANK_12 và QUESTION_BANK
    const pool: IGrade1Question[] = [
      ...ADVANCED_QUESTION_BANK_12,
      ...QUESTION_BANK,
    ].filter((q) => {
      const matchTopic = targetTopics.has(q.topic);
      const matchDiff = targetDifficulties.includes(q.difficulty);
      return matchTopic && matchDiff;
    });

    // Nếu không đủ câu hỏi ở đúng mức, mở rộng lấy toàn bộ chủ đề
    if (pool.length < count) {
      const fallbackPool = [...ADVANCED_QUESTION_BANK_12, ...QUESTION_BANK].filter((q) =>
        targetTopics.has(q.topic)
      );
      if (fallbackPool.length > 0) {
        return this.shuffleArray(fallbackPool).slice(0, count);
      }
    }

    return this.shuffleArray(pool).slice(0, count);
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  public getState(): ITrainingSessionState {
    return { ...this.state };
  }

  /**
   * Gửi câu trả lời của bé
   */
  public submitAnswer(answer: unknown): {
    isCorrect: boolean;
    explanation: string;
    scoreGained: number;
    isFinished: boolean;
  } {
    if (this.state.isCompleted || !this.state.currentQuestion) {
      return { isCorrect: false, explanation: '', scoreGained: 0, isFinished: true };
    }

    this.state.selectedOption = answer;
    const currentQ = this.state.currentQuestion;

    const evalResult = EvaluationEngine.evaluate(currentQ, answer);
    let scoreGained = 0;

    if (evalResult.isCorrect) {
      this.state.correctCount++;
      this.state.streak++;
      scoreGained = 20 + this.state.streak * 5;
      this.state.score += scoreGained;
    } else {
      this.state.mistakesCount++;
      this.state.streak = 0;
    }

    return {
      isCorrect: evalResult.isCorrect,
      explanation: currentQ.explanation || evalResult.feedbackMessage,
      scoreGained,
      isFinished: this.state.currentIndex + 1 >= this.state.questions.length,
    };
  }

  /**
   * Chuyển sang câu hỏi kế tiếp
   */
  public nextQuestion(): boolean {
    if (this.state.currentIndex + 1 < this.state.questions.length) {
      this.state.currentIndex++;
      this.state.currentQuestion = this.state.questions[this.state.currentIndex];
      this.state.selectedOption = null;
      return true;
    } else {
      this.state.isCompleted = true;
      this.state.currentQuestion = null;
      this.state.elapsedSeconds = Math.round((Date.now() - this.state.startTime) / 1000);
      return false;
    }
  }

  /**
   * Ghi nhận sử dụng gợi ý
   */
  public useHint(): string {
    this.state.hintsUsedCount++;
    return this.state.currentQuestion?.hint?.text || 'Hãy đọc kỹ đề bài nhé bé yêu!';
  }

  /**
   * Tổng kết buổi luyện tập: Điểm EXP, Sao, Lời khen
   */
  public getSessionSummary() {
    const accuracy =
      this.state.questions.length > 0
        ? Math.round((this.state.correctCount / this.state.questions.length) * 100)
        : 0;

    const diffNum = this.state.level === 'practice' ? 1 : this.state.level === 'advanced' ? 3 : 5;
    const starEval = StarRatingEngine.evaluateStars(
      100,
      this.state.questions.length,
      this.state.correctCount,
      this.state.mistakesCount,
      diffNum,
      this.state.hintsUsedCount
    );

    const expBreakdown = ProgressionEngine.calculateExpReward({
      baseExp: 100,
      progress: 100,
      totalQuestions: this.state.questions.length,
      correctCount: this.state.correctCount,
      mistakesCount: this.state.mistakesCount,
      streak: this.state.streak,
      starsEarned: starEval.stars,
    });

    return {
      accuracy,
      stars: starEval.stars,
      expGained: expBreakdown.totalExpGained,
      correctCount: this.state.correctCount,
      totalQuestions: this.state.questions.length,
      timeSpentSeconds: this.state.elapsedSeconds,
      queenFeedback: starEval.feedback,
    };
  }
}
