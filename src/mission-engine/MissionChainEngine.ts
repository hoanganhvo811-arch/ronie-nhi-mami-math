// src/mission-engine/MissionChainEngine.ts
// Bộ Điều Khiển Chiến Dịch Liên Hoàn 3–5 Chặng (Mission Chain Engine) - Phase 3
// Đảm bảo nguyên tắc bảo toàn điểm số, độ thân thiện với trẻ em (GDPT 2018), không phạt sạch điểm khi chơi lại chặng.

import type {
  IMissionChainConfig,
  IMissionChainState,
  IMissionChainStage,
  IMissionConfig,
} from './types';
import { MISSION_CHAIN_CATALOG } from './missionChainCatalog';

export class MissionChainEngine {
  private chainConfig: IMissionChainConfig | null = null;
  private state: IMissionChainState;

  constructor(initialChainId?: string, savedState?: IMissionChainState) {
    if (savedState) {
      this.state = { ...savedState };
      this.chainConfig = MISSION_CHAIN_CATALOG[savedState.chainId] || null;
    } else if (initialChainId && MISSION_CHAIN_CATALOG[initialChainId]) {
      this.chainConfig = MISSION_CHAIN_CATALOG[initialChainId];
      this.state = {
        chainId: initialChainId,
        currentStageIndex: 0,
        completedStages: [],
        isChainCompleted: false,
        totalScoreAccumulated: 0,
        totalStarsAccumulated: 0,
        isPaused: false,
      };
    } else {
      this.state = {
        chainId: '',
        currentStageIndex: 0,
        completedStages: [],
        isChainCompleted: false,
        totalScoreAccumulated: 0,
        totalStarsAccumulated: 0,
        isPaused: false,
      };
    }
  }

  /**
   * Bắt đầu một chiến dịch nhiệm vụ liên hoàn mới
   */
  public startChain(chainId: string): IMissionChainState {
    const config = MISSION_CHAIN_CATALOG[chainId];
    if (!config) {
      throw new Error(`[MissionChainEngine] Không tìm thấy chiến dịch liên hoàn có id: ${chainId}`);
    }

    this.chainConfig = config;
    this.state = {
      chainId,
      currentStageIndex: 0,
      completedStages: [],
      isChainCompleted: false,
      totalScoreAccumulated: 0,
      totalStarsAccumulated: 0,
      isPaused: false,
    };

    return this.getState();
  }

  /**
   * Lấy cấu hình chiến dịch hiện tại
   */
  public getChainConfig(): IMissionChainConfig | null {
    return this.chainConfig;
  }

  /**
   * Lấy thông tin chặng hiện tại đang diễn ra
   */
  public getCurrentStage(): IMissionChainStage | null {
    if (!this.chainConfig) return null;
    if (this.state.currentStageIndex >= this.chainConfig.stages.length) return null;
    return this.chainConfig.stages[this.state.currentStageIndex];
  }

  /**
   * Lấy cấu hình nhiệm vụ phụ trách của chặng hiện tại
   */
  public getCurrentMissionConfig(): IMissionConfig | null {
    const stage = this.getCurrentStage();
    return stage ? stage.missionConfig : null;
  }

  /**
   * Hoàn thành chặng hiện tại và tiến lên chặng kế tiếp
   * Tích luỹ điểm và sao mà không bị ghi đè hay mất mát
   */
  public advanceStage(
    stageScore: number,
    stageStars: number
  ): {
    isCompleted: boolean;
    nextStage: IMissionChainStage | null;
    grandReward?: IMissionChainConfig['grandReward'];
  } {
    if (!this.chainConfig) {
      throw new Error('[MissionChainEngine] Chưa khởi động chiến dịch nào.');
    }

    const currentStage = this.getCurrentStage();
    if (!currentStage) {
      return {
        isCompleted: true,
        nextStage: null,
        grandReward: this.chainConfig.grandReward,
      };
    }

    // Ghi nhận hoàn thành chặng hiện tại
    if (!this.state.completedStages.includes(currentStage.stageIndex)) {
      this.state.completedStages.push(currentStage.stageIndex);
    }

    // Tích lũy điểm và sao an toàn
    this.state.totalScoreAccumulated += Math.max(0, stageScore);
    this.state.totalStarsAccumulated += Math.max(0, stageStars);

    // Kiểm tra xem đã vượt qua tất cả các chặng chưa
    if (this.state.currentStageIndex + 1 >= this.chainConfig.stages.length) {
      this.state.isChainCompleted = true;
      return {
        isCompleted: true,
        nextStage: null,
        grandReward: this.chainConfig.grandReward,
      };
    }

    // Chuyển sang chặng kế tiếp
    this.state.currentStageIndex += 1;
    return {
      isCompleted: false,
      nextStage: this.getCurrentStage(),
    };
  }

  /**
   * Thử lại chặng hiện tại khi thất bại.
   * NGUYÊN TẮC SƯ PHẠM: Giữ nguyên tổng điểm và các chặng đã vượt qua trước đó.
   * Trẻ không bị phạt trừ điểm đã tích lũy từ các chặng thành công!
   */
  public retryCurrentStage(): void {
    // Không trừ totalScoreAccumulated hoặc totalStarsAccumulated
    this.state.isPaused = false;
  }

  /**
   * Tạm dừng chiến dịch (để bé nghỉ ngơi hoặc xem lại bài học)
   */
  public pauseChain(): void {
    this.state.isPaused = true;
  }

  /**
   * Tiếp tục chiến dịch sau khi nghỉ ngơi
   */
  public resumeChain(): void {
    this.state.isPaused = false;
  }

  /**
   * Lấy bản sao trạng thái hiện tại (Immutable)
   */
  public getState(): IMissionChainState {
    return {
      ...this.state,
      completedStages: [...this.state.completedStages],
    };
  }
}
