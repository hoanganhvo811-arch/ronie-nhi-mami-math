// src/mission-engine/types.ts
// Định nghĩa cấu trúc chuẩn cho Mission Engine & 6 Cơ chế Gameplay Tương tác (Phase 4)

import type { MathTopic, MathDifficulty, IGrade1Question } from '../math-engine/types';
import type { RonieAnimationState, NPCId } from '../types/character';

/**
 * 8 Loại cơ chế gameplay tương tác theo yêu cầu Phase 3 (kèm các alias tương thích ngược)
 */
export type GameplayType =
  | 'RESCUE_ROPE'       // 1. Kéo nhân vật khỏi vực sâu (Rescue Rope)
  | 'MONSTER_PUSH'      // 2. Đẩy lùi quái vật (Monster Push)
  | 'PUSH_BACK_MONSTER' // Alias tương thích ngược cho MONSTER_PUSH
  | 'TREASURE_CHEST'    // 3. Mở rương kho báu (Treasure Chest)
  | 'BRIDGE_BUILDER'    // 4. Xây cầu kỳ diệu qua sông (Bridge Builder)
  | 'BRIDGE_CROSSING'   // Alias tương thích ngược cho BRIDGE_BUILDER
  | 'ROCKET_LAUNCH'     // 5. Phóng tên lửa bay vào vũ trụ (Rocket Launch)
  | 'MAGIC_KEY'         // 6. Tìm chìa khóa ma thuật mở cổng lâu đài (Magic Key)
  | 'NUMBER_MAZE'       // 7. Vượt mê cung số kỳ diệu (Number Maze)
  | 'BOSS_BATTLE'       // 8. Đánh bại trùm cuối Quái vật khổng lồ (Boss Battle)
  | 'SHUTDOWN_MACHINE'  // Cơ chế hỗ trợ: Tắt cỗ máy năng lượng quá tải
  | 'MATH_RACING';      // Cơ chế hỗ trợ: Đua xe toán học siêu tốc

/**
 * Các trạng thái vòng đời của một nhiệm vụ
 */
export type MissionState =
  | 'IDLE' // Chưa bắt đầu
  | 'INTRO' // Đang giới thiệu cốt truyện & mục tiêu
  | 'PLAYING' // Đang chơi, trả lời câu hỏi
  | 'PAUSED' // Tạm dừng
  | 'VICTORY' // Hoàn thành nhiệm vụ xuất sắc
  | 'DEFEAT'; // Thất bại tạm thời, động viên thử lại

/**
 * Cấu hình toàn diện cho một nhiệm vụ
 */
export interface IMissionConfig {
  id: string; // Mã nhiệm vụ (VD: "mission_01_rescue_girl")
  title: string; // Tên nhiệm vụ
  description: string; // Tóm tắt cốt truyện
  gameplayType: GameplayType; // 1 trong 8 cơ chế gameplay
  region: string; // Vùng đất trên Bản Đồ (Rừng Số, Thung Lũng, Cầu Vồng,...)
  characters: {
    primary: 'ronie';
    secondary: NPCId | 'queen' | 'boss_robot' | 'cookie_monster';
    secondaryName: string;
  };
  mathTopic: MathTopic; // Chủ đề toán học (Số học, Phép tính, Hình học,...)
  difficulty: MathDifficulty; // Độ khó (1..5)
  questionCount: number; // Tổng số câu hỏi (mặc định 3 - 5 câu cho trẻ lớp 1)
  targetProgress: number; // Điểm tiến trình để thắng (thường là 100%)
  stepPerCorrect: number; // Tiến trình tăng thêm khi làm đúng
  stepPerWrong: number; // Tiến trình tụt lùi khi làm sai
  maxMistakes: number; // Số lần sai tối đa trước khi tạm dừng (mặc định 3)
  reward: {
    stars: number; // Số sao đạt được (1..3)
    exp: number; // Điểm kinh nghiệm
    badgeId?: string; // Huy hiệu mở khóa
    itemReward?: string; // Tên phần thưởng
  };
  dialogue: {
    intro: string; // Lời thoại mở đầu
    victory: string; // Lời thoại chiến thắng
    defeat: string; // Lời thoại động viên khi làm lại
    hintPrompt: string; // Lời nhắc nhở gợi ý
  };
  bgTheme: string; // Màu sắc hoặc chủ đề hình nền
}

/**
 * Cấu trúc một chặng trong Nhiệm Vụ Liên Hoàn (Mission Chain)
 */
export interface IMissionChainStage {
  stageIndex: number; // Thứ tự chặng (1, 2, 3, 4, 5)
  title: string; // Tên chặng
  missionConfig: IMissionConfig; // Cấu hình nhiệm vụ của chặng
  dialogueIntro: string; // Đối thoại trước khi bắt đầu chặng
  landscape: {
    theme: string;
    bgGradient: string;
    weather: 'sunny' | 'rainbow' | 'starry' | 'aurora' | 'sunset';
  };
}

/**
 * Cấu hình Nhiệm Vụ Liên Hoàn 3–5 chặng (Mission Chain Config)
 */
export interface IMissionChainConfig {
  id: string; // Mã chiến dịch liên hoàn
  title: string; // Tên chiến dịch (VD: "Đại Thám Hiểm Vương Quốc Toán Học")
  description: string; // Mô tả cốt truyện dài tập
  totalStages: number; // Tổng số chặng (3 - 5 chặng)
  stages: IMissionChainStage[];
  grandReward: {
    stars: number;
    exp: number;
    badgeId: string;
    costumeReward?: string;
    trophyReward: string;
  };
}

/**
 * Trạng thái tiến trình của Nhiệm Vụ Liên Hoàn
 */
export interface IMissionChainState {
  chainId: string;
  currentStageIndex: number; // 0..stages.length - 1
  completedStages: number[];
  isChainCompleted: boolean;
  totalScoreAccumulated: number;
  totalStarsAccumulated: number;
  isPaused: boolean;
}

/**
 * Trạng thái động theo thời gian thực khi đang chơi nhiệm vụ
 */
export interface IMissionRunState {
  missionId: string;
  state: MissionState;
  currentQuestionIndex: number;
  currentQuestion: IGrade1Question | null;
  progress: number; // 0 -> 100
  correctCount: number;
  mistakesCount: number;
  streak: number; // Chuỗi trả lời đúng liên tiếp
  score: number;
  ronieAnimState: RonieAnimationState;
  secondaryAnimState: string;
  isActionAnimating: boolean; // Khóa tương tác khi nhân vật đang biểu diễn hành động
  actionFeedback: {
    text: string;
    type: 'success' | 'warning' | 'info';
    timestamp: number;
  } | null;
}
