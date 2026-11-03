// src/types/rewards.ts
// Định nghĩa cấu trúc chuẩn cho Hệ Thống Phần Thưởng & Kho Đồ (Phase 5)

export type RewardCategory = 'toy' | 'candy' | 'badge' | 'costume';

export type CostumeSlot = 'cloak' | 'mask' | 'boots' | 'hat' | 'suit';

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface IRewardItem {
  id: string; // VD: 'toy_teddy_bear', 'candy_lollipop', 'costume_star_cloak'
  category: RewardCategory;
  name: string;
  description: string;
  icon: string; // Emoji hoặc asset icon
  rarity: RewardRarity;
  costumeSlot?: CostumeSlot; // Dành riêng cho trang phục
  colorAccent?: string; // Mã màu nhấn 3D Pastel
  soundPhrase?: string; // Lời thoại phát ra khi chạm vào đồ chơi / huy hiệu
  unlockCondition: {
    type: 'mission' | 'stars' | 'level' | 'default';
    target?: string | number;
    description: string;
  };
}

export interface IEquippedCostumes {
  cloak?: string; // ID áo choàng
  mask?: string; // ID mặt nạ
  boots?: string; // ID giày
  hat?: string; // ID mũ / vương miện
  suit?: string; // ID bộ giáp đặc biệt
}

export interface IRoomDecoration {
  profileId: string;
  shelfSlots: (string | null)[]; // 6 vị trí trên kệ đồ chơi
  wallpaperColor: string; // Màu giấy dán tường phòng
  carpetColor: string; // Màu thảm trải sàn
  updatedAt: number;
}

export interface IClaimRewardResult {
  success: boolean;
  isDuplicate: boolean;
  item: IRewardItem | null;
  xpGained: number;
  levelUp: boolean;
  newLevel: number;
  message: string;
}
