// src/services/time/ScreenTimeTracker.ts
// Quản lý thời gian chơi, bảo vệ thị lực & cảnh báo nghỉ ngơi dịu dàng cho trẻ (Phase 7)

export interface IScreenTimeConfig {
  dailyLimitMinutes: number; // 0 = Không giới hạn
  isLimitEnabled: boolean;
  breakReminderMinutes: number;
}

class ScreenTimeTrackerService {
  private config: IScreenTimeConfig = {
    dailyLimitMinutes: 20,
    isLimitEnabled: true,
    breakReminderMinutes: 15,
  };

  private activeSessionStart: number = Date.now();
  private extraGrantedMinutes: number = 0;
  private isNotifiedForCurrentSession: boolean = false;

  private getTodayDateKey(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  /**
   * Lấy số phút bé đã chơi trong ngày hôm nay
   */
  public getTodayPlayedMinutes(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const todayKey = this.getTodayDateKey();
      const raw = localStorage.getItem(`ronie_playtime_${todayKey}`);
      const storedSeconds = raw ? parseInt(raw, 10) : 0;

      // Cộng dồn thời gian của phiên hiện tại
      const currentSessionSeconds = Math.floor((Date.now() - this.activeSessionStart) / 1000);
      const totalSeconds = storedSeconds + Math.max(0, currentSessionSeconds);

      return Math.floor(totalSeconds / 60);
    } catch {
      return 0;
    }
  }

  /**
   * Lưu số giây đã chơi vào localStorage
   */
  public commitCurrentSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const todayKey = this.getTodayDateKey();
      const raw = localStorage.getItem(`ronie_playtime_${todayKey}`);
      const storedSeconds = raw ? parseInt(raw, 10) : 0;

      const currentSessionSeconds = Math.floor((Date.now() - this.activeSessionStart) / 1000);
      const newTotal = storedSeconds + currentSessionSeconds;

      localStorage.setItem(`ronie_playtime_${todayKey}`, newTotal.toString());
      this.activeSessionStart = Date.now();
    } catch {
      // Fallback
    }
  }

  /**
   * Cập nhật cấu hình thời gian từ Phụ huynh
   */
  public setConfig(config: Partial<IScreenTimeConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  public getConfig(): IScreenTimeConfig {
    return { ...this.config };
  }

  /**
   * Kiểm tra xem thời gian chơi hôm nay đã chạm ngưỡng giới hạn chưa
   */
  public isLimitReached(): boolean {
    if (!this.config.isLimitEnabled || this.config.dailyLimitMinutes <= 0) {
      return false;
    }

    const played = this.getTodayPlayedMinutes();
    const allowed = this.config.dailyLimitMinutes + this.extraGrantedMinutes;

    return played >= allowed;
  }

  /**
   * Phụ huynh cấp thêm thời gian (ví dụ: +5 phút hoặc +10 phút)
   */
  public grantExtraMinutes(minutes: number): void {
    this.extraGrantedMinutes += minutes;
    this.isNotifiedForCurrentSession = false;
  }

  /**
   * Đánh dấu đã nhắc nhở bé nghỉ ngơi
   */
  public setNotified(notified: boolean): void {
    this.isNotifiedForCurrentSession = notified;
  }

  public isNotified(): boolean {
    return this.isNotifiedForCurrentSession;
  }

  /**
   * Đặt lại bộ đếm phiên chơi (dùng cho test)
   */
  public resetForTesting(): void {
    this.activeSessionStart = Date.now();
    this.extraGrantedMinutes = 0;
    this.isNotifiedForCurrentSession = false;
    if (typeof window !== 'undefined') {
      const todayKey = this.getTodayDateKey();
      localStorage.removeItem(`ronie_playtime_${todayKey}`);
    }
  }
}

export const screenTimeTracker = new ScreenTimeTrackerService();
