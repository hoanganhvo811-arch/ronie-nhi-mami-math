// src/math-engine/HintEngine.ts
// Bộ tạo gợi ý sư phạm trực quan từng bước (Visual Hint & Step-by-Step Pedagogical Engine)

import type { IGrade1Question, IQuestionHint } from './types';

export interface IInteractiveHintStep {
  stepIndex: number;
  title: string;
  instruction: string;
  voicePrompt: string;
  visualHighlight?: {
    type: 'count' | 'add_group' | 'sub_group' | 'compare_arrows' | 'shape_highlight';
    elements: { emoji: string; count: number; label: string }[];
  };
}

export interface IResolvedHint {
  shortHint: string;
  audioPrompt: string;
  steps: IInteractiveHintStep[];
}

export class HintEngine {
  /**
   * Tạo bộ gợi ý trực quan tương tác cho câu hỏi
   */
  public static generateHint(question: IGrade1Question): IResolvedHint {
    const shortHint = question.hint?.text || 'Bé hãy đọc kỹ câu hỏi và quan sát hình ảnh nhé!';
    const audioPrompt = question.hint?.audioPrompt || shortHint;
    const steps: IInteractiveHintStep[] = [];

    // 1. GỢI Ý CHO PHÉP CỘNG
    if (question.topic === 'operations' && question.questionText.includes('+')) {
      const match = question.questionText.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) {
        const a = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        const emoji = question.visualData?.groupA?.emoji || '🍎';

        steps.push({
          stepIndex: 1,
          title: `Bước 1: Nhóm ban đầu có ${a} vật thể`,
          instruction: `Bé hãy nhìn nhóm thứ nhất có ${a} ${emoji}.`,
          voicePrompt: `Nhóm thứ nhất có ${a} quả.`,
          visualHighlight: {
            type: 'count',
            elements: [{ emoji, count: a, label: `Nhóm 1: ${a}` }],
          },
        });

        steps.push({
          stepIndex: 2,
          title: `Bước 2: Thêm vào ${b} vật thể`,
          instruction: `Bé thêm tiếp ${b} ${emoji} của nhóm thứ hai vào.`,
          voicePrompt: `Thêm tiếp ${b} quả nữa vào đĩa.`,
          visualHighlight: {
            type: 'add_group',
            elements: [
              { emoji, count: a, label: `${a}` },
              { emoji, count: b, label: `+ ${b}` },
            ],
          },
        });

        steps.push({
          stepIndex: 3,
          title: 'Bước 3: Đếm tất cả',
          instruction: `Bé hãy đếm tiếp từ ${a}: thêm ${b} đơn vị nữa để ra kết quả tổng!`,
          voicePrompt: `Giờ bé hãy đếm tất cả xem có bao nhiêu quả nhé!`,
          visualHighlight: {
            type: 'count',
            elements: [{ emoji, count: a + b, label: `Tổng cộng: ${a + b}` }],
          },
        });
      }
    }

    // 2. GỢI Ý CHO PHÉP TRỪ
    else if (question.topic === 'operations' && question.questionText.includes('-')) {
      const match = question.questionText.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        const a = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        const emoji = question.visualData?.groupA?.emoji || '🥕';

        steps.push({
          stepIndex: 1,
          title: `Bước 1: Có tất cả ${a} vật thể`,
          instruction: `Ban đầu có tất cả ${a} ${emoji}.`,
          voicePrompt: `Ban đầu có tất cả ${a} củ cà rốt.`,
          visualHighlight: {
            type: 'count',
            elements: [{ emoji, count: a, label: `Tất cả: ${a}` }],
          },
        });

        steps.push({
          stepIndex: 2,
          title: `Bước 2: Bớt đi (gạch chéo) ${b} vật thể`,
          instruction: `Bé gạch bớt đi ${b} ${emoji} đã bị ăn hoặc bay mất.`,
          voicePrompt: `Bớt đi ${b} củ bị gạch chéo.`,
          visualHighlight: {
            type: 'sub_group',
            elements: [
              { emoji, count: a - b, label: `Còn lại` },
              { emoji: '❌', count: b, label: `Bớt đi: ${b}` },
            ],
          },
        });

        steps.push({
          stepIndex: 3,
          title: 'Bước 3: Đếm số lượng còn lại',
          instruction: `Đếm số vật thể còn nguyên vẹn chưa bị gạch: ${a} trừ ${b} bằng mấy nào?`,
          voicePrompt: `Bé đếm số lượng còn lại nhé!`,
        });
      }
    }

    // 3. GỢI Ý CHO SO SÁNH SỐ
    else if (question.questionType === 'number_comparison') {
      steps.push({
        stepIndex: 1,
        title: 'Bước 1: Xác định giá trị hai bên',
        instruction: 'Quan sát số lượng của bên trái và bên phải.',
        voicePrompt: 'Bé so sánh số bên trái và số bên phải.',
      });
      steps.push({
        stepIndex: 2,
        title: 'Bước 2: Nhớ quy tắc dấu',
        instruction: 'Đầu nhọn luôn chĩa về phía số bé hơn, miệng mở rộng quay về phía số lớn hơn.',
        voicePrompt: 'Đầu nhọn của dấu luôn chĩa về số bé hơn con nhé!',
      });
    }

    // 4. MẶC ĐỊNH CHO CÁC DẠNG CÂU HỎI KHÁC
    else {
      steps.push({
        stepIndex: 1,
        title: 'Gợi ý từ Nữ hoàng Nhi Mami',
        instruction: shortHint,
        voicePrompt: audioPrompt,
      });
    }

    return {
      shortHint,
      audioPrompt,
      steps,
    };
  }
}
