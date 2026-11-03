// src/types/dialogue.ts
// Cấu trúc hệ thống hội thoại (Dialogue Engine) cho trẻ em Lớp 1 (Phase 2)

import type { CharacterId } from './character';

export type DialogueCategory =
  | 'greeting'         // Chào đón
  | 'quest_assign'     // Giao nhiệm vụ
  | 'quest_start'      // Bắt đầu nhiệm vụ
  | 'answer_correct'   // Đúng
  | 'answer_wrong'     // Sai / Thử lại
  | 'hint'             // Gợi ý
  | 'victory'          // Chiến thắng
  | 'defeat'           // Cần cố gắng
  | 'rewarding'        // Trao thưởng
  | 'encouragement'    // Động viên
  | 'new_zone';        // Mở khóa vùng mới

export interface IDialogueChoice {
  text: string;
  nextDialogueId: string;
}

export interface IDialogueNode {
  id: string;
  characterId: CharacterId;
  characterName: string;
  text: string;
  audioId?: string;
  animation?: string; // RonieAnimationState hoặc QueenAnimationState
  duration?: number; // Thời gian hiển thị tự động nếu không bấm tiếp
  nextDialogueId?: string | null;
  choices?: IDialogueChoice[];
}

export interface IDialogueConversation {
  id: string;
  title: string;
  category: DialogueCategory;
  startNodeId: string;
  nodes: Record<string, IDialogueNode>;
}
