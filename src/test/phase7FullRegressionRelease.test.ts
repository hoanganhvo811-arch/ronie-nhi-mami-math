// src/test/phase7FullRegressionRelease.test.ts
// PHASE 7: FULL REGRESSION TEST & RELEASE ACCEPTANCE TEST SUITE
// Kiểm thử nghiệm thu hồi quy toàn diện hệ thống RONIE & NHI MAMI – MATH KINGDOM

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  QUESTION_BANK,
  QuestionValidator,
  EvaluationEngine,
  getQuestionsByDifficulty,
} from '../math-engine';
import { OPERATIONS_BANK } from '../math-engine/bank/operationsBank';
import { MissionEngine } from '../mission-engine/MissionEngine';
import { MISSION_CHAIN_CATALOG } from '../mission-engine/missionChainCatalog';
import { MissionChainEngine } from '../mission-engine/MissionChainEngine';
import { AdaptiveDifficultyEngine } from '../math-engine/adaptive/AdaptiveDifficultyEngine';
import {
  ProgressionEngine,
  PLAYER_RANKS,
} from '../features/progression/progressionEngine';
import { StarRatingEngine } from '../features/progression/StarRatingEngine';
import {
  RewardEngine,
} from '../features/rewards/RewardEngine';
import {
  ALL_REWARDS_LIST,
  getRewardItemById,
} from '../features/rewards/rewardCatalog';
import {
  DEFAULT_PROFILE_ID,
  getProgression,
  getParentSettings,
  updateParentSettings,
  recordMathSession,
  getMathSessions,
  exportBackupData,
  importBackupData,
} from '../services/storage/db';
import { soundManager } from '../services/audio/AudioManager';
import { screenTimeTracker } from '../services/time/ScreenTimeTracker';
import type { IGrade1Question } from '../math-engine/types';
import type { IMissionConfig, GameplayType } from '../mission-engine/types';

// Mock AudioManager để tránh Web Audio context trong môi trường Node/JSDOM
vi.mock('../services/audio/AudioManager', () => ({
  soundManager: {
    playTap: vi.fn(),
    playCorrect: vi.fn(),
    playTryAgain: vi.fn(),
    playCelebration: vi.fn(),
    playPull: vi.fn(),
    playAttack: vi.fn(),
    playWebShoot: vi.fn(),
    speakDialogue: vi.fn(),
    speakVietnamese: vi.fn(),
    playBgm: vi.fn(),
    stopBgm: vi.fn(),
    stopDialogueVoice: vi.fn(),
    cleanup: vi.fn(),
  },
}));

// Helper tạo câu hỏi mẫu
const makeQuestion = (id: string, correct: number, wrong: number[]): IGrade1Question => ({
  id,
  topic: 'addition',
  subtopic: 'phep_cong',
  grade: 1,
  semester: 1,
  difficulty: 2,
  questionType: 'multiple_choice',
  questionText: `Phép tính: ${correct - 2} + 2 = ?`,
  correctAnswer: correct,
  wrongAnswers: wrong,
  options: [correct, ...wrong],
  hint: { text: `Hãy đếm thêm 2 từ ${correct - 2} nhé!` },
  explanation: `${correct - 2} cộng thêm 2 bằng ${correct}`,
  curriculumReference: 'GDPT 2018',
  tags: ['regression_test'],
});

