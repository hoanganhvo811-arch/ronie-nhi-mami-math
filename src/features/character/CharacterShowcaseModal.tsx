// src/features/character/CharacterShowcaseModal.tsx
// Sân khấu tương tác Biểu cảm Nhân vật, NPC & Thử nghiệm Hội thoại (Phase 2 Showcase)

import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Volume2, Play } from 'lucide-react';
import type { RonieAnimationState, QueenAnimationState, NPCId } from '../../types/character';
import { RonieAvatar } from './RonieAvatar';
import { QueenNhiMamiAvatar } from './QueenNhiMamiAvatar';
import { NPCAvatar } from './NPCAvatar';
import { npcRegistry } from './npcRegistry';
import { DIALOGUE_LIBRARY } from '../dialogue/dialogueLibrary';
import { DialoguePlayer } from '../dialogue/DialoguePlayer';
import { soundManager } from '../../services/audio/AudioManager';

interface CharacterShowcaseModalProps {
  onClose: () => void;
}

export const CharacterShowcaseModal: React.FC<CharacterShowcaseModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ronie' | 'queen' | 'npcs' | 'dialogues'>('ronie');
  const [artVariant, setArtVariant] = useState<'photo' | 'vector'>('photo');

  // Trạng thái biểu cảm đang chọn
  const [ronieState, setRonieState] = useState<RonieAnimationState>('idle');
  const [queenState, setQueenState] = useState<QueenAnimationState>('idle');
  const [selectedNpcId, setSelectedNpcId] = useState<NPCId>('rabbit');

  // Thử nghiệm hội thoại
  const [activeConversationKey, setActiveConversationKey] = useState<string | null>(null);

  // 12 trạng thái của Ronie
  const ronieStates: { state: RonieAnimationState; name: string }[] = [
    { state: 'idle', name: 'Nghỉ ngơi' },
    { state: 'walk', name: 'Đi bộ' },
    { state: 'run', name: 'Chạy nhanh' },
    { state: 'jump', name: 'Nhảy cao' },
    { state: 'celebrate', name: 'Ăn mừng' },
    { state: 'sad', name: 'Buồn bã' },
    { state: 'surprised', name: 'Ngạc nhiên' },
    { state: 'attack', name: 'Tấn công' },
    { state: 'web_shoot', name: 'Bắn tơ' },
    { state: 'pull', name: 'Kéo dây' },
    { state: 'victory', name: 'Chiến thắng' },
    { state: 'defeat', name: 'Cố gắng lại' },
  ];

  // 8 trạng thái của Nữ hoàng
  const queenStates: { state: QueenAnimationState; name: string }[] = [
    { state: 'idle', name: 'Dịu dàng' },
    { state: 'greeting', name: 'Chào đón' },
    { state: 'talking', name: 'Nói chuyện' },
    { state: 'laughing', name: 'Cười vui' },
    { state: 'surprised', name: 'Ngạc nhiên' },
    { state: 'clapping', name: 'Vỗ tay' },
    { state: 'rewarding', name: 'Trao thưởng' },
    { state: 'encouraging', name: 'Khích lệ' },
  ];

  const npcs = npcRegistry.getAll();
  const selectedNpc = npcRegistry.get(selectedNpcId);

  const handleSelectRonieState = (st: RonieAnimationState) => {
    soundManager.playTap();
    setRonieState(st);
    if (st === 'web_shoot') soundManager.playWebShoot();
    else if (st === 'pull') soundManager.playPull();
    else if (st === 'attack') soundManager.playAttack();
    else if (st === 'celebrate' || st === 'victory') soundManager.playCelebration();
    else if (st === 'sad' || st === 'defeat') soundManager.playTryAgain();
  };

  const handleSelectQueenState = (st: QueenAnimationState) => {
    soundManager.playTap();
    setQueenState(st);
    if (st === 'rewarding') soundManager.playCelebration();
    else if (st === 'clapping') soundManager.playCorrect();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      {/* NẾU ĐANG CHẠY HỘI THOẠI TRẢI NGHIỆM */}
      {activeConversationKey && DIALOGUE_LIBRARY[activeConversationKey] && (
        <DialoguePlayer
          conversation={DIALOGUE_LIBRARY[activeConversationKey]}
          onComplete={() => setActiveConversationKey(null)}
          onSkip={() => setActiveConversationKey(null)}
        />
      )}

      <div className="relative w-full max-w-4xl bg-gradient-to-b from-white via-amber-50 to-pink-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-5 md:p-7 flex flex-col max-h-[92vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border border-amber-500 flex items-center justify-center text-slate-950 text-2xl shadow-md">
              🎭
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-comic font-black text-slate-900 leading-tight">
                SÂN KHẤU NHÂN VẬT & HỘI THOẠI
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                12 Biểu cảm Ronie • 8 Biểu cảm Nữ hoàng • 7 Nhân vật phụ • Kịch bản tương tác
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* NÚT CHUYỂN ĐỔI PHONG CÁCH HÌNH ẢNH 3D / VECTOR */}
            <div className="flex items-center p-1 bg-white/90 rounded-2xl border-2 border-amber-300 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setArtVariant('photo');
                }}
                className={`px-3 py-1.5 rounded-xl font-comic font-black text-xs transition-all cursor-pointer ${
                  artVariant === 'photo'
                    ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Sử dụng hình ảnh 3D nhân vật chính thức"
              >
                ⭐ Ảnh 3D Gốc
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setArtVariant('vector');
                }}
                className={`px-3 py-1.5 rounded-xl font-comic font-black text-xs transition-all cursor-pointer ${
                  artVariant === 'vector'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Sử dụng vector chibi"
              >
                🎨 Chibi Vector
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl transition-all cursor-pointer"
              title="Đóng sân khấu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 TABS CHUYỂN ĐỔI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('ronie');
            }}
            className={`py-2.5 px-3 rounded-2xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ronie'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 text-rose-900 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <span>🕷️ 12 Trạng Thái Ronie</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('queen');
            }}
            className={`py-2.5 px-3 rounded-2xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'queen'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/80 text-purple-900 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <span>👑 8 Trạng Thái Nữ Hoàng</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('npcs');
            }}
            className={`py-2.5 px-3 rounded-2xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'npcs'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/80 text-amber-900 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <span>🐾 7 Nhân Vật Phụ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('dialogues');
            }}
            className={`py-2.5 px-3 rounded-2xl font-comic font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'dialogues'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white/80 text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <span>💬 11 Kịch Bản Thoại</span>
          </button>
        </div>

        {/* NỘI DUNG TỪNG TAB */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: 12 TRẠNG THÁI RONIE */}
          {activeTab === 'ronie' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* KHU VỰC PREVIEW LỚN */}
              <div className="md:col-span-5 flex flex-col items-center bg-white/90 p-5 rounded-3xl border-3 border-rose-300 shadow-md text-center">
                <div className="relative w-44 h-44 bg-gradient-to-tr from-rose-100 to-amber-100 rounded-full border-4 border-rose-400 flex items-center justify-center shadow-inner my-2">
                  <RonieAvatar size="2xl" state={ronieState} variant={artVariant} />
                </div>
                <h3 className="font-comic font-black text-xl text-rose-600 capitalize mt-2">
                  {ronieState}
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {ronieStates.find((s) => s.state === ronieState)?.name}
                </span>
              </div>

              {/* LƯỚI 12 NÚT CHỌN BIỂU CẢM */}
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ronieStates.map((item) => (
                  <button
                    key={item.state}
                    type="button"
                    onClick={() => handleSelectRonieState(item.state)}
                    className={`p-3 rounded-2xl font-comic font-black text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-sm ${
                      ronieState === item.state
                        ? 'bg-rose-500 text-white shadow-md scale-102 ring-2 ring-rose-300'
                        : 'bg-white/90 text-slate-700 hover:bg-rose-50 border border-rose-100'
                    }`}
                  >
                    <span className="capitalize">{item.state}</span>
                    <span className="text-[10px] opacity-80 font-normal">({item.name})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 8 TRẠNG THÁI NỮ HOÀNG */}
          {activeTab === 'queen' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* KHU VỰC PREVIEW LỚN */}
              <div className="md:col-span-5 flex flex-col items-center bg-white/90 p-5 rounded-3xl border-3 border-purple-300 shadow-md text-center">
                <div className="relative w-44 h-44 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full border-4 border-purple-400 flex items-center justify-center shadow-inner my-2">
                  <QueenNhiMamiAvatar size="2xl" state={queenState} variant={artVariant} />
                </div>
                <h3 className="font-comic font-black text-xl text-purple-700 capitalize mt-2">
                  {queenState}
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {queenStates.find((s) => s.state === queenState)?.name}
                </span>
              </div>

              {/* LƯỚI 8 NÚT CHỌN BIỂU CẢM */}
              <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
                {queenStates.map((item) => (
                  <button
                    key={item.state}
                    type="button"
                    onClick={() => handleSelectQueenState(item.state)}
                    className={`p-3.5 rounded-2xl font-comic font-black text-xs md:text-sm flex flex-col items-center gap-1 transition-all cursor-pointer shadow-sm ${
                      queenState === item.state
                        ? 'bg-purple-600 text-white shadow-md scale-102 ring-2 ring-purple-300'
                        : 'bg-white/90 text-slate-700 hover:bg-purple-50 border border-purple-100'
                    }`}
                  >
                    <span className="capitalize">{item.state}</span>
                    <span className="text-[11px] opacity-80 font-normal">({item.name})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 7 NHÂN VẬT PHỤ (NPCS) */}
          {activeTab === 'npcs' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* PREVIEW NPC ĐANG CHỌN */}
              <div className="md:col-span-5 flex flex-col items-center bg-white/90 p-5 rounded-3xl border-3 border-amber-300 shadow-md text-center">
                <NPCAvatar npcId={selectedNpcId} size="xl" />
                <h3 className="font-comic font-black text-lg text-slate-900 mt-2">
                  {selectedNpc.name}
                </h3>
                <span
                  className="px-3 py-0.5 rounded-full text-white font-comic font-black text-xs mt-1"
                  style={{ backgroundColor: selectedNpc.primaryColor }}
                >
                  {selectedNpc.title}
                </span>
                <p className="text-xs text-slate-600 font-semibold mt-2 leading-relaxed max-w-xs">
                  "{selectedNpc.catchphrase}"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    soundManager.speakDialogue(selectedNpc.catchphrase, selectedNpc.voicePitch, 0.9);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-xl text-white font-comic font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                  style={{ backgroundColor: selectedNpc.primaryColor }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Giọng Nói</span>
                </button>
              </div>

              {/* LƯỚI 7 NHÂN VẬT PHỤ */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {npcs.map((npc) => (
                  <div
                    key={npc.id}
                    onClick={() => {
                      soundManager.playTap();
                      setSelectedNpcId(npc.id);
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                      selectedNpcId === npc.id
                        ? 'bg-amber-100/90 border-amber-400 scale-102 ring-2 ring-amber-300'
                        : 'bg-white/90 border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="text-3xl p-2 rounded-xl bg-white shadow-inner flex-shrink-0">
                      {npc.avatarEmoji}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-comic font-black text-xs md:text-sm text-slate-800 truncate">
                        {npc.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">{npc.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 11 KỊCH BẢN HỘI THOẠI TRẢI NGHIỆM */}
          {activeTab === 'dialogues' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(DIALOGUE_LIBRARY).map(([key, conv]) => (
                <div
                  key={key}
                  className="bg-white/95 p-4 rounded-3xl border-2 border-emerald-200 hover:border-emerald-400 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {conv.category}
                    </span>
                    <h4 className="font-comic font-black text-sm text-slate-800">{conv.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      "{conv.nodes[conv.startNodeId]?.text}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setActiveConversationKey(key);
                    }}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-white font-comic font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Trải Nghiệm Hội Thoại</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
