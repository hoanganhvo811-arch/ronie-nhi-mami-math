// src/mission-engine/MissionEngine.ts
// Bộ điều phối Nhiệm vụ và Gameplay cốt lõi dùng chung (Unified Mission Engine - Phase 4)

import type {
  IMissionConfig,
  IMissionRunState,
  MissionState,
} from './types';
import type { IGrade1Question } from '../math-engine/types';
import { EvaluationEngine } from '../math-engine/EvaluationEngine';
import { getRandomQuestions } from '../math-engine/bank';
import { soundManager } from '../services/audio/AudioManager';

export type MissionStateListener = (state: IMissionRunState) => void;

export class MissionEngine {
  private config: IMissionConfig;
  private questions: IGrade1Question[] = [];
  private state: IMissionRunState;
  private listeners: Set<MissionStateListener> = new Set();
  private questionAttempts: number = 0;
  private actionTimer: any = null;

  constructor(config: IMissionConfig, questions?: IGrade1Question[]) {
    this.config = config;
    this.questions = questions && questions.length > 0 ? questions : this.loadQuestionsForConfig(config);

    this.state = {
      missionId: config.id,
      state: 'INTRO',
      currentQuestionIndex: 0,
      currentQuestion: this.questions[0] || null,
      progress: 0,
      correctCount: 0,
      mistakesCount: 0,
      streak: 0,
      score: 0,
      ronieAnimState: 'idle',
      secondaryAnimState: 'idle',
      isActionAnimating: false,
      actionFeedback: null,
    };
  }

  /**
   * Tải câu hỏi phù hợp từ Ngân hàng câu hỏi kiểm định (Phase 3)
   */
  private loadQuestionsForConfig(config: IMissionConfig): IGrade1Question[] {
    return getRandomQuestions({
      topic: config.mathTopic,
      difficulty: config.difficulty,
      count: config.questionCount,
    });
  }

  public subscribe(listener: MissionStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const currentState = this.getState();
    this.listeners.forEach((l) => l(currentState));
  }

  public getState(): IMissionRunState {
    return { ...this.state };
  }

  public getConfig(): IMissionConfig {
    return this.config;
  }

  public getQuestions(): IGrade1Question[] {
    return [...this.questions];
  }

  /**
   * Bắt đầu chơi sau khi xem xong phần giới thiệu (Intro)
   */
  public startPlaying(): void {
    this.state.state = 'PLAYING';
    this.state.ronieAnimState = 'idle';
    this.state.secondaryAnimState = 'idle';
    this.questionAttempts = 0;
    this.notify();
  }

  /**
   * Gửi câu trả lời toán học và tương tác trực tiếp lên thế giới game
   */
  public submitAnswer(answer: unknown, timeSpentMs: number = 2000): {
    isCorrect: boolean;
    progress: number;
    feedback: string;
  } {
    // Ngăn chặn bấm liên tục khi đang diễn hoạt hành động
    if (this.state.isActionAnimating || this.state.state !== 'PLAYING') {
      return {
        isCorrect: false,
        progress: this.state.progress,
        feedback: 'Đang thực hiện chuyển động...',
      };
    }

    const currentQ = this.state.currentQuestion;
    if (!currentQ) {
      return { isCorrect: false, progress: this.state.progress, feedback: 'Không có câu hỏi.' };
    }

    this.questionAttempts++;
    const evalResult = EvaluationEngine.evaluate(currentQ, answer, {
      timeSpentMs,
      attemptsCount: this.questionAttempts,
    });

    this.state.isActionAnimating = true;

    if (evalResult.isCorrect) {
      this.handleCorrectAnswer(evalResult.score);
    } else {
      this.handleWrongAnswer();
    }

    this.notify();

    // Sau khi hoạt ảnh kết thúc (khoảng 1.2s - 1.5s), chuyển tiếp trạng thái
    if (this.actionTimer) clearTimeout(this.actionTimer);
    this.actionTimer = setTimeout(() => {
      this.resolvePostActionTransition(evalResult.isCorrect);
    }, 1200);

    return {
      isCorrect: evalResult.isCorrect,
      progress: this.state.progress,
      feedback: evalResult.feedbackMessage,
    };
  }

