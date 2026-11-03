// src/types/character.ts
// Các định nghĩa về nhân vật, trạng thái hoạt ảnh và hệ thống NPC (Phase 2)

export type RonieAnimationState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'celebrate'
  | 'sad'
  | 'surprised'
  | 'attack'
  | 'web_shoot'
  | 'pull'
  | 'victory'
  | 'defeat'
  // Tương thích ngược
  | 'walking'
  | 'celebrating'
  | 'thinking'
  | 'jumping'
  | 'swinging';

export type QueenAnimationState =
  | 'idle'
  | 'greeting'
  | 'talking'
  | 'laughing'
  | 'surprised'
  | 'clapping'
  | 'rewarding'
  | 'encouraging';

export type NPCId =
  | 'bear'            // Gấu con
  | 'rabbit'          // Thỏ con
  | 'rescued_girl'    // Cô bé cần cứu
  | 'dragon'          // Rồng con
  | 'robot'           // Robot thông minh
  | 'cookie_monster'  // Quái vật bánh quy (hài hước)
  | 'candy_witch';    // Phù thủy kẹo (ngọt ngào)

export type CharacterId = 'ronie' | 'queen' | NPCId;

export type NPCRole = 'companion' | 'quest_giver' | 'friendly_rival' | 'rescued' | 'mentor';

export interface INPCDefinition {
  id: NPCId;
  name: string;
  title: string;
  role: NPCRole;
  avatarEmoji: string;
  primaryColor: string;
  pastelColor: string;
  catchphrase: string;
  voicePitch: number; // Pitch cho Web Speech API (0.8 - 1.4)
  description: string;
}
