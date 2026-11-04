// src/math-engine/adaptive/AdaptiveDifficultyEngine.ts
// Bộ Động Cơ Điều Chỉnh Độ Khó Tự Động & Đánh Giá Năng Lực (Adaptive Difficulty Engine) - Phase 2

import type { MathTopic, MathDifficulty, IGrade1Question } from '../types';
import { QUESTION_BANK } from '../bank';
import type {
  GameMode,
  MasteryLevel,
  ITopicCompetence,
  IQuestionAttemptRecord,
  IAdaptiveEvaluation,
  IAdaptiveRecommendation,
  IPlayerAdaptiveState,
} from './types';

export class AdaptiveDifficultyEngine {
  private state: IPlayerAdaptiveState;
  private recentQuestionIds: Set<string> = new Set();
  private readonly RECENT_HISTORY_LIMIT = 15;

  constructor(initialProfileId: string = 'profile_ronie_default', initialMode: GameMode = 'story') {
    this.state = {
      profileId: initialProfileId,
      activeGameMode: initialMode,
      competenceByTopic: {},
      topicsNeedingImprovement: [],
      strongTopics: [],
      longestStreak: 0,
      totalCorrectAllTime: 0,
      totalQuestionsAllTime: 0,
      recentAttempts: [],
      lastSessionTimestamp: Date.now(),
    };
  }

  /**
   * Lấy bản sao trạng thái hiện tại của người chơi
   */
  public getState(): IPlayerAdaptiveState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Thiết lập chế độ chơi hiện tại (story | practice | challenge)
   */
  public setGameMode(mode: GameMode): void {
    this.state.activeGameMode = mode;
  }

  /**
   * Khởi tạo hoặc lấy hồ sơ năng lực theo chủ đề
   */
  public getOrCreateTopicCompetence(topic: MathTopic): ITopicCompetence {
    if (!this.state.competenceByTopic[topic]) {
      // Thiết lập độ khó ban đầu: Challenge Mode bắt đầu ở Level 4, Story & Practice ở Level 1
      const initialDifficulty: MathDifficulty =
        this.state.activeGameMode === 'challenge' ? 4 : 1;

      this.state.competenceByTopic[topic] = {
        topic,
        totalQuestions: 0,
        correctCount: 0,
        accuracy: 0,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        consecutiveCorrectWithoutHint: 0,
        totalHintsUsed: 0,
        totalAttempts: 0,
        averageResponseTimeMs: 0,
        masteryScore: 0,
        masteryLevel: 'needs_practice',
        currentDifficulty: initialDifficulty,
        highestPassedDifficulty: 1,
        lastUpdated: Date.now(),
      };
    }

    return this.state.competenceByTopic[topic]!;
  }