  /**
   * Xử lý khi trả lời đúng theo từng loại cơ chế gameplay
   */
  private handleCorrectAnswer(scoreGain: number): void {
    soundManager.playCorrect();
    this.state.correctCount++;
    this.state.streak++;
    this.state.score += scoreGain;

    // Tăng tiến trình
    const newProgress = Math.min(100, this.state.progress + this.config.stepPerCorrect);
    this.state.progress = newProgress;

    // Hiệu ứng và hành động nhân vật theo Gameplay Type
    switch (this.config.gameplayType) {
      case 'RESCUE_ROPE':
        soundManager.playPull();
        this.state.ronieAnimState = 'pull';
        this.state.secondaryAnimState = 'happy';
        this.state.actionFeedback = {
          text: `🕸️ Ronie gồng sức kéo tơ lên! (+${this.config.stepPerCorrect}m)`,
          type: 'success',
          timestamp: Date.now(),
        };
        break;

      case 'PUSH_BACK_MONSTER':
        soundManager.playAttack();
        this.state.ronieAnimState = 'attack';
        this.state.secondaryAnimState = 'pushed_back';
        this.state.actionFeedback = {
          text: `💥 Bắn tơ sao! Quái vật bị đẩy lùi! (+${this.config.stepPerCorrect}m)`,
          type: 'success',
          timestamp: Date.now(),
        };
        break;

      case 'BRIDGE_CROSSING':
        soundManager.playTap();
        this.state.ronieAnimState = 'jump';
        this.state.secondaryAnimState = 'clapping';
        this.state.actionFeedback = {
          text: `🌈 Viên đá ma thuật nổi lên! Ronie nhảy vọt qua! (+${this.config.stepPerCorrect}%)`,
          type: 'success',
          timestamp: Date.now(),
        };
        break;

      case 'TREASURE_CHEST':
        soundManager.playTap();
        this.state.ronieAnimState = 'celebrate';
        this.state.secondaryAnimState = 'happy';
        this.state.actionFeedback = {
          text: `🔓 Tách! Một ổ khóa hoàng gia đã được mở!`,
          type: 'success',
          timestamp: Date.now(),
        };
        break;

      case 'SHUTDOWN_MACHINE':
        soundManager.playPull();
        this.state.ronieAnimState = 'pull';
        this.state.secondaryAnimState = 'surprised';
        this.state.actionFeedback = {
          text: `⚙️ Xả van năng lượng! Cỗ máy giảm nhiệt! (-${this.config.stepPerCorrect}%)`,
          type: 'success',
          timestamp: Date.now(),
        };
        break;

      case 'MATH_RACING':
        soundManager.playWebShoot();
        this.state.ronieAnimState = 'run';
        this.state.secondaryAnimState = 'surprised';
        this.state.actionFeedback = {
          text: `🏎️ Siêu xe Ronie tăng tốc xé gió vượt lên! (+${this.config.stepPerCorrect}m)`,
          type: 'success',
          timestamp: Date.now(),
        };
        break;
    }
  }

