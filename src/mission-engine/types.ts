// src/mission-engine/types.ts
// Định nghĩa cấu trúc chuẩn cho Mission Engine & 6 Cơ chế Gameplay Tương tác (Phase 4)

import type { MathTopic, MathDifficulty, IGrade1Question } from '../math-engine/types';
import type { RonieAnimationState, NPCId } from '../types/character';

/**
 * 6 Loại cơ chế gameplay tương tác theo yêu cầu Phase 4
 */
export type GameplayType =
  | 'RESCUE_ROPE' // 1. Giải cứu cô bé khỏi vực sâu (Kéo tơ nhện)
  | 'PUSH_BACK_MONSTER' // 2. Đẩy lùi quái vật bánh quy (Bắn tơ/đấm sao)
  | 'BRIDGE_CROSSING' // 3. Vượt cầu đá kỳ diệu qua sông (Tạo đá nhảy bước)
  | 'TREASURE_CHEST' // 4. Mở rương kho báu hoàng gia (Mở từng ổ khóa vàng)
  | 'SHUTDOWN_MACHINE' // 5. Tắt cỗ máy kẹo ngọt (Xả thanh năng lượng quá tải)
  | 'MATH_RACING'; // 6. Đua xe toán học siêu tốc (Ronie vs Robot)

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
  gameplayType: GameplayType; // 1 trong 6 cơ chế gameplay
  region: string; // Vùng đất trên Bản Đồ (Rừng Số, Thung Lũng, Cầu Vồng,...)
  characters: {
    primary: 'ronie';
    secondary: NPCId | 'queen';
    secondaryName: string;
  };
  mathTopic: MathTopic; // Chủ đề toán học (Số học, Phép tính, Hình học,...)
  difficulty: MathDifficulty; // Độ khó (1..4)
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