  /**
   * Ghi nhận và phân tích kết quả của một câu hỏi vừa trả lời
   */
  public recordAttempt(record: IQuestionAttemptRecord): IAdaptiveEvaluation {
    const comp = this.getOrCreateTopicCompetence(record.topic);
    const prevDifficulty = comp.currentDifficulty;

    // Cập nhật thống kê câu hỏi tổng quát
    comp.totalQuestions++;
    comp.totalAttempts += Math.max(1, record.attemptsCount || 1);
    comp.totalHintsUsed += record.hintsUsed || 0;
    comp.lastUpdated = record.timestamp || Date.now();

    // Cập nhật thời gian phản hồi trung bình (Thời gian không dùng để trừ điểm/hạ cấp bé)
    const prevTimeTotal = comp.averageResponseTimeMs * (comp.totalQuestions - 1);
    comp.averageResponseTimeMs = Math.round(
      (prevTimeTotal + Math.max(0, record.responseTimeMs)) / comp.totalQuestions
    );

    // Cập nhật toàn cục người chơi
    this.state.totalQuestionsAllTime++;
    this.state.lastSessionTimestamp = Date.now();
    this.recentQuestionIds.add(record.questionId);
    if (this.recentQuestionIds.size > this.RECENT_HISTORY_LIMIT) {
      const first = Array.from(this.recentQuestionIds)[0];
      this.recentQuestionIds.delete(first);
    }

    let adjustment: 'UP' | 'DOWN' | 'MAINTAIN' = 'MAINTAIN';
    let reason = 'Duy trì mức độ câu hỏi hiện tại.';
    let needsVisualSupport = false;

    if (record.isCorrect) {
      // --- TRƯỜNG HỢP TRẢ LỜI ĐÚNG ---
      comp.correctCount++;
      comp.consecutiveCorrect++;
      comp.consecutiveWrong = 0; // Reset chuỗi sai
      this.state.totalCorrectAllTime++;

      if (comp.consecutiveCorrect > this.state.longestStreak) {
        this.state.longestStreak = comp.consecutiveCorrect;
      }

      if (record.difficulty > comp.highestPassedDifficulty) {
        comp.highestPassedDifficulty = record.difficulty;
      }

      // Kiểm tra xem bé có dùng gợi ý hay không
      if (!record.hintsUsed || record.hintsUsed === 0) {
        comp.consecutiveCorrectWithoutHint++;
      } else {
        // Bé dùng gợi ý -> reset chuỗi tự chủ để đảm bảo chỉ thăng hạng khi tự làm đúng
        comp.consecutiveCorrectWithoutHint = 0;
      }

      // QUY TẮC TĂNG ĐỘ KHÓ:
      // "Nếu bé trả lời đúng liên tiếp 5 câu và không cần gợi ý: Tăng độ khó một mức."
      if (comp.consecutiveCorrectWithoutHint >= 5) {
        if (comp.currentDifficulty < 5) {
          comp.currentDifficulty = (comp.currentDifficulty + 1) as MathDifficulty;
          adjustment = 'UP';
          reason = `Hoan hô! Bé đã làm đúng liên tiếp 5 câu không cần trợ giúp! Nữ hoàng mở thử thách Level ${comp.currentDifficulty}.`;
        } else {
          reason = 'Tuyệt vời! Bé đã đạt cấp độ Thử thách tối đa (Level 5) và tiếp tục duy trì phong độ đỉnh cao!';
        }
        // Sau khi nâng cấp, đặt lại chuỗi tự chủ để tích lũy chuỗi mới
        comp.consecutiveCorrectWithoutHint = 0;
      }
    } else {
      // --- TRƯỜNG HỢP TRẢ LỜI SAI ---
      comp.consecutiveWrong++;
      comp.consecutiveCorrect = 0; // Reset chuỗi đúng
      comp.consecutiveCorrectWithoutHint = 0;

      // QUY TẮC GIẢM ĐỘ KHÓ / HỖ TRỢ TRỰC QUAN:
      // "Nếu bé trả lời sai liên tiếp 2 câu: Không tiếp tục tăng độ khó. Đưa ra câu hỏi dễ hơn hoặc hướng dẫn trực quan."
      if (comp.consecutiveWrong >= 2) {
        // Trong CHALLENGE MODE: "không tự giảm độ khó giữa chặng, nhưng vẫn có gợi ý khi bé cần"
        if (record.gameMode === 'challenge') {
          adjustment = 'MAINTAIN';
          needsVisualSupport = true;
          reason = 'Chế độ Thử thách kiên cường: Giữ vững độ khó, Nữ hoàng bật gợi ý dịu dàng giúp bé!';
        } else {
          // STORY MODE & PRACTICE MODE: Giảm 1 mức độ khó nếu đang > 1
          if (comp.currentDifficulty > 1) {
            comp.currentDifficulty = (comp.currentDifficulty - 1) as MathDifficulty;
            adjustment = 'DOWN';
            reason = `Bé gặp đôi chút trở ngại. Nữ hoàng điều chỉnh câu hỏi về Level ${comp.currentDifficulty} để bé tự tin làm lại nhé!`;
          } else {
            reason = 'Nữ hoàng bổ sung thêm hình ảnh minh họa trực quan sinh động giúp bé quan sát.';
          }
          needsVisualSupport = true;
        }
        // Reset bộ đếm sai liên tiếp sau khi đã phản ứng điều chỉnh
        comp.consecutiveWrong = 0;
      }
    }

    // Cập nhật tỷ lệ chính xác
    comp.accuracy = Math.round((comp.correctCount / comp.totalQuestions) * 100);

    // Tính toán lại điểm Mastery (0..100) và cấp độ nhận thức
    comp.masteryScore = this.calculateMasteryScore(comp);
    comp.masteryLevel = this.getMasteryLevel(comp.masteryScore);

    // Lưu vào lịch sử gần đây
    this.state.recentAttempts.unshift(record);
    if (this.state.recentAttempts.length > 50) {
      this.state.recentAttempts.pop();
    }

    // Cập nhật danh sách chủ đề yếu / thế mạnh
    this.refreshStrengthsAndWeaknesses();

    return {
      topic: record.topic,
      previousDifficulty: prevDifficulty,
      newDifficulty: comp.currentDifficulty,
      adjustment,
      reason,
      needsVisualSupport,
      masteryScore: comp.masteryScore,
      masteryLevel: comp.masteryLevel,
      consecutiveCorrect: comp.consecutiveCorrect,
      consecutiveWrong: comp.consecutiveWrong,
    };
  }

