// src/features/profile/ProfileScreen.tsx
// Màn hình Hồ Sơ của Ronie (Profile) - Cấp độ, Tổng nhiệm vụ, Số huy hiệu & Thành tích học toán

import React from 'react';
import { Star, Award, CheckCircle, Flame, Target, BookOpen, Sparkles } from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { RonieAvatar } from '../character/RonieAvatar';

interface ProfileScreenProps {
  onBack: () => void;
  onHome: () => void;
  totalStars?: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onHome, totalStars = 12 }) => {
  // Cấp độ và danh hiệu
  const knightLevel = 3;
  const levelTitle = 'Hiệp Sĩ Nhí Tinh Anh';
  const totalMissions = 15;
  const completedMissions = 5;
  const totalBadges = 12;
  const unlockedBadges = 4;
  const streakDays = 3;
  const accuracyRate = 92;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-50 select-none overflow-y-auto">
      {/* THANH ĐIỀU HƯỚNG */}
      <NavigationHeader
        title="Hồ Sơ Của Ronie"
        subtitle="Thông tin hiệp sĩ & Bảng thành tích"
        onBack={onBack}
        onHome={onHome}
        totalStars={totalStars}
      />

      <main className="w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col my-auto z-10">
        {/* CARD THÔNG TIN CÁ NHÂN RONIE */}
        <div className="bg-white/95 rounded-3xl p-6 md:p-8 border-3 border-sky-300 shadow-xl flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-sky-100 to-rose-100 border-4 border-sky-300 flex items-center justify-center shadow-inner">
              <RonieAvatar size="xl" state="celebrating" />
            </div>
            <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 font-comic font-black text-xs px-2.5 py-1 rounded-full border-2 border-white shadow-md">
              Cấp {knightLevel}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{levelTitle}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-comic font-black text-slate-850">
              BÉ RONIE - LỚP 1
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold mt-0.5">
              Đồng hành cùng Nữ hoàng Nhi Mami khám phá Toán Tiểu học (Bộ GD&ĐT)
            </p>

            {/* THANH TIẾN ĐỘ LÊN CẤP */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600">Tiến trình lên Cấp 4</span>
                <span className="text-amber-600 font-black">{totalStars}/20 Sao</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalStars / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 CHỈ SỐ THÀNH TÍCH CHÍNH (4 STATS CARDS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* SAO TRI THỨC */}
          <div className="bg-white/95 rounded-3xl p-4 border-2 border-amber-300 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 mb-2">
              <Star className="w-7 h-7 fill-amber-400" />
            </div>
            <span className="font-comic font-black text-2xl text-amber-600">{totalStars}</span>
            <span className="text-xs font-bold text-slate-600">Sao Tri Thức</span>
          </div>

          {/* NHIỆM VỤ HOÀN THÀNH */}
          <div className="bg-white/95 rounded-3xl p-4 border-2 border-emerald-300 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
              <CheckCircle className="w-7 h-7" />
            </div>
            <span className="font-comic font-black text-2xl text-emerald-600">
              {completedMissions}/{totalMissions}
            </span>
            <span className="text-xs font-bold text-slate-600">Nhiệm Vụ Xong</span>
          </div>

          {/* HUY HIỆU ĐÃ ĐẠT */}
          <div className="bg-white/95 rounded-3xl p-4 border-2 border-purple-300 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              <Award className="w-7 h-7" />
            </div>
            <span className="font-comic font-black text-2xl text-purple-600">
              {unlockedBadges}/{totalBadges}
            </span>
            <span className="text-xs font-bold text-slate-600">Huy Hiệu</span>
          </div>

          {/* CHUỖI NGÀY HỌC */}
          <div className="bg-white/95 rounded-3xl p-4 border-2 border-rose-300 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 mb-2">
              <Flame className="w-7 h-7 fill-rose-500" />
            </div>
            <span className="font-comic font-black text-2xl text-rose-600">{streakDays} Ngày</span>
            <span className="text-xs font-bold text-slate-600">Chăm Chỉ</span>
          </div>
        </div>

        {/* BẢNG KỸ NĂNG TOÁN HỌC LỚP 1 */}
        <div className="bg-white/95 rounded-3xl p-6 border-3 border-indigo-200 shadow-lg">
          <h3 className="font-comic font-black text-base md:text-lg text-slate-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Kỹ Năng Toán Học Thành Thạo</span>
          </h3>

          <div className="space-y-3">
            {[
              { skill: 'Nhận biết & Đếm số 0 đến 10', percent: 95, color: 'bg-emerald-500' },
              { skill: 'So sánh lớn hơn, bé hơn, bằng nhau', percent: 90, color: 'bg-teal-500' },
              { skill: 'Phép cộng trong phạm vi 10 & 20', percent: 85, color: 'bg-amber-500' },
              { skill: 'Phép trừ & Cán cân thăng bằng', percent: 80, color: 'bg-rose-500' },
              { skill: 'Nhận biết hình phẳng & Khối hộp', percent: 92, color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800">{item.skill}</span>
                  <span className="text-indigo-600 font-black">{item.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
