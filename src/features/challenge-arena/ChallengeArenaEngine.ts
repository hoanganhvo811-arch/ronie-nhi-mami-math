// src/features/challenge-arena/ChallengeArenaEngine.ts
// Bộ Điều Khiển Đấu Trường Toán Học (Challenge Arena Engine) - Phase 5
// 5 Chế độ thử thách: 60s, Marathon 20 câu, Boss Battle 10 câu, Mystery Number, Multi-step
// Tuân thủ quy tắc: Có thể tắt đếm giờ, không dùng tốc độ làm tiêu chí duy nhất, lưu lịch sử

import type {
  ChallengeArenaMode,
  IArenaModeConfig,
  IArenaSessionState,
} from '../../types/training-and-arena';
import type { IGrade1Question, MathDifficulty } from '../../math-engine/types';
import { ADVANCED_QUESTION_BANK_12 } from '../../math-engine/advanced-bank';
import { QUESTION_BANK } from '../../math-engine/bank';
import { EvaluationEngine } from '../../math-engine/EvaluationEngine';
import { StarRatingEngine } from '../progression/StarRatingEngine';
import { ProgressionEngine } from '../progression/progressionEngine';

export const ARENA_MODES_CONFIG: Record<ChallengeArenaMode, IArenaModeConfig> = {
  speed_60s: {
    id: 'speed_60s',
    name: 'Thử Thách 60 Giây',
    subtitle: 'Giải nhanh chuẩn xác trong 60 giây',
    description: 'Bé hãy giải càng nhiều câu đố càng tốt trong 60 giây. Có thể tắt đồng hồ đếm giờ bất kỳ lúc nào!',
    icon: '⏱️',
    badgeName: 'Tia Chớp Tri Thức',
    accentColor: '#EF4444',
    bannerGradient: 'from-rose-600 via-orange-600 to-amber-600',
    totalQuestions: 20,
    hasTimer: true,
    defaultTimeSeconds: 60,
    rewardExp: 200,
    rewardStars: 3,
  },
  marathon_20q: {
    id: 'marathon_20q',
    name: 'Siêu Thử Thách Marathon',
    subtitle: 'Vượt qua 20 câu hỏi độ khó tăng dần',
    description: 'Chinh phục 20 câu hỏi từ nhận biết dễ đến nâng cao. Mỗi chặng 5 câu sẽ đưa bé lên một đỉnh cao mới!',
    icon: '🏃‍♂️',
    badgeName: 'Kiện Tướng Bền Bỉ',
    accentColor: '#3B82F6',
    bannerGradient: 'from-blue-600 via-indigo-600 to-purple-600',
    totalQuestions: 20,
    hasTimer: false,
    defaultTimeSeconds: 0,
    rewardExp: 350,
    rewardStars: 3,
  },
  boss_10q: {
    id: 'boss_10q',
    name: 'Đại Chiến Trùm Cuối',
    subtitle: 'Hạ gục Quái Vật Khổng Lồ qua 10 câu hỏi',
    description: 'Mỗi câu trả lời đúng sẽ giúp Ronie tung chưởng sao làm Boss mất máu! Đánh bại Boss để nhận cúp vàng!',
    icon: '👹',
    badgeName: 'Dũng Sĩ Diệt Trùm',
    accentColor: '#8B5CF6',
    bannerGradient: 'from-purple-700 via-pink-700 to-rose-700',
    totalQuestions: 10,
    hasTimer: false,
    defaultTimeSeconds: 0,
    rewardExp: 300,
    rewardStars: 3,
  },
  mystery_number: {
    id: 'mystery_number',
    name: 'Đi Tìm Số Bí Mật',
    subtitle: 'Giải mã các manh mối để tìm ẩn số',
    description: 'Lần theo các gợi ý của Nữ hoàng để khám phá ra con số bí mật đang ẩn nấp!',
    icon: '🕵️',
    badgeName: 'Thám Tử Số Học',
    accentColor: '#10B981',
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    totalQuestions: 5,
    hasTimer: false,
    defaultTimeSeconds: 0,
    rewardExp: 180,
    rewardStars: 3,
  },
  multi_step: {
    id: 'multi_step',
    name: 'Thử Thách Nhiều Bước',
    subtitle: 'Toán tư duy logic giải quyết qua 2-3 bước',
    description: 'Bài toán phối hợp nhiều sự kiện hấp dẫn rèn luyện tư duy logic toàn diện cho bé.',
    icon: '🧩',
    badgeName: 'Bộ Não Siêu Cấp',
    accentColor: '#F59E0B',
    bannerGradient: 'from-amber-600 via-yellow-600 to-emerald-600',
    totalQuestions: 5,
    hasTimer: false,
    defaultTimeSeconds: 0,
    rewardExp: 220,
    rewardStars: 3,
  },
};

