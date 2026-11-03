// src/test/missionEngine.test.ts
// Bộ kiểm thử tự động toàn diện cho Mission Engine & 6 Cơ chế Gameplay Cốt lõi (Phase 4)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MissionEngine,
  MISSION_CATALOG,
  ALL_MISSIONS_LIST,
  getMissionConfigById,
  getMissionsByGameplayType,
  type IMissionConfig,
} from '../mission-engine';
import type { IGrade1Question } from '../math-engine/types';

// Mock audio manager to avoid DOM audio issues in node test environment
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
  },
}));

// Tạo tập câu hỏi mẫu kiểm thử
const createMockQuestion = (id: string, correct: number, wrong: number[]): IGrade1Question => ({
  id,
  topic: 'numbers',
  subtopic: 'dem_so',
  grade: 1,
  semester: 1,
  difficulty: 1,
  questionType: 'multiple_choice',
  questionText: `Câu hỏi mẫu ${id}?`,
  correctAnswer: correct,
  wrongAnswers: wrong,
  options: [correct, ...wrong],
  hint: { text: `Gợi ý cho ${id}` },
  explanation: `Giải thích cho ${id}`,
  curriculumReference: 'GDPT 2018 Toán 1',
  tags: ['test'],
});

const mockQuestions: IGrade1Question[] = [
  createMockQuestion('MOCK_Q1', 5, [2, 3, 4]),
  createMockQuestion('MOCK_Q2', 8, [6, 7, 9]),
  createMockQuestion('MOCK_Q3', 10, [7, 8, 9]),
  createMockQuestion('MOCK_Q4', 3, [1, 2, 4]),
];

describe('1. Danh Mục Nhiệm Vụ Cốt Lõi (Mission Catalog Integrity)', () => {
  it('danh mục có đầy đủ 6 nhiệm vụ gameplay theo đặc tả Phase 4', () => {
    expect(ALL_MISSIONS_LIST.length).toBe(6);
    expect(Object.keys(MISSION_CATALOG).length).toBe(6);
  });

  it('hỗ trợ đầy đủ 6 loại cơ chế gameplay khác nhau', () => {
    const types = new Set(ALL_MISSIONS_LIST.map((m) => m.gameplayType));
    expect(types.has('RESCUE_ROPE')).toBe(true);
    expect(types.has('PUSH_BACK_MONSTER')).toBe(true);
    expect(types.has('BRIDGE_CROSSING')).toBe(true);
    expect(types.has('TREASURE_CHEST')).toBe(true);
    expect(types.has('SHUTDOWN_MACHINE')).toBe(true);
    expect(types.has('MATH_RACING')).toBe(true);
    expect(types.size).toBe(6);
  });

  it('mọi nhiệm vụ đều có tham số tiến trình và điều kiện thắng/thua rõ ràng', () => {
    ALL_MISSIONS_LIST.forEach((m) => {
      expect(m.targetProgress).toBe(100);
      expect(m.stepPerCorrect).toBeGreaterThan(0);
      expect(m.stepPerWrong).toBeGreaterThan(0);
      expect(m.maxMistakes).toBeGreaterThanOrEqual(2);
      expect(m.dialogue.intro).toBeTruthy();
      expect(m.dialogue.victory).toBeTruthy();
      expect(m.dialogue.defeat).toBeTruthy();
    });
  });

  it('hàm truy vấn getMissionConfigById và getMissionsByGameplayType hoạt động chính xác', () => {
    const rescueMission = getMissionConfigById('mission_01_rescue_girl');
    expect(rescueMission).toBeDefined();
    expect(rescueMission?.gameplayType).toBe('RESCUE_ROPE');

    const racingMissions = getMissionsByGameplayType('MATH_RACING');
    expect(racingMissions.length).toBe(1);
    expect(racingMissions[0].id).toBe('mission_06_math_racing');
  });
});

