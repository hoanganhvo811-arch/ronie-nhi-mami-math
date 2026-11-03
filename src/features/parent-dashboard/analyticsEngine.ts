// src/features/parent-dashboard/analyticsEngine.ts
// Bộ máy xử lý thống kê học tập, phân tích năng lực & nhận định sư phạm tích cực (Phase 7)

import type {
  MathTopicKey,
  IMathSession,
  IProgressRecord,
  IProgressionRecord,
} from '../../types/database';
import type {
  TimeframeFilter,
  IAnalyticsOverview,
  ITopicAnalytics,
  ILearningDiagnostics,
} from '../../types/analytics';

export interface ITopicMeta {
  key: MathTopicKey;
  name: string;
  category: string;
  icon: string;
}

export const TOPIC_META_MAP: Record<MathTopicKey, ITopicMeta> = {
  counting_to_10: {
    key: 'counting_to_10',
    name: 'Đếm & Nhận biết số (0 - 10)',
    category: 'Số học',
    icon: '🍎',
  },
  comparison_operators: {
    key: 'comparison_operators',
    name: 'So sánh lớn hơn, bé hơn, bằng nhau',
    category: 'Số học',
    icon: '⚖️',
  },
  addition_within_10: {
    key: 'addition_within_10',
    name: 'Phép cộng trong phạm vi 10',
    category: 'Phép tính',
    icon: '➕',
  },
  subtraction_within_10: {
    key: 'subtraction_within_10',
    name: 'Phép trừ trong phạm vi 10',
    category: 'Phép tính',
    icon: '➖',
  },
  numbers_to_20: {
    key: 'numbers_to_20',
    name: 'Số & Phép tính trong phạm vi 20',
    category: 'Phép tính',
    icon: '🔢',
  },
  flat_shapes: {
    key: 'flat_shapes',
    name: 'Hình vuông, tròn, tam giác, chữ nhật',
    category: 'Hình học',
    icon: '🔷',
  },
  spatial_shapes: {
    key: 'spatial_shapes',
    name: 'Khối lập phương & Hộp chữ nhật',
    category: 'Hình học',
    icon: '📦',
  },
  length_centimeter: {
    key: 'length_centimeter',
    name: 'Đo độ dài bằng thước xăng-ti-mét',
    category: 'Đo lường & Thời gian',
    icon: '📏',
  },
  clock_reading: {
    key: 'clock_reading',
    name: 'Xem đồng hồ kim & Giờ đúng',
    category: 'Đo lường & Thời gian',
    icon: '⏰',
  },
  numbers_to_100: {
    key: 'numbers_to_100',
    name: 'Số tròn chục & Phép tính tới 100',
    category: 'Số học',
    icon: '💯',
  },
};

export class AnalyticsEngine {
  /**
   * Lọc các phiên học theo mốc thời gian (Hôm nay, 7 ngày, 30 ngày, Tất cả)
   */
  public static filterSessionsByTimeframe(
    sessions: IMathSession[],
    timeframe: TimeframeFilter
  ): IMathSession[] {
    if (timeframe === 'all_time') return sessions;

    const now = Date.now();
    let cutoff = 0;

    if (timeframe === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      cutoff = today.getTime();
    } else if (timeframe === '7_days') {
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
    } else if (timeframe === '30_days') {
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
    }

    return sessions.filter((s) => s.timestamp >= cutoff);
  }

  /**
   * Tính toán các chỉ số tổng quan (Overview)
   */
  public static calculateOverview(
    sessions: IMathSession[],
    progressList: IProgressRecord[],
    progression: IProgressionRecord | null
  ): IAnalyticsOverview {
    const totalPlaytimeMinutes = Math.round(
      sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
    );

    const totalQuestionsAnswered = sessions.reduce((acc, s) => acc + s.totalQuestions, 0);
    const totalCorrectAnswers = sessions.reduce((acc, s) => acc + s.correctQuestions, 0);

    const accuracyPercentage =
      totalQuestionsAnswered > 0
        ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
        : 0;

    // Tổng số màn chơi hoàn thành (tối thiểu 15 màn chuẩn của 5 vùng đất)
    const completedStagesCount = progressList.filter((p) => p.completed).length;
    const totalMissionsCompleted = progression?.totalMissions ?? completedStagesCount;

    // Tiến độ học tập chương trình lớp 1 (dựa trên 15 màn chơi)
    const curriculumProgressPercentage = Math.min(100, Math.round((completedStagesCount / 15) * 100));

    return {
      totalPlaytimeMinutes,
      totalMissionsCompleted,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      accuracyPercentage,
      curriculumProgressPercentage,
    };
  }

