// src/features/toy-room/ToyRoom.tsx
// Phòng Đồ Chơi (Toy Room) của Ronie - Kệ đồ chơi, Tủ trang phục & Khu trưng bày huy hiệu

import React, { useState } from 'react';
import { Shirt, Award, Sparkles, Check, Heart, Volume2 } from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';

interface ToyRoomProps {
  onBack: () => void;
  onHome: () => void;
  totalStars?: number;
}

interface ICostume {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  colorName: string;
}

interface IToy {
  id: string;
  name: string;
  icon: string;
  type: string;
  soundPhrase: string;
  description: string;
}

export const ToyRoom: React.FC<ToyRoomProps> = ({ onBack, onHome, totalStars = 12 }) => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'toys' | 'trophies'>('wardrobe');
  const [selectedCostumeId, setSelectedCostumeId] = useState<string>('costume_classic');
  const [activeToyMessage, setActiveToyMessage] = useState<string>('Bé hãy chạm vào món đồ chơi trên kệ để cùng chơi nhé!');

  const costumes: ICostume[] = [
    {
      id: 'costume_classic',
      name: 'Bộ Nhện Đỏ Ruby Khám Phá',
      icon: '🕷️',
      colorName: 'Đỏ Ruby & Xanh Biển',
      description: 'Trang phục siêu nhân nhện nhí nguyên bản với hoa văn tơ sao may mắn.',
      unlocked: true,
    },
    {
      id: 'costume_emerald',
      name: 'Bộ Nhện Ngọc Bích Rừng Xanh',
      icon: '🌿',
      colorName: 'Xanh Lá Pastel',
      description: 'Ban tặng bởi Thần Cây Rừng Số Đếm khi Ronie đếm chính xác hoa quả.',
      unlocked: true,
    },
    {
      id: 'costume_gold',
      name: 'Áo Choàng Sao Vàng Hoàng Gia',
      icon: '👑',
      colorName: 'Vàng Kim Quý Phái',
      description: 'Nữ hoàng Nhi Mami đích thân trao tặng cho hiệp sĩ toán học xuất sắc.',
      unlocked: true,
    },
    {
      id: 'costume_candy',
      name: 'Bộ Nhện Cầu Vồng Kẹo Ngọt',
      icon: '🍭',
      colorName: 'Hồng & Tím Pastel',
      description: 'Trang phục rực rỡ ngọt ngào nhận được tại Thung Lũng Cầu Vồng.',
      unlocked: totalStars >= 10,
    },
  ];

  const toys: IToy[] = [
    {
      id: 'toy_bear',
      name: 'Gấu Bông Học Đếm',
      icon: '🧸',
      type: 'Đồ chơi số học',
      soundPhrase: 'Một, hai, ba, bốn, năm! Chúc bé Ronie học giỏi toán nhé!',
      description: 'Chú gấu bông ấm áp biết phát âm các số đếm từ một đến mười.',
    },
    {
      id: 'toy_train',
      name: 'Xe Lửa Xếp Khối Gỗ',
      icon: '🚂',
      type: 'Đồ chơi tư duy',
      soundPhrase: 'Tu tu xình xịch! Đoàn tàu chở các khối lập phương và khối hộp chữ nhật!',
      description: 'Đoàn tàu chở các khối gỗ hình học đủ màu sắc.',
    },
    {
      id: 'toy_scale',
      name: 'Cán Cân Mini Cân Bằng',
      icon: '⚖️',
      type: 'Đồ chơi phép tính',
      soundPhrase: 'Bên trái bằng bên phải rồi, cán cân thật thăng bằng!',
      description: 'Mô hình cân hai đĩa giúp Ronie hiểu bản chất của phép cộng trừ.',
    },
    {
      id: 'toy_clock',
      name: 'Đồng Hồ Quả Lắc Cún Con',
      icon: '⏰',
      type: 'Đồ chơi thời gian',
      soundPhrase: 'Tích tắc tích tắc! Kim ngắn chỉ giờ, kim dài chỉ phút!',
      description: 'Chiếc đồng hồ kim ngộ nghĩnh có thể xoay kim học xem giờ đúng.',
    },
  ];

  const trophies = [
    {
      id: 'tr_1',
      title: 'Huy Hiệu Khởi Đầu May Mắn',
      icon: '⭐',
      desc: 'Bước chân đầu tiên vào Vương Quốc Toán Học cùng Nữ hoàng Nhi Mami.',
      earned: true,
    },
    {
      id: 'tr_2',
      title: 'Bàn Tay Vàng Đếm Số',
      icon: '🖐️',
      desc: 'Hoàn thành xuất sắc 5 bài toán đếm số mà không cần gợi ý.',
      earned: true,
    },
    {
      id: 'tr_3',
      title: 'Bậc Thầy Xe Lửa Phép Cộng',
      icon: '🚂',
      desc: 'Lái tàu hoa quả chở đủ 10 quả táo đến Thung Lũng.',
      earned: true,
    },
    {
      id: 'tr_4',
      title: 'Nhà Kiến Trúc Cầu Vồng',
      icon: '🌈',
      desc: 'Ghép tranh hình học chính xác 100% trong Lâu Đài.',
      earned: false,
    },
    {
      id: 'tr_5',
      title: 'Hiệp Sĩ Thời Gian Hoàng Gia',
      icon: '🕰️',
      desc: 'Xem đúng 5 đồng hồ kim liên tiếp mở tiệc cung điện.',
      earned: false,
    },
    {
      id: 'tr_6',
      title: 'Đại Huân Chương Trăm Điểm',
      icon: '👑',
      desc: 'Chinh phục toàn bộ 5 Vùng đất Toán học Lớp 1 chuẩn Bộ GD&ĐT.',
      earned: false,
    },
  ];

  const handleSelectCostume = (costume: ICostume) => {
    if (!costume.unlocked) return;
    soundManager.playTap();
    setSelectedCostumeId(costume.id);
  };

  const handlePlayWithToy = (toy: IToy) => {
    soundManager.playTap();
    soundManager.playCorrect();
    setActiveToyMessage(`🧸 ${toy.name}: "${toy.soundPhrase}"`);
    soundManager.speakVietnamese(toy.soundPhrase);
  };

  const selectedCostume = costumes.find((c) => c.id === selectedCostumeId) || costumes[0];

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-amber-100 via-pink-100 to-purple-100 select-none overflow-y-auto">
      {/* THANH ĐIỀU HƯỚNG */}
      <NavigationHeader
        title="Phòng Đồ Chơi Của Ronie"
        subtitle="Tủ trang phục, kệ đồ chơi & cúp vàng"
        onBack={onBack}
        onHome={onHome}
        totalStars={totalStars}
      />

      <main className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col my-auto z-10">
        {/* TABS LỰA CHỌN */}
        <div className="flex gap-2 mb-4 bg-white/70 p-1.5 rounded-2xl border border-white/80 shadow-sm max-w-lg mx-auto w-full">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('wardrobe');
            }}
            className={`flex-1 py-2.5 rounded-xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'wardrobe'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-rose-900 hover:bg-rose-100'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Tủ Trang Phục</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('toys');
            }}
            className={`flex-1 py-2.5 rounded-xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'toys'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Kệ Đồ Chơi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('trophies');
            }}
            className={`flex-1 py-2.5 rounded-xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'trophies'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Cúp & Huy Hiệu</span>
          </button>
        </div>

        {/* TAB 1: TỦ TRANG PHỤC */}
        {activeTab === 'wardrobe' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* KHU VỰC THỬ ĐỒ (GƯƠNG SOI & RONIE) */}
            <div className="md:col-span-5 flex flex-col items-center bg-white/80 backdrop-blur-md p-6 rounded-3xl border-3 border-rose-300 shadow-lg text-center">
              <span className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2">
                Gương Soi Hoàng Gia
              </span>

              <div className="relative w-48 h-48 bg-gradient-to-tr from-rose-100 to-amber-50 rounded-full border-4 border-rose-300 flex items-center justify-center shadow-inner my-2">
                <RonieAvatar size="xl" state="celebrating" />
              </div>

              <h3 className="font-comic font-black text-lg md:text-xl text-slate-800 mt-2">
                {selectedCostume.name}
              </h3>
              <p className="text-xs font-bold text-amber-700">{selectedCostume.colorName}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">{selectedCostume.description}</p>

              <div className="mt-3 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Đang Mặc Sẵn Sàng</span>
              </div>
            </div>

            {/* DANH SÁCH BỘ TRANG PHỤC TRONG TỦ */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {costumes.map((costume) => {
                const isSelected = selectedCostumeId === costume.id;
                return (
                  <div
                    key={costume.id}
                    onClick={() => handleSelectCostume(costume)}
                    className={`p-4 rounded-3xl border-3 transition-all flex items-center gap-3 cursor-pointer shadow-md ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 scale-102 ring-2 ring-rose-300'
                        : costume.unlocked
                        ? 'bg-white/90 border-slate-200 hover:border-rose-200'
                        : 'bg-slate-100/70 border-slate-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                      {costume.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-comic font-black text-sm text-slate-800 truncate">
                          {costume.name}
                        </h4>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] font-bold text-rose-600">{costume.colorName}</p>
                      {!costume.unlocked && (
                        <span className="text-[10px] font-black text-amber-600">🔒 Cần 10 Sao để mở</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: KỆ ĐỒ CHƠI TƯƠNG TÁC */}
        {activeTab === 'toys' && (
          <div className="flex flex-col gap-4">
            {/* KHUNG THÔNG BÁO TƯƠNG TÁC ĐỒ CHƠI */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border-3 border-amber-300 shadow-md flex items-center gap-3">
              <span className="text-3xl">🧸</span>
              <p className="text-sm font-bold text-slate-800 flex-1">{activeToyMessage}</p>
            </div>

            {/* CÁC MÓN ĐỒ CHƠI TRÊN KỆ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {toys.map((toy) => (
                <div
                  key={toy.id}
                  onClick={() => handlePlayWithToy(toy)}
                  className="bg-white/95 rounded-3xl p-5 border-3 border-amber-200 hover:border-amber-400 shadow-lg flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-2 transition-all active:scale-95"
                >
                  <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-5xl mb-3 shadow-inner animate-pulse">
                    {toy.icon}
                  </div>

                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                    {toy.type}
                  </span>
                  <h4 className="font-comic font-black text-base text-slate-900">{toy.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{toy.description}</p>

                  <div className="mt-3 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-comic font-black text-xs rounded-xl shadow-sm flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Bấm Để Chơi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CÚP & BỘ SƯU TẬP HUY HIỆU */}
        {activeTab === 'trophies' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trophies.map((tr) => (
              <div
                key={tr.id}
                className={`p-4 rounded-3xl border-3 flex items-center gap-4 shadow-md ${
                  tr.earned
                    ? 'bg-white/95 border-purple-300'
                    : 'bg-slate-100/70 border-slate-300 opacity-60'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner ${
                    tr.earned ? 'bg-purple-100 border-2 border-purple-400' : 'bg-slate-200'
                  }`}
                >
                  {tr.earned ? tr.icon : '🔒'}
                </div>

                <div>
                  <h4 className="font-comic font-black text-sm md:text-base text-slate-900">
                    {tr.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{tr.desc}</p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                      tr.earned ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tr.earned ? '✨ Đã Đạt Được' : 'Chưa Mở Khóa'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