  /**
   * Tính toán điểm năng lực thuần thục Mastery Score (0..100)
   * Yêu cầu: Dựa trên nhiều câu hỏi và nhiều lượt chơi, không dựa vào một lần làm bài đơn lẻ.
   * Không đánh giá năng lực chỉ dựa trên tốc độ làm bài.
   */
  public calculateMasteryScore(comp: ITopicCompetence): number {
    if (comp.totalQuestions === 0) return 0;

    const accuracy = (comp.correctCount / comp.totalQuestions) * 100;

    // Đo mức độ tự chủ (Autonomy): Tỷ lệ không lạm dụng gợi ý
    const hintRatio = comp.totalHintsUsed / comp.totalQuestions;
    const autonomyScore = Math.max(0, 100 - hintRatio * 35);

    // Mức độ khó cao nhất đã chinh phục thành công (Difficulty Mastery Bonus)
    // Level 1 = 20đ, Level 2 = 40đ, Level 3 = 60đ, Level 4 = 80đ, Level 5 = 100đ
    const difficultyScore = (comp.highestPassedDifficulty / 5) * 100;

    // Tổng hợp đa tiêu chí: 50% Accuracy + 25% Autonomy + 25% Difficulty Achieved
    const weightedScore = accuracy * 0.5 + autonomyScore * 0.25 + difficultyScore * 0.25;

    // Yếu tố độ tin cậy mẫu (Sample Confidence Factor):
    // Cần tối thiểu 5 câu hỏi để đạt 100% độ tin cậy. Dưới 5 câu thì áp dụng hệ số làm quen.
    const confidenceMultiplier = Math.min(1.0, 0.4 + (comp.totalQuestions / 5) * 0.6);
    let finalScore = weightedScore * confidenceMultiplier;

    // Thưởng nhẹ cho chuỗi đúng dài (Consistency Bonus):
    if (comp.consecutiveCorrect >= 5) {
      finalScore += 5;
    }

    return Math.min(100, Math.max(0, Math.round(finalScore)));
  }

  /**
   * Xác định bậc năng lực tương ứng theo thang điểm 0–100
   * 0–39: Cần luyện tập
   * 40–59: Đang tiến bộ
   * 60–79: Khá tốt
   * 80–94: Thành thạo
   * 95–100: Xuất sắc
   */
  public getMasteryLevel(score: number): MasteryLevel {
    if (score < 40) return 'needs_practice';
    if (score < 60) return 'progressing';
    if (score < 80) return 'proficient';
    if (score < 95) return 'mastered';
    return 'exemplary';
  }

  /**
   * Lấy nhãn hiển thị tiếng Việt sư phạm tích cực
   */
  public static getMasteryLabelVi(level: MasteryLevel): string {
    switch (level) {
      case 'needs_practice':
        return 'Cần luyện tập thêm';
      case 'progressing':
        return 'Đang tiến bộ tích cực';
      case 'proficient':
        return 'Làm bài khá tốt';
      case 'mastered':
        return 'Thành thạo tự tin';
      case 'exemplary':
        return 'Xuất sắc tuyệt đỉnh';
    }
  }

  /**
   * Cập nhật danh sách chủ đề yếu (cần cải thiện) và chủ đề mạnh
   */
  private refreshStrengthsAndWeaknesses(): void {
    const weaknesses: MathTopic[] = [];
    const strengths: MathTopic[] = [];

    for (const [topicStr, comp] of Object.entries(this.state.competenceByTopic)) {
      const topic = topicStr as MathTopic;
      if (!comp) continue;

      if (comp.totalQuestions >= 2 && comp.masteryScore < 60) {
        weaknesses.push(topic);
      } else if (comp.masteryScore >= 80) {
        strengths.push(topic);
      }
    }

    this.state.topicsNeedingImprovement = weaknesses;
    this.state.strongTopics = strengths;
  }

