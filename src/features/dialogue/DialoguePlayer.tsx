// src/features/dialogue/DialoguePlayer.tsx
// Trình phát hội thoại tương tác (Interactive Dialogue Player) cho trẻ em Lớp 1 (Phase 2)

import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, FastForward, CheckCircle2 } from 'lucide-react';
import type { IDialogueConversation, IDialogueNode } from '../../types/dialogue';
import type { RonieAnimationState, QueenAnimationState, NPCId } from '../../types/character';
import { RonieAvatar } from '../character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../character/QueenNhiMamiAvatar';
import { NPCAvatar } from '../character/NPCAvatar';
import { npcRegistry } from '../character/npcRegistry';
import { soundManager } from '../../services/audio/AudioManager';

interface DialoguePlayerProps {
  conversation: IDialogueConversation;
  onComplete: () => void;
  onSkip?: () => void;
}

export const DialoguePlayer: React.FC<DialoguePlayerProps> = ({
  conversation,
  onComplete,
  onSkip,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(conversation.startNodeId);
  const currentNode: IDialogueNode | undefined = conversation.nodes[currentNodeId];

  // Phát âm thanh giọng đọc khi chuyển câu thoại mới
  useEffect(() => {
    if (!currentNode) return;

    let voicePitch = 1.05;
    if (currentNode.characterId === 'ronie') {
      voicePitch = 1.2;
    } else if (currentNode.characterId === 'queen') {
      voicePitch = 1.05;
    } else {
      const npc = npcRegistry.get(currentNode.characterId as NPCId);
      voicePitch = npc.voicePitch || 1.1;
    }

    soundManager.speakDialogue(currentNode.text, voicePitch, 0.9);

    return () => {
      soundManager.stopDialogueVoice();
    };
  }, [currentNodeId, currentNode]);

  if (!currentNode) {
    return null;
  }

  const handleNext = () => {
    soundManager.playTap();
    if (currentNode.nextDialogueId && conversation.nodes[currentNode.nextDialogueId]) {
      setCurrentNodeId(currentNode.nextDialogueId);
    } else {
      onComplete();
    }
  };

  const handleChoice = (nextId: string) => {
    soundManager.playTap();
    if (conversation.nodes[nextId]) {
      setCurrentNodeId(nextId);
    } else {
      onComplete();
    }
  };

  const handleReplayVoice = () => {
    soundManager.playTap();
    let voicePitch = 1.05;
    if (currentNode.characterId === 'ronie') {
      voicePitch = 1.2;
    } else if (currentNode.characterId === 'queen') {
      voicePitch = 1.05;
    } else {
      const npc = npcRegistry.get(currentNode.characterId as NPCId);
      voicePitch = npc.voicePitch || 1.1;
    }
    soundManager.speakDialogue(currentNode.text, voicePitch, 0.9);
  };

  const handleSkip = () => {
    soundManager.playTap();
    soundManager.stopDialogueVoice();
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  // Render Avatar của nhân vật tương ứng
  const renderAvatar = () => {
    if (currentNode.characterId === 'ronie') {
      return (
        <RonieAvatar
          size="xl"
          state={(currentNode.animation as RonieAnimationState) || 'celebrate'}
        />
      );
    }
    if (currentNode.characterId === 'queen') {
      return (
        <QueenNhiMamiAvatar
          size="xl"
          state={(currentNode.animation as QueenAnimationState) || 'talking'}
        />
      );
    }
    return <NPCAvatar npcId={currentNode.characterId as NPCId} size="xl" />;
  };

  const isPlayer = currentNode.characterId === 'ronie';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-white via-amber-50/90 to-pink-50/95 rounded-3xl p-5 md:p-7 shadow-2xl border-4 border-amber-300 flex flex-col gap-4 animate-scaleUp">
        {/* TOP BAR: TIÊU ĐỀ CUỘC THOẠI & NÚT BỎ QUA */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
          <span className="px-3.5 py-1 bg-amber-200/80 text-amber-950 rounded-full font-comic font-black text-xs md:text-sm">
            💬 {conversation.title}
          </span>

          <button
            type="button"
            onClick={handleSkip}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-comic font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Bỏ qua đoạn hội thoại này"
          >
            <span>Bỏ qua</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* THÂN BONG BÓNG LỜI THOẠI: AVATAR & NỘI DUNG */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-4 ${
            isPlayer ? 'sm:flex-row-reverse' : ''
          }`}
        >
          {/* AVATAR NHÂN VẬT ĐANG NÓI */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="p-2 bg-white rounded-full shadow-md border-2 border-amber-200">
              {renderAvatar()}
            </div>
            <span
              className={`mt-1.5 px-3 py-0.5 rounded-full font-comic font-black text-xs text-white shadow-sm ${
                currentNode.characterId === 'ronie'
                  ? 'bg-rose-500'
                  : currentNode.characterId === 'queen'
                  ? 'bg-purple-600'
                  : 'bg-emerald-600'
              }`}
            >
              {currentNode.characterName}
            </span>
          </div>

          {/* VĂN BẢN LỜI THOẠI NGẮN GỌN CHO TRẺ 6-7 TUỔI */}
          <div className="flex-1 w-full bg-white/95 p-4 md:p-5 rounded-3xl border-2 border-amber-200 shadow-md text-left flex flex-col justify-between min-h-[100px]">
            <p className="text-base md:text-xl font-comic font-black text-slate-800 leading-relaxed">
              "{currentNode.text}"
            </p>

            {/* CÁC LỰA CHỌN PHẢN HỒI (NẾU CÓ CHOICES) */}
            {currentNode.choices && currentNode.choices.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {currentNode.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChoice(choice.nextDialogueId)}
                    className="w-full text-left p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-comic font-black text-xs md:text-sm border border-amber-300 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-between"
                  >
                    <span>👉 {choice.text}</span>
                    <ArrowRight className="w-4 h-4 text-amber-700" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* THANH ĐIỀU KHIỂN DƯỚI: NÚT NGHE LẠI & NÚT TIẾP TỤC */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReplayVoice}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-comic font-black text-xs md:text-sm rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Nghe lại giọng đọc"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe lại</span>
          </button>

          {/* NẾU KHÔNG CÓ CHOICES THÌ HIỂN THỊ NÚT TIẾP TỤC */}
          {(!currentNode.choices || currentNode.choices.length === 0) && (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 text-white font-comic font-black text-sm md:text-base rounded-2xl border-2 border-white shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>{currentNode.nextDialogueId ? 'Tiếp tục' : 'Hoàn thành'}</span>
              {currentNode.nextDialogueId ? (
                <ArrowRight className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
