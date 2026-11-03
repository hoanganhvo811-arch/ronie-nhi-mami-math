// src/components/AudioControlBar.tsx
// Thanh điều khiển âm thanh & giọng đọc trực quan cho trẻ và phụ huynh (Phase 6)

import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Mic, Settings } from 'lucide-react';
import { soundManager } from '../services/audio/AudioManager';

interface AudioControlBarProps {
  compact?: boolean;
}

export const AudioControlBar: React.FC<AudioControlBarProps> = ({ compact = true }) => {
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(soundManager.getMasterMuted());
  const [isBgmMuted, setIsBgmMuted] = useState<boolean>(soundManager.isChannelMuted('bgm'));
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(soundManager.isChannelMuted('dialogue'));
  const [showPanel, setShowPanel] = useState<boolean>(false);

  const handleToggleMaster = () => {
    soundManager.playTap();
    const newMuted = soundManager.toggleMute();
    setIsMasterMuted(newMuted);
  };

  const handleToggleBgm = () => {
    soundManager.playTap();
    const newMuted = !isBgmMuted;
    soundManager.setChannelMuted('bgm', newMuted);
    setIsBgmMuted(newMuted);
  };

  const handleToggleVoice = () => {
    soundManager.playTap();
    const newMuted = !isVoiceMuted;
    soundManager.setChannelMuted('dialogue', newMuted);
    setIsVoiceMuted(newMuted);
  };

  return (
    <div className="relative inline-flex items-center select-none">
      {/* NÚT THAO TÁC NHANH TRÊN HEADER */}
      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border-2 border-amber-200 shadow-sm">
        {/* BẬT/TẮT TOÀN BỘ ÂM THANH */}
        <button
          type="button"
          onClick={handleToggleMaster}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
            isMasterMuted
              ? 'bg-rose-100 text-rose-600 border border-rose-300'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          }`}
          title={isMasterMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMasterMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* NÚT MỞ BẢNG ĐIỀU CHỈNH CHI TIẾT */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            setShowPanel((prev) => !prev);
          }}
          className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center justify-center cursor-pointer active:scale-90"
          title="Tùy chỉnh nhạc và giọng đọc"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* BẢNG TÙY CHỈNH NỔI (POPUP) */}
      {showPanel && (
        <div className="absolute top-12 right-0 z-50 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-3 border-amber-300 shadow-2xl animate-scaleUp">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <span className="text-xs font-comic font-black text-slate-800">
              🎧 Âm Thanh & Giọng Đọc
            </span>
            <button
              onClick={() => setShowPanel(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2.5">
            {/* NHẠC NỀN BGM */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-comic font-bold text-slate-700 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-600" />
                Nhạc Nền (BGM)
              </span>
              <button
                onClick={handleToggleBgm}
                className={`px-3 py-1 rounded-xl text-xs font-comic font-black transition-all cursor-pointer ${
                  isBgmMuted || isMasterMuted
                    ? 'bg-slate-200 text-slate-500'
                    : 'bg-purple-600 text-white shadow'
                }`}
              >
                {isBgmMuted || isMasterMuted ? 'Tắt' : 'Bật'}
              </button>
            </div>

            {/* GIỌNG ĐỌC NHÂN VẬT & ĐỀ BÀI */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-comic font-bold text-slate-700 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-rose-500" />
                Giọng Đọc (Voice)
              </span>
              <button
                onClick={handleToggleVoice}
                className={`px-3 py-1 rounded-xl text-xs font-comic font-black transition-all cursor-pointer ${
                  isVoiceMuted || isMasterMuted
                    ? 'bg-slate-200 text-slate-500'
                    : 'bg-rose-500 text-white shadow'
                }`}
              >
                {isVoiceMuted || isMasterMuted ? 'Tắt' : 'Bật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
