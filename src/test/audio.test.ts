// src/test/audio.test.ts
import { describe, it, expect } from 'vitest';
import { soundManager, AudioChannel } from '../services/audio/AudioManager';

describe('AudioManager Multi-Channel System', () => {
  it('cho phép bật và tắt âm thanh tổng (Master Mute)', () => {
    soundManager.setMasterMuted(false);
    expect(soundManager.getMasterMuted()).toBe(false);

    const toggled = soundManager.toggleMute();
    expect(toggled).toBe(true);
    expect(soundManager.getMasterMuted()).toBe(true);

    soundManager.setMasterMuted(false);
    expect(soundManager.getMuted()).toBe(false);
  });

  it('quản lý âm lượng độc lập cho từng kênh (Audio Channels)', () => {
    const channels: AudioChannel[] = [
      'dialogue',
      'bgm',
      'sfx_success',
      'sfx_failure',
      'sfx_button',
      'sfx_reward',
      'sfx_game_effect',
    ];

    channels.forEach((channel) => {
      soundManager.setChannelVolume(channel, 0.65);
      expect(soundManager.getChannelVolume(channel)).toBe(0.65);

      // Giới hạn giá trị trong khoảng 0.0 -> 1.0
      soundManager.setChannelVolume(channel, 1.5);
      expect(soundManager.getChannelVolume(channel)).toBe(1.0);

      soundManager.setChannelVolume(channel, -0.2);
      expect(soundManager.getChannelVolume(channel)).toBe(0.0);

      // Phục hồi mức chuẩn
      soundManager.setChannelVolume(channel, 0.8);
      expect(soundManager.getChannelVolume(channel)).toBe(0.8);
    });
  });

  it('các hiệu ứng âm thanh tổng hợp chạy an toàn trong môi trường test', () => {
    soundManager.setMasterMuted(false);

    expect(() => {
      // Button sound
      soundManager.playTap();
      // Success chime
      soundManager.playCorrect();
      // Failure wobble
      soundManager.playTryAgain();
      // Game effect sounds
      soundManager.playWebShoot();
      soundManager.playPull();
      soundManager.playAttack();
      // Reward celebration fanfare
      soundManager.playCelebration();
    }).not.toThrow();
  });

  it('hệ thống giọng đọc hội thoại (Dialogue Voice Engine) hoạt động chuẩn xác', () => {
    expect(() => {
      soundManager.speakDialogue('Xin chào bé Ronie!', 1.2, 0.9);
      soundManager.speakVietnamese('Nữ hoàng trao thưởng!');
      soundManager.stopDialogueVoice();
    }).not.toThrow();
  });
});
