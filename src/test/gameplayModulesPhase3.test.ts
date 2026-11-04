// src/test/gameplayModulesPhase3.test.ts
// Kiểm thử toàn diện 8 Gameplay Modules & Hệ Thống Nhiệm Vụ Liên Hoàn (Mission Chain) - Phase 3

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MissionEngine } from '../mission-engine/MissionEngine';
import { MISSION_CATALOG } from '../mission-engine/missionCatalog';
import { MISSION_CHAIN_CATALOG } from '../mission-engine/missionChainCatalog';
import { MissionChainEngine } from '../mission-engine/MissionChainEngine';
import type { IGrade1Question } from '../math-engine/types';

// Mock soundManager to avoid audio DOM elements in Node vitest
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

// Mock questions for reliable deterministic testing
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
  createMockQuestion('MOCK_Q5', 7, [4, 5, 6]),
];

describe('PHASE 3: 8 Gameplay Modules Testing', () => {
  // 1. RESCUE ROPE (Kéo nhân vật khỏi vực sâu)
  it('Module 1 [RESCUE_ROPE]: Kéo tơ lên khi trả lời đúng, trượt nhẹ khi trả lời sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_01_rescue_girl, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    expect(q).not.toBeNull();

    // Đúng
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(25);
    expect(state.ronieAnimState).toBe('pull');
    expect(state.secondaryAnimState).toBe('happy');
    expect(state.actionFeedback?.text).toContain('Ronie gồng sức kéo tơ');

    // Mở khóa animation để test tiếp trường hợp sai
    (engine as any).state.isActionAnimating = false;

    // Sai
    engine.submitAnswer('WRONG_ANSWER_DUMMY');
    state = engine.getState();
    expect(state.mistakesCount).toBe(1);
    expect(state.progress).toBe(10); // 25 - 15 = 10
    expect(state.ronieAnimState).toBe('sad');
    expect(state.secondaryAnimState).toBe('scared');
    expect(state.actionFeedback?.text).toContain('Sợi tơ bị trượt nhẹ');
  });

  // 2. MONSTER PUSH (Đẩy lùi quái vật bánh quy)
  it('Module 2 [MONSTER_PUSH]: Bắn tơ đẩy lùi quái vật khi đúng, quái vật nhón chân khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_02_cookie_monster, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(25);
    expect(state.ronieAnimState).toBe('attack');
    expect(state.secondaryAnimState).toBe('pushed_back');
    expect(state.actionFeedback?.text).toContain('Bắn tơ sao! Quái vật bị đẩy lùi');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.ronieAnimState).toBe('sad');
    expect(state.secondaryAnimState).toBe('advance');
    expect(state.actionFeedback?.text).toContain('Quái vật nhón chân tiến lên');
  });

  // 3. BRIDGE BUILDER (Xây cầu đá kỳ diệu qua sông)
  it('Module 3 [BRIDGE_BUILDER]: Viên đá nổi lên khi đúng, rung rinh khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_03_bridge_crossing, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(25);
    expect(state.ronieAnimState).toBe('jump');
    expect(state.secondaryAnimState).toBe('clapping');
    expect(state.actionFeedback?.text).toContain('Viên đá ma thuật nổi lên');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.ronieAnimState).toBe('sad');
    expect(state.secondaryAnimState).toBe('worried');
    expect(state.actionFeedback?.text).toContain('Viên đá bị rung rinh nhẹ');
  });

  // 4. TREASURE CHEST (Mở rương kho báu hoàng gia)
  it('Module 4 [TREASURE_CHEST]: Mở ổ khóa hoàng gia khi đúng, rung lắc khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_04_treasure_chest, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(25);
    expect(state.ronieAnimState).toBe('celebrate');
    expect(state.secondaryAnimState).toBe('happy');
    expect(state.actionFeedback?.text).toContain('Một ổ khóa hoàng gia đã được mở');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.actionFeedback?.text).toContain('Khóa ma thuật rung lắc');
  });

  // 5. ROCKET LAUNCH (Phóng tên lửa vũ trụ)
  it('Module 5 [ROCKET_LAUNCH]: Nạp tầng nhiên liệu sao khi đúng, xì khói nhẹ khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_07_rocket_launch, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(25);
    expect(state.ronieAnimState).toBe('jump');
    expect(state.secondaryAnimState).toBe('happy');
    expect(state.actionFeedback?.text).toContain('Nhiên liệu sao nạp đầy');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.secondaryAnimState).toBe('worried');
    expect(state.actionFeedback?.text).toContain('Ống khói tên lửa xì nhẹ');
  });

  // 6. MAGIC KEY (Tìm chìa khóa ma thuật)
  it('Module 6 [MAGIC_KEY]: Đúc mảnh chìa khóa vàng khi đúng, chưa đúng rãnh khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_08_magic_key, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(34);
    expect(state.ronieAnimState).toBe('celebrate');
    expect(state.secondaryAnimState).toBe('happy');
    expect(state.actionFeedback?.text).toContain('Mảnh chìa khóa vàng phát sáng');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.actionFeedback?.text).toContain('Chìa khóa ma thuật chưa đúng rãnh');
  });

  // 7. NUMBER MAZE (Vượt mê cung số)
  it('Module 7 [NUMBER_MAZE]: Ronie lướt nhanh qua mê cung khi đúng, lùi lại 1 bước khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_09_number_maze, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(25);
    expect(state.ronieAnimState).toBe('run');
    expect(state.secondaryAnimState).toBe('clapping');
    expect(state.actionFeedback?.text).toContain('Ronie lướt nhanh qua mê cung');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.actionFeedback?.text).toContain('Gặp ngõ cụt hoa cỏ mềm');
  });

  // 8. BOSS BATTLE (Đại chiến Trùm Cuối)
  it('Module 8 [BOSS_BATTLE]: Sao Băng trúng đích Boss mất máu khi đúng, Boss hắt xì khi sai', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_10_boss_battle, mockQuestions);
    engine.startPlaying();

    const q = engine.getState().currentQuestion;
    engine.submitAnswer(q!.correctAnswer);
    let state = engine.getState();
    expect(state.progress).toBe(20);
    expect(state.ronieAnimState).toBe('attack');
    expect(state.secondaryAnimState).toBe('pushed_back');
    expect(state.actionFeedback?.text).toContain('Boss Quái vật mất máu');

    (engine as any).state.isActionAnimating = false;
    engine.submitAnswer('WRONG');
    state = engine.getState();
    expect(state.actionFeedback?.text).toContain('Quái vật làm mặt hề hắt xì');
  });
});

