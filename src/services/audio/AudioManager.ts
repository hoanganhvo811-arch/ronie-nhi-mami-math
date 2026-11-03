// src/services/audio/AudioManager.ts
// Bộ quản lý âm thanh đa tầng & đa kênh (Multi-Channel Audio Manager) với Web Audio Synthesis 100% Offline

export type AudioChannel =
  | 'dialogue'
  | 'bgm'
  | 'sfx_success'
  | 'sfx_failure'
  | 'sfx_button'
  | 'sfx_reward'
  | 'sfx_game_effect';

interface ChannelConfig {
  volume: number; // 0.0 -> 1.0
  muted: boolean;
}

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private isMasterMuted: boolean = false;
  private masterVolume: number = 0.9;

  // Cấu hình âm lượng từng kênh riêng biệt
  private channels: Record<AudioChannel, ChannelConfig> = {
    dialogue: { volume: 1.0, muted: false },
    bgm: { volume: 0.5, muted: false },
    sfx_success: { volume: 0.85, muted: false },
    sfx_failure: { volume: 0.7, muted: false },
    sfx_button: { volume: 0.75, muted: false },
    sfx_reward: { volume: 0.9, muted: false },
    sfx_game_effect: { volume: 0.8, muted: false },
  };

  // Giới hạn số âm thanh phát đồng thời để không bị chồng âm thanh
  private activeSoundCount: number = 0;
  private readonly MAX_CONCURRENT_SFX = 3;
  private lastSoundTimestamp: number = 0;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // --- QUẢN LÝ MASTER & KÊNH ---

  public setMasterMuted(muted: boolean): void {
    this.isMasterMuted = muted;
  }

  public getMasterMuted(): boolean {
    return this.isMasterMuted;
  }

  public toggleMute(): boolean {
    this.isMasterMuted = !this.isMasterMuted;
    return this.isMasterMuted;
  }

  // Tương thích ngược với Phase 0/1
  public setMuted(muted: boolean): void {
    this.setMasterMuted(muted);
  }

  public getMuted(): boolean {
    return this.getMasterMuted();
  }

  public setChannelVolume(channel: AudioChannel, volume: number): void {
    if (this.channels[channel]) {
      this.channels[channel].volume = Math.max(0, Math.min(1, volume));
    }
  }

  public getChannelVolume(channel: AudioChannel): number {
    return this.channels[channel]?.volume ?? 1.0;
  }

  private canPlaySound(channel: AudioChannel): boolean {
    if (this.isMasterMuted) return false;
    if (this.channels[channel]?.muted) return false;

    // Giới hạn tránh spam click hoặc âm thanh chồng lấn quá nhanh (< 40ms)
    const now = Date.now();
    if (now - this.lastSoundTimestamp < 40 && channel !== 'dialogue') {
      return false;
    }
    if (this.activeSoundCount >= this.MAX_CONCURRENT_SFX && channel !== 'dialogue') {
      return false;
    }

    this.lastSoundTimestamp = now;
    return true;
  }

  // --- CÁC HIỆU ỨNG ÂM THANH TỔNG HỢP (OFFLINE SYNTHESIS) ---

  /**
   * Âm thanh chạm nút nhẹ nhàng (Button Sound: Bloop)
   */
  public playTap(): void {
    if (!this.canPlaySound('sfx_button')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.activeSoundCount++;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vol = this.masterVolume * this.channels.sfx_button.volume * 0.15;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      setTimeout(() => {
        this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
      }, 90);
    } catch {
      this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
    }
  }

  /**
   * Âm thanh trả lời đúng (Success Sound: Ding-Chime)
   */
  public playCorrect(): void {
    if (!this.canPlaySound('sfx_success')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.activeSoundCount++;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const vol = this.masterVolume * this.channels.sfx_success.volume * 0.2;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(vol, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });

      setTimeout(() => {
        this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
      }, 500);
    } catch {
      this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
    }
  }

  /**
   * Âm thanh thử lại êm ái (Failure Sound: Wobble dịu dàng không phạt)
   */
  public playTryAgain(): void {
    if (!this.canPlaySound('sfx_failure')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.activeSoundCount++;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vol = this.masterVolume * this.channels.sfx_failure.volume * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);

      setTimeout(() => {
        this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
      }, 200);
    } catch {
      this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
    }
  }

  /**
   * Âm thanh bắn tơ nhện (Game Effect: Web Shoot Whoosh)
   */
  public playWebShoot(): void {
    if (!this.canPlaySound('sfx_game_effect')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.activeSoundCount++;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vol = this.masterVolume * this.channels.sfx_game_effect.volume * 0.1;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);

      setTimeout(() => {
        this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
      }, 150);
    } catch {
      this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
    }
  }

  /**
   * Âm thanh kéo tơ gồng sức (Game Effect: Pull)
   */
  public playPull(): void {
    if (!this.canPlaySound('sfx_game_effect')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.activeSoundCount++;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vol = this.masterVolume * this.channels.sfx_game_effect.volume * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(380, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);

      setTimeout(() => {
        this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
      }, 220);
    } catch {
      this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
    }
  }

  /**
   * Âm thanh đấm tơ sao (Game Effect: Attack)
   */
  public playAttack(): void {
    if (!this.canPlaySound('sfx_game_effect')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.activeSoundCount++;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vol = this.masterVolume * this.channels.sfx_game_effect.volume * 0.12;

      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);

      setTimeout(() => {
        this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
      }, 120);
    } catch {
      this.activeSoundCount = Math.max(0, this.activeSoundCount - 1);
    }
  }

  /**
   * Âm thanh trao thưởng & vinh danh (Reward Sound: Fanfare)
   */
  public playCelebration(): void {
    if (!this.canPlaySound('sfx_reward')) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      const vol = this.masterVolume * this.channels.sfx_reward.volume * 0.18;

      fanfareNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(vol, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch {
      // Ignored
    }
  }

  // --- HỆ THỐNG GIỌNG ĐỌC HỘI THOẠI (DIALOGUE VOICE ENGINE) ---

  /**
   * Đọc thoại tiếng Việt có tùy chỉnh âm sắc (Pitch & Rate) theo từng nhân vật
   */
  public speakDialogue(text: string, pitch: number = 1.1, rate: number = 0.9): void {
    if (this.isMasterMuted || this.channels.dialogue.muted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Ngắt câu trước để không phát chồng âm
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = rate; // Tốc độ nói phù hợp trẻ em
      utterance.pitch = pitch; // Âm sắc trầm bổng riêng của từng nhân vật
      utterance.volume = this.masterVolume * this.channels.dialogue.volume;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback
    }
  }

  // Tương thích ngược
  public speakVietnamese(text: string): void {
    this.speakDialogue(text, 1.1, 0.9);
  }

  public stopDialogueVoice(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new AudioManager();
