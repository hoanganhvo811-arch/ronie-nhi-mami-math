// src/math-engine/adaptive/AdaptiveStorageService.ts
// Dịch vụ lưu trữ và phục hồi tiến trình thích ứng (Adaptive Storage Service) - Phase 2

import type { IPlayerAdaptiveState, IQuestionAttemptRecord, GameMode } from './types';
import { db } from '../../services/storage/db';

const STORAGE_KEY_PREFIX = 'ronie_math_adaptive_state_';

export class AdaptiveStorageService {
  /**
   * Lưu toàn bộ trạng thái thích ứng của người chơi
   */
  public static async saveAdaptiveState(state: IPlayerAdaptiveState): Promise<void> {
    const key = `${STORAGE_KEY_PREFIX}${state.profileId}`;

    // 1. Lưu dự phòng nhanh vào localStorage (nếu có window)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.warn('Lỗi lưu adaptive state vào localStorage:', err);
      }
    }

    // 2. Lưu đồng bộ vào Dexie nếu database khả dụng
    try {
      if (db && db.profiles) {
        // Cập nhật lastPlayedAt trên profile
        await db.profiles.update(state.profileId, {
          lastPlayedAt: Date.now(),
        });
      }
    } catch {
      // Bỏ qua lỗi nếu chạy trong môi trường test không có IndexedDB
    }
  }

  /**
   * Tải trạng thái thích ứng đã lưu của người chơi
   */
  public static async loadAdaptiveState(
    profileId: string = 'profile_ronie_default',
    defaultMode: GameMode = 'story'
  ): Promise<IPlayerAdaptiveState> {
    const key = `${STORAGE_KEY_PREFIX}${profileId}`;

    // 1. Thử tải từ localStorage trước
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as IPlayerAdaptiveState;
          if (parsed && parsed.profileId === profileId) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Lỗi đọc adaptive state từ localStorage:', err);
      }
    }

    // 2. Nếu chưa có, trả về trạng thái khởi tạo mặc định an toàn
    return {
      profileId,
      activeGameMode: defaultMode,
      competenceByTopic: {},
      topicsNeedingImprovement: [],
      strongTopics: [],
      longestStreak: 0,
      totalCorrectAllTime: 0,
      totalQuestionsAllTime: 0,
      recentAttempts: [],
      lastSessionTimestamp: Date.now(),
    };
  }

  /**
   * Ghi nhận một phiên làm bài vào bảng lịch sử mathSessions của Dexie (Tương thích 100% Phase 5 & 7)
   */
  public static async recordMathSessionToDatabase(record: IQuestionAttemptRecord): Promise<void> {
    try {
      if (db && db.mathSessions) {
        const sessionId = `session_${record.profileId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await db.mathSessions.add({
          id: sessionId,
          profileId: record.profileId,
          topicKey: record.topic as any,
          durationSeconds: Math.max(1, Math.round(record.responseTimeMs / 1000)),
          totalQuestions: 1,
          correctQuestions: record.isCorrect ? 1 : 0,
          hintUsedCount: record.hintsUsed || 0,
          timestamp: record.timestamp || Date.now(),
        });
      }
    } catch {
      // An toàn khi chạy trong headless unit tests
    }
  }

  /**
   * Xóa toàn bộ dữ liệu thích ứng của 1 profile (chỉ dùng khi reset profile)
   */
  public static clearState(profileId: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${profileId}`);
    }
  }
}
