// src/test/audio.test.ts
import { describe, it, expect } from 'vitest';
import { soundManager } from '../services/audio/AudioManager';

describe('AudioManager', () => {
  it('cho phép bật và tắt âm thanh (toggle mute)', () => {
    const initialMute = soundManager.getMuted();
    const toggled = soundManager.toggleMute();
    expect(toggled).toBe(!initialMute);

    soundManager.setMuted(false);
    expect(soundManager.getMuted()).toBe(false);
  });

  it('các phương thức phát âm thanh chạy an toàn mà không gây crash môi trường test', () => {
    expect(() => {
      soundManager.playTap();
      soundManager.playCorrect();
      soundManager.playTryAgain();
      soundManager.playWebShoot();
      soundManager.speakVietnamese('Xin chào bé Ronie!');
    }).not.toThrow();
  });
});
