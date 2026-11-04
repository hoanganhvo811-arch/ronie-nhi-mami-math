// src/types/rewards.ts
// Định nghĩa cấu trúc chuẩn cho Hệ Thống Phần Thưởng & Kho Đồ Chơi, Phụ Kiện, Lâu Đài - Phase 4

export type RewardCategory =
  | 'toy' // Gấu bông, robot, xe đồ chơi, búp bê, v.v.
  | 'candy' // Kẹo ngọt ngào
  | 'badge' // Huy hiệu vinh danh
  | 'costume' // Trang phục Ronie
  | 'crown' // Vương miện hoàng gia
  | 'queen_accessory' // Phụ kiện cho Nữ Hoàng Nhi Mami
  | 'castle_decoration' // Đồ trang trí lâu đài
  | 'trophy'; // Cúp vàng danh dự

export type ToySubcategory = 'teddy_bear' | 'robot' | 'toy_car' | 'doll' | 'dino' | 'spider';

export type CostumeSlot = 'cloak' | 'mask' | 'boots' | 'hat' | 'suit';

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface IRewardItem {
  id: string; // VD: 'toy_teddy_bear', 'queen_feather_fan', 'castle_red_carpet'
  category: RewardCategory;
  toySubcategory?: ToySubcategory;
  name: string;
  description: string;
  icon: string; // Emoji hoặc asset icon
  rarity: RewardRarity;
  costumeSlot?: CostumeSlot; // Dành riêng cho trang phục
  colorAccent?: string; // Mã màu nhấn 3D Pastel
  soundPhrase?: string; // Lời thoại phát ra khi chạm vào đồ chơi / phụ kiện
  isFreePlay?: boolean; // Luôn luôn true - 100% không yêu cầu tiền thật
  unlockCondition: {
    type: 'mission' | 'stars' | 'level' | 'default' | 'achievement' | 'daily';
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