describe('PHASE 3: Pedagogical Safety & Lifecycle Testing', () => {
  it('Quản lý vòng đời hoàn chỉnh: INTRO -> PLAYING -> DEFEAT -> RETRY -> VICTORY', () => {
    const engine = new MissionEngine(MISSION_CATALOG.mission_01_rescue_girl, mockQuestions);
    expect(engine.getState().state).toBe('INTRO');

    engine.startPlaying();
    expect(engine.getState().state).toBe('PLAYING');

    // Sai 3 lần -> DEFEAT (Thân thiện, không phạt trừ âm điểm)
    engine.submitAnswer('WRONG_1');
    (engine as any).resolvePostActionTransition(false);

    engine.submitAnswer('WRONG_2');
    (engine as any).resolvePostActionTransition(false);

    engine.submitAnswer('WRONG_3');
    (engine as any).resolvePostActionTransition(false);

    expect(engine.getState().state).toBe('DEFEAT');
    expect(engine.getState().mistakesCount).toBe(3);

    // Chơi lại (Retry)
    engine.retry();
    expect(engine.getState().state).toBe('PLAYING');
    expect(engine.getState().mistakesCount).toBe(0);
    expect(engine.getState().progress).toBe(0);

    // Trả lời đúng liên tục đến 100% -> VICTORY
    let safetyCounter = 0;
    while (engine.getState().state === 'PLAYING' && safetyCounter < 10) {
      safetyCounter++;
      const currentQ = engine.getState().currentQuestion;
      if (!currentQ) break;
      engine.submitAnswer(currentQ.correctAnswer);
      (engine as any).resolvePostActionTransition(true);
    }

    expect(engine.getState().state).toBe('VICTORY');
    expect(engine.getState().progress).toBe(100);
  });
});

