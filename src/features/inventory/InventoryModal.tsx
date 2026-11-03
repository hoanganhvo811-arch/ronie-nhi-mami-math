// src/features/inventory/InventoryModal.tsx
// Tủ đồ trang phục của Ronie & Bộ sưu tập Huy hiệu Nữ hoàng Nhi Mami

import React, { useState } from 'react';
import { X, Shirt, Award, Check } from 'lucide-react';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface InventoryModalProps {
  onClose: () => void;
}

interface ICostume {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  unlocked: boolean;
}

interface IBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'costumes' | 'badges'>('costumes');
  const [selectedCostumeId, setSelectedCostumeId] = useState<string>('costume_classic');

  const costumes: ICostume[] = [
    {
      id: 'costume_classic',
      name: 'Áo Nhện Tơ Đỏ Ruby',
      icon: '🕷️',
      color: '#E11D48',
      description: 'Trang phục siêu anh hùng cơ bản mang biểu tượng tơ sao may mắn.',
      unlocked: true,
    },
    {
      id: 'costume_emerald',
      name: 'Giáp Nhện Ngọc Bích',
      icon: '🌿',
      color: '#10B981',
      description: 'Ban tặng bởi Thần Cây Rừng Số Đếm khi bé đếm chuẩn xác.',
      unlocked: true,
    },
    {
      id: 'costume_gold',
      name: 'Áo Choàng Sao Vàng Hoàng Gia',
      icon: '👑',
      color: '#F59E0B',
      description: 'Nữ hoàng Nhi Mami ban tặng cho hiệp sĩ toán học xuất sắc.',
      unlocked: false,
    },
  ];

  const badges: IBadge[] = [
    {
      id: 'badge_star',
      name: 'Huy Hiệu Hiệp Sĩ Khởi Đầu',
      icon: '⭐',
      description: 'Bước chân đầu tiên vào Vương Quốc Toán Học.',
      unlocked: true,
    },
    {
      id: 'badge_counting',
      name: 'Bàn Tay Vàng Đếm Số',
      icon: '🖐️',
      description: 'Đếm chính xác 10 bài toán không cần gợi ý.',
      unlocked: true,
    },
    {
      id: 'badge_shapes',
      name: 'Nhà Hình Học Nhí',
      icon: '🔷',
      description: 'Nhận diện xuất sắc các hình khối không gian.',
      unlocked: false,
    },
    {
      id: 'badge_clock',
      name: 'Chúa Tể Thời Gian',
      icon: '⏰',
      description: 'Xem đúng tất cả các đồng hồ kim trong lâu đài.',
      unlocked: false,
    },
  ];

  const handleSelectCostume = (id: string, unlocked: boolean) => {
    if (!unlocked) return;
    soundManager.playTap();
    setSelectedCostumeId(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border-4 border-amber-400 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-2xl text-slate-950 font-black">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-amber-300">TỦ ĐỒ & BỘ SƯU TẬP</h2>
              <p className="text-xs text-slate-400">Trang phục Ronie & Huy hiệu Nữ hoàng Nhi Mami</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 my-4">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setTab('costumes');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              tab === 'costumes'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Trang Phục Ronie</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setTab('badges');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              tab === 'badges'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Huy Hiệu Nữ Hoàng</span>
          </button>
        </div>

        {/* NỘI DUNG TỦ ĐỒ */}
        <div className="flex-1 overflow-y-auto pr-1">
          {tab === 'costumes' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {costumes.map((costume) => {
                const isSelected = selectedCostumeId === costume.id;
                return (
                  <div
                    key={costume.id}
                    onClick={() => handleSelectCostume(costume.id, costume.unlocked)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-md'
                        : costume.unlocked
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-850/40 border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-3xl flex-shrink-0">
                      {costume.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-100 truncate">{costume.name}</h4>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {costume.description}
                      </p>
                      {!costume.unlocked && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-amber-500">
                          🔒 Cần thêm 6 sao để mở
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${
                    badge.unlocked
                      ? 'bg-purple-950/30 border-purple-500/50'
                      : 'bg-slate-850/40 border-slate-800 opacity-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border border-purple-400/40 flex items-center justify-center text-3xl flex-shrink-0">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-purple-200">{badge.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RonieAvatar size="sm" state="celebrating" />
            <span className="text-xs font-bold text-slate-300">Ronie luôn sẵn sàng phiêu lưu!</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl transition-all cursor-pointer"
          >
            Đóng Tủ Đồ
          </button>
        </div>
      </div>
    </div>
  );
};
