// src/features/parent-dashboard/analyticsEngine.ts
// Bộ máy xử lý thống kê học tập, phân tích năng lực & đề xuất sư phạm (Phase 6 & Phase 7)

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
  Phase6TopicKey,
  ITopicAnalyticsPhase6,
  ISmartLearningRecommendation,
  IParentLearningHistoryItem,
} from '../../types/analytics';

export type LegacyMathTopicKey =
  | 'counting_to_10'
  | 'comparison_operators'
  | 'addition_within_10'
  | 'subtraction_within_10'
  | 'numbers_to_20'
  | 'flat_shapes'
  | 'spatial_shapes'
  | 'length_centimeter'
  | 'clock_reading'
  | 'numbers_to_100';

export interface ITopicMeta {
  key: MathTopicKey;
  name: string;
  category: string;
  icon: string;
}

export const TOPIC_META_MAP: Record<LegacyMathTopicKey, ITopicMeta> = {
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

/**
 * Metadata cho 8 nhóm kiến thức cốt lõi (Phase 6 - Parent Dashboard)
 */
export const PHASE6_TOPICS_META: Record<
  Phase6TopicKey,
  {
    key: Phase6TopicKey;
    name: string;
    category: string;
    icon: string;
    color: string;
    defaultFocusArea: string;
  }
> = {
  addition: {
    key: 'addition',
    name: 'Phép cộng',
    category: 'Phép tính',
    icon: '➕',
    color: 'emerald',
    defaultFocusArea: 'Phép cộng không nhớ trong phạm vi 10, 20 và cộng các số tròn chục.',
  },
  subtraction: {
    key: 'subtraction',
    name: 'Phép trừ',
    category: 'Phép tính',
    icon: '➖',
    color: 'rose',
    defaultFocusArea: 'Phép trừ không nhớ trong phạm vi 10, 20 và trừ các số tròn chục.',
  },
  comparison: {
    key: 'comparison',
    name: 'So sánh số',
    category: 'Số học',
    icon: '⚖️',
    color: 'amber',
    defaultFocusArea: 'So sánh lớn hơn (>), bé hơn (<), bằng nhau (=) và thứ tự số đến 100.',
  },
  missing_numbers: {
    key: 'missing_numbers',
    name: 'Tìm số chưa biết',
    category: 'Số học & Phép tính',
    icon: '❓',
    color: 'indigo',
    defaultFocusArea: 'Điền số còn thiếu vào ô trống, tìm số hạng còn thiếu trong phép tính.',
  },
  word_problems: {
    key: 'word_problems',
    name: 'Toán có lời văn',
    category: 'Ứng dụng thực tế',
    icon: '📖',
    color: 'violet',
    defaultFocusArea: 'Đọc hiểu tình huống có lời văn, nhận biết từ khóa "tất cả" và "còn lại".',
  },
  logical_thinking: {
    key: 'logical_thinking',
    name: 'Tư duy logic',
    category: 'Tư duy & Quy luật',
    icon: '🧩',
    color: 'cyan',
    defaultFocusArea: 'Quy luật dãy số cách đều, mê cung số học và suy luận logic theo hình.',
  },
  geometry: {
    key: 'geometry',
    name: 'Hình học',
    category: 'Hình học & Không gian',
    icon: '🔷',
    color: 'blue',
    defaultFocusArea: 'Nhận biết hình phẳng (vuông, tròn, tam giác, chữ nhật) và các khối hộp.',
  },
  measurement: {
    key: 'measurement',
    name: 'Đo lường',
    category: 'Đo lường & Thời gian',
    icon: '⏰',
    color: 'orange',
    defaultFocusArea: 'Đo độ dài bằng thước xăng-ti-mét và xem giờ đúng trên mặt đồng hồ kim.',
  },
};

/**
 * Ánh xạ linh hoạt từ bất kỳ TopicKey nào sang 1 trong 8 nhóm chuẩn của Phase 6
 */
export function mapToPhase6TopicKey(rawKey: string): Phase6TopicKey {
  const k = (rawKey || '').toLowerCase();
  if (k === 'addition' || k.includes('addition') || k.includes('cong')) return 'addition';
  if (k === 'subtraction' || k.includes('subtraction') || k.includes('tru')) return 'subtraction';
  if (k === 'comparison' || k.includes('comparison') || k.includes('so_sanh')) return 'comparison';
  if (
    k === 'missing_numbers' ||
    k.includes('missing') ||
    k.includes('secret') ||
    k.includes('dien_so')
  )
    return 'missing_numbers';
  if (k === 'word_problems' || k.includes('word') || k.includes('loi_van')) return 'word_problems';
  if (
    k === 'logical_thinking' ||
    k.includes('logic') ||
    k === 'number_patterns' ||
    k.includes('pattern')
  )
    return 'logical_thinking';
  if (k === 'geometry' || k.includes('shape') || k.includes('hinh_hoc')) return 'geometry';
  if (
    k === 'measurement' ||
    k.includes('length') ||
    k.includes('clock') ||
    k.includes('do_luong') ||
    k === 'measurement_time'
  )
    return 'measurement';

  // Nhận biết số & đếm cơ bản ánh xạ vào so sánh / nhận biết số
  if (
    k.includes('counting') ||
    k.includes('numbers_to') ||
    k.includes('composition') ||
    k.includes('tens')
  ) {
    return 'comparison';
  }
  return 'addition';
}

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
   * Tính toán các chỉ số tổng quan (Overview) - Dữ liệu thực tế 100%
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

    // Tổng số màn chơi hoàn thành
    const completedStagesCount = progressList.filter((p) => p.completed).length;
    const totalMissionsCompleted = progression?.totalMissions ?? completedStagesCount;

    // Tiến độ học tập chương trình lớp 1 (dựa trên 15 màn chơi chuẩn)
    const curriculumProgressPercentage = Math.min(100, Math.round((completedStagesCount / 15) * 100));

    // Thống kê 8 chủ đề Phase 6 để lấy số lượng chủ đề thành thạo
    const phase6Breakdown = AnalyticsEngine.calculateTopicBreakdownPhase6(sessions);
    const masteredTopicsCount = phase6Breakdown.filter((t) => t.status === 'mastered').length;

    // Xu hướng tiến bộ theo thời gian
    let progressOverTimeTrend = 'Bé đang duy trì tinh thần học tập hào hứng và tích cực!';
    if (sessions.length >= 4) {
      const recent = sessions.slice(0, Math.floor(sessions.length / 2));
      const older = sessions.slice(Math.floor(sessions.length / 2));
      const accRecent =
        recent.reduce((a, s) => a + s.correctQuestions, 0) /
        Math.max(1, recent.reduce((a, s) => a + s.totalQuestions, 0));
      const accOlder =
        older.reduce((a, s) => a + s.correctQuestions, 0) /
        Math.max(1, older.reduce((a, s) => a + s.totalQuestions, 0));
      const diff = Math.round((accRecent - accOlder) * 100);
      if (diff > 0) {
        progressOverTimeTrend = `Tỷ lệ chính xác gần đây tăng +${diff}% so với giai đoạn trước!`;
      } else if (diff < -10) {
        progressOverTimeTrend = 'Bé đang tiếp cận các dạng toán thử thách mới, cần thêm thời gian rèn luyện.';
      } else {
        progressOverTimeTrend = 'Phong độ làm bài ổn định, nắm chắc kiến thức căn bản.';
      }
    }

    return {
      totalPlaytimeMinutes,
      totalMissionsCompleted,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      accuracyPercentage,
      curriculumProgressPercentage,
      masteredTopicsCount,
      progressOverTimeTrend,
    };
  }

  /**
   * Thống kê chi tiết theo từng mạch chủ đề kiến thức cũ (10 chủ đề legacy)
   */
  public static calculateTopicBreakdown(sessions: IMathSession[]): ITopicAnalytics[] {
    const topicKeys = Object.keys(TOPIC_META_MAP) as LegacyMathTopicKey[];

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
   * Phân tích 8 chủ đề toán học theo chuẩn Phase 6
   */
  public static calculateTopicBreakdownPhase6(sessions: IMathSession[]): ITopicAnalyticsPhase6[] {
    const keys: Phase6TopicKey[] = [
      'addition',
      'subtraction',
      'comparison',
      'missing_numbers',
      'word_problems',
      'logical_thinking',
      'geometry',
      'measurement',
    ];

    return keys.map((key) => {
      const meta = PHASE6_TOPICS_META[key];
      const matchedSessions = sessions.filter((s) => mapToPhase6TopicKey(s.topicKey) === key);

      const totalQuestions = matchedSessions.reduce((acc, s) => acc + s.totalQuestions, 0);
      const correctQuestions = matchedSessions.reduce((acc, s) => acc + s.correctQuestions, 0);
      const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
      const practiceSessionsCount = matchedSessions.length;

      // Xác định cấp độ năng lực (Level 1 đến 5)
      let currentLevel = 1;
      let levelName = 'Cấp 1: Nhận biết';
      if (totalQuestions === 0) {
        currentLevel = 1;
        levelName = 'Cấp 1: Nhận biết';
      } else if (accuracy >= 90 && totalQuestions >= 15) {
        currentLevel = 5;
        levelName = 'Cấp 5: Thử thách';
      } else if (accuracy >= 80 && totalQuestions >= 10) {
        currentLevel = 4;
        levelName = 'Cấp 4: Vận dụng cao';
      } else if (accuracy >= 70 && totalQuestions >= 5) {
        currentLevel = 3;
        levelName = 'Cấp 3: Vận dụng';
      } else if (accuracy >= 50) {
        currentLevel = 2;
        levelName = 'Cấp 2: Thông hiểu';
      } else {
        currentLevel = 1;
        levelName = 'Cấp 1: Nhận biết';
      }

      // Trạng thái thành thạo
      let status: 'mastered' | 'practicing' | 'needs_practice' = 'practicing';
      let statusText = 'Đang tiến bộ';
      if (totalQuestions > 0 && accuracy >= 80 && totalQuestions >= 5) {
        status = 'mastered';
        statusText = 'Thành thạo';
      } else if (totalQuestions > 0 && accuracy >= 60) {
        status = 'practicing';
        statusText = 'Đang tiến bộ';
      } else {
        status = 'needs_practice';
        statusText = totalQuestions === 0 ? 'Chưa luyện tập' : 'Cần luyện thêm';
      }

      // Xu hướng tiến bộ
      let trend: 'improving' | 'stable' | 'needs_support' = 'stable';
      let trendText = 'Ổn định ➡️';
      if (matchedSessions.length >= 2) {
        const recent = matchedSessions.slice(0, Math.ceil(matchedSessions.length / 2));
        const older = matchedSessions.slice(Math.ceil(matchedSessions.length / 2));

        const recentAcc =
          recent.reduce((a, s) => a + s.correctQuestions, 0) /
          Math.max(1, recent.reduce((a, s) => a + s.totalQuestions, 0));
        const olderAcc =
          older.reduce((a, s) => a + s.correctQuestions, 0) /
          Math.max(1, older.reduce((a, s) => a + s.totalQuestions, 0));

        const diff = Math.round((recentAcc - olderAcc) * 100);
        if (diff >= 5) {
          trend = 'improving';
          trendText = `Tăng dần ↗️ (+${diff}%)`;
        } else if (diff <= -10) {
          trend = 'needs_support';
          trendText = 'Cần hỗ trợ 🔄';
        } else {
          trend = 'stable';
          trendText = 'Ổn định ➡️';
        }
      }

      // Nội dung sư phạm cần luyện thêm
      let focusAreas = meta.defaultFocusArea;
      if (totalQuestions === 0) {
        focusAreas = `Bé chưa bắt đầu luyện tập chủ đề này. Hãy bắt đầu với bài tập Cấp 1!`;
      } else if (status === 'mastered') {
        focusAreas = `Bé đã nắm vững xuất sắc (${accuracy}%). Sẵn sàng cho các thử thách Cấp 4 & 5!`;
      } else if (status === 'needs_practice') {
        if (key === 'subtraction') {
          focusAreas = `Cần luyện thêm phép trừ trong phạm vi 10 & 20 và đếm bớt bằng hình ảnh trực quan.`;
        } else if (key === 'word_problems') {
          focusAreas = `Cần cải thiện kỹ năng đọc đề, gạch chân từ khóa "tất cả" (cộng), "còn lại" (trừ).`;
        } else if (key === 'missing_numbers') {
          focusAreas = `Cần rèn luyện bài toán tách số: điền vào ô trống □ + 4 = 10 hoặc 9 - □ = 5.`;
        } else if (key === 'logical_thinking') {
          focusAreas = `Rèn thêm quy luật dãy số tăng dần đều (2, 4, 6...) và mê cung số học.`;
        } else {
          focusAreas = `Khuyến khích bé làm quen lại qua tranh ảnh và que tính trước khi tính nhẩm nhanh.`;
        }
      }

      return {
        topicKey: key,
        topicName: meta.name,
        curriculumCategory: meta.category,
        icon: meta.icon,
        color: meta.color,
        totalQuestions,
        correctQuestions,
        accuracy,
        practiceSessionsCount,
        currentLevel,
        levelName,
        status,
        statusText,
        trend,
        trendText,
        focusAreas,
      };
    });
  }

  /**
   * Đề xuất luyện tập thông minh (Smart Recommendations) theo yêu cầu Phase 6
   * Ví dụ: Làm tốt phép cộng -> cần luyện thêm phép trừ -> cải thiện bài toán có lời văn
   */
  public static generateSmartRecommendations(
    topicStats: ITopicAnalyticsPhase6[],
    _sessions: IMathSession[] = []
  ): {
    strengths: string[];
    needsPractice: string[];
    recommendations: ISmartLearningRecommendation[];
    summary: string;
  } {
    const testedTopics = topicStats.filter((t) => t.totalQuestions > 0);
    const strongTopics = testedTopics.filter((t) => t.accuracy >= 75);
    const weakTopics = topicStats.filter((t) => t.status === 'needs_practice' || t.accuracy < 70);

    const strengths: string[] = [];
    const needsPractice: string[] = [];
    const recommendations: ISmartLearningRecommendation[] = [];

    // 1. Phân tích điểm mạnh
    if (strongTopics.length > 0) {
      strongTopics.slice(0, 3).forEach((t) => {
        strengths.push(`Làm tốt ${t.topicName} (${t.accuracy}% chính xác)`);
      });
    } else {
      strengths.push('Bé có tinh thần học tập hào hứng, tích cực làm quen với các con số');
    }

    // 2. Phân tích nội dung cần luyện thêm
    if (weakTopics.length > 0) {
      const sortedWeak = [...weakTopics].sort((a, b) => {
        if (a.totalQuestions > 0 && b.totalQuestions > 0) return a.accuracy - b.accuracy;
        if (a.totalQuestions > 0) return -1;
        if (b.totalQuestions > 0) return 1;
        return 0;
      });

      sortedWeak.slice(0, 3).forEach((t) => {
        if (t.totalQuestions === 0) {
          needsPractice.push(`Chưa luyện tập ${t.topicName}`);
        } else {
          needsPractice.push(`Cần luyện thêm ${t.topicName} (hiện đạt ${t.accuracy}%)`);
        }
      });
    } else {
      needsPractice.push('Đang duy trì phong độ làm bài rất đều đặn');
    }

    // 3. Đề xuất nhiệm vụ luyện tập phù hợp
    // Đề xuất 1 & 2: Dành cho chủ đề cần rèn luyện
    const targetWeak = weakTopics.length > 0 ? weakTopics : topicStats;
    targetWeak.slice(0, 2).forEach((t) => {
      recommendations.push({
        id: `rec_${t.topicKey}_train`,
        topicKey: t.topicKey,
        topicName: t.topicName,
        type: 'training_station',
        activityTitle: `Phòng Luyện Toán – Trạm ${t.topicName}`,
        suggestedLevel: Math.max(1, t.currentLevel),
        levelName: t.levelName,
        reason:
          t.totalQuestions === 0
            ? `Bé nên làm quen với ${t.topicName} qua các bài tập trực quan mức độ Cấp 1.`
            : `Rèn luyện thêm ${t.topicName} để nâng cao sự tự tin và phản xạ tính toán.`,
        priority: 'high',
      });
    });

    // Đề xuất 3: Dành cho chủ đề mạnh để bứt phá
    if (strongTopics.length > 0) {
      const bestTopic = strongTopics[0];
      recommendations.push({
        id: `rec_${bestTopic.topicKey}_arena`,
        topicKey: bestTopic.topicKey,
        topicName: bestTopic.topicName,
        type: 'challenge_arena',
        activityTitle: `Đấu Trường Toán Học – Thử Thách Vận Dụng Cao`,
        suggestedLevel: Math.min(5, bestTopic.currentLevel + 1),
        levelName: 'Cấp 4 - 5: Thử thách nâng cao',
        reason: `Bé đã làm rất tốt ${bestTopic.topicName} (${bestTopic.accuracy}%), hãy thử sức với Đấu Trường để bứt phá!`,
        priority: 'medium',
      });
    } else {
      recommendations.push({
        id: 'rec_story_mission',
        topicKey: 'addition',
        topicName: 'Phép cộng',
        type: 'story_mission',
        activityTitle: 'Nhiệm Vụ Cốt Truyện – Cùng Ronie Vượt Vực Thẳm',
        suggestedLevel: 1,
        levelName: 'Cấp 1: Nhận biết',
        reason: 'Tham gia nhiệm vụ cốt truyện để tăng hứng thú và nhận thêm sao phần thưởng.',
        priority: 'gentle',
      });
    }

    const summary = `Bé: ${strengths.join(', ')}. ${needsPractice.join(', ')}.`;

    return {
      strengths,
      needsPractice,
      recommendations,
      summary,
    };
  }

  /**
   * Định dạng lịch sử các phiên học toán thực tế cho bảng nhật ký
   */
  public static formatLearningHistory(sessions: IMathSession[]): IParentLearningHistoryItem[] {
    return sessions.map((s) => {
      const phase6Key = mapToPhase6TopicKey(s.topicKey);
      const meta = PHASE6_TOPICS_META[phase6Key];
      const dateObj = new Date(s.timestamp);
      const dateFormatted = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj
        .getMinutes()
        .toString()
        .padStart(2, '0')} - ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

      const acc =
        s.totalQuestions > 0 ? Math.round((s.correctQuestions / s.totalQuestions) * 100) : 0;

      let modeName = 'Luyện tập toán';
      if (s.id.startsWith('train_')) modeName = 'Phòng Luyện Toán';
      else if (s.id.startsWith('arena_')) modeName = 'Đấu Trường Toán Học';
      else if (s.id.startsWith('session_')) modeName = 'Nhiệm Vụ Cốt Truyện';

      return {
        id: s.id,
        timestamp: s.timestamp,
        dateFormatted,
        topicKey: phase6Key,
        topicName: meta ? meta.name : s.topicKey,
        modeName,
        totalQuestions: s.totalQuestions,
        correctQuestions: s.correctQuestions,
        accuracy: acc,
        durationSeconds: s.durationSeconds,
        hintsUsed: s.hintUsedCount,
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
