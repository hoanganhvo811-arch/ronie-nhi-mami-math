// src/features/quests/questData.ts
// Danh sách nhiệm vụ hoàng gia chuẩn Chương trình Toán Lớp 1 GDPT 2018

import type { IZoneInfo } from '../../types/game';

export const ZONES_CONFIG: IZoneInfo[] = [
  {
    id: 1,
    title: 'Rừng Số Đếm',
    subtitle: 'Vương Quốc Số 0 đến 10 & So Sánh',
    topicKey: 'counting_to_10',
    color: '#10B981',
    bgGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    icon: '🌲',
    requiredStars: 0,
    description: 'Khám phá thế giới nấm kỳ diệu, làm quen mặt số và so sánh nhiều hơn - ít hơn.',
  },
  {
    id: 2,
    title: 'Thung Lũng Phép Cộng',
    subtitle: 'Gộp Số & Bảng Cộng Trong Phạm Vi 10, 20',
    topicKey: 'addition_within_10',
    color: '#F59E0B',
    bgGradient: 'from-amber-500 via-orange-600 to-slate-900',
    icon: '🚂',
    requiredStars: 3,
    description: 'Cùng Bác Gấu Nâu lái đoàn tàu chở hoa quả và gộp các nhóm số lượng.',
  },
  {
    id: 3,
    title: 'Hẻm Núi Phép Trừ',
    subtitle: 'Bớt Số & Cán Cân Thăng Bằng',
    topicKey: 'subtraction_within_10',
    color: '#EC4899',
    bgGradient: 'from-rose-500 via-pink-600 to-slate-900',
    icon: '⚖️',
    requiredStars: 6,
    description: 'Thử thách cán cân kỳ diệu, tìm số còn thiếu khi bớt đi các vật phẩm.',
  },
  {
    id: 4,
    title: 'Lâu Đài Hình Khối',
    subtitle: 'Hình Phẳng, Khối Lập Phương, Thước Đo & Đồng Hồ',
    topicKey: 'flat_shapes',
    color: '#3B82F6',
    bgGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    icon: '🏰',
    requiredStars: 9,
    description: 'Lắp ghép các viên ngọc hình học, đo độ dài xăng-ti-mét và xem đồng hồ đúng giờ.',
  },
  {
    id: 5,
    title: 'Đấu Trường Trăm Điểm',
    subtitle: 'Số Tròn Chục & Phép Tính Không Nhớ Tới 100',
    topicKey: 'numbers_to_100',
    color: '#8B5CF6',
    bgGradient: 'from-purple-600 via-violet-800 to-slate-900',
    icon: '👑',
    requiredStars: 12,
    description: 'Chinh phục đấu trường hoàng gia, kích hoạt Đài Phun Nước Tri Thức cùng Nữ hoàng!',
  },
];
