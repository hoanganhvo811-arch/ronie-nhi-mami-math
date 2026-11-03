// src/features/rewards/rewardCatalog.ts
// Danh mục Toàn Diện Phần Thưởng & Kho Đồ Chơi, Kẹo, Huy Hiệu, Trang Phục (Phase 5)

import type { IRewardItem, RewardCategory } from '../../types/rewards';

export const REWARD_ITEMS_CATALOG: Record<string, IRewardItem> = {
  // ==========================================
  // NHÓM A: ĐỒ CHƠI (TOYS - 6 MÓN)
  // ==========================================
  toy_teddy_bear: {
    id: 'toy_teddy_bear',
    category: 'toy',
    name: 'Gấu Bông Học Đếm',
    description: 'Chú gấu bông tròn trĩnh ấm áp, luôn đồng hành cùng Ronie đếm số.',
    icon: '🧸',
    rarity: 'common',
    colorAccent: '#F59E0B',
    soundPhrase: 'Một, hai, ba, bốn, năm! Ronie học toán chăm chỉ quá!',
    unlockCondition: {
      type: 'default',
      description: 'Nhận ngay khi bước chân vào Vương Quốc Toán Học.',
    },
  },
  toy_mini_robot: {
    id: 'toy_mini_robot',
    category: 'toy',
    name: 'Robot Bíp Bíp Tí Hon',
    description: 'Người bạn người máy thông minh, có màn hình đo chiều dài cm nhấp nháy.',
    icon: '🤖',
    rarity: 'rare',
    colorAccent: '#38BDF8',
    soundPhrase: 'Bíp bíp! Phép tính chính xác một trăm phần trăm!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_06_math_racing',
      description: 'Hoàn thành nhiệm vụ Đua Xe Toán Học Siêu Tốc.',
    },
  },
  toy_race_car: {
    id: 'toy_race_car',
    category: 'toy',
    name: 'Xe Đua Tơ Nhện Siêu Tốc',
    description: 'Chiếc ô tô đồ chơi bánh đỏ mui trần lướt cực nhanh trên sàn gỗ.',
    icon: '🏎️',
    rarity: 'rare',
    colorAccent: '#EF4444',
    soundPhrase: 'Vroom vroom! Chiếc xe nhện tăng tốc về đích đầu tiên!',
    unlockCondition: {
      type: 'level',
      target: 2,
      description: 'Đạt Cấp độ 2 - Bé Đếm Số Cừ Khôi.',
    },
  },
  toy_princess_doll: {
    id: 'toy_princess_doll',
    category: 'toy',
    name: 'Búp Bê Công Chúa Nơ Hồng',
    description: 'Cô búp bê nhỏ mặc váy hồng xòe, quà tặng từ bạn nhỏ được giải cứu.',
    icon: '🎎',
    rarity: 'common',
    colorAccent: '#EC4899',
    soundPhrase: 'Cảm ơn hiệp sĩ Ronie dũng cảm đã cứu tớ nhé!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_01_rescue_girl',
      description: 'Hoàn thành nhiệm vụ Giải Cứu Cô Bé Khỏi Vực Sâu.',
    },
  },
  toy_dino: {
    id: 'toy_dino',
    category: 'toy',
    name: 'Khủng Long Xanh Tí Nị',
    description: 'Chú khủng long bạo chúa bằng cao su mềm biết kêu gầm gừ vui nhộn.',
    icon: '🦖',
    rarity: 'rare',
    colorAccent: '#10B981',
    soundPhrase: 'Roar roar! Tớ thích ăn các viên đá hình vuông!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_04_treasure_chest',
      description: 'Hoàn thành nhiệm vụ Mở Rương Kho Báu Hoàng Gia.',
    },
  },
  toy_spider: {
    id: 'toy_spider',
    category: 'toy',
    name: 'Đồ Chơi Nhện Nhí Phát Sáng',
    description: 'Mô hình chú nhện màu đỏ xanh có đèn LED dạ quang lung linh ban đêm.',
    icon: '🕷️',
    rarity: 'epic',
    colorAccent: '#8B5CF6',
    soundPhrase: 'Chíu chíu! Tơ nhện ma thuật bảo vệ vương quốc!',
    unlockCondition: {
      type: 'stars',
      target: 10,
      description: 'Tích lũy đủ 10 Ngôi Sao Tri Thức.',
    },
  },

  // ==========================================
  // NHÓM B: KẸO (CANDY - 4 MÓN)
  // ==========================================
  candy_lollipop: {
    id: 'candy_lollipop',
    category: 'candy',
    name: 'Kẹo Mút Cầu Vồng 7 Màu',
    description: 'Cây kẹo xoắn tròn ngọt lịm với vị dâu tây và cam tươi mát lành.',
    icon: '🍭',
    rarity: 'common',
    colorAccent: '#F43F5E',
    soundPhrase: 'Măm măm! Kẹo mút ngọt ngào tiếp thêm năng lượng học tập!',
    unlockCondition: {
      type: 'default',
      description: 'Nữ hoàng Nhi Mami tặng thưởng bé làm quen vương quốc.',
    },
  },
  candy_gummy: {
    id: 'candy_gummy',
    category: 'candy',
    name: 'Kẹo Dẻo Gấu Hương Nho',
    description: 'Những chú gấu kẹo dẻo dai dai mềm mềm nhiều màu sắc sặc sỡ.',
    icon: '🍬',
    rarity: 'common',
    colorAccent: '#A855F7',
    soundPhrase: 'Dẻo dẻo dai dai, cùng đếm xem có mấy chú gấu kẹo nào!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_03_bridge_crossing',
      description: 'Hoàn thành nhiệm vụ Vượt Cầu Đá Kỳ Diệu.',
    },
  },
  candy_chocolate: {
    id: 'candy_chocolate',
    category: 'candy',
    name: 'Thanh Socola Hoàng Gia',
    description: 'Socola sữa béo ngậy được chia thành từng ô vuông toán học thơm ngon.',
    icon: '🍫',
    rarity: 'rare',
    colorAccent: '#78350F',
    soundPhrase: 'Bẻ một ô vuông socola chia cho bạn bè cùng thưởng thức!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_05_candy_machine',
      description: 'Hoàn thành nhiệm vụ Tắt Cỗ Máy Kẹo Quá Tải.',
    },
  },
  candy_cookie: {
    id: 'candy_cookie',
    category: 'candy',
    name: 'Bánh Quy Bơ Sao Vàng',
    description: 'Chiếc bánh gừng giòn rụm hình ngôi sao do Quái Vật Bánh Quy tặng lại làm hòa.',
    icon: '🍪',
    rarity: 'rare',
    colorAccent: '#D97706',
    soundPhrase: 'Rôm rốp rôm rốp! Quái vật bánh quy đã chia bánh cho Ronie rồi!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_02_cookie_monster',
      description: 'Hoàn thành nhiệm vụ Đẩy Lùi Quái Vật Bánh Quy.',
    },
  },

  // ==========================================
  // NHÓM C: HUY HIỆU (BADGES - 5 MÓN)
  // ==========================================
  badge_bravery: {
    id: 'badge_bravery',
    category: 'badge',
    name: 'Huy Hiệu Dũng Cảm',
    description: 'Trao cho hiệp sĩ Ronie không bao giờ bỏ cuộc trước bài toán khó.',
    icon: '🛡️',
    rarity: 'rare',
    colorAccent: '#F59E0B',
    soundPhrase: 'Bé Ronie thật dũng cảm, luôn kiên trì vượt qua thử thách!',
    unlockCondition: {
      type: 'level',
      target: 3,
      description: 'Đạt Cấp độ 3 - Thợ Săn Phép Tính.',
    },
  },
  badge_super_intellect: {
    id: 'badge_super_intellect',
    category: 'badge',
    name: 'Huy Hiệu Siêu Trí Tuệ',
    description: 'Biểu tượng trí óc sáng ngời, giải quyết nhanh các bài toán vận dụng.',
    icon: '🧠',
    rarity: 'epic',
    colorAccent: '#06B6D4',
    soundPhrase: 'Tư duy nhanh nhẹn, suy luận chuẩn xác như một thiên tài nhí!',
    unlockCondition: {
      type: 'stars',
      target: 15,
      description: 'Tích lũy đủ 15 Ngôi Sao Tri Thức.',
    },
  },
  badge_junior_mathematician: {
    id: 'badge_junior_mathematician',
    category: 'badge',
    name: 'Huy Hiệu Nhà Toán Học Nhí',
    description: 'Chứng nhận năng lực nắm vững toàn diện chương trình Toán Lớp 1 GDPT 2018.',
    icon: '📐',
    rarity: 'legendary',
    colorAccent: '#10B981',
    soundPhrase: 'Chúc mừng Nhà Toán Học Nhí xuất sắc của Vương Quốc!',
    unlockCondition: {
      type: 'level',
      target: 5,
      description: 'Đạt Cấp độ 5 - Nhà Thám Hiểm Hình Học.',
    },
  },
  badge_rescuer: {
    id: 'badge_rescuer',
    category: 'badge',
    name: 'Huy Hiệu Người Cứu Hộ',
    description: 'Vinh danh tinh thần nhân ái, sẵn sàng kéo tơ giải cứu muôn loài.',
    icon: '🛟',
    rarity: 'rare',
    colorAccent: '#EC4899',
    soundPhrase: 'Hiệp sĩ cứu hộ luôn có mặt giúp đỡ những người bạn gặp nạn!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_01_rescue_girl',
      description: 'Hoàn thành nhiệm vụ Giải Cứu Cô Bé Khỏi Vực Sâu.',
    },
  },
  badge_math_warrior: {
    id: 'badge_math_warrior',
    category: 'badge',
    name: 'Huy Hiệu Chiến Binh Toán Học',
    description: 'Huy hiệu kim loại quý trao cho chiến binh đẩy lùi quái vật bánh quy.',
    icon: '⚔️',
    rarity: 'epic',
    colorAccent: '#6366F1',
    soundPhrase: 'Đòn đánh tơ sao chuẩn xác bảo vệ hòa bình cho vương quốc!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_02_cookie_monster',
      description: 'Hoàn thành nhiệm vụ Đẩy Lùi Quái Vật Bánh Quy.',
    },
  },

  // ==========================================
  // NHÓM D: TRANG PHỤC (COSTUMES - 5 MÓN)
  // ==========================================
  costume_star_cloak: {
    id: 'costume_star_cloak',
    category: 'costume',
    costumeSlot: 'cloak',
    name: 'Áo Choàng Sao Vàng Hoàng Gia',
    description: 'Tấm áo choàng nhung màu vàng kim thêu hoa văn sao lấp lánh tung bay trong gió.',
    icon: '🌟',
    rarity: 'rare',
    colorAccent: '#FBBF24',
    soundPhrase: 'Áo choàng hoàng gia tung bay, Ronie trông thật oai vệ!',
    unlockCondition: {
      type: 'stars',
      target: 6,
      description: 'Tích lũy 6 Ngôi Sao Tri Thức.',
    },
  },
  costume_spider_mask: {
    id: 'costume_spider_mask',
    category: 'costume',
    costumeSlot: 'mask',
    name: 'Mặt Nạ Tơ Nhện Thần Bí',
    description: 'Mặt nạ siêu anh hùng nhí che mắt với viền phát sáng vi diệu.',
    icon: '🎭',
    rarity: 'common',
    colorAccent: '#E11D48',
    soundPhrase: 'Biến hình siêu anh hùng nhện! Sẵn sàng phiêu lưu!',
    unlockCondition: {
      type: 'default',
      description: 'Trang phục khởi đầu có sẵn trong tủ đồ.',
    },
  },
  costume_speed_boots: {
    id: 'costume_speed_boots',
    category: 'costume',
    costumeSlot: 'boots',
    name: 'Giày Siêu Tốc Tia Chớp',
    description: 'Đôi giày thể thao gắn cánh nhỏ bên hông, giúp Ronie nhảy thoăn thoắt qua các tảng đá.',
    icon: '👟',
    rarity: 'rare',
    colorAccent: '#38BDF8',
    soundPhrase: 'Vèo! Bước chạy nhẹ tênh như tia chớp!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_03_bridge_crossing',
      description: 'Hoàn thành nhiệm vụ Vượt Cầu Đá Kỳ Diệu.',
    },
  },
  costume_crown_hat: {
    id: 'costume_crown_hat',
    category: 'costume',
    costumeSlot: 'hat',
    name: 'Vương Miện Hoàng Gia Nhí',
    description: 'Chiếc vương miện đính ngọc hồng pastel do chính Nữ hoàng Nhi Mami đội lên đầu Ronie.',
    icon: '👑',
    rarity: 'legendary',
    colorAccent: '#F59E0B',
    soundPhrase: 'Hoàng tử nhí của mẹ, con là niềm tự hào lớn nhất của vương quốc!',
    unlockCondition: {
      type: 'mission',
      target: 'mission_04_treasure_chest',
      description: 'Hoàn thành nhiệm vụ Mở Rương Kho Báu Hoàng Gia.',
    },
  },
  costume_super_spider: {
    id: 'costume_super_spider',
    category: 'costume',
    costumeSlot: 'suit',
    name: 'Bộ Giáp Nhện Hoàng Kim Tối Thượng',
    description: 'Trang phục siêu nhân nhện cao cấp kết hợp áo giáp hoàng kim lộng lẫy nhất.',
    icon: '🦸',
    rarity: 'legendary',
    colorAccent: '#F59E0B',
    soundPhrase: 'Sức mạnh tri thức tối thượng! Ronie là hiệp sĩ vĩ đại nhất!',
    unlockCondition: {
      type: 'level',
      target: 6,
      description: 'Đạt Cấp độ 6 - Bậc Thầy Đo Lường.',
    },
  },
};

export const ALL_REWARDS_LIST: IRewardItem[] = Object.values(REWARD_ITEMS_CATALOG);

export function getRewardItemById(id: string): IRewardItem | undefined {
  return REWARD_ITEMS_CATALOG[id];
}

export function getRewardsByCategory(category: RewardCategory): IRewardItem[] {
  return ALL_REWARDS_LIST.filter((item) => item.category === category);
}

/**
 * Bản đồ ánh xạ phần thưởng đặc trưng cho 6 nhiệm vụ Phase 4
 */
export const MISSION_REWARD_MAP: Record<string, string> = {
  mission_01_rescue_girl: 'toy_princess_doll',
  mission_02_cookie_monster: 'candy_cookie',
  mission_03_bridge_crossing: 'costume_speed_boots',
  mission_04_treasure_chest: 'costume_crown_hat',
  mission_05_candy_machine: 'candy_chocolate',
  mission_06_math_racing: 'toy_mini_robot',
};
