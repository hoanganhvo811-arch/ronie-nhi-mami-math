// src/services/audio/VoiceSystem.ts
// Hệ Thống Giọng Đọc Nhân Vật & Thuyết Minh Câu Hỏi Trực Quan Tiếng Việt (Phase 6)

import { soundManager } from './AudioManager';

export type CharacterVoiceId =
  | 'ronie'
  | 'queen'
  | 'cookie_monster'
  | 'rabbit'
  | 'robot'
  | 'candy_witch'
  | 'dragon'
  | 'rescued_girl';

export interface IVoiceProfile {
  characterId: CharacterVoiceId;
  name: string;
  role: string;
  pitch: number; // 0.5 (trầm) -> 1.5 (cao)
  rate: number; // 0.8 (chậm) -> 1.2 (nhanh)
  description: string;
}

export const CHARACTER_VOICE_PROFILES: Record<CharacterVoiceId, IVoiceProfile> = {
  ronie: {
    characterId: 'ronie',
    name: 'Bé Ronie',
    role: 'Hiệp Sĩ Nhện Nhí',
    pitch: 1.3,
    rate: 1.05,
    description: 'Giọng trẻ thơ trong trẻo, vui tươi, tinh nghịch và tràn đầy năng lượng.',
  },
  queen: {
    characterId: 'queen',
    name: 'Nữ Hoàng Nhi Mami',
    role: 'Người Mẹ & Nữ Hoàng',
    pitch: 1.0,
    rate: 0.85,
    description: 'Giọng nữ ấm áp, dịu dàng, phát âm chuẩn mực, âu yếm như mẹ hiền.',
  },
  cookie_monster: {
    characterId: 'cookie_monster',
    name: 'Quái Vật Bánh Quy',
    role: 'Kẻ Trộm Bánh Hài Hước',
    pitch: 0.75,
    rate: 0.9,
    description: 'Giọng trầm ấm hóm hỉnh, ngộ nghĩnh, gây cười cho trẻ.',
  },
  rabbit: {
    characterId: 'rabbit',
    name: 'Thỏ Con Tinh Nghịch',
    role: 'Bạn Đồng Hành',
    pitch: 1.4,
    rate: 1.1,
    description: 'Giọng líu lo, nhanh nhẹn, nhí nhảnh.',
  },
  robot: {
    characterId: 'robot',
    name: 'Robot Bíp Bíp',
    role: 'Máy Tính Thông Minh',
    pitch: 0.9,
    rate: 0.95,
    description: 'Giọng điện tử đều đặn, rõ ràng từng con số.',
  },
  candy_witch: {
    characterId: 'candy_witch',
    name: 'Phù Thủy Kẹo',
    role: 'Bà Tiên Mật Ong',
    pitch: 1.2,
    rate: 0.95,
    description: 'Giọng ngọt ngào, bay bổng như truyện cổ tích.',
  },
  dragon: {
    characterId: 'dragon',
    name: 'Rồng Con Hạt Dẻ',
    role: 'Thần Giữ Rương',
    pitch: 1.1,
    rate: 0.9,
    description: 'Giọng ngộ nghĩnh, hào sảng.',
  },
  rescued_girl: {
    characterId: 'rescued_girl',
    name: 'Cô Bé Nơ Hồng',
    role: 'Bạn Nhỏ Dễ Thương',
    pitch: 1.35,
    rate: 0.95,
    description: 'Giọng bé gái ngọt ngào, đáng yêu.',
  },
};

export class VoiceSystem {
  private static lastNarrationTime = 0;
  private static readonly SPAM_THROTTLE_MS = 300;

  /**
   * Đặt lại bộ đếm chống spam (dùng trong test hoặc chuyển màn)
   */
  public static resetThrottle(): void {
    this.lastNarrationTime = 0;
  }

  /**
   * Phát giọng đọc của một nhân vật cụ thể với pitch & rate định sẵn
   */
  public static speakCharacter(characterId: CharacterVoiceId | string, text: string): void {
    if (!text || text.trim().length === 0) return;

    const profile = CHARACTER_VOICE_PROFILES[characterId as CharacterVoiceId] || {
      pitch: 1.1,
      rate: 0.95,
    };

    soundManager.speakDialogue(text, profile.pitch, profile.rate);
  }

  /**
   * Thuyết minh đề bài câu hỏi cho trẻ lớp 1
   * QUY TẮC CỐT LÕI:
   * - Chỉ đọc nội dung đề bài (questionText).
   * - TUYỆT ĐỐI KHÔNG đọc các đáp án trắc nghiệm trước khi bé chọn để bé tự tư duy.
   * - Chống bấm spam liên tục (< 300ms).
   */
  public static narrateQuestion(questionText: string): void {
    const now = Date.now();
    if (
      this.lastNarrationTime > 0 &&
      now >= this.lastNarrationTime &&
      now - this.lastNarrationTime < this.SPAM_THROTTLE_MS
    ) {
      return;
    }
    this.lastNarrationTime = now;

    // Giọng Nữ hoàng Nhi Mami ấm áp, phát âm chuẩn chậm rãi cho bé nghe
    soundManager.stopDialogueVoice();
    soundManager.speakDialogue(questionText, 1.0, 0.88);
  }

  /**
   * Phát âm thanh và lời khen khi trẻ trả lời ĐÚNG
   */
  public static givePositiveFeedback(customPhrase?: string): void {
    soundManager.playCorrect();

    const phrases = [
      'Đúng rồi! Bé giỏi quá!',
      'Tuyệt vời! Con tính nhanh như chớp!',
      'Chính xác! Thêm một ngôi sao vàng!',
      'Hoan hô Ronie dũng cảm!',
      'Thông minh tuyệt đỉnh!',
    ];

    const phrase = customPhrase || phrases[Math.floor(Math.random() * phrases.length)];
    // Phát giọng Nữ hoàng hoặc Ronie
    setTimeout(() => {
      soundManager.speakDialogue(phrase, 1.05, 0.95);
    }, 250);
  }

  /**
   * Phát âm thanh dịu dàng và lời động viên khi trẻ trả lời CHƯA ĐÚNG
   * Tuyệt đối không tạo cảm giác trừng phạt hay chuông báo lỗi đáng sợ
   */
  public static giveEncouragingFeedback(customPhrase?: string): void {
    soundManager.playTryAgain();

    const phrases = [
      'Gần đúng rồi con ơi, chúng mình thử lại nhé!',
      'Bình tĩnh đếm lại nào bé yêu!',
      'Không sao cả, con thử nhìn kỹ lại xem!',
      'Cố lên hiệp sĩ nhí, mẹ tin con làm được!',
      'Một chút xíu nữa thôi, làm lại nào!',
    ];

    const phrase = customPhrase || phrases[Math.floor(Math.random() * phrases.length)];
    setTimeout(() => {
      soundManager.speakDialogue(phrase, 1.0, 0.88);
    }, 250);
  }

  /**
   * Dừng toàn bộ âm thanh giọng đọc ngay lập tức (khi chuyển màn hoặc đóng modal)
   */
  public static stopAll(): void {
    this.resetThrottle();
    soundManager.stopDialogueVoice();
  }
}
