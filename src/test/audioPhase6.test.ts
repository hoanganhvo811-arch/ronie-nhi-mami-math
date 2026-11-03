// src/test/audioPhase6.test.ts
// Kiểm thử tự động Hệ thống Âm thanh, Giọng đọc & Trải nghiệm Trẻ em (Phase 6)

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CHARACTER_VOICE_PROFILES,
  VoiceSystem,
  CharacterVoiceId,
} from '../services/audio/VoiceSystem';
import { soundManager, BgmTheme } from '../services/audio/AudioManager';
import { RANDOM_PHRASES, getRandomPhrase } from '../features/dialogue/dialogueLibrary';
import type { DialogueCategory } from '../types/dialogue';

describe('Phase 6: Audio, Animation & Child Experience', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    VoiceSystem.resetThrottle();
    soundManager.setMasterMuted(false);
    soundManager.setChannelMuted('bgm', false);
    soundManager.setChannelMuted('dialogue', false);
  });

  afterEach(() => {
    soundManager.cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('1. Character Voice Profiles & Tuning', () => {
    it('định nghĩa đầy đủ 8 nhân vật với âm sắc riêng biệt', () => {
      const requiredCharacters: CharacterVoiceId[] = [
        'ronie',
        'queen',
        'cookie_monster',
        'rabbit',
        'robot',
        'candy_witch',
        'dragon',
        'rescued_girl',
      ];

      requiredCharacters.forEach((charId) => {
        const profile = CHARACTER_VOICE_PROFILES[charId];
        expect(profile).toBeDefined();
        expect(profile.name.length).toBeGreaterThan(0);
        expect(profile.pitch).toBeGreaterThan(0.5);
        expect(profile.pitch).toBeLessThanOrEqual(1.6);
        expect(profile.rate).toBeGreaterThan(0.7);
        expect(profile.rate).toBeLessThanOrEqual(1.3);
      });
    });

    it('Ronie có giọng trẻ thơ vui tươi, Nữ hoàng ấm áp dịu dàng, Quái vật bánh quy trầm hóm hỉnh', () => {
      const ronie = CHARACTER_VOICE_PROFILES.ronie;
      const queen = CHARACTER_VOICE_PROFILES.queen;
      const monster = CHARACTER_VOICE_PROFILES.cookie_monster;

      // Ronie pitch cao hơn Nữ Hoàng và Quái Vật
      expect(ronie.pitch).toBeGreaterThan(queen.pitch);
      expect(queen.pitch).toBeGreaterThan(monster.pitch);

      // Nữ hoàng nói chậm rãi mẫu mực cho trẻ lớp 1 (rate <= 0.9)
      expect(queen.rate).toBeLessThanOrEqual(0.9);
      expect(monster.pitch).toBeLessThan(1.0);
    });
  });

  describe('2. Question Narration & Anti-Spoiler Protection', () => {
    it('chỉ đọc nội dung đề bài, không đọc đáp án trắc nghiệm trước khi bé chọn', () => {
      const speakSpy = vi.spyOn(soundManager, 'speakDialogue');
      const questionText = 'Có 4 quả táo đỏ, mẹ cho thêm 3 quả táo xanh. Hỏi có tất cả mấy quả táo?';
      const options = ['5 quả', '6 quả', '7 quả', '8 quả'];

      // Gọi narrateQuestion chỉ với đề bài
      VoiceSystem.narrateQuestion(questionText);

      expect(speakSpy).toHaveBeenCalledTimes(1);
      const spokenText = speakSpy.mock.calls[0][0];

      // Phải chứa đúng nội dung đề bài
      expect(spokenText).toBe(questionText);

      // Tuyệt đối không được chứa các phương án lựa chọn gây lộ đáp án
      options.forEach((opt) => {
        expect(spokenText).not.toContain(opt);
      });

      speakSpy.mockRestore();
    });

    it('ngăn chặn spam click nghe đề liên tục trong khoảng thời gian ngắn (< 300ms)', () => {
      const speakSpy = vi.spyOn(soundManager, 'speakDialogue');
      const questionText = 'Tìm số lớn nhất trong các số: 5, 9, 2, 8';

      // Trẻ bấm liên tục 5 lần cực nhanh
      VoiceSystem.narrateQuestion(questionText);
      VoiceSystem.narrateQuestion(questionText);
      VoiceSystem.narrateQuestion(questionText);

      // Chỉ được phát đúng 1 lần
      expect(speakSpy).toHaveBeenCalledTimes(1);

      // Sau 400ms bấm lại thì cho phép phát lại
      vi.advanceTimersByTime(400);
      VoiceSystem.narrateQuestion(questionText);
      expect(speakSpy).toHaveBeenCalledTimes(2);

      speakSpy.mockRestore();
    });
  });

  describe('3. Multi-Channel Audio & BGM Synthesis Loops', () => {
    it('hỗ trợ bật tắt Master Mute và BGM Mute độc lập', () => {
      expect(soundManager.getMasterMuted()).toBe(false);
      expect(soundManager.isChannelMuted('bgm')).toBe(false);

      // Mute BGM riêng
      soundManager.setChannelMuted('bgm', true);
      expect(soundManager.isChannelMuted('bgm')).toBe(true);
      expect(soundManager.getMasterMuted()).toBe(false); // Master vẫn bật cho SFX

      // Tắt Master thì toàn bộ tắt
      soundManager.setMasterMuted(true);
      expect(soundManager.getMasterMuted()).toBe(true);
    });

    it('hỗ trợ chuyển đổi mượt mà giữa các chủ đề BGM (castle, adventure, battle, toy_room)', () => {
      const themes: BgmTheme[] = ['castle', 'adventure', 'battle', 'toy_room'];

      themes.forEach((theme) => {
        soundManager.playBgm(theme);
        // Kiểm tra không gây crash và trạng thái BGM hoạt động
        expect(soundManager.getMasterMuted()).toBe(false);
      });

      soundManager.stopBgm();
      expect(soundManager.isBgmActive()).toBe(false);
    });

    it('cho phép điều chỉnh âm lượng từng kênh riêng biệt trong khoảng [0, 1]', () => {
      soundManager.setChannelVolume('bgm', 0.5);
      expect(soundManager.getChannelVolume('bgm')).toBe(0.5);

      soundManager.setChannelVolume('dialogue', 0.8);
      expect(soundManager.getChannelVolume('dialogue')).toBe(0.8);

      // Thử giá trị biên
      soundManager.setChannelVolume('bgm', 1.5);
      expect(soundManager.getChannelVolume('bgm')).toBe(1.0);

      soundManager.setChannelVolume('bgm', -0.5);
      expect(soundManager.getChannelVolume('bgm')).toBe(0.0);
    });
  });

  describe('4. Feedback Audio: Cheerful Success & Gentle Comfort', () => {
    it('trả lời đúng kích hoạt hiệu ứng vui tươi và lời khen', () => {
      const correctSpy = vi.spyOn(soundManager, 'playCorrect');
      const speakSpy = vi.spyOn(soundManager, 'speakDialogue');

      VoiceSystem.givePositiveFeedback('Bé Ronie giỏi quá!');
      expect(correctSpy).toHaveBeenCalledTimes(1);

      // Lời thoại được phát sau khoảng trễ ngắn
      vi.advanceTimersByTime(300);
      expect(speakSpy).toHaveBeenCalledWith('Bé Ronie giỏi quá!', 1.05, 0.95);

      correctSpy.mockRestore();
      speakSpy.mockRestore();
    });

    it('trả lời chưa đúng kích hoạt âm thanh dịu dàng (không phạt, không chuông báo lỗi đáng sợ)', () => {
      const tryAgainSpy = vi.spyOn(soundManager, 'playTryAgain');
      const speakSpy = vi.spyOn(soundManager, 'speakDialogue');

      VoiceSystem.giveEncouragingFeedback('Con cố lên nhé!');
      expect(tryAgainSpy).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(300);
      expect(speakSpy).toHaveBeenCalledWith('Con cố lên nhé!', 1.0, 0.88);

      tryAgainSpy.mockRestore();
      speakSpy.mockRestore();
    });
  });

  describe('5. Child Experience & Scenarios Library Diversity', () => {
    it('11 tình huống sư phạm đều có ít nhất 4 biến thể tự nhiên để trẻ không bị chán', () => {
      const requiredCategories: DialogueCategory[] = [
        'greeting',
        'quest_assign',
        'quest_start',
        'answer_correct',
        'answer_wrong',
        'hint',
        'victory',
        'defeat',
        'rewarding',
        'encouragement',
        'new_zone',
      ];

      requiredCategories.forEach((cat) => {
        const phrases = RANDOM_PHRASES[cat];
        expect(phrases).toBeDefined();
        expect(phrases.length).toBeGreaterThanOrEqual(4);

        // Đảm bảo các câu thoại không rỗng
        phrases.forEach((phrase) => {
          expect(typeof phrase).toBe('string');
          expect(phrase.trim().length).toBeGreaterThan(10);
        });
      });
    });

    it('getRandomPhrase trả về chuỗi thoại tiếng Việt hợp lệ cho mọi tình huống', () => {
      const phrase = getRandomPhrase('answer_correct');
      expect(typeof phrase).toBe('string');
      expect(phrase.length).toBeGreaterThan(0);
    });
  });
});
