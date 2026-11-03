// src/mission-engine/missionCatalog.ts
// Danh mục 6 Nhiệm vụ Gameplay Cốt lõi của Phase 4

import type { IMissionConfig, GameplayType } from './types';

export const MISSION_CATALOG: Record<string, IMissionConfig> = {
  // NHIỆM VỤ 1: GIẢI CỨU CÔ BÉ KHỎI VỰC SÂU (RESCUE_ROPE)
  mission_01_rescue_girl: {
    id: 'mission_01_rescue_girl',
    title: 'Giải Cứu Cô Bé Khỏi Vực Sâu',
    description: 'Cô Bé Nơ Hồng bị mắc kẹt dưới vực sâu của Rừng Số. Ronie hãy dùng sợi tơ nhện kéo cô bé lên bờ an toàn!',
    gameplayType: 'RESCUE_ROPE',
    region: 'Rừng Số Kỳ Diệu',
    characters: {
      primary: 'ronie',
      secondary: 'rescued_girl',
      secondaryName: 'Cô Bé Nơ Hồng',
    },
    mathTopic: 'numbers',
    difficulty: 1,
    questionCount: 4,
    targetProgress: 100,
    stepPerCorrect: 25,
    stepPerWrong: 15,
    maxMistakes: 3,
    reward: {
      stars: 3,
      exp: 150,
      badgeId: 'badge_hero_rescue',
      itemReward: 'Sợi Dây Tơ Cứu Hộ',
    },
    dialogue: {
      intro: 'Ronie ơi! Cô bé đang ở dưới vực sâu, con hãy giải đúng các câu đố số học để kéo bạn ấy lên nhé!',
      victory: 'Hoan hô Ronie dũng cảm! Cô bé đã được cứu lên an toàn rồi!',
      defeat: 'Ôi sợi tơ bị trượt rồi! Đừng nản lòng bé Ronie ơi, chúng ta cùng thử lại nhé!',
      hintPrompt: 'Bé hãy đếm thật cẩn thận để tơ nhện kéo bạn lên vững chắc nhé!',
    },
    bgTheme: 'from-emerald-900 via-teal-950 to-slate-950',
  },

  // NHIỆM VỤ 2: ĐẨY LÙI QUÁI VẬT BÁNH QUY (PUSH_BACK_MONSTER)
  mission_02_cookie_monster: {
    id: 'mission_02_cookie_monster',
    title: 'Đẩy Lùi Quái Vật Bánh Quy',
    description: 'Quái vật bánh quy khổng lồ tham ăn đang tiến tới kho bánh! Hãy giải đúng các phép tính để Ronie bắn tơ sao đẩy lùi quái vật!',
    gameplayType: 'PUSH_BACK_MONSTER',
    region: 'Thung Lũng Cộng Trừ',
    characters: {
      primary: 'ronie',
      secondary: 'cookie_monster',
      secondaryName: 'Quái Vật Bánh Quy',
    },
    mathTopic: 'operations',
    difficulty: 2,
    questionCount: 4,
    targetProgress: 100,
    stepPerCorrect: 25,
    stepPerWrong: 20,
    maxMistakes: 3,
    reward: {
      stars: 3,
      exp: 200,
      badgeId: 'badge_cookie_defender',
      itemReward: 'Huy Hiệu Bánh Quy Vàng',
    },
    dialogue: {
      intro: 'Rôm rốp rôm rốp! Ta sẽ ăn hết bánh! Ronie hãy tung chưởng tơ sao đẩy lùi ta xem nào!',
      victory: 'Tuyệt vời! Quái vật bánh quy đã chịu thua và chạy biến rồi!',
      defeat: 'Quái vật đã tiến sát quá! Bé hãy bình tĩnh tính toán lại để đẩy lùi nó nhé!',
      hintPrompt: 'Mỗi phép tính đúng là một đòn đấm tơ sao đầy uy lực!',
    },
    bgTheme: 'from-amber-900 via-orange-950 to-slate-950',
  },

  // NHIỆM VỤ 3: VƯỢT CẦU ĐÁ KỲ DIỆU QUA SÔNG (BRIDGE_CROSSING)
  mission_03_bridge_crossing: {
    id: 'mission_03_bridge_crossing',
    title: 'Vượt Cầu Đá Kỳ Diệu Qua Sông',
    description: 'Dòng sông Cầu Vồng nước chảy cuồn cuộn. Mỗi câu đố hình học đúng sẽ làm nổi lên một viên đá ma thuật để Ronie nhảy qua!',
    gameplayType: 'BRIDGE_CROSSING',
    region: 'Cầu Vồng Hình Học',
    characters: {
      primary: 'ronie',
      secondary: 'rabbit',
      secondaryName: 'Thỏ Trắng Tinh Nghịch',
    },
    mathTopic: 'geometry',
    difficulty: 2,
    questionCount: 4,
    targetProgress: 100,
    stepPerCorrect: 25,
    stepPerWrong: 15,
    maxMistakes: 3,
    reward: {
      stars: 3,
      exp: 180,
      badgeId: 'badge_rainbow_bridge',
      itemReward: 'Viên Ngọc Đá Thần',
    },
    dialogue: {
      intro: 'Dòng sông rộng quá Ronie ơi! Cùng Thỏ Trắng gọi các viên đá hình học nổi lên để qua bờ bên kia nào!',
      victory: 'Cả hai bạn đã sang bờ bên kia an toàn! Một chuyến phiêu lưu kỳ diệu!',
      defeat: 'Viên đá bị rung lắc rồi! Cố lên bé ơi, bước thêm vài bước nữa là qua sông!',
      hintPrompt: 'Nhìn kỹ các hình tròn, vuông, tam giác để chọn viên đá vững chắc nhất!',
    },
    bgTheme: 'from-pink-900 via-purple-950 to-slate-950',
  },

  // NHIỆM VỤ 4: MỞ RƯƠNG KHO BÁU HOÀNG GIA (TREASURE_CHEST)
  mission_04_treasure_chest: {
    id: 'mission_04_treasure_chest',
    title: 'Mở Rương Kho Báu Hoàng Gia',
    description: 'Rương kho báu trong hang được niêm phong bởi các ổ khóa ma thuật. Giải đúng các phép tính để bẻ khóa mở rương báu!',
    gameplayType: 'TREASURE_CHEST',
    region: 'Hang Kho Báu',
    characters: {
      primary: 'ronie',
      secondary: 'dragon',
      secondaryName: 'Rồng Con Hạt Dẻ',
    },
    mathTopic: 'operations',
    difficulty: 3,
    questionCount: 4,
    targetProgress: 100,
    stepPerCorrect: 25,
    stepPerWrong: 15,
    maxMistakes: 3,
    reward: {
      stars: 3,
      exp: 250,
      badgeId: 'badge_treasure_master',
      itemReward: 'Vương Miện Kim Cương',
    },
    dialogue: {
      intro: 'Khè khè! Rương báu cổ xưa của vương quốc có nhiều vàng bạc lắm! Ronie hãy mở từng ổ khóa nào!',
      victory: 'Rương báu đã mở bung! Muôn vàn ánh sáng lấp lánh tỏa sáng!',
      defeat: 'Khóa ma thuật chưa mở được! Bé Ronie hãy tính lại cẩn thận nhé!',
      hintPrompt: 'Tập trung tính toán chính xác để mở từng ổ khóa hoàng gia!',
    },
    bgTheme: 'from-purple-950 via-indigo-950 to-slate-950',
  },

  // NHIỆM VỤ 5: TẮT CỖ MÁY KẸO QUÁ TẢI (SHUTDOWN_MACHINE)
  mission_05_candy_machine: {
    id: 'mission_05_candy_machine',
    title: 'Tắt Cỗ Máy Kẹo Quá Tải',
    description: 'Cỗ máy kẹo ngọt của Phù Thủy Kẹo đang chạy quá tải và sắp nổ tung kẹo! Hãy giải đúng các câu đố thời gian & đo lường để giảm năng lượng máy!',
    gameplayType: 'SHUTDOWN_MACHINE',
    region: 'Thành Phố Thời Gian',
    characters: {
      primary: 'ronie',
      secondary: 'candy_witch',
      secondaryName: 'Phù Thủy Kẹo Ngọt',
    },
    mathTopic: 'measurement_time',
    difficulty: 3,
    questionCount: 4,
    targetProgress: 100,
    stepPerCorrect: 25,
    stepPerWrong: 15,
    maxMistakes: 3,
    reward: {
      stars: 3,
      exp: 220,
      badgeId: 'badge_candy_engineer',
      itemReward: 'Kẹo Mút Phép Thuật',
    },
    dialogue: {
      intro: 'Úi chà chà! Cỗ máy kẹo của ta quay nhanh quá rồi! Ronie hãy hạ mức năng lượng xuống về 0 ngay đi!',
      victory: 'Cỗ máy kẹo đã dừng êm ái! Ronie và Phù Thủy cùng chia kẹo ngọt nào!',
      defeat: 'Máy vẫn còn xì khói kìa! Chúng ta cùng làm lại để xả hết năng lượng nhé!',
      hintPrompt: 'Xem kim đồng hồ và đo thước cm thật chuẩn để vặn van hãm năng lượng!',
    },
    bgTheme: 'from-sky-900 via-blue-950 to-slate-950',
  },

  // NHIỆM VỤ 6: ĐUA XE TOÁN HỌC SIÊU TỐC (MATH_RACING)
  mission_06_math_racing: {
    id: 'mission_06_math_racing',
    title: 'Đua Xe Toán Học Siêu Tốc',
    description: 'Cuộc đua tốc độ nghẹt thở giữa Xe Tơ Nhện của Ronie và Siêu Xe Robot Bíp Bíp. Mỗi bài toán có lời văn đúng sẽ giúp xe Ronie tăng tốc vượt lên!',
    gameplayType: 'MATH_RACING',
    region: 'Đấu Trường Hoàng Gia',
    characters: {
      primary: 'ronie',
      secondary: 'robot',
      secondaryName: 'Robot Bíp Bíp',
    },
    mathTopic: 'word_problems',
    difficulty: 3,
    questionCount: 4,
    targetProgress: 100,
    stepPerCorrect: 25,
    stepPerWrong: 20,
    maxMistakes: 3,
    reward: {
      stars: 3,
      exp: 300,
      badgeId: 'badge_speed_champion',
      itemReward: 'Cúp Tay Đua Vàng',
    },
    dialogue: {
      intro: 'Bíp bíp! Động cơ đã sẵn sàng! Ronie có dám đua xe xem ai về đích trước không nào?',
      victory: 'Vèo! Chiếc xe tơ nhện của Ronie đã cán đích đầu tiên! Nhà vô địch tuyệt đỉnh!',
      defeat: 'Robot đã vượt lên một chút rồi! Bé hãy tăng tốc bằng những phép tính chuẩn xác nhé!',
      hintPrompt: 'Đọc kỹ lời văn bài toán để tìm ra phép tính tăng tốc thần kỳ!',
    },
    bgTheme: 'from-amber-950 via-rose-950 to-slate-950',
  },
};

export const ALL_MISSIONS_LIST: IMissionConfig[] = Object.values(MISSION_CATALOG);

export function getMissionConfigById(id: string): IMissionConfig | undefined {
  return MISSION_CATALOG[id];
}

export function getMissionsByGameplayType(type: GameplayType): IMissionConfig[] {
  return ALL_MISSIONS_LIST.filter((m) => m.gameplayType === type);
}
