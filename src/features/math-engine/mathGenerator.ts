// src/features/math-engine/mathGenerator.ts
// Bộ sinh câu hỏi Toán Lớp 1 chuẩn Chương trình GDPT 2018 (Bộ GD&ĐT Việt Nam)

import type { IMathQuestion } from '../../types/game';

const FRUITS = [
  { emoji: '🍎', name: 'quả táo đỏ' },
  { emoji: '🍓', name: 'quả dâu tây' },
  { emoji: '🍊', name: 'quả cam vàng' },
  { emoji: '🥕', name: 'củ cà rốt' },
  { emoji: '⭐', name: 'ngôi sao may mắn' },
];

/**
 * Sinh câu hỏi tương tác theo Vùng Đất và Cấp độ
 */
export function generateQuestionForZone(zoneId: number, questionIndex: number = 1): IMathQuestion {
  const qId = `q_${zoneId}_${questionIndex}_${Date.now()}`;

  switch (zoneId) {
    case 1: {
      // VÙNG 1: RỪNG SỐ ĐẾM (Đếm 0-10 và So sánh >, <, =)
      const isComparison = Math.random() > 0.5;
      if (isComparison) {
        const left = Math.floor(Math.random() * 9) + 1;
        let right = Math.floor(Math.random() * 9) + 1;
        // Đôi khi cho bằng nhau
        if (Math.random() > 0.7) right = left;

        let correct = '=';
        if (left > right) correct = '>';
        if (left < right) correct = '<';

        return {
          id: qId,
          zoneId: 1,
          topicKey: 'comparison_operators',
          questionText: `Bé hãy so sánh hai số: ${left} ... ${right}`,
          visualType: 'COMPARISON',
          visualData: {
            comparisonValues: { left, right },
          },
          options: ['>', '<', '='],
          correctAnswer: correct,
          hint: left > right ? `Số ${left} nhiều hơn số ${right} đó bé ơi!` : (left < right ? `Số ${left} ít hơn số ${right} nhé!` : `Hai số này bằng nhau nè!`),
        };
      } else {
        const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        const count = Math.floor(Math.random() * 8) + 2; // 2..9
        const wrong1 = count > 2 ? count - 1 : count + 2;
        const wrong2 = count + 1;
        const wrong3 = count > 3 ? count - 2 : count + 3;

        const options = Array.from(new Set([count, wrong1, wrong2, wrong3])).sort(() => Math.random() - 0.5);

        return {
          id: qId,
          zoneId: 1,
          topicKey: 'counting_to_10',
          questionText: `Bé hãy đếm xem có tất cả bao nhiêu ${fruit.name}?`,
          visualType: 'COUNTING',
          visualData: {
            countItems: { emoji: fruit.emoji, count, name: fruit.name },
          },
          options,
          correctAnswer: count,
          hint: `Bé Ronie hãy chỉ tay vào từng ${fruit.name} và đếm từ 1 đến hết nhé!`,
        };
      }
    }

    case 2: {
      // VÙNG 2: THUNG LŨNG PHÉP CỘNG (Trong phạm vi 10 và 20)
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const sum = a + b;
      const fruitA = FRUITS[0];
      const fruitB = FRUITS[2];

      const options = Array.from(new Set([sum, sum + 1, sum - 1 > 0 ? sum - 1 : sum + 2, sum + 2])).sort(() => Math.random() - 0.5);

      return {
        id: qId,
        zoneId: 2,
        topicKey: 'addition_within_10',
        questionText: `Nữ hoàng có ${a} ${fruitA.name}, Ronie tặng thêm ${b} ${fruitB.name}. Có tất cả bao nhiêu quả?`,
        visualType: 'ADDITION_VISUAL',
        visualData: {
          groupA: { emoji: fruitA.emoji, count: a },
          groupB: { emoji: fruitB.emoji, count: b },
        },
        options,
        correctAnswer: sum,
        hint: `Bé hãy gộp cả hai nhóm quả lại và đếm tổng cộng: ${a} cộng ${b} bằng mấy nào?`,
      };
    }

    case 3: {
      // VÙNG 3: HẺM NÚI PHÉP TRỪ (Trong phạm vi 10)
      const total = Math.floor(Math.random() * 6) + 4; // 4..9
      const sub = Math.floor(Math.random() * (total - 1)) + 1; // 1..(total-1)
      const remain = total - sub;
      const fruit = FRUITS[1];

      const options = Array.from(new Set([remain, remain + 1, remain - 1 >= 0 ? remain - 1 : remain + 2, remain + 2])).sort(() => Math.random() - 0.5);

      return {
        id: qId,
        zoneId: 3,
        topicKey: 'subtraction_within_10',
        questionText: `Trên đĩa có ${total} ${fruit.name}, thỏ trắng ăn bớt ${sub} quả. Còn lại bao nhiêu quả?`,
        visualType: 'SUBTRACTION_VISUAL',
        visualData: {
          groupA: { emoji: fruit.emoji, count: total },
          groupB: { emoji: '❌', count: sub },
        },
        options,
        correctAnswer: remain,
        hint: `Bớt đi nghĩa là trừ đi: ${total} trừ ${sub} còn lại bao nhiêu quả trên đĩa?`,
      };
    }

    case 4: {
      // VÙNG 4: LÂU ĐÀI HÌNH KHỐI & THƯỚC ĐO & ĐỒNG HỒ
      const randMode = Math.random();
      if (randMode < 0.4) {
        // Hình học phẳng
        const shapes = [
          { name: 'Hình tròn', type: 'circle' as const, color: '#38BDF8' },
          { name: 'Hình vuông', type: 'square' as const, color: '#EF4444' },
          { name: 'Hình tam giác', type: 'triangle' as const, color: '#F59E0B' },
          { name: 'Hình chữ nhật', type: 'rectangle' as const, color: '#10B981' },
        ];
        const chosen = shapes[Math.floor(Math.random() * shapes.length)];
        const otherNames = shapes.map((s) => s.name);

        return {
          id: qId,
          zoneId: 4,
          topicKey: 'flat_shapes',
          questionText: `Viên ngọc toán học này là hình gì hả bé?`,
          visualType: 'GEOMETRY',
          visualData: {
            shapes: [chosen],
          },
          options: otherNames,
          correctAnswer: chosen.name,
          hint: `Hãy nhìn kỹ các cạnh và góc của hình nhé!`,
        };
      } else if (randMode < 0.7) {
        // Thước đo cm
        const length = Math.floor(Math.random() * 6) + 4; // 4..9 cm
        const options = Array.from(new Set([`${length} cm`, `${length + 1} cm`, `${length - 1} cm`, `${length + 2} cm`])).sort(() => Math.random() - 0.5);

        return {
          id: qId,
          zoneId: 4,
          topicKey: 'length_centimeter',
          questionText: `Cây bút chì thần kỳ dài bao nhiêu xăng-ti-mét (cm)?`,
          visualType: 'RULER_CM',
          visualData: {
            measurement: { objectName: 'Bút chì thần kỳ', lengthCm: length },
          },
          options,
          correctAnswer: `${length} cm`,
          hint: `Bé nhìn từ vạch số 0 đến đầu bút chì thẳng với vạch số mấy trên thước kẻ?`,
        };
      } else {
        // Đồng hồ đúng giờ
        const hour = Math.floor(Math.random() * 10) + 1; // 1..10 giờ
        const options = Array.from(new Set([`${hour} giờ`, `${(hour % 12) + 1} giờ`, `${hour > 1 ? hour - 1 : 12} giờ`, `${(hour + 2) % 12 || 12} giờ`])).sort(() => Math.random() - 0.5);

        return {
          id: qId,
          zoneId: 4,
          topicKey: 'clock_reading',
          questionText: `Đồng hồ hoàng gia đang chỉ mấy giờ?`,
          visualType: 'CLOCK',
          visualData: {
            clockTime: { hour, minute: 0 },
          },
          options,
          correctAnswer: `${hour} giờ`,
          hint: `Kim ngắn màu đỏ chỉ giờ, kim dài màu xanh chỉ đúng số 12 đó bé ơi!`,
        };
      }
    }

    case 5:
    default: {
      // VÙNG 5: ĐẠI ĐẤU TRƯỜNG TRĂM ĐIỂM (Số tròn chục & cộng trừ tới 100)
      const tensA = (Math.floor(Math.random() * 5) + 1) * 10; // 10, 20, 30, 40, 50
      const tensB = (Math.floor(Math.random() * 4) + 1) * 10; // 10, 20, 30, 40
      const isAdd = Math.random() > 0.4;
      const res = isAdd ? tensA + tensB : tensA;
      const minus = isAdd ? tensB : Math.min(tensA, tensB);
      const answer = isAdd ? res : tensA - minus;
      const expr = isAdd ? `${tensA} + ${tensB}` : `${tensA} - ${minus}`;

      const options = Array.from(new Set([answer, answer + 10, answer - 10 > 0 ? answer - 10 : answer + 20, answer + 20])).sort(() => Math.random() - 0.5);

      return {
        id: qId,
        zoneId: 5,
        topicKey: 'numbers_to_100',
        questionText: `Bé hãy tính phép tính tròn chục sau: ${expr} = ?`,
        visualType: 'ADDITION_VISUAL',
        visualData: {
          groupA: { emoji: '📦', count: (isAdd ? tensA : tensA) / 10 },
          groupB: { emoji: isAdd ? '📦' : '❌', count: (isAdd ? tensB : minus) / 10 },
        },
        options,
        correctAnswer: answer,
        hint: `Mỗi thùng hàng là 1 chục (10). ${tensA / 10} chục ${isAdd ? 'cộng' : 'trừ'} ${(isAdd ? tensB : minus) / 10} chục bằng mấy chục?`,
      };
    }
  }
}