describe('PHASE 3: Mission Chain System (Nhiệm Vụ Liên Hoàn 3–5 Chặng)', () => {
  let chainEngine: MissionChainEngine;

  beforeEach(() => {
    chainEngine = new MissionChainEngine();
  });

  it('Chiến dịch 5 chặng [grand_kingdom_crusade_5stages] vận hành chuẩn xác qua 5 giai đoạn', () => {
    const state = chainEngine.startChain('grand_kingdom_crusade_5stages');
    expect(state.chainId).toBe('grand_kingdom_crusade_5stages');
    expect(state.currentStageIndex).toBe(0);
    expect(state.isChainCompleted).toBe(false);

    const config = chainEngine.getChainConfig();
    expect(config).not.toBeNull();
    expect(config!.totalStages).toBe(5);

    // Chặng 1: Vực Thẳm Rừng Số
    let stage = chainEngine.getCurrentStage();
    expect(stage?.stageIndex).toBe(1);
    expect(stage?.title).toContain('Chặng 1');

    // Hoàn thành chặng 1 với 250 điểm, 3 sao
    let res = chainEngine.advanceStage(250, 3);
    expect(res.isCompleted).toBe(false);
    expect(res.nextStage?.stageIndex).toBe(2);

    // Chặng 2: Thung Lũng Quái Vật
    res = chainEngine.advanceStage(300, 3);
    expect(res.isCompleted).toBe(false);
    expect(res.nextStage?.stageIndex).toBe(3);

    // Chặng 3: Dòng Sông Cầu Vồng
    res = chainEngine.advanceStage(350, 3);
    expect(res.isCompleted).toBe(false);
    expect(res.nextStage?.stageIndex).toBe(4);

    // Chặng 4: Bệ Phóng Vũ Trụ Thời Gian
    res = chainEngine.advanceStage(400, 3);
    expect(res.isCompleted).toBe(false);
    expect(res.nextStage?.stageIndex).toBe(5);

    // Chặng 5: Đỉnh Lâu Đài & Đại Chiến Boss -> Cán đích chiến dịch lớn!
    res = chainEngine.advanceStage(500, 3);
    expect(res.isCompleted).toBe(true);
    expect(res.nextStage).toBeNull();
    expect(res.grandReward).toBeDefined();
    expect(res.grandReward?.badgeId).toBe('badge_grand_master_knight');
    expect(res.grandReward?.trophyReward).toContain('Cúp Đại Hiệp Sĩ');

    // Kiểm tra tổng điểm và sao tích lũy an toàn
    const finalState = chainEngine.getState();
    expect(finalState.isChainCompleted).toBe(true);
    expect(finalState.completedStages.length).toBe(5);
    expect(finalState.totalScoreAccumulated).toBe(250 + 300 + 350 + 400 + 500);
    expect(finalState.totalStarsAccumulated).toBe(15);
  });

  it('Chiến dịch 3 chặng [treasure_maze_expedition_3stages] hoàn thành đúng 3 chặng', () => {
    chainEngine.startChain('treasure_maze_expedition_3stages');
    expect(chainEngine.getChainConfig()?.totalStages).toBe(3);

    // Stage 1 -> Stage 2
    let res = chainEngine.advanceStage(200, 3);
    expect(res.isCompleted).toBe(false);
    expect(res.nextStage?.stageIndex).toBe(2);

    // Stage 2 -> Stage 3
    res = chainEngine.advanceStage(250, 3);
    expect(res.isCompleted).toBe(false);
    expect(res.nextStage?.stageIndex).toBe(3);

    // Stage 3 -> Hoàn thành!
    res = chainEngine.advanceStage(350, 3);
    expect(res.isCompleted).toBe(true);
    expect(res.grandReward?.badgeId).toBe('badge_treasure_hunter_legend');
  });

  it('Bảo toàn sư phạm: retry chặng KHÔNG làm mất điểm các chặng trước đó', () => {
    chainEngine.startChain('treasure_maze_expedition_3stages');

    // Vượt qua chặng 1 được 200 điểm
    chainEngine.advanceStage(200, 3);
    expect(chainEngine.getState().totalScoreAccumulated).toBe(200);

    // Sang chặng 2 bị thất bại và retry
    chainEngine.retryCurrentStage();

    // Điểm và sao tích lũy vẫn giữ nguyên 200 điểm, 3 sao
    expect(chainEngine.getState().totalScoreAccumulated).toBe(200);
    expect(chainEngine.getState().totalStarsAccumulated).toBe(3);
    expect(chainEngine.getState().completedStages).toContain(1);
  });

  it('Tạm dừng và tiếp tục chiến dịch (Pause / Resume)', () => {
    chainEngine.startChain('grand_kingdom_crusade_5stages');
    expect(chainEngine.getState().isPaused).toBe(false);

    chainEngine.pauseChain();
    expect(chainEngine.getState().isPaused).toBe(true);

    chainEngine.resumeChain();
    expect(chainEngine.getState().isPaused).toBe(false);
  });
});
