// src/features/character/npcRegistry.ts
// Hệ thống đăng ký & quản lý các nhân vật phụ (Extensible NPC Registry)

import type { NPCId, INPCDefinition } from '../../types/character';

const BASE_NPCS: Record<NPCId, INPCDefinition> = {
  rabbit: {
    id: 'rabbit',
    name: 'Thỏ Con Tinh Nghịch',
    title: 'Người Bạn Rừng Xanh',
    role: 'companion',
    avatarEmoji: '🐰',
    primaryColor: '#F472B6',
    pastelColor: '#FCE7F3',
    catchphrase: 'Nhảy tưng tưng, cùng Ronie hái dâu tây nào!',
    voicePitch: 1.3,
    description: 'Chú thỏ trắng ham học hỏi, thích đếm hoa quả và thi chạy cùng Ronie.',
  },
  bear: {
    id: 'bear',
    name: 'Gấu Con Tròn Trĩnh',
    title: 'Bác Tài Lái Tàu Hào Sảng',
    role: 'quest_giver',
    avatarEmoji: '🐻',
    primaryColor: '#F59E0B',
    pastelColor: '#FEF3C7',
    catchphrase: 'Hô hô! Giúp bác chất thêm táo lên đoàn tàu nhé!',
    voicePitch: 0.85,
    description: 'Gấu con tốt bụng lái đoàn tàu hoa quả qua Thung Lũng Cộng Trừ.',
  },
  rescued_girl: {
    id: 'rescued_girl',
    name: 'Bé Mi Mi Cần Cứu',
    title: 'Công Chúa Hoa Cúc',
    role: 'rescued',
    avatarEmoji: '👧',
    primaryColor: '#EC4899',
    pastelColor: '#FCE7F3',
    catchphrase: 'Ronie ơi! Hãy giải phép tính để mở cánh cửa lồng son giúp tớ với!',
    voicePitch: 1.25,
    description: 'Cô bé dễ thương bị mắc kẹt sau cánh cửa câu đố hình học.',
  },
  dragon: {
    id: 'dragon',
    name: 'Rồng Con Đuôi Lửa',
    title: 'Thần Giữ Kho Báu',
    role: 'companion',
    avatarEmoji: '🐲',
    primaryColor: '#10B981',
    pastelColor: '#D1FAE5',
    catchphrase: 'Phù phù! Tớ biết đếm số tròn chục tới một trăm đấy!',
    voicePitch: 1.1,
    description: 'Chú rồng con ngộ nghĩnh không thở ra lửa mà thở ra những viên kẹo ngọt tròn chục.',
  },
  robot: {
    id: 'robot',
    name: 'Robot Bíp Bíp',
    title: 'Máy Tính Thông Minh',
    role: 'mentor',
    avatarEmoji: '🤖',
    primaryColor: '#38BDF8',
    pastelColor: '#E0F2FE',
    catchphrase: 'Bíp bíp! Phép tính chính xác một trăm phần trăm!',
    voicePitch: 0.95,
    description: 'Người bạn robot tí hon với màn hình hiển thị thước đo cm và kim đồng hồ.',
  },
  cookie_monster: {
    id: 'cookie_monster',
    name: 'Quái Vật Bánh Quy Háu Ăn',
    title: 'Kẻ Trộm Bánh Hài Hước',
    role: 'friendly_rival',
    avatarEmoji: '🍪',
    primaryColor: '#D97706',
    pastelColor: '#FEF3C7',
    catchphrase: 'Om nom nom! Đố Ronie tính được tớ đã ăn mất mấy cái bánh quy sô-cô-la?',
    voicePitch: 0.9,
    description: 'Một chú quái vật tròn vo làm bằng bánh gừng, chỉ thích đố toán để xin thêm bánh.',
  },
  candy_witch: {
    id: 'candy_witch',
    name: 'Phù Thủy Kẹo Ngọt Ngào',
    title: 'Bà Tiên Mật Ong',
    role: 'friendly_rival',
    avatarEmoji: '🧙‍♀️',
    primaryColor: '#8B5CF6',
    pastelColor: '#EDE9FE',
    catchphrase: 'Úm ba la! Thử giải bài toán cây kẹo mút này xem nào Ronie!',
    voicePitch: 1.2,
    description: 'Cô phù thủy nhỏ đội nón kẹo quế đáng yêu, luôn thách đố trẻ em bằng những câu đố toán kẹo dẻo.',
  },
};

class NPCRegistry {
  private registry: Map<NPCId, INPCDefinition> = new Map();

  constructor() {
    Object.values(BASE_NPCS).forEach((npc) => {
      this.registry.set(npc.id, npc);
    });
  }

  public get(id: NPCId): INPCDefinition {
    return (
      this.registry.get(id) || {
        id,
        name: 'Bạn Nhỏ Bí Ẩn',
        title: 'Cư Dân Vương Quốc',
        role: 'companion',
        avatarEmoji: '🌟',
        primaryColor: '#F59E0B',
        pastelColor: '#FEF3C7',
        catchphrase: 'Chào Ronie!',
        voicePitch: 1.0,
        description: 'Một người bạn đáng mến ở Vương Quốc Toán Học.',
      }
    );
  }

  public getAll(): INPCDefinition[] {
    return Array.from(this.registry.values());
  }

  public register(npc: INPCDefinition): void {
    this.registry.set(npc.id, npc);
  }
}

export const npcRegistry = new NPCRegistry();