describe('2. Unified Mission Engine - Vòng Đời Trạng Thái (State Machine Lifecycle)', () => {
  let engine: MissionEngine;
  let testConfig: IMissionConfig;

  beforeEach(() => {
    testConfig = { ...MISSION_CATALOG.mission_01_rescue_girl, questionCount: 4 };
    engine = new MissionEngine(testConfig, mockQuestions);
  });

  it('khởi tạo nhiệm vụ ở trạng thái INTRO với 0% tiến trình', () => {
    const state = engine.getState();
    expect(state.state).toBe('INTRO');
    expect(state.progress).toBe(0);
    expect(state.correctCount).toBe(0);
    expect(state.mistakesCount).toBe(0);
    expect(state.currentQuestion?.id).toBe('MOCK_Q1');
  });

  it('chuyển sang PLAYING khi gọi startPlaying()', () => {
    engine.startPlaying();
    expect(engine.getState().state).toBe('PLAYING');
  });

  it('hỗ trợ tạm dừng (pause) và tiếp tục (resume)', () => {
    engine.startPlaying();
    expect(engine.getState().state).toBe('PLAYING');

    engine.pause();
    expect(engine.getState().state).toBe('PAUSED');

    engine.resume();
    expect(engine.getState().state).toBe('PLAYING');
  });

  it('hỗ trợ chơi lại từ đầu (retry) thiết lập lại toàn bộ tiến trình', () => {
    engine.startPlaying();
    engine.submitAnswer(5); // Đúng câu 1
    expect(engine.getState().progress).toBeGreaterThan(0);

    engine.retry();
    const resetState = engine.getState();
    expect(resetState.state).toBe('PLAYING');
    expect(resetState.progress).toBe(0);
    expect(resetState.correctCount).toBe(0);
    expect(resetState.mistakesCount).toBe(0);
    expect(resetState.score).toBe(0);
  });

  it('cho phép đăng ký lắng nghe (subscribe) trạng thái thay đổi', () => {
    const spyListener = vi.fn();
    const unsub = engine.subscribe(spyListener);

    expect(spyListener).toHaveBeenCalledTimes(1);
    engine.startPlaying();
    expect(spyListener).toHaveBeenCalledTimes(2);

    unsub();
    engine.pause();
    expect(spyListener).toHaveBeenCalledTimes(2);
  });
});