  /**
   * Lựa chọn câu hỏi tiếp theo thích ứng tối ưu (Adaptive Question Selection)
   */
  public getNextQuestionRecommendation(options?: {
    forcedTopic?: MathTopic;
    forcedDifficulty?: MathDifficulty;
    gameMode?: GameMode;
  }): IAdaptiveRecommendation {
    const mode = options?.gameMode || this.state.activeGameMode;
    let chosenTopic: MathTopic;
    let chosenDifficulty: MathDifficulty;
    let reason: string;
    let needsVisualSupport = false;

    if (options?.forcedTopic) {
      chosenTopic = options.forcedTopic;
      const comp = this.getOrCreateTopicCompetence(chosenTopic);
      chosenDifficulty = options.forcedDifficulty || comp.currentDifficulty;
      reason = `Chế độ Luyện tập: Bé đang rèn luyện chủ đề ${chosenTopic} ở Level ${chosenDifficulty}.`;
    } else if (mode === 'practice' && this.state.topicsNeedingImprovement.length > 0) {
      // Ưu tiên chủ đề bé đang yếu nhất
      const weakTopic = this.state.topicsNeedingImprovement[0];
      const comp = this.getOrCreateTopicCompetence(weakTopic);
      chosenTopic = weakTopic;
      chosenDifficulty = comp.currentDifficulty;
      needsVisualSupport = true;
      reason = `Hệ thống nhận thấy bé đang cần rèn luyện thêm chủ đề ${weakTopic}. Ưu tiên ôn tập vững vàng.`;
    } else {
      // Chế độ Story Mode hoặc bình thường: Lấy chủ đề tiếp theo
      const allTopics = Object.keys(this.state.competenceByTopic) as MathTopic[];
      chosenTopic = allTopics.length > 0 ? allTopics[0] : 'counting_recognition';
      const comp = this.getOrCreateTopicCompetence(chosenTopic);
      chosenDifficulty = options?.forcedDifficulty || comp.currentDifficulty;
      reason = `Câu hỏi thích ứng chuẩn năng lực Level ${chosenDifficulty}.`;
    }

    // Trong Challenge mode, đảm bảo mức độ tối thiểu là Level 4
    if (mode === 'challenge' && chosenDifficulty < 4) {
      chosenDifficulty = 4;
      reason = 'Chế độ Thử thách yêu cầu câu hỏi độ khó cao (Level 4 hoặc 5).';
    }

    // Chọn câu hỏi phù hợp nhất từ ngân hàng
    const candidateQuestion = this.pickQuestionFromBank(chosenTopic, chosenDifficulty, needsVisualSupport);

    return {
      recommendedTopic: chosenTopic,
      recommendedDifficulty: chosenDifficulty,
      gameMode: mode,
      needsVisualSupport,
      reason,
      candidateQuestion,
    };
  }

  /**
   * Lọc và chọn 1 câu hỏi từ QUESTION_BANK tránh lặp lại
   */
  public pickQuestionFromBank(
    topic: MathTopic,
    difficulty: MathDifficulty,
    needsVisualSupport: boolean = false
  ): IGrade1Question | undefined {
    let pool = QUESTION_BANK.filter(
      (q) => q.topic === topic && q.difficulty === difficulty && !this.recentQuestionIds.has(q.id)
    );

    // Nếu hết câu hỏi chưa làm, dùng lại pool cùng topic & difficulty
    if (pool.length === 0) {
      pool = QUESTION_BANK.filter((q) => q.topic === topic && q.difficulty === difficulty);
    }

    // Nếu vẫn không có đúng độ khó, tìm độ khó lân cận (+-1)
    if (pool.length === 0) {
      pool = QUESTION_BANK.filter(
        (q) => q.topic === topic && Math.abs(q.difficulty - difficulty) <= 1
      );
    }

    // Nếu vẫn không có câu hỏi thuộc topic này, lấy từ toàn bộ ngân hàng
    if (pool.length === 0) {
      pool = QUESTION_BANK.filter((q) => q.difficulty === difficulty);
    }

    // Nếu cần hỗ trợ trực quan, ưu tiên câu hỏi có visualData
    if (needsVisualSupport) {
      const visualPool = pool.filter((q) => q.visualData !== undefined);
      if (visualPool.length > 0) {
        pool = visualPool;
      }
    }

    if (pool.length === 0) {
      return QUESTION_BANK[0];
    }

    // Chọn ngẫu nhiên trong danh sách hợp lệ
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  /**
   * Nạp trạng thái đã lưu trữ
   */
  public loadState(savedState: IPlayerAdaptiveState): void {
    if (savedState) {
      this.state = JSON.parse(JSON.stringify(savedState));
      this.refreshStrengthsAndWeaknesses();
    }
  }
}
