// src/types/analytics.ts
// Các cấu trúc dữ liệu cho Báo Cáo Phụ Huynh, Phân Tích Năng Lực Học Tập & Sao Lưu (Phase 7)

import type {
  MathTopicKey,
  IParentSettings,
  IPlayerProfile,
  IProgressRecord,
  IMathSession,
  IInventoryItem,
  IProgressionRecord,
  IRoomDecorationRecord,
  IClaimedRewardRecord,
} from './database';

export type TimeframeFilter = 'today' | '7_days' | '30_days' | 'all_time';

export interface IAnalyticsOverview {
  totalPlaytimeMinutes: number;
  totalMissionsCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  accuracyPercentage: number;
  curriculumProgressPercentage: number;
}

export interface ITopicAnalytics {
  topicKey: MathTopicKey;
  topicName: string;
  curriculumCategory: string; // Số học, Phép tính, Hình học, Đo lường...
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number; // 0 - 100
  hintUsedCount: number;
  avgDurationSeconds: number;
  status: 'mastered' | 'practicing' | 'needs_practice';
}

export interface ILearningDiagnostics {
  strengths: string[];       // Thế mạnh nổi trội của bé (lời khen ấm áp)
  needsPractice: string[];   // Chủ đề đang rèn luyện thêm (ngôn ngữ khích lệ, không tiêu cực)
  hintTendency: string;      // Thống kê sử dụng gợi ý
  avgResponseSpeed: number;  // Tốc độ phản xạ trung bình (giây)
  speedFeedback: string;     // Nhận xét tốc độ
  progressTrend: string;     // Xu hướng tiến bộ tích cực
}

export interface IParentBackupPayload {
  appId: 'ronie-nhi-mami-math';
  appVersion: string;
  exportedAt: number;
  exportedDateString: string;
  profileId: string;
  data: {
    profile: IPlayerProfile | null;
    parentSettings: IParentSettings | null;
    progression: IProgressionRecord | null;
    roomDecoration: IRoomDecorationRecord | null;
    progressList: IProgressRecord[];
    mathSessions: IMathSession[];
    inventory: IInventoryItem[];
    rewardsHistory: IClaimedRewardRecord[];
  };
}