describe('3. Cơ Chế Gameplay Tương Tác & Phản Hồi Toán Học (Interactive Mechanics)', () => {
  it('Nhiệm vụ 1 (RESCUE_ROPE): Trả lời đúng kéo tơ lên (+25%), trả lời sai tụt xuống', () => {
    const config = MISSION_CATALOG.mission_01_rescue_girl;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    // Trả lời đúng câu 1 (đáp án 5)
    const result1 = engine.submitAnswer(5);
    expect(result1.isCorrect).toBe(true);
    expect(engine.getState().progress).toBe(25);
    expect(engine.getState().ronieAnimState).toBe('pull');
    expect(engine.getState().actionFeedback?.text).toContain('kéo tơ lên');

    // Trả lời sai (đáp án 99)
    // Giả lập kết thúc animation lock để test tiếp
    (engine as any).state.isActionAnimating = false;
    const result2 = engine.submitAnswer(99);
    expect(result2.isCorrect).toBe(false);
    expect(engine.getState().progress).toBe(10); // 25 - 15 = 10
    expect(engine.getState().mistakesCount).toBe(1);
    expect(engine.getState().actionFeedback?.text).toContain('trượt nhẹ');
  });

  it('Nhiệm vụ 2 (PUSH_BACK_MONSTER): Trả lời đúng bắn tơ sao đẩy lùi quái vật', () => {
    const config = MISSION_CATALOG.mission_02_cookie_monster;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    const res = engine.submitAnswer(5);
    expect(res.isCorrect).toBe(true);
    expect(engine.getState().progress).toBe(25);
    expect(engine.getState().ronieAnimState).toBe('attack');
    expect(engine.getState().secondaryAnimState).toBe('pushed_back');
    expect(engine.getState().actionFeedback?.text).toContain('Bắn tơ sao');
  });

  it('Nhiệm vụ 3 (BRIDGE_CROSSING): Trả lời đúng Ronie nhảy qua viên đá', () => {
    const config = MISSION_CATALOG.mission_03_bridge_crossing;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    const res = engine.submitAnswer(5);
    expect(res.isCorrect).toBe(true);
    expect(engine.getState().ronieAnimState).toBe('jump');
    expect(engine.getState().actionFeedback?.text).toContain('Viên đá ma thuật');
  });

  it('Nhiệm vụ 4 (TREASURE_CHEST): Trả lời đúng mở khóa kho báu', () => {
    const config = MISSION_CATALOG.mission_04_treasure_chest;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    const res = engine.submitAnswer(5);
    expect(res.isCorrect).toBe(true);
    expect(engine.getState().ronieAnimState).toBe('celebrate');
    expect(engine.getState().actionFeedback?.text).toContain('ổ khóa hoàng gia');
  });

  it('Nhiệm vụ 5 (SHUTDOWN_MACHINE): Trả lời đúng gạt cần xả nhiệt cỗ máy', () => {
    const config = MISSION_CATALOG.mission_05_candy_machine;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    const res = engine.submitAnswer(5);
    expect(res.isCorrect).toBe(true);
    expect(engine.getState().ronieAnimState).toBe('pull');
    expect(engine.getState().actionFeedback?.text).toContain('Xả van năng lượng');
  });

  it('Nhiệm vụ 6 (MATH_RACING): Trả lời đúng xe nhện tăng tốc vượt lên', () => {
    const config = MISSION_CATALOG.mission_06_math_racing;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    const res = engine.submitAnswer(5);
    expect(res.isCorrect).toBe(true);
    expect(engine.getState().ronieAnimState).toBe('run');
    expect(engine.getState().actionFeedback?.text).toContain('tăng tốc xé gió');
  });
});

describe('4. Điều Kiện Thắng / Thua & Cơ Chế Khóa Nhấp (Win / Lose & Anti-Spam)', () => {
  it('ngăn chặn nhấp phím liên tục khi đang diễn hoạt (isActionAnimating lock)', () => {
    const config = MISSION_CATALOG.mission_01_rescue_girl;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    // Lần bấm 1: hợp lệ
    const res1 = engine.submitAnswer(5);
    expect(res1.isCorrect).toBe(true);
    expect(engine.getState().isActionAnimating).toBe(true);

    // Lần bấm 2 ngay lập tức: bị chặn bởi guard
    const res2 = engine.submitAnswer(5);
    expect(res2.isCorrect).toBe(false);
    expect(res2.feedback).toContain('chuyển động');
  });

  it('kích hoạt trạng thái VICTORY khi tiến trình đạt 100%', () => {
    const config = MISSION_CATALOG.mission_01_rescue_girl;
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    // Giả lập hoàn thành các câu hỏi để đạt 100%
    (engine as any).state.progress = 75;
    (engine as any).state.isActionAnimating = false;

    engine.submitAnswer(5); // +25% -> đạt 100%
    expect(engine.getState().progress).toBe(100);

    // Giải phóng transition
    (engine as any).resolvePostActionTransition(true);

    expect(engine.getState().state).toBe('VICTORY');
    expect(engine.getState().ronieAnimState).toBe('victory');
  });

  it('kích hoạt trạng thái DEFEAT khi đạt số lần sai tối đa (maxMistakes)', () => {
    const config = MISSION_CATALOG.mission_01_rescue_girl; // maxMistakes = 3
    const engine = new MissionEngine(config, mockQuestions);
    engine.startPlaying();

    (engine as any).state.mistakesCount = 2;
    (engine as any).state.isActionAnimating = false;

    // Lần sai thứ 3
    engine.submitAnswer(99);
    expect(engine.getState().mistakesCount).toBe(3);

    (engine as any).resolvePostActionTransition(false);

    expect(engine.getState().state).toBe('DEFEAT');
    expect(engine.getState().ronieAnimState).toBe('defeat');
  });
});