  /**
   * Thống kê chi tiết theo từng mạch chủ đề kiến thức (8 - 10 chủ đề)
   */
  public static calculateTopicBreakdown(sessions: IMathSession[]): ITopicAnalytics[] {
    const topicKeys = Object.keys(TOPIC_META_MAP) as MathTopicKey[];

    return topicKeys.map((key) => {
      const meta = TOPIC_META_MAP[key];
      const matchedSessions = sessions.filter((s) => s.topicKey === key);

      const totalQuestions = matchedSessions.reduce((acc, s) => acc + s.totalQuestions, 0);
      const correctQuestions = matchedSessions.reduce((acc, s) => acc + s.correctQuestions, 0);
      const hintUsedCount = matchedSessions.reduce((acc, s) => acc + s.hintUsedCount, 0);
      const totalDuration = matchedSessions.reduce((acc, s) => acc + s.durationSeconds, 0);

      const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
      const avgDurationSeconds =
        totalQuestions > 0 ? Number((totalDuration / totalQuestions).toFixed(1)) : 0;

      let status: 'mastered' | 'practicing' | 'needs_practice' = 'practicing';
      if (totalQuestions === 0) {
        status = 'practicing';
      } else if (accuracy >= 80) {
        status = 'mastered';
      } else if (accuracy >= 60) {
        status = 'practicing';
      } else {
        status = 'needs_practice';
      }

      return {
        topicKey: key,
        topicName: meta.name,
        curriculumCategory: meta.category,
        totalQuestions,
        correctQuestions,
        accuracy,
        hintUsedCount,
        avgDurationSeconds,
        status,
      };
    });
  }

  /**
   * Phân tích điểm mạnh & điểm cần rèn luyện thêm với 100% ngôn ngữ tích cực
   * NGUYÊN TẮC: Tuyệt đối KHÔNG gắn nhãn "kém" hoặc "yếu"
   */
  public static generatePositiveDiagnostics(
    topicStats: ITopicAnalytics[],
    sessions: IMathSession[]
  ): ILearningDiagnostics {
    const testedTopics = topicStats.filter((t) => t.totalQuestions > 0);

    const strengths: string[] = [];
    const needsPractice: string[] = [];

    // 1. Tìm các chủ đề thành thạo (accuracy >= 75%)
    const strongTopics = testedTopics
      .filter((t) => t.accuracy >= 75)
      .sort((a, b) => b.accuracy - a.accuracy);

    if (strongTopics.length > 0) {
      strongTopics.slice(0, 3).forEach((t) => {
        strengths.push(
          `Bé nắm rất vững ${t.topicName} với độ chính xác đạt ${t.accuracy}%.`
        );
      });
    } else {
      strengths.push(
        'Bé có tinh thần học tập hào hứng, chăm chỉ làm quen với các con số và thử thách mới.'
      );
    }

    // 2. Tìm các chủ đề đang luyện tập thêm (ngôn ngữ tích cực, khuyến khích)
    const practiceTopics = testedTopics
      .filter((t) => t.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy);

    if (practiceTopics.length > 0) {
      practiceTopics.slice(0, 2).forEach((t) => {
        needsPractice.push(
          `Bé Ronie đang rèn luyện thêm về ${t.topicName} để ngày càng tự tin hơn nhé!`
        );
      });
    } else {
      needsPractice.push(
        'Bé đang duy trì phong độ làm bài rất đều đặn, sẵn sàng mở rộng sang các thử thách nâng cao!'
      );
    }

    // 3. Phân tích tốc độ phản xạ
    const totalDuration = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalQ = sessions.reduce((acc, s) => acc + s.totalQuestions, 0);
    const avgResponseSpeed = totalQ > 0 ? Number((totalDuration / totalQ).toFixed(1)) : 0;

    let speedFeedback = 'Bé duy trì nhịp độ làm bài ổn định và tập trung.';
    if (avgResponseSpeed > 0 && avgResponseSpeed <= 5) {
      speedFeedback = 'Bé có phản xạ toán học rất nhanh nhẹn và quyết đoán!';
    } else if (avgResponseSpeed > 5 && avgResponseSpeed <= 12) {
      speedFeedback = 'Bé có thói quen quan sát kỹ lưỡng và suy nghĩ cẩn thận trước khi chọn đáp án.';
    } else if (avgResponseSpeed > 12) {
      speedFeedback = 'Bé kiên nhẫn đếm từng đồ vật một cách tỉ mỉ, rất đáng khích lệ.';
    }

    // 4. Phân tích việc sử dụng gợi ý
    const totalHints = sessions.reduce((acc, s) => acc + s.hintUsedCount, 0);
    let hintTendency = 'Bé tự tin suy luận và đưa ra kết quả độc lập.';
    if (totalHints > 0) {
      hintTendency = `Bé biết cách lắng nghe gợi ý sư phạm của Nữ Hoàng (${totalHints} lần) để tự mình tháo gỡ bài toán khó.`;
    }

    // 5. Xu hướng tiến bộ
    let progressTrend = 'Bé đang có xu hướng tiến bộ ổn định qua từng buổi học.';
    if (sessions.length >= 4) {
      const firstHalf = sessions.slice(Math.floor(sessions.length / 2));
      const secondHalf = sessions.slice(0, Math.floor(sessions.length / 2));

      const acc1 =
        firstHalf.reduce((a, s) => a + s.correctQuestions, 0) /
        Math.max(1, firstHalf.reduce((a, s) => a + s.totalQuestions, 0));
      const acc2 =
        secondHalf.reduce((a, s) => a + s.correctQuestions, 0) /
        Math.max(1, secondHalf.reduce((a, s) => a + s.totalQuestions, 0));

      if (acc2 > acc1) {
        progressTrend = `Tỷ lệ chính xác gần đây tăng lên rõ rệt (+${Math.round((acc2 - acc1) * 100)}%), cho thấy sự tiến bộ vượt bậc!`;
      }
    }

    return {
      strengths,
      needsPractice,
      hintTendency,
      avgResponseSpeed,
      speedFeedback,
      progressTrend,
    };
  }
}
