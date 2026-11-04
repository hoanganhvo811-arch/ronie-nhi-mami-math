// src/features/toy-room/ToyRoom.tsx
// Phòng Đồ Chơi (Toy Room) của Ronie - Kệ đồ chơi, Tủ trang phục, Huy hiệu, Kho báu & Trang trí phòng (Phase 5)

import React, { useState, useEffect } from 'react';
import {
  Shirt,
  Award,
  Sparkles,
  Check,
  Heart,
  Volume2,
  Palette,
  Package,
  Trash2,
  Plus,
} from 'lucide-react';
import { NavigationHeader } from '../../components/NavigationHeader';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';
import {
  REWARD_ITEMS_CATALOG,
  getRewardItemById,
  ALL_REWARDS_LIST,
} from '../rewards/rewardCatalog';
import {
  getInventory,
  getRoomDecoration,
  saveRoomDecoration,
  equipCostumeItem,
  getEquippedCostumes,
  getProgression,
  DEFAULT_PROFILE_ID,
} from '../../services/storage/db';
import type { IInventoryItem, CostumeSlot } from '../../types/database';
import type { IEquippedCostumes, IRewardItem } from '../../types/rewards';
import type { IProgressionRecord } from '../../types/database';
import { ProgressionEngine } from '../progression/progressionEngine';

interface ToyRoomProps {
  onBack: () => void;
  onHome: () => void;
  totalStars?: number;
}

