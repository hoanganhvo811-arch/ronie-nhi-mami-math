// src/features/progression/DailyAdventureEngine.ts
// Bộ Điều Phối Phiêu Lưu Hằng Ngày (Daily Adventure Engine) - Phase 4
// Mỗi ngày có một nhiệm vụ nhỏ vui tươi, KHÔNG tạo áp lực đăng nhập, KHÔNG reset thành tích khi nghỉ chơi

import type { IDailyAdventureQuest } from '../../types/progression';

export const DAILY_TOPIC_POOL = [
  { topic: 'numbers', title: 'Đếm Quả Ngọt Cùng Thỏ Trắng', desc: 'Cùng Thỏ Trắng đếm các quả táo đỏ mọng rơi trong vườn số.' },
  { topic: 'addition', title: 'Hái Hoa Tặng Nữ Hoàng', desc: 'Làm những phép tính cộng dễ thương để gom một bó hoa rực rỡ tặng Mẹ.' },
  { topic: 'subtraction', title: 'Chia Bánh Cùng Quái Vật Bánh Quy', desc: 'Làm phép tính trừ chia sẻ những chiếc bánh quy giòn rụm cho muôn loài.' },
  { topic: 'comparison', title: 'Cân Thăng Bằng Cá Sấu', desc: 'Chọn đúng dấu lớn hơn, bé hơn hoặc bằng để giữ cân luôn thăng bằng.' },
  { topic: 'geometry', title: 'Xếp Hình Lâu Đài Nhỏ', desc: 'Nhận diện hình vuông, hình tròn và hình tam giác để trang hoàng cổng lâu đài.' },
  { topic: 'measurement_time', title: 'Xem Giờ Cùng Đồng Hồ Cổ', desc: 'Nhìn đồng hồ kim chỉ mấy giờ để chuẩn bị đến giờ tiệc trà hoàng gia.' },
  { topic: 'number_patterns', title: 'Bước Nhảy Mê Cung Hoa', desc: 'Tìm số tiếp theo trong dãy số bí mật để vượt qua thảm cỏ kỳ diệu.' },
];

export class DailyAdventureEngine {
  /**
   * Định dạng chuỗi ngày YYYY-MM-DD
   */
  public static formatDate(date: Date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Sinh nhiệm vụ nhỏ trong ngày theo ngày tháng (Deterministic theo ngày)
   */
  public static getTodayDailyQuest(date: Date = new Date()): IDailyAdventureQuest {
    const dateStr = this.formatDate(date);

    // Tính mã băm đơn giản từ ngày tháng để chọn chủ đề xoay vòng tự nhiên
    const charCodeSum = dateStr.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const poolIndex = charCodeSum % DAILY_TOPIC_POOL.length;
    const template = DAILY_TOPIC_POOL[poolIndex];

    return {
      id: `daily_${dateStr}`,
      dateStr,
      title: `Thử Thách Hôm Nay: ${template.title}`,
      description: template.desc,
      queenEncouragement: 'Nữ hoàng Nhi Mami mỉm cười: "Chào bé yêu! Hôm nay chúng ta chỉ cần giải 3 câu đố nhỏ thôi nhé, con làm được mà!"',
      mathTopic: template.topic,
      targetCount: 3, // Chỉ 3 câu ngắn gọn, nhẹ nhàng, vui tươi
      reward: {
        exp: 80,
        stars: 1,
        rewardItemId: 'candy_lollipop',
        candyReward: 'Kẹo Mút Cầu Vồng 7 Màu',
      },
    };
  }

  /**
   * Kiểm tra xem bé có bị phạt khi nghỉ chơi nhiều ngày hay không?
   * NGUYÊN TẮC BẢO VỆ TÂM LÝ TRẺ EM:
   * Luôn trả về thông điệp chào đón yêu thương, KHÔNG reset tiến trình, KHÔNG trừ điểm.
   */
  public static checkAbsenceSafety(daysMissed: number): {
    isSafe: boolean;
    welcomeMessage: string;
    lostProgress: boolean;
  } {
    return {
      isSafe: true,
      lostProgress: false,
      welcomeMessage:
        daysMissed > 0
          ? `Nữ hoàng Nhi Mami dang rộng vòng tay: "Chào mừng Ronie trở về Vương Quốc! Toàn bộ đồ chơi, sao và điểm số của con vẫn được cất giữ an toàn tuyệt đối!"`
          : `Nữ hoàng Nhi Mami tươi cười: "Chúc bé Ronie một ngày phiêu lưu tràn ngập niềm vui!"`,
    };
  }
}