export class ChallengeArenaEngine {
  private state: IArenaSessionState;
  private config: IArenaModeConfig;

  constructor(mode: ChallengeArenaMode = 'speed_60s', enableTimer: boolean = true) {
    this.config = ARENA_MODES_CONFIG[mode];
    this.state = this.initSession(mode, enableTimer);
  }

  public initSession(mode: ChallengeArenaMode, enableTimer: boolean = true): IArenaSessionState {
    const config = ARENA_MODES_CONFIG[mode];
    const questions = this.loadQuestionsForMode(mode);

    return {
      mode,
      isTimerEnabled: config.hasTimer ? enableTimer : false,
      timeRemainingSeconds: config.hasTimer ? config.defaultTimeSeconds : 0,
      totalTimeSpentSeconds: 0,
      questions,
      currentIndex: 0,
      currentQuestion: questions.length > 0 ? questions[0] : null,
      selectedOption: null,
      correctCount: 0,
      mistakesCount: 0,
      streak: 0,
      score: 0,
      bossHp: 100,
      maxBossHp: 100,
      isFinished: false,
    };
  }

  /**
   * Tải câu hỏi phù hợp cho từng chế độ đấu trường
   */
  private loadQuestionsForMode(mode: ChallengeArenaMode): IGrade1Question[] {
    const allPool: IGrade1Question[] = [...ADVANCED_QUESTION_BANK_12, ...QUESTION_BANK];

    switch (mode) {
      case 'speed_60s': {
        // Lấy các câu nhận biết & thông hiểu độ khó 1, 2
        const pool = allPool.filter((q) => q.difficulty <= 2);
        return this.shuffle(pool).slice(0, 20);
      }

      case 'marathon_20q': {
        // 20 câu độ khó tăng dần: 5 câu L1 -> 5 câu L2 -> 5 câu L3 -> 5 câu L4/L5
        const qL1 = this.shuffle(allPool.filter((q) => q.difficulty === 1)).slice(0, 5);
        const qL2 = this.shuffle(allPool.filter((q) => q.difficulty === 2)).slice(0, 5);
        const qL3 = this.shuffle(allPool.filter((q) => q.difficulty === 3)).slice(0, 5);
        const qL45 = this.shuffle(allPool.filter((q) => q.difficulty >= 4)).slice(0, 5);
        return [...qL1, ...qL2, ...qL3, ...qL45];
      }

      case 'boss_10q': {
        // 10 câu tư duy logic và vận dụng cao
        const pool = allPool.filter(
          (q) => q.difficulty >= 3 || q.topic === 'logical_thinking' || q.topic === 'word_problems'
        );
        return this.shuffle(pool).slice(0, 10);
      }

      case 'mystery_number': {
        // Các câu hỏi tìm số bí mật, điền số, cấu tạo số
        const pool = allPool.filter(
          (q) =>
            q.topic === 'missing_numbers' ||
            q.topic === 'number_composition' ||
            q.topic === 'tens_and_ones'
        );
        return this.shuffle(pool).slice(0, 5);
      }

      case 'multi_step': {
        // Các câu hỏi nhiều bước suy luận và toán lời văn
        const pool = allPool.filter(
          (q) => q.topic === 'word_problems' || q.topic === 'logical_thinking'
        );
        return this.shuffle(pool).slice(0, 5);
      }
    }
  }

  private shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  public getState(): IArenaSessionState {
    return { ...this.state };
  }

  /**
   * Bật hoặc tắt đồng hồ đếm ngược (đáp ứng tiêu chuẩn an toàn tâm lý)
   */
  public toggleTimer(enabled: boolean): void {
    this.state.isTimerEnabled = enabled;
  }

