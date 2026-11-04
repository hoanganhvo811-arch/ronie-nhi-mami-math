// src/features/progression/StarRatingEngine.ts
// Bộ Đánh Giá Hệ Thống 3 Sao Chuẩn Sư Phạm Trẻ Em Lớp 1 (Phase 4)
// Tối đa 3 sao theo độ khó, tỷ lệ chính xác, số lần sai và không gây áp lực cho bé

import type { IStarEvaluationResult, IStarCriteriaConfig } from '../../types/progression';

export class StarRatingEngine {
  /**
   * Cấu hình điều kiện sao mặc định theo độ khó từ 1 đến 5
   */
  public static getCriteriaForDifficulty(difficulty: number): IStarCriteriaConfig {
    switch (difficulty) {
      case 1:
      case 2:
        return {
          minAccuracyFor2Stars: 70,
          maxMistakesFor2Stars: 2,
          minAccuracyFor3Stars: 95,
          maxMistakesFor3Stars: 0,
          maxHintsFor3Stars: 1,
        };
      case 3:
        return {
          minAccuracyFor2Stars: 65,
          maxMistakesFor2Stars: 2,
          minAccuracyFor3Stars: 85,
          maxMistakesFor3Stars: 1,
          maxHintsFor3Stars: 1,
        };
      case 4:
      case 5:
      default:
        // Cấp độ thử thách cao: cho phép tối đa 1 lỗi nhỏ vẫn đạt 3 sao nếu đạt trên 80% câu đúng
        return {
          minAccuracyFor2Stars: 60,
          maxMistakesFor2Stars: 2,
          minAccuracyFor3Stars: 80,
          maxMistakesFor3Stars: 1,
          maxHintsFor3Stars: 2,
        };
    }
  }

  /**
   * Đánh giá số sao (1, 2, hoặc 3 sao) khi hoàn thành nhiệm vụ
   */
  public static evaluateStars(
    progress: number,
    totalQuestions: number,
    correctCount: number,
    mistakesCount: number,
    difficulty: number = 1,
    hintsUsed: number = 0,
    customCriteria?: Partial<IStarCriteriaConfig>
  ): IStarEvaluationResult {
    const defaultCriteria = this.getCriteriaForDifficulty(difficulty);
    const criteria: IStarCriteriaConfig = { ...defaultCriteria, ...customCriteria };

    const totalAttempts = Math.max(totalQuestions, correctCount + mistakesCount);
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    const isCompleted = progress >= 100 || correctCount >= totalQuestions;

    // 1 Sao: Hoàn thành nhiệm vụ
    const star1Achieved = isCompleted;

    // 2 Sao: Kết quả tốt
    const star2Achieved =
      isCompleted &&
      accuracy >= criteria.minAccuracyFor2Stars &&
      mistakesCount <= criteria.maxMistakesFor2Stars;

    // 3 Sao: Hoàn thành xuất sắc
    const star3Achieved =
      isCompleted &&
      star2Achieved &&
      accuracy >= criteria.minAccuracyFor3Stars &&
      mistakesCount <= criteria.maxMistakesFor3Stars &&
      hintsUsed <= (criteria.maxHintsFor3Stars ?? 1);

    let starCount: 1 | 2 | 3 = 1;
    if (star3Achieved) {
      starCount = 3;
    } else if (star2Achieved) {
      starCount = 2;
    } else {
      starCount = 1;
    }

    let feedback = '';
    if (starCount === 3) {
      feedback = '🌟 Tuyệt đỉnh xuất sắc! Nữ hoàng Nhi Mami vui mừng: "Con đã đạt trọn vẹn 3 Ngôi Sao Tri Thức lấp lánh!"';
    } else if (starCount === 2) {
      feedback = '⭐ Rất giỏi! Nữ hoàng Nhi Mami mỉm cười: "Kết quả rất tốt, con nhận được 2 Ngôi Sao Tri Thức! Chăm chỉ thêm chút nữa sẽ đạt 3 sao nhé!"';
    } else {
      feedback = '✨ Hoan hô! Nữ hoàng Nhi Mami ôm Ronie: "Con đã nỗ lực hoàn thành nhiệm vụ và nhận được 1 Ngôi Sao Tri Thức! Mẹ rất tự hào về con!"';
    }

    return {
      stars: starCount,
      details: {
        star1: {
          achieved: star1Achieved,
          label: 'Hoàn thành nhiệm vụ',
          desc: 'Bé đã kiên trì vượt qua tất cả các thử thách của bài toán.',
        },
        star2: {
          achieved: star2Achieved,
          label: 'Kết quả tốt',
          desc: `Đạt độ chính xác từ ${criteria.minAccuracyFor2Stars}% trở lên và ít mắc lỗi sai.`,
        },
        star3: {
          achieved: star3Achieved,
          label: 'Hoàn thành xuất sắc',
          desc: `Giải toán chuẩn xác tối ưu (từ ${criteria.minAccuracyFor3Stars}%), không hoặc rất ít lỗi.`,
        },
      },
      feedback,
    };
  }
}