  /**
   * Xử lý khi trả lời sai (không phạt nặng, có phản hồi trực quan)
   */
  private handleWrongAnswer(): void {
    soundManager.playTryAgain();
    this.state.mistakesCount++;
    this.state.streak = 0;

    // Tụt lùi tiến trình nhẹ
    const newProgress = Math.max(0, this.state.progress - this.config.stepPerWrong);
    this.state.progress = newProgress;
    this.state.ronieAnimState = 'sad';

    switch (this.config.gameplayType) {
      case 'RESCUE_ROPE':
        this.state.secondaryAnimState = 'scared';
        this.state.actionFeedback = {
          text: `Sợi tơ bị trượt nhẹ! Cố lên bé ơi!`,
          type: 'warning',
          timestamp: Date.now(),
        };
        break;

      case 'PUSH_BACK_MONSTER':
        this.state.secondaryAnimState = 'advance';
        this.state.actionFeedback = {
          text: `Quái vật nhón chân tiến lên một bước!`,
          type: 'warning',
          timestamp: Date.now(),
        };
        break;

      case 'BRIDGE_CROSSING':
        this.state.secondaryAnimState = 'worried';
        this.state.actionFeedback = {
          text: `Viên đá bị rung rinh nhẹ! Bé hãy chọn lại nhé!`,
          type: 'warning',
          timestamp: Date.now(),
        };
        break;

      case 'TREASURE_CHEST':
        this.state.secondaryAnimState = 'idle';
        this.state.actionFeedback = {
          text: `Khóa ma thuật rung lắc! Chưa mở được!`,
          type: 'warning',
          timestamp: Date.now(),
        };
        break;

      case 'SHUTDOWN_MACHINE':
        this.state.secondaryAnimState = 'laughing';
        this.state.actionFeedback = {
          text: `Ống hơi phì nhẹ! Cỗ máy vẫn còn hoạt động!`,
          type: 'warning',
          timestamp: Date.now(),
        };
        break;

      case 'MATH_RACING':
        this.state.secondaryAnimState = 'advance';
        this.state.actionFeedback = {
          text: `Xe của Robot bíp bíp vượt lên một chút!`,
          type: 'warning',
          timestamp: Date.now(),
        };
        break;
    }
  }

  /**
   * Chuyển cảnh sau khi diễn hoạt hoàn tất (Kiểm tra thắng/thua hoặc sang câu tiếp theo)
   */
  private resolvePostActionTransition(wasCorrect: boolean): void {
    this.state.isActionAnimating = false;

    // 1. Kiểm tra điều kiện Thắng (Win Condition)
    if (this.state.progress >= this.config.targetProgress) {
      soundManager.playCelebration();
      this.state.state = 'VICTORY';
      this.state.ronieAnimState = 'victory';
      this.state.secondaryAnimState = 'happy';
      this.notify();
      return;
    }

    // 2. Kiểm tra điều kiện Thua (Lose Condition)
    if (this.state.mistakesCount >= this.config.maxMistakes) {
      this.state.state = 'DEFEAT';
      this.state.ronieAnimState = 'defeat';
      this.state.secondaryAnimState = 'worried';
      this.notify();
      return;
    }

    // 3. Nếu đúng và chưa hết câu hỏi, chuyển sang câu tiếp theo
    if (wasCorrect) {
      const nextIndex = this.state.currentQuestionIndex + 1;
      if (nextIndex < this.questions.length) {
        this.state.currentQuestionIndex = nextIndex;
        this.state.currentQuestion = this.questions[nextIndex];
        this.questionAttempts = 0;
      } else {
        // Hết câu hỏi mà chưa đủ 100% -> Tự động đạt điều kiện hoàn thành nếu số câu đúng chiếm đa số
        soundManager.playCelebration();
        this.state.progress = 100;
        this.state.state = 'VICTORY';
        this.state.ronieAnimState = 'victory';
      }
    }

    this.state.ronieAnimState = 'idle';
    this.notify();
  }

  /**
   * Tạm dừng nhiệm vụ (Pause)
   */
  public pause(): void {
    if (this.state.state === 'PLAYING') {
      soundManager.playTap();
      this.state.state = 'PAUSED';
      this.notify();
    }
  }

  /**
   * Tiếp tục nhiệm vụ sau khi tạm dừng (Resume)
   */
  public resume(): void {
    if (this.state.state === 'PAUSED') {
      soundManager.playTap();
      this.state.state = 'PLAYING';
      this.notify();
    }
  }

  /**
   * Chơi lại nhiệm vụ từ đầu (Retry)
   */
  public retry(): void {
    soundManager.playTap();
    this.questions = this.loadQuestionsForConfig(this.config);
    this.state = {
      missionId: this.config.id,
      state: 'PLAYING',
      currentQuestionIndex: 0,
      currentQuestion: this.questions[0] || null,
      progress: 0,
      correctCount: 0,
      mistakesCount: 0,
      streak: 0,
      score: 0,
      ronieAnimState: 'idle',
      secondaryAnimState: 'idle',
      isActionAnimating: false,
      actionFeedback: null,
    };
    this.questionAttempts = 0;
    this.notify();
  }
}