  /**
   * Giảm thời gian đếm ngược 1 giây (nếu bật đếm giờ)
   */
  public tickSecond(): { isTimeUp: boolean; remaining: number } {
    this.state.totalTimeSpentSeconds++;

    if (!this.state.isTimerEnabled) {
      return { isTimeUp: false, remaining: 0 };
    }

    if (this.state.timeRemainingSeconds > 0) {
      this.state.timeRemainingSeconds--;
    }

    const isTimeUp = this.state.timeRemainingSeconds <= 0;
    if (isTimeUp && !this.state.isFinished) {
      this.finishChallenge();
    }

    return {
      isTimeUp,
      remaining: this.state.timeRemainingSeconds,
    };
  }

  /**
   * Gửi đáp án trong đấu trường
   */
  public submitAnswer(answer: unknown): {
    isCorrect: boolean;
    bossHpLeft: number;
    scoreGained: number;
    isFinished: boolean;
  } {
    if (this.state.isFinished || !this.state.currentQuestion) {
      return { isCorrect: false, bossHpLeft: this.state.bossHp, scoreGained: 0, isFinished: true };
    }

    this.state.selectedOption = answer;
    const currentQ = this.state.currentQuestion;
    const evalResult = EvaluationEngine.evaluate(currentQ, answer);
    let scoreGained = 0;

    if (evalResult.isCorrect) {
      this.state.correctCount++;
      this.state.streak++;
      scoreGained = 30 + this.state.streak * 5;
      this.state.score += scoreGained;

      // Giảm máu Boss trong chế độ boss_10q
      if (this.state.mode === 'boss_10q') {
        const damagePerCorrect = Math.ceil(this.state.maxBossHp / this.state.questions.length);
        this.state.bossHp = Math.max(0, this.state.bossHp - damagePerCorrect);
      }
    } else {
      this.state.mistakesCount++;
      this.state.streak = 0;
    }

    const isLastQ = this.state.currentIndex + 1 >= this.state.questions.length;
    const isBossDead = this.state.mode === 'boss_10q' && this.state.bossHp <= 0;

    if (isLastQ || isBossDead) {
      this.finishChallenge();
    }

    return {
      isCorrect: evalResult.isCorrect,
      bossHpLeft: this.state.bossHp,
      scoreGained,
      isFinished: this.state.isFinished,
    };
  }

  /**
   * Chuyển câu hỏi kế tiếp
   */
  public nextQuestion(): boolean {
    if (this.state.isFinished) return false;

    if (this.state.currentIndex + 1 < this.state.questions.length) {
      this.state.currentIndex++;
      this.state.currentQuestion = this.state.questions[this.state.currentIndex];
      this.state.selectedOption = null;
      return true;
    } else {
      this.finishChallenge();
      return false;
    }
  }

  /**
   * Kết thúc thử thách và tổng kết (Không đánh giá chỉ dựa trên tốc độ)
   */
  public finishChallenge(): void {
    this.state.isFinished = true;
    this.state.currentQuestion = null;

    const totalAnswered = Math.max(1, this.state.currentIndex + 1);
    const accuracy = Math.round((this.state.correctCount / totalAnswered) * 100);

    // Đánh giá sao dựa trên độ chính xác & mức độ hoàn thành
    const starEval = StarRatingEngine.evaluateStars(
      100,
      totalAnswered,
      this.state.correctCount,
      this.state.mistakesCount,
      3
    );

    const expBreakdown = ProgressionEngine.calculateExpReward({
      baseExp: this.config.rewardExp,
      progress: 100,
      totalQuestions: totalAnswered,
      correctCount: this.state.correctCount,
      mistakesCount: this.state.mistakesCount,
      streak: this.state.streak,
      starsEarned: starEval.stars,
    });

    let title = 'Nhà Chinh Phục Đấu Trường';
    if (this.state.mode === 'boss_10q' && this.state.bossHp <= 0) {
      title = 'Dũng Sĩ Đánh Bại Trùm Cuối Khổng Lồ!';
    } else if (accuracy >= 90) {
      title = 'Thiên Tài Toán Học Toàn Năng!';
    }

    this.state.resultBreakdown = {
      accuracy,
      starsEarned: starEval.stars,
      expEarned: expBreakdown.totalExpGained,
      title,
      queenFeedback: starEval.feedback,
    };
  }
}
