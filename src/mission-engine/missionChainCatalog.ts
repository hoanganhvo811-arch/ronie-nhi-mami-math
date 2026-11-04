// src/mission-engine/missionChainCatalog.ts
// Danh mục các Chiến Dịch Nhiệm Vụ Liên Hoàn 3–5 Chặng (Mission Chain) - Phase 3

import type { IMissionChainConfig } from './types';
import { MISSION_CATALOG } from './missionCatalog';

export const MISSION_CHAIN_CATALOG: Record<string, IMissionChainConfig> = {
  // CHIẾN DỊCH ĐẠI QUÂN ĐOÀN 5 CHẶNG: HÀNH TRÌNH BẢO VỆ VƯƠNG QUỐC TOÁN HỌC
  grand_kingdom_crusade_5stages: {
    id: 'grand_kingdom_crusade_5stages',
    title: 'Hành Trình Giải Cứu Vương Quốc Toán Học',
    description: 'Chiến dịch liên hoàn 5 chặng vượt qua Rừng Số, Thung Lũng Phép Tính, Cầu Vồng Hình Học, Thành Phố Thời Gian đến Đỉnh Lâu Đài Hoàng Gia để trở thành Đại Hiệp Sĩ!',
    totalStages: 5,
    stages: [
      {
        stageIndex: 1,
        title: 'Chặng 1: Vực Thẳm Rừng Số',
        missionConfig: MISSION_CATALOG.mission_01_rescue_girl,
        dialogueIntro: 'Nhiệm vụ đầu tiên: Hãy kéo cô bé thoát khỏi vực sâu Rừng Số bằng kỹ năng đếm số chuẩn xác!',
        landscape: {
          theme: 'Rừng Số Xanh Biếc',
          bgGradient: 'from-emerald-900 via-teal-950 to-slate-950',
          weather: 'sunny',
        },
      },
      {
        stageIndex: 2,
        title: 'Chặng 2: Thung Lũng Quái Vật Bánh Quy',
        missionConfig: MISSION_CATALOG.mission_02_cookie_monster,
        dialogueIntro: 'Chặng thứ 2: Quái vật bánh quy đang tiến tới! Dùng phép cộng trừ bắn tơ sao đẩy lùi nó nhé!',
        landscape: {
          theme: 'Thung Lũng Bánh Kẹo',
          bgGradient: 'from-amber-900 via-orange-950 to-slate-950',
          weather: 'sunset',
        },
      },
      {
        stageIndex: 3,
        title: 'Chặng 3: Dòng Sông Cầu Vồng Kỳ Bí',
        missionConfig: MISSION_CATALOG.mission_03_bridge_crossing,
        dialogueIntro: 'Chặng thứ 3: Nhận diện các hình khối không gian để triệu hồi cầu đá vượt qua dòng sông cầu vồng!',
        landscape: {
          theme: 'Cầu Vồng Bảy Sắc',
          bgGradient: 'from-pink-900 via-purple-950 to-slate-950',
          weather: 'rainbow',
        },
      },
      {
        stageIndex: 4,
        title: 'Chặng 4: Bệ Phóng Vũ Trụ Thời Gian',
        missionConfig: MISSION_CATALOG.mission_07_rocket_launch,
        dialogueIntro: 'Chặng thứ 4: Tính toán chính xác thời gian và độ dài cm để tiếp nhiên liệu phóng tên lửa Ronie 1!',
        landscape: {
          theme: 'Bầu Trời Ngân Hà',
          bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
          weather: 'starry',
        },
      },
      {
        stageIndex: 5,
        title: 'Chặng 5: Đỉnh Lâu Đài & Đại Chiến Boss',
        missionConfig: MISSION_CATALOG.mission_10_boss_battle,
        dialogueIntro: 'Chặng Quyết Đấu Cuối Cùng: Vận dụng tư duy logic đỉnh cao để đánh bại Trùm Khổng Lồ và đăng quang!',
        landscape: {
          theme: 'Lâu Đài Nhi Mami',
          bgGradient: 'from-purple-950 via-rose-950 to-slate-950',
          weather: 'aurora',
        },
      },
    ],
    grandReward: {
      stars: 15,
      exp: 1500,
      badgeId: 'badge_grand_master_knight',
      costumeReward: 'Áo Choàng Ngôi Sao Hoàng Gia',
      trophyReward: 'Cúp Đại Hiệp Sĩ Vương Quốc Toán Học Vàng Ròng',
    },
  },

  // CHIẾN DỊCH THÁM HIỂM MÊ CUNG & KHO BÁU 3 CHẶNG
  treasure_maze_expedition_3stages: {
    id: 'treasure_maze_expedition_3stages',
    title: 'Thám Hiểm Mê Cung & Rương Kho Báu',
    description: 'Chiến dịch 3 chặng truy tìm kho báu hoàng gia: Vượt Mê Cung Số -> Đúc Chìa Khóa Vàng -> Mở Rương Kim Cương!',
    totalStages: 3,
    stages: [
      {
        stageIndex: 1,
        title: 'Chặng 1: Mê Cung Số Bí Ẩn',
        missionConfig: MISSION_CATALOG.mission_09_number_maze,
        dialogueIntro: 'Bắt đầu chặng 1: Tìm quy luật dãy số để vượt qua mê cung an toàn!',
        landscape: {
          theme: 'Mê Cung Thảo Mộc',
          bgGradient: 'from-teal-900 via-emerald-950 to-slate-950',
          weather: 'sunny',
        },
      },
      {
        stageIndex: 2,
        title: 'Chặng 2: Thu Thập Chìa Khóa Ma Thuật',
        missionConfig: MISSION_CATALOG.mission_08_magic_key,
        dialogueIntro: 'Chặng 2: Tách gộp số để rèn đủ 3 chiếc chìa khóa vàng mở cổng kho báu!',
        landscape: {
          theme: 'Cổng Vàng Hoàng Gia',
          bgGradient: 'from-amber-900 via-rose-950 to-slate-950',
          weather: 'sunset',
        },
      },
      {
        stageIndex: 3,
        title: 'Chặng 3: Mở Khóa Rương Đại Đế',
        missionConfig: MISSION_CATALOG.mission_04_treasure_chest,
        dialogueIntro: 'Chặng về đích: Giải các phép tính toán học để mở bung rương kho báu ngập tràn vàng bạc!',
        landscape: {
          theme: 'Động Kim Cương Lấp Lánh',
          bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
          weather: 'starry',
        },
      },
    ],
    grandReward: {
      stars: 9,
      exp: 900,
      badgeId: 'badge_treasure_hunter_legend',
      costumeReward: 'Mũ Thám Hiểm Hoàng Kim',
      trophyReward: 'Rương Kho Báu Khổng Lồ',
    },
  },
};
