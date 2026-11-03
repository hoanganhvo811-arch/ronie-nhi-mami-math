// src/features/adventure/ChapterStoryModal.tsx
// Trình diễn Cốt Truyện 6 Chương & Thử Thách Trùm Cuối (Phase 8)

import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Volume2,
  Award,
  Sparkles,
  Shield,
  Star,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import type { IChapterStory } from '../../types/adventure';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { RonieAvatar } from '../character/RonieAvatar';
import { soundManager } from '../../services/audio/AudioManager';
import { VoiceSystem } from '../../services/audio/VoiceSystem';

interface ChapterStoryModalProps {
  chapter: IChapterStory | null;
  isOpen: boolean;
  isCompleted?: boolean;
  onClose: () => void;
  onStartChapter: (chapter: IChapterStory) => void;
}

export const ChapterStoryModal: React.FC<ChapterStoryModalProps> = ({
  chapter,
  isOpen,
  isCompleted = false,
  onClose,
  onStartChapter,
}) => {
  const [showEnding, setShowEnding] = useState<boolean>(false);

  if (!isOpen || !chapter) return null;

  const handleSpeakDialogue = (text: string, speakerType: string) => {
    soundManager.playTap();
    if (speakerType === 'queen') {
      VoiceSystem.speakCharacter('queen', text);
    } else if (speakerType === 'ronie') {
      VoiceSystem.speakCharacter('ronie', text);
    } else {
      VoiceSystem.speakCharacter('rabbit', text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 border-4 border-amber-400 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* NÚT ĐÓNG */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER CHƯƠNG */}
        <div className="flex items-center gap-3 pb-3 border-b border-indigo-800/80 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-slate-950 font-comic font-black text-lg shadow-md shrink-0">
            {chapter.chapterNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-comic font-bold text-amber-300 uppercase tracking-wider">
                CHƯƠNG {chapter.chapterNumber}
              </span>
              {isCompleted && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-comic font-bold rounded-full border border-emerald-400">
                  Đã Hoàn Thành
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-comic font-black text-white">
              {chapter.title}
            </h3>
          </div>
        </div>

        {/* NỘI DUNG CUỘN */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
          {/* LỜI THOẠI MỞ ĐẦU (OPENING DIALOGUE) */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border-2 border-indigo-400/40 flex flex-col sm:flex-row items-center gap-3">
            <div className="shrink-0">
              {chapter.openingDialogue.avatarType === 'queen' ? (
                <QueenNhiMamiAvatar size="md" state="talking" variant="photo" />
              ) : (
                <RonieAvatar size="md" state="idle" variant="photo" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-comic font-black text-amber-300">
                  {chapter.openingDialogue.speaker}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakDialogue(
                      chapter.openingDialogue.text,
                      chapter.openingDialogue.avatarType
                    )
                  }
                  className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-white text-xs font-comic font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Nghe giọng</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-comic font-bold text-slate-200 leading-relaxed italic">
                "{chapter.openingDialogue.text}"
              </p>
            </div>
          </div>

          {/* CHUỖI CÁC NHIỆM VỤ TIẾN HÀNH TRONG CHƯƠNG */}
          <div>
            <h4 className="text-xs font-comic font-black text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Chuỗi Nhiệm Vụ Trong Chương
            </h4>
            <div className="space-y-2">
              {chapter.missionSequence.map((m, idx) => (
                <div
                  key={m.missionId}
                  className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/80 text-white font-comic font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-comic font-black text-white">
                        {m.title}
                      </div>
                      <div className="text-[11px] font-comic font-bold text-slate-400">
                        {m.mathTopic}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          {/* THỬ THÁCH TRÙM CUỐI HOẶC CỬA ẢI ĐẶC BIỆT (BOSS CHALLENGE) */}
          <div className="bg-gradient-to-r from-purple-950/80 to-rose-950/80 p-4 rounded-2xl border-2 border-amber-400 shadow-md">
            <div className="flex items-center gap-2 text-xs font-comic font-black text-amber-300 uppercase mb-1">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Thử Thách Trùm Cuối Chương: {chapter.bossChallenge.bossName}</span>
            </div>
            <h5 className="text-sm font-comic font-black text-white mb-1">
              {chapter.bossChallenge.title}
            </h5>
            <p className="text-xs font-comic font-bold text-slate-300 leading-relaxed mb-2">
              {chapter.bossChallenge.description}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-comic font-black text-pink-300">
              <span>Chủ đề: {chapter.bossChallenge.mathTopic}</span>
              <span>• Điểm yêu cầu: {chapter.bossChallenge.targetScore} EXP</span>
            </div>
          </div>

          {/* PHẦN THƯỞNG HOÀN THÀNH CHƯƠNG */}
          <div className="bg-amber-950/60 p-3.5 rounded-2xl border border-amber-400/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{chapter.rewardItem.icon}</span>
              <div>
                <span className="text-[10px] font-comic font-black text-amber-400 uppercase">
                  Phần Thưởng Hoàn Thành Chương
                </span>
                <div className="text-sm font-comic font-black text-white">
                  {chapter.rewardItem.name}
                </div>
                <div className="text-[11px] font-comic font-bold text-slate-300">
                  {chapter.rewardItem.description}
                </div>
              </div>
            </div>
          </div>

          {/* NẾU ĐÃ HOÀN THÀNH HOẶC BẬT XEM ĐOẠN KẾT */}
          {showEnding && (
            <div className="bg-emerald-950/80 p-4 rounded-2xl border-2 border-emerald-400 animate-fadeIn">
              <span className="text-xs font-comic font-black text-emerald-300 block mb-1">
                🎉 Đoạn Kết Vinh Danh Chương {chapter.chapterNumber}:
              </span>
              <p className="text-xs sm:text-sm font-comic font-bold text-slate-200 leading-relaxed italic">
                "{chapter.endingScene.text}"
              </p>
            </div>
          )}
        </div>

        {/* NÚT THAO TÁC CHÍNH */}
        <div className="pt-3 border-t border-indigo-900 flex gap-2 shrink-0">
          {isCompleted && (
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                setShowEnding((prev) => !prev);
              }}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-comic font-black text-xs rounded-2xl cursor-pointer"
            >
              {showEnding ? 'Ẩn Đoạn Kết' : 'Xem Đoạn Kết'}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onStartChapter(chapter);
            }}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 active:scale-95 text-slate-950 font-comic font-black text-sm rounded-2xl shadow-xl border-2 border-white transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>BẮT ĐẦU CHƯƠNG {chapter.chapterNumber} NGAY! 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