export const ToyRoom: React.FC<ToyRoomProps> = ({ onBack, onHome, totalStars = 12 }) => {
  const [activeTab, setActiveTab] = useState<'shelf' | 'wardrobe' | 'badges' | 'treasure' | 'decor'>('shelf');
  const [inventoryItems, setInventoryItems] = useState<IInventoryItem[]>([
    {
      id: `${DEFAULT_PROFILE_ID}_toy_teddy_bear`,
      profileId: DEFAULT_PROFILE_ID,
      itemType: 'toy',
      itemId: 'toy_teddy_bear',
      name: 'Gấu Bông Học Đếm',
      description: 'Chú gấu bông ấm áp luôn đồng hành cùng bé Ronie.',
      icon: '🧸',
      isEquipped: false,
      unlockedAt: Date.now(),
    },
    {
      id: `${DEFAULT_PROFILE_ID}_candy_lollipop`,
      profileId: DEFAULT_PROFILE_ID,
      itemType: 'candy',
      itemId: 'candy_lollipop',
      name: 'Kẹo Mút Cầu Vồng 7 Màu',
      description: 'Cây kẹo xoắn tròn ngọt ngào tiếp thêm năng lượng học tập.',
      icon: '🍭',
      isEquipped: false,
      unlockedAt: Date.now(),
    },
    {
      id: `${DEFAULT_PROFILE_ID}_badge_bravery`,
      profileId: DEFAULT_PROFILE_ID,
      itemType: 'badge',
      itemId: 'badge_bravery',
      name: 'Huy Hiệu Dũng Cảm',
      description: 'Nữ hoàng Nhi Mami trao tặng khi bước chân vào Vương Quốc.',
      icon: '🛡️',
      isEquipped: false,
      unlockedAt: Date.now(),
    },
  ]);
  const [shelfSlots, setShelfSlots] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [wallpaperColor, setWallpaperColor] = useState<string>('#FCE7F3');
  const [carpetColor, setCarpetColor] = useState<string>('#FEF3C7');
  const [equippedCostumes, setEquippedCostumes] = useState<IEquippedCostumes>({});
  const [progression, setProgression] = useState<IProgressionRecord | null>(null);
  const [activeToyMessage, setActiveToyMessage] = useState<string>(
    'Bé hãy chạm vào món đồ chơi trên kệ để lắng nghe âm thanh vui nhộn nhé!'
  );
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Tải dữ liệu từ Dexie khi vào phòng
  const loadRoomData = async () => {
    try {
      const [inv, deco, costumes, prog] = await Promise.all([
        getInventory(DEFAULT_PROFILE_ID),
        getRoomDecoration(DEFAULT_PROFILE_ID),
        getEquippedCostumes(DEFAULT_PROFILE_ID),
        getProgression(DEFAULT_PROFILE_ID),
      ]);
      setInventoryItems(inv);
      setShelfSlots(deco.shelfSlots);
      setWallpaperColor(deco.wallpaperColor);
      setCarpetColor(deco.carpetColor);
      setEquippedCostumes(costumes);
      setProgression(prog);
    } catch (err) {
      console.warn('Lỗi tải dữ liệu phòng đồ chơi:', err);
    }
  };

  useEffect(() => {
    loadRoomData();
  }, []);

  // Chạm vào đồ chơi trên kệ
  const handleTapPlacedToy = (itemId: string) => {
    soundManager.playTap();
    const itemDef = getRewardItemById(itemId);
    if (itemDef) {
      const phrase = itemDef.soundPhrase || `Đây là món ${itemDef.name} tuyệt đẹp của Ronie!`;
      setActiveToyMessage(phrase);
      soundManager.speakVietnamese(phrase);
    }
  };

  // Đặt đồ chơi vào ô kệ
  const handlePlaceToyToSlot = async (slotIdx: number, toyId: string) => {
    soundManager.playTap();
    const newSlots = [...shelfSlots];
    newSlots[slotIdx] = toyId;
    setShelfSlots(newSlots);
    setSelectedSlotIndex(null);
    await saveRoomDecoration(DEFAULT_PROFILE_ID, newSlots, wallpaperColor, carpetColor);

    const itemDef = getRewardItemById(toyId);
    setActiveToyMessage(`Bé đã đặt ${itemDef?.name || 'đồ chơi'} lên kệ phòng!`);
  };

  // Cất đồ chơi khỏi kệ về kho
  const handleRemoveToyFromSlot = async (slotIdx: number) => {
    soundManager.playTap();
    const newSlots = [...shelfSlots];
    newSlots[slotIdx] = null;
    setShelfSlots(newSlots);
    await saveRoomDecoration(DEFAULT_PROFILE_ID, newSlots, wallpaperColor, carpetColor);
  };

  // Mặc thử hoặc thay đổi trang phục
  const handleEquipCostume = async (costumeItem: IRewardItem) => {
    if (!costumeItem.costumeSlot) return;
    soundManager.playCelebration();
    await equipCostumeItem(DEFAULT_PROFILE_ID, costumeItem.id, costumeItem.costumeSlot);

    const updated = await getEquippedCostumes(DEFAULT_PROFILE_ID);
    setEquippedCostumes(updated);
    setActiveToyMessage(`Ronie vừa mặc ${costumeItem.name}! Trông thật oai vệ!`);
    soundManager.speakVietnamese(costumeItem.soundPhrase || `Ronie mặc ${costumeItem.name}`);
  };

  // Thay đổi màu giấy dán tường
  const handleChangeWallpaper = async (color: string) => {
    soundManager.playTap();
    setWallpaperColor(color);
    await saveRoomDecoration(DEFAULT_PROFILE_ID, shelfSlots, color, carpetColor);
  };

  // Thay đổi màu thảm
  const handleChangeCarpet = async (color: string) => {
    soundManager.playTap();
    setCarpetColor(color);
    await saveRoomDecoration(DEFAULT_PROFILE_ID, shelfSlots, wallpaperColor, color);
  };

  // Lọc các món đồ chơi sở hữu trong kho
  const ownedToys = inventoryItems
    .filter((item) => item.itemType === 'toy')
    .map((item) => getRewardItemById(item.itemId))
    .filter((item): item is IRewardItem => !!item);

  // Lọc trang phục sở hữu
  const ownedCostumes = ALL_REWARDS_LIST.filter(
    (item) =>
      item.category === 'costume' &&
      (inventoryItems.some((inv) => inv.itemId === item.id) || item.unlockCondition.type === 'default')
  );

  // Lọc huy hiệu sở hữu
  const ownedBadges = ALL_REWARDS_LIST.filter(
    (item) =>
      item.category === 'badge' &&
      (inventoryItems.some((inv) => inv.itemId === item.id) || item.unlockCondition.type === 'default')
  );

  // Lọc kẹo sở hữu
  const ownedCandies = ALL_REWARDS_LIST.filter(
    (item) =>
      item.category === 'candy' &&
      (inventoryItems.some((inv) => inv.itemId === item.id) || item.unlockCondition.type === 'default')
  );

  const levelInfo = ProgressionEngine.getLevelInfo(progression?.xp || 0);

  return (
    <div
      className="relative w-full h-full min-h-screen flex flex-col justify-between select-none overflow-y-auto transition-colors duration-500"
      style={{ backgroundColor: wallpaperColor }}
    >
      {/* THANH ĐIỀU HƯỚNG */}
      <NavigationHeader
        title="Phòng Đồ Chơi Của Ronie"
        subtitle={`Cấp ${levelInfo.level}: ${levelInfo.title} • ${progression?.xp || 0} EXP`}
        onBack={onBack}
        onHome={onHome}
        totalStars={totalStars}
      />

      {/* SÂN KHẤU TRUNG TÂM PHÒNG ĐỒ CHƠI (Image 5 Reference: 3D Dressing Room & Toy Room) */}
      <main className="w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col my-auto z-10">
        {/* KHUNG CẢNH 3D PHÒNG THAY ĐỒ & ĐỒ CHƠI: GƯƠNG ĐÈN TRÒN, THẢM NHUNG TÍM & GIÁ TREO ĐỒ */}
        <div className="relative w-full rounded-3xl p-4 sm:p-6 border-4 border-amber-300 shadow-2xl bg-white/75 backdrop-blur-md mb-4 flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6 overflow-hidden">
          {/* 1. GƯƠNG TRANG ĐIỂM VÒM CÓ DÃY ĐÈN TRÒN PHÁT SÁNG (Image 5 Vanity Mirror with Round Lights) */}
          <div className="relative w-40 sm:w-48 h-56 sm:h-64 rounded-t-full bg-gradient-to-b from-purple-800 via-indigo-900 to-purple-950 p-2.5 border-4 border-purple-950 shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex flex-col items-center shrink-0">
            {/* CÁC BÓNG ĐÈN TRÒN VÀNG SÁNG XUNG QUANH VIỀN GƯƠNG */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_12px_#fde047] animate-pulse" />
            <div className="absolute top-6 left-0.5 w-3.5 h-3.5 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_10px_#fde047]" />
            <div className="absolute top-6 right-0.5 w-3.5 h-3.5 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_10px_#fde047]" />
            <div className="absolute top-20 left-0.5 w-3.5 h-3.5 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_10px_#fde047]" />
            <div className="absolute top-20 right-0.5 w-3.5 h-3.5 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_10px_#fde047]" />
            <div className="absolute top-36 left-0.5 w-3.5 h-3.5 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_10px_#fde047]" />
            <div className="absolute top-36 right-0.5 w-3.5 h-3.5 rounded-full bg-yellow-200 border-2 border-yellow-400 shadow-[0_0_10px_#fde047]" />

            {/* MẶT GƯƠNG THẦN KỲ PHẢN CHIẾU ÁNH SÁNG */}
            <div className="relative w-full h-full rounded-t-full bg-gradient-to-tr from-sky-200 via-sky-100 to-white border-2 border-purple-400 overflow-hidden flex flex-col items-center justify-end p-2 shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.7)_50%,transparent_60%)] pointer-events-none" />
              <span className="text-[10px] font-comic font-black text-purple-900 bg-white/90 px-2 py-0.5 rounded-full z-10 shadow-sm">
                🪞 Gương Thần Kỳ
              </span>
            </div>

            {/* BÀN DƯỚI GƯƠNG */}
            <div className="w-full h-4 bg-blue-700 rounded-b-xl border-t-2 border-amber-300 shadow-md -mb-1" />
          </div>

          {/* 2. TRUNG TÂM: RONIE & THÚ CƯNG ĐỨNG TRÊN THẢM NHUNG TÍM (Image 5 Ronie & Pets) */}
          <div className="relative flex flex-col items-center my-2">
            {/* THẢM TRÒN NHUNG TÍM */}
            <div
              className="relative w-52 h-28 sm:w-64 sm:h-32 rounded-[50%] border-4 border-amber-300 shadow-[0_12px_24px_rgba(0,0,0,0.25)] flex items-center justify-center transition-colors duration-500"
              style={{ backgroundColor: carpetColor || '#7E22CE' }}
            >
              <div className="scale-115 sm:scale-130 -mt-8 sm:-mt-12 z-10">
                <RonieAvatar
                  size="xl"
                  state="celebrating"
                  variant="photo"
                  costumes={equippedCostumes}
                />
              </div>

              {/* BẠN CÚN XANH THÔNG MINH (Image 5 Blue Puppy) */}
              <div className="absolute -bottom-1 -left-4 z-20 animate-bounce cursor-pointer" title="Cún con trung thành">
                <span className="text-3xl sm:text-4xl drop-shadow">🐶</span>
              </div>

              {/* BẠN NHỆN CON VUI VẺ (Image 5 Little Spider Pet) */}
              <div className="absolute -bottom-2 -right-4 z-20 animate-pulse cursor-pointer" title="Bé nhện đáng yêu">
                <span className="text-3xl sm:text-4xl drop-shadow">🕷️</span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center">
              <span className="px-3.5 py-0.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-comic font-black text-xs rounded-full shadow-[0_3px_0_#9f1239] border border-white">
                Hiệp Sĩ Ronie
              </span>
              <span className="text-[10px] font-comic font-bold text-slate-800 mt-1 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                {equippedCostumes.cloak ? 'Áo Choàng Hoàng Gia • ' : ''}
                {equippedCostumes.hat ? 'Vương Miện Nhí' : 'Trang Phục Nhện Tinh Nghịch'}
              </span>
            </div>
          </div>

          {/* 3. TỦ TREO TRANG PHỤC GỖ CÓ BÁNH XE (Image 5 Rolling Garment Rack) */}
          <div className="relative w-44 sm:w-52 flex flex-col items-center shrink-0">
            <span className="text-[11px] font-comic font-black text-amber-950 mb-1">
              👗 Giá Treo Trang Phục
            </span>
            <div className="w-full bg-gradient-to-b from-amber-800 to-amber-950 p-2.5 rounded-2xl border-3 border-amber-950 shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
              {/* Thanh xà kim loại vàng */}
              <div className="w-full h-2 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 rounded-full shadow-inner mb-2.5" />
              {/* Trang phục móc treo */}
              <div className="flex items-center justify-around gap-1">
                <span className="text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer" title="Áo Choàng">
                  🧥
                </span>
                <span className="text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer" title="Mặt Nạ">
                  🎭
                </span>
                <span className="text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer" title="Vương Miện">
                  👑
                </span>
                <span className="text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer" title="Giày Hiệp Sĩ">
                  👢
                </span>
              </div>
            </div>
            {/* Chân giá đỡ & bánh xe con lăn */}
            <div className="w-full flex justify-between px-3 -mt-0.5">
              <div className="w-2 h-5 bg-amber-900 rounded-b" />
              <div className="w-2 h-5 bg-amber-900 rounded-b" />
            </div>
            <div className="w-full flex justify-between px-2 -mt-1">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-600 shadow" />
              <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-600 shadow" />
            </div>
          </div>
        </div>

        {/* KỆ ĐỒ CHƠI GỖ 6 NGĂN HOÀNG GIA (Nằm ngay bên dưới để bé dễ thao tác đặt đồ chơi) */}
        <div className="w-full bg-gradient-to-r from-amber-900 via-amber-850 to-amber-950 p-3 sm:p-4 rounded-3xl border-3 border-amber-700 shadow-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-comic font-black text-amber-200 flex items-center gap-1.5">
              <span>🪵 Kệ Đồ Chơi Gỗ Hoàng Gia (6 Ngăn Trưng Bày)</span>
            </span>
            <span className="text-[10px] font-comic font-bold text-amber-300">
              {shelfSlots.filter(Boolean).length}/6 món đã trưng bày
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {shelfSlots.map((toyId, slotIdx) => {
              const toyDef = toyId ? getRewardItemById(toyId) : null;
              return (
                <div
                  key={slotIdx}
                  className="relative w-full h-20 sm:h-22 rounded-2xl border-3 border-amber-400/80 bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center shadow-md cursor-pointer group hover:scale-105 active:scale-95 transition-all"
                >
                  {toyDef ? (
                    <>
                      <div
                        onClick={() => handleTapPlacedToy(toyDef.id)}
                        className="flex flex-col items-center"
                        title={toyDef.name}
                      >
                        <span className="text-3xl sm:text-4xl animate-bounce drop-shadow">
                          {toyDef.icon}
                        </span>
                        <span className="text-[9px] font-comic font-black text-amber-950 truncate max-w-[65px] mt-0.5">
                          {toyDef.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveToyFromSlot(slotIdx);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow cursor-pointer"
                        title="Cất vào kho"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div
                      onClick={() => setSelectedSlotIndex(slotIdx)}
                      className="flex flex-col items-center text-amber-800/60 hover:text-amber-950"
                    >
                      <Plus className="w-5 h-5 stroke-[3]" />
                      <span className="text-[8px] font-comic font-bold">Đặt đồ chơi</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* KHUNG THOẠI ÂM THANH ĐỒ CHƠI */}
        <div className="w-full bg-white/90 border-2 border-amber-300 rounded-2xl p-3 mb-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <p className="text-xs sm:text-sm font-comic font-bold text-slate-800">
              {activeToyMessage}
            </p>
          </div>
          <button
            onClick={() => soundManager.speakVietnamese(activeToyMessage)}
            className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl cursor-pointer shrink-0 active:scale-90"
            title="Nghe lại"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* TABS ĐIỀU HƯỚNG PHÒNG ĐỒ CHƠI */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('shelf');
            }}
            className={`py-2 px-3 sm:px-4 rounded-xl font-comic font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              activeTab === 'shelf'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white/70 hover:bg-white text-slate-700'
            }`}
          >
            <span>🧸 Kệ Đồ Chơi</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('wardrobe');
            }}
            className={`py-2 px-3 sm:px-4 rounded-xl font-comic font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              activeTab === 'wardrobe'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/70 hover:bg-white text-slate-700'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Tủ Trang Phục</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('badges');
            }}
            className={`py-2 px-3 sm:px-4 rounded-xl font-comic font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              activeTab === 'badges'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/70 hover:bg-white text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Cúp & Huy Hiệu</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('treasure');
            }}
            className={`py-2 px-3 sm:px-4 rounded-xl font-comic font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              activeTab === 'treasure'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/70 hover:bg-white text-slate-700'
            }`}
          >
            <span>🍭 Lọ Kẹo & Kho Báu</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('decor');
            }}
            className={`py-2 px-3 sm:px-4 rounded-xl font-comic font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
              activeTab === 'decor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/70 hover:bg-white text-slate-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Trang Trí Phòng</span>
          </button>
        </div>

        {/* NỘI DUNG TỪNG TAB */}

        {/* TAB 1: DANH SÁCH ĐỒ CHƠI TRONG KHO (ĐỂ ĐẶT LÊN KỆ) */}
        {activeTab === 'shelf' && (
          <div className="bg-white/95 rounded-3xl p-5 border-3 border-amber-300 shadow-xl">
            <h3 className="text-base font-comic font-black text-amber-950 mb-3 flex items-center justify-between">
              <span>Đồ chơi đã sưu tầm ({ownedToys.length})</span>
              <span className="text-xs font-bold text-slate-500">
                {selectedSlotIndex !== null
                  ? `👉 Chạm vào đồ chơi để đặt vào ô kệ số ${selectedSlotIndex + 1}`
                  : 'Chạm ô kệ có dấu (+) để đặt đồ chơi'}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {ownedToys.map((toy) => (
                <div
                  key={toy.id}
                  onClick={() => {
                    if (selectedSlotIndex !== null) {
                      handlePlaceToyToSlot(selectedSlotIndex, toy.id);
                    } else {
                      // Tìm ô trống đầu tiên
                      const firstEmpty = shelfSlots.findIndex((s) => s === null);
                      if (firstEmpty !== -1) {
                        handlePlaceToyToSlot(firstEmpty, toy.id);
                      } else {
                        handleTapPlacedToy(toy.id);
                      }
                    }
                  }}
                  className="bg-amber-50 hover:bg-amber-100 rounded-2xl p-3 border-2 border-amber-300 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all shadow-sm group"
                >
                  <span className="text-4xl group-hover:scale-125 transition-transform">
                    {toy.icon}
                  </span>
                  <span className="text-xs font-comic font-black text-slate-800 mt-1 line-clamp-1">
                    {toy.name}
                  </span>
                  <span className="text-[9px] text-amber-700 font-bold mt-0.5">Đặt lên kệ</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TỦ TRANG PHỤC CỦA RONIE */}
        {activeTab === 'wardrobe' && (
          <div className="bg-white/95 rounded-3xl p-5 border-3 border-rose-300 shadow-xl">
            <h3 className="text-base font-comic font-black text-rose-950 mb-3">
              Tủ Đồ Thời Trang Hiệp Sĩ Nhí ({ownedCostumes.length} bộ trang phục)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ownedCostumes.map((costume) => {
                const isEquipped = costume.costumeSlot && equippedCostumes[costume.costumeSlot] === costume.id;
                return (
                  <div
                    key={costume.id}
                    className={`rounded-2xl p-3.5 border-3 transition-all flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-300'
                        : 'bg-slate-50 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-3xl shadow-inner shrink-0">
                        {costume.icon}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-comic font-black text-slate-800">
                          {costume.name}
                        </h4>
                        <span className="text-[10px] text-rose-600 font-bold uppercase">
                          {costume.costumeSlot}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEquipCostume(costume)}
                      className={`px-3 py-1.5 rounded-xl font-comic font-black text-xs cursor-pointer active:scale-95 transition-all ${
                        isEquipped
                          ? 'bg-emerald-500 text-white shadow'
                          : 'bg-rose-500 hover:bg-rose-600 text-white shadow'
                      }`}
                    >
                      {isEquipped ? 'Đang Mặc' : 'Mặc Ngay'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BẢNG HUY HIỆU VINH DANH */}
        {activeTab === 'badges' && (
          <div className="bg-white/95 rounded-3xl p-5 border-3 border-indigo-300 shadow-xl">
            <h3 className="text-base font-comic font-black text-indigo-950 mb-3">
              Bảng Huy Hiệu Vinh Dự Hoàng Gia ({ownedBadges.length} huy hiệu)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {ownedBadges.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => {
                    soundManager.playTap();
                    setActiveToyMessage(badge.soundPhrase || badge.description);
                    soundManager.speakVietnamese(badge.soundPhrase || badge.description);
                  }}
                  className="bg-indigo-50/70 hover:bg-indigo-100 rounded-2xl p-3 border-2 border-indigo-300 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <span className="text-4xl animate-bounce">{badge.icon}</span>
                  <span className="text-xs font-comic font-black text-indigo-900 mt-1 line-clamp-1">
                    {badge.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium mt-0.5 line-clamp-2">
                    {badge.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LỌ KẸO NGỌT & KHO BÁU */}
        {activeTab === 'treasure' && (
          <div className="bg-white/95 rounded-3xl p-5 border-3 border-purple-300 shadow-xl">
            <h3 className="text-base font-comic font-black text-purple-950 mb-3">
              Lọ Kẹo Ngọt Ngào & Thống Kê Thành Tích
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {ownedCandies.map((candy) => (
                <div
                  key={candy.id}
                  onClick={() => {
                    soundManager.playTap();
                    setActiveToyMessage(candy.soundPhrase || candy.description);
                    soundManager.speakVietnamese(candy.soundPhrase || candy.description);
                  }}
                  className="bg-purple-50 hover:bg-purple-100 rounded-2xl p-3 border-2 border-purple-300 flex flex-col items-center text-center cursor-pointer active:scale-95 shadow-sm"
                >
                  <span className="text-4xl">{candy.icon}</span>
                  <span className="text-xs font-comic font-black text-purple-900 mt-1">
                    {candy.name}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-black mt-0.5">Sẵn sàng!</span>
                </div>
              ))}
            </div>

            {/* THỐNG KÊ CHI TIẾT */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-200 flex flex-wrap justify-around items-center gap-4 text-center">
              <div>
                <span className="text-xs font-bold text-slate-500 block">TỔNG NHIỆM VỤ</span>
                <span className="text-xl font-comic font-black text-purple-700">
                  {progression?.totalMissions || 0}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">TỔNG CÂU ĐÚNG</span>
                <span className="text-xl font-comic font-black text-emerald-600">
                  {progression?.totalCorrect || 0}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">NGÔI SAO TRI THỨC</span>
                <span className="text-xl font-comic font-black text-amber-500">
                  {totalStars} ⭐
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TRANG TRÍ PHÒNG RIÊNG (MÀU TƯỜNG & THẢM) */}
        {activeTab === 'decor' && (
          <div className="bg-white/95 rounded-3xl p-5 border-3 border-emerald-300 shadow-xl">
            <h3 className="text-base font-comic font-black text-emerald-950 mb-3">
              Trang Trí Tường & Thảm Sàn Phòng Riêng
            </h3>

            {/* CHỌN MÀU GIẤY DÁN TƯỜNG */}
            <div className="mb-4">
              <span className="text-xs font-comic font-black text-slate-700 block mb-2">
                🎨 Chọn màu giấy dán tường pastel:
              </span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Hồng Pastel', color: '#FCE7F3' },
                  { name: 'Xanh Da Trời', color: '#E0F2FE' },
                  { name: 'Bạc Hà Dịu Mát', color: '#D1FAE5' },
                  { name: 'Tím Lavender', color: '#EDE9FE' },
                  { name: 'Vàng Nắng Ấm', color: '#FEF3C7' },
                ].map((bg) => (
                  <button
                    key={bg.color}
                    onClick={() => handleChangeWallpaper(bg.color)}
                    className={`w-10 h-10 rounded-full border-3 shadow-md cursor-pointer transition-transform hover:scale-110 ${
                      wallpaperColor === bg.color ? 'border-amber-500 scale-110 ring-2 ring-amber-300' : 'border-white'
                    }`}
                    style={{ backgroundColor: bg.color }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>

            {/* CHỌN MÀU THẢM TRẢI SÀN */}
            <div>
              <span className="text-xs font-comic font-black text-slate-700 block mb-2">
                🧶 Chọn màu thảm trải sàn Ronie đứng:
              </span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Vàng Kem', color: '#FEF3C7' },
                  { name: 'Hồng Phấn', color: '#FFE4E6' },
                  { name: 'Xanh Biển', color: '#BAE6FD' },
                  { name: 'Xanh Lá', color: '#BBF7D0' },
                ].map((cp) => (
                  <button
                    key={cp.color}
                    onClick={() => handleChangeCarpet(cp.color)}
                    className={`w-10 h-10 rounded-2xl border-3 shadow-md cursor-pointer transition-transform hover:scale-110 ${
                      carpetColor === cp.color ? 'border-amber-500 scale-110 ring-2 ring-amber-300' : 'border-white'
                    }`}
                    style={{ backgroundColor: cp.color }}
                    title={cp.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
