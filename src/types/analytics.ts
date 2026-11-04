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
  // Phase 6 Extensions:
  masteredTopicsCount?: number;
  progressOverTimeTrend?: string;
}

export type Phase6TopicKey =
  | 'addition'
  | 'subtraction'
  | 'comparison'
  | 'missing_numbers'
  | 'word_problems'
  | 'logical_thinking'
  | 'geometry'
  | 'measurement';

export interface ITopicAnalyticsPhase6 {
  topicKey: Phase6TopicKey;
  topicName: string;
  curriculumCategory: string;
  icon: string;
  color: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number; // 0 - 100
  practiceSessionsCount: number;
  currentLevel: number; // 1 - 5
  levelName: string; // Nhận biết, Thông hiểu, Vận dụng, Vận dụng nâng cao, Thử thách
  status: 'mastered' | 'practicing' | 'needs_practice';
  statusText: string;
  trend: 'improving' | 'stable' | 'needs_support';
  trendText: string;
  focusAreas: string; // Những nội dung cần luyện thêm
}

export interface ISmartLearningRecommendation {
  id: string;
  topicKey: Phase6TopicKey;
  topicName: string;
  type: 'training_station' | 'challenge_arena' | 'story_mission';
  activityTitle: string;
  suggestedLevel: number;
  levelName: string;
  reason: string;
  priority: 'high' | 'medium' | 'gentle';
}

export interface IParentLearningHistoryItem {
  id: string;
  timestamp: number;
  dateFormatted: string;
  topicKey: string;
  topicName: string;
  modeName: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number;
  durationSeconds: number;
  hintsUsed: number;
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