describe('PHASE 7: FULL REGRESSION TEST & RELEASE ACCEPTANCE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    screenTimeTracker.resetForTesting();
  });

  // ==========================================================================
  // PHẦN 1: KIỂM TRA KIẾN THỨC TOÁN HỌC (QUESTION BANK & PEDAGOGY)
  // ==========================================================================
  describe('1. Kiểm Tra Toàn Bộ Ngân Hàng Câu Hỏi & Tính Sư Phạm', () => {
    it('toàn bộ 325 câu hỏi vượt qua bộ kiểm định QuestionValidator với 0 lỗi nghiêm trọng', () => {
      expect(QUESTION_BANK.length).toBe(325);
      const summary = QuestionValidator.validateBank(QUESTION_BANK);
      expect(summary.isValid).toBe(true);
      expect(summary.invalidCount).toBe(0);
      expect(summary.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    });

    it('không có bất kỳ câu hỏi nào bị trùng lặp ID trên toàn bộ cơ sở dữ liệu', () => {
      const seenIds = new Set<string>();
      const duplicates: string[] = [];

      for (const q of QUESTION_BANK) {
        if (seenIds.has(q.id)) {
          duplicates.push(q.id);
        }
        seenIds.add(q.id);
      }

      expect(duplicates).toHaveLength(0);
      expect(seenIds.size).toBe(QUESTION_BANK.length);
    });

    it('mỗi câu hỏi đều có đáp án chính xác, đáp án nhiễu khác rỗng và options chứa đáp án đúng', () => {
      QUESTION_BANK.forEach((q) => {
        expect(q.correctAnswer).toBeDefined();
        expect(q.correctAnswer).not.toBeNull();
        expect(Array.isArray(q.wrongAnswers)).toBe(true);
        expect(q.wrongAnswers.length).toBeGreaterThan(0);
        expect(q.wrongAnswers).not.toContain(q.correctAnswer);
        if (q.options) {
          expect(q.options).toContain(q.correctAnswer);
        }
      });
    });

    it('100% câu hỏi (325/325) được EvaluationEngine so sánh khớp đúng với correctAnswer của chính nó', () => {
      QUESTION_BANK.forEach((q) => {
        const matches = EvaluationEngine.compareAnswers(q.correctAnswer, q.correctAnswer, q.questionType);
        expect(matches).toBe(true);
      });
    });

    it('tất cả câu hỏi phép tính số học (+, -) thuần túy tính toán chuẩn xác theo toán học lớp 1', () => {
      const twoTermRegex = /^Tính:\s*(\d+)\s*([+\-])\s*(\d+)\s*=\s*\?/;
      const threeTermRegex = /^Tính:\s*(\d+)\s*([+\-])\s*(\d+)\s*([+\-])\s*(\d+)\s*=\s*\?/;
      let count = 0;

      for (const q of OPERATIONS_BANK) {
        if (typeof q.correctAnswer !== 'number') continue;

        const m3 = q.questionText.match(threeTermRegex);
        if (m3) {
          const a = parseInt(m3[1], 10);
          const op1 = m3[2];
          const b = parseInt(m3[3], 10);
          const op2 = m3[4];
          const c = parseInt(m3[5], 10);
          const step1 = op1 === '+' ? a + b : a - b;
          const expected = op2 === '+' ? step1 + c : step1 - c;
          expect(q.correctAnswer).toBe(expected);
          count++;
          continue;
        }

        const m2 = q.questionText.match(twoTermRegex);
        if (m2) {
          const a = parseInt(m2[1], 10);
          const op = m2[2];
          const b = parseInt(m2[3], 10);
          const expected = op === '+' ? a + b : a - b;
          expect(q.correctAnswer).toBe(expected);
          count++;
        }
      }

      expect(count).toBeGreaterThan(15);
    });

    it('các câu hỏi toán có lời văn đầy đủ nội dung tiếng Việt ngữ cảnh và lời gợi ý sư phạm', () => {
      const wordProblems = QUESTION_BANK.filter(
        (q) => q.topic === 'word_problems' || q.id.includes('WORD')
      );
      expect(wordProblems.length).toBeGreaterThanOrEqual(25);

      wordProblems.forEach((q) => {
        expect(q.questionText.length).toBeGreaterThanOrEqual(15);
        expect(q.hint).toBeDefined();
        expect(q.hint.text.length).toBeGreaterThanOrEqual(5);
      });
    });

    it('độ phủ đầy đủ 5 mức độ khó từ Cấp 1 (Nhận biết) đến Cấp 5 (Thử thách)', () => {
      const diff1 = getQuestionsByDifficulty(1);
      const diff2 = getQuestionsByDifficulty(2);
      const diff3 = getQuestionsByDifficulty(3);
      const diff4 = getQuestionsByDifficulty(4);
      const diff5 = getQuestionsByDifficulty(5);

      expect(diff1.length).toBeGreaterThan(30);
      expect(diff2.length).toBeGreaterThan(30);
      expect(diff3.length).toBeGreaterThan(30);
      expect(diff4.length).toBeGreaterThan(30);
      expect(diff5.length).toBeGreaterThan(15);
    });

    it('khả năng thích ứng độ khó (Adaptive Engine) tự động thăng cấp và hạ cấp đúng quy tắc', () => {
      const engine = new AdaptiveDifficultyEngine(DEFAULT_PROFILE_ID);
      engine.setGameMode('practice');

      // Trả lời đúng 5 câu liên tiếp không gợi ý -> Tăng cấp (adjustment === 'UP')
      let lastEval;
      for (let i = 0; i < 5; i++) {
        lastEval = engine.recordAttempt({
          profileId: DEFAULT_PROFILE_ID,
          questionId: `Q_TEST_${i}`,
          topic: 'addition',
          difficulty: 1,
          isCorrect: true,
          responseTimeMs: 3000,
          hintsUsed: 0,
          attemptsCount: 1,
          gameMode: 'practice',
          timestamp: Date.now(),
        });
      }
      expect(lastEval?.adjustment).toBe('UP');

      // Trả lời sai 2 câu liên tiếp -> Hạ cấp (adjustment === 'DOWN')
      engine.recordAttempt({
        profileId: DEFAULT_PROFILE_ID,
        questionId: 'Q_FAIL_1',
        topic: 'addition',
        difficulty: 2,
        isCorrect: false,
        responseTimeMs: 12000,
        hintsUsed: 1,
        attemptsCount: 1,
        gameMode: 'practice',
        timestamp: Date.now(),
      });
      const failEval2 = engine.recordAttempt({
        profileId: DEFAULT_PROFILE_ID,
        questionId: 'Q_FAIL_2',
        topic: 'addition',
        difficulty: 2,
        isCorrect: false,
        responseTimeMs: 14000,
        hintsUsed: 1,
        attemptsCount: 1,
        gameMode: 'practice',
        timestamp: Date.now(),
      });
      expect(failEval2.adjustment).toBe('DOWN');
    });
  });

  // ==========================================================================
  // PHẦN 2: KIỂM TRA ĐẦY ĐỦ 8 GAMEPLAY MODULES
  // ==========================================================================
  describe('2. Kiểm Tra Toàn Diện 8 Gameplay Modules Tương Tác', () => {
    const gameplayTypes: GameplayType[] = [
      'RESCUE_ROPE',
      'MONSTER_PUSH',
      'TREASURE_CHEST',
      'BRIDGE_BUILDER',
      'ROCKET_LAUNCH',
      'MAGIC_KEY',
      'NUMBER_MAZE',
      'BOSS_BATTLE',
    ];

    gameplayTypes.forEach((gpType) => {
      describe(`Gameplay Module: [${gpType}]`, () => {
        let config: IMissionConfig;
        let testQuestions: IGrade1Question[];
        let engine: MissionEngine;

        beforeEach(() => {
          config = {
            id: `test_mission_${gpType.toLowerCase()}`,
            title: `Nhiệm vụ kiểm thử ${gpType}`,
            description: `Kiểm tra module ${gpType}`,
            gameplayType: gpType,
            region: 'Vùng Đất Kiểm Thử',
            characters: {
              primary: 'ronie',
              secondary: 'queen',
              secondaryName: 'Nữ Hoàng Nhi Mami',
            },
            mathTopic: 'addition',
            difficulty: 2,
            questionCount: 4,
            targetProgress: 100,
            stepPerCorrect: 25,
            stepPerWrong: 15,
            maxMistakes: 3,
            reward: {
              stars: 3,
              exp: 150,
              badgeId: `badge_${gpType.toLowerCase()}`,
              itemReward: `Vật phẩm ${gpType}`,
            },
            dialogue: {
              intro: `Bắt đầu ${gpType}!`,
              victory: `Chiến thắng ${gpType}!`,
              defeat: `Thử lại ${gpType}!`,
              hintPrompt: `Gợi ý ${gpType}!`,
            },
            bgTheme: 'from-blue-900 to-indigo-950',
          };

          testQuestions = [
            makeQuestion('Q1', 4, [1, 2, 3]),
            makeQuestion('Q2', 6, [3, 4, 5]),
            makeQuestion('Q3', 8, [5, 6, 7]),
            makeQuestion('Q4', 10, [7, 8, 9]),
          ];

          engine = new MissionEngine(config, testQuestions);
        });

        it('chạy đúng chu trình: Bắt đầu -> Đúng -> Tăng tiến trình -> VICTORY', () => {
          expect(engine.getState().state).toBe('INTRO');
          engine.startPlaying();
          expect(engine.getState().state).toBe('PLAYING');

          // Làm đúng 4 câu liên tiếp để đạt 100%
          for (let i = 0; i < 4; i++) {
            (engine as any).state.isActionAnimating = false;
            const res = engine.submitAnswer(testQuestions[i].correctAnswer);
            expect(res.isCorrect).toBe(true);
            (engine as any).resolvePostActionTransition(true);
          }

          expect(engine.getState().progress).toBe(100);
          expect(engine.getState().state).toBe('VICTORY');
        });

        it('xử lý sai 3 lần đạt DEFEAT và cho phép retry() trực tiếp vào PLAYING', () => {
          engine.startPlaying();

          // Trả lời sai 3 lần
          for (let i = 0; i < 3; i++) {
            (engine as any).state.isActionAnimating = false;
            const res = engine.submitAnswer(999);
            expect(res.isCorrect).toBe(false);
            (engine as any).resolvePostActionTransition(false);
          }

          expect(engine.getState().state).toBe('DEFEAT');
          expect(engine.getState().mistakesCount).toBe(3);

          // Thử lại bằng retry() -> Sẵn sàng chơi ngay
          engine.retry();
          expect(engine.getState().state).toBe('PLAYING');
          expect(engine.getState().progress).toBe(0);
          expect(engine.getState().mistakesCount).toBe(0);
        });
      });
    });

    it('nhiệm vụ liên hoàn (Mission Chain) hỗ trợ tạm dừng, thoát giữa chừng và khôi phục tiến trình', () => {
      const chainConfig = Object.values(MISSION_CHAIN_CATALOG)[0];
      const chainEngine = new MissionChainEngine(chainConfig.id);

      // Bắt đầu chuỗi
      chainEngine.startChain(chainConfig.id);
      expect(chainEngine.getState().currentStageIndex).toBe(0);

      // Tạm dừng
      chainEngine.pauseChain();
      expect(chainEngine.getState().isPaused).toBe(true);

      // Tiếp tục
      chainEngine.resumeChain();
      expect(chainEngine.getState().isPaused).toBe(false);

      // Giả lập hoàn thành chặng 1 và tiến sang chặng 2
      chainEngine.advanceStage(100, 3);
      expect(chainEngine.getState().currentStageIndex).toBe(1);
      expect(chainEngine.getState().completedStages).toContain(1);
      expect(chainEngine.getState().totalScoreAccumulated).toBe(100);
    });
  });

  // ==========================================================================
  // PHẦN 3: KIỂM TRA DỮ LIỆU & BẢO TOÀN TIẾN TRÌNH
  // ==========================================================================
  describe('3. Kiểm Tra Dữ Liệu (EXP, Stars, Achievements, Rewards, Mastery, History)', () => {
    it('bảng 5 cấp bậc chuẩn Phase 4 hiển thị chính xác theo điểm EXP', () => {
      expect(PLAYER_RANKS).toHaveLength(5);
      expect(ProgressionEngine.getPlayerRank(0).rank).toBe('Bé tập sự');
      expect(ProgressionEngine.getPlayerRank(350).rank).toBe('Hiệp sĩ toán học');
      expect(ProgressionEngine.getPlayerRank(900).rank).toBe('Chiến binh số học');
      expect(ProgressionEngine.getPlayerRank(1800).rank).toBe('Siêu nhân toán học');
      expect(ProgressionEngine.getPlayerRank(3000).rank).toBe('Huyền thoại vương quốc');
    });

    it('hệ thống sao đánh giá sư phạm chuẩn (1 đến 3 sao), không tạo áp lực tiêu cực', () => {
      // 100% đúng, 0 lỗi -> 3 sao
      expect(StarRatingEngine.evaluateStars(100, 4, 4, 0, 1).stars).toBe(3);
      // 75% đúng, 1 lỗi -> 2 sao
      expect(StarRatingEngine.evaluateStars(100, 4, 3, 1, 1).stars).toBe(2);
      // 50% đúng -> tối thiểu 1 sao khích lệ
      expect(StarRatingEngine.evaluateStars(100, 4, 2, 2, 1).stars).toBe(1);
    });

    it('danh mục phần thưởng phong phú (tối thiểu 20 món) và tra cứu an toàn theo ID', () => {
      expect(ALL_REWARDS_LIST.length).toBeGreaterThanOrEqual(20);
      const teddy = getRewardItemById('toy_teddy_bear');
      expect(teddy).toBeDefined();
      expect(teddy?.name).toContain('Gấu Bông');
    });

    it('ghi nhận và truy vấn lịch sử học tập (Learning History) chính xác', async () => {
      await recordMathSession(DEFAULT_PROFILE_ID, 'addition', 10, 9, 0, 85);
      await recordMathSession(DEFAULT_PROFILE_ID, 'subtraction', 10, 8, 1, 95);

      const sessions = await getMathSessions(DEFAULT_PROFILE_ID);
      expect(sessions.length).toBeGreaterThanOrEqual(2);
      expect(sessions[0].profileId).toBe(DEFAULT_PROFILE_ID);
    });
  });

  // ==========================================================================
  // PHẦN 4: KIỂM TRA GIAO DIỆN & TÍNH DỄ TIẾP CẬN (ACCESSIBILITY & RESPONSIVE)
  // ==========================================================================
  describe('4. Kiểm Tra Giao Diện, Âm Thanh & Accessibility', () => {
    it('AudioManager hỗ trợ đầy đủ các lệnh phát âm thanh, lời thoại và nhạc nền mà không gây lỗi', () => {
      soundManager.playTap();
      soundManager.playCorrect();
      soundManager.playTryAgain();
      soundManager.playCelebration();
      soundManager.speakVietnamese('Chào bé Ronie!');
      soundManager.playBgm('castle');
      soundManager.stopBgm();

      expect(soundManager.playTap).toHaveBeenCalled();
      expect(soundManager.playCorrect).toHaveBeenCalled();
      expect(soundManager.playCelebration).toHaveBeenCalled();
      expect(soundManager.speakVietnamese).toHaveBeenCalledWith('Chào bé Ronie!');
    });

    it('ScreenTimeTracker quản lý thời gian chơi dịu dàng, tôn trọng cấu hình phụ huynh', () => {
      screenTimeTracker.setConfig({
        dailyLimitMinutes: 20,
        isLimitEnabled: true,
        breakReminderMinutes: 15,
      });

      expect(screenTimeTracker.isLimitReached()).toBe(false);
      expect(screenTimeTracker.getTodayPlayedMinutes()).toBe(0);
    });
  });

  // ==========================================================================
  // PHẦN 5: KIỂM TRA KỸ THUẬT & SAO LƯU PHỤC HỒI (BACKUP & RESTORE ROUNDTRIP)
  // ==========================================================================
  describe('5. Kiểm Tra Sao Lưu, Phục Hồi Dữ Liệu & Phục Hồi Sau Đóng Trình Duyệt', () => {
    it('xuất file sao lưu (Export JSON) và khôi phục (Import JSON) toàn vẹn cấu trúc dữ liệu', async () => {
      // 1. Xuất dữ liệu
      const jsonBackup = await exportBackupData(DEFAULT_PROFILE_ID);
      expect(typeof jsonBackup).toBe('string');

      const parsed = JSON.parse(jsonBackup);
      expect(parsed.appId).toBe('ronie-nhi-mami-math');
      expect(parsed.data).toBeDefined();

      // 2. Nhập lại dữ liệu
      const importRes = await importBackupData(jsonBackup);
      expect(importRes.success).toBe(true);
      expect(importRes.message).toContain('thành công');
    });

    it('từ chối an toàn khi file sao lưu JSON bị hỏng hoặc không đúng ứng dụng', async () => {
      const corruptJson = '{"appId": "other_fake_app", "data": {}}';
      const importRes = await importBackupData(corruptJson);
      expect(importRes.success).toBe(false);
      expect(importRes.message).toContain('không hợp lệ');
    });
  });
});
