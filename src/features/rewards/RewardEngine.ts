// src/features/rewards/RewardEngine.ts
// Bộ Điều Phối Trao Thưởng & Quản Lý Nghi Thức Vinh Danh Hoàng Gia (Phase 5)

import {
  getRewardItemById,
  MISSION_REWARD_MAP,
  REWARD_ITEMS_CATALOG,
} from './rewardCatalog';
import {
  grantRewardItem,
  updateProgression,
  DEFAULT_PROFILE_ID,
} from '../../services/storage/db';
import type { IRewardItem, IClaimRewardResult } from '../../types/rewards';
import { soundManager } from '../../services/audio/AudioManager';

export class RewardEngine {
  private static isProcessing = false;

  /**
   * Xác định phần thưởng chính xác cho một nhiệm vụ cụ thể
   */
  public static resolveRewardForMission(missionId: string): IRewardItem {
    const specificItemId = MISSION_REWARD_MAP[missionId];
    if (specificItemId && REWARD_ITEMS_CATALOG[specificItemId]) {
      return REWARD_ITEMS_CATALOG[specificItemId];
    }
    // Mặc định nếu không tìm thấy
    return REWARD_ITEMS_CATALOG.candy_lollipop;
  }

  /**
   * Trao phần thưởng an toàn (Có cơ chế khóa Mutex chống click đúp & chống nhận trùng)
   */
  public static async claimMissionReward(
    missionId: string,
    expGained: number,
    correctAnswersCount: number,
    profileId: string = DEFAULT_PROFILE_ID
  ): Promise<IClaimRewardResult> {
    // 1. Chống nhấp đúp (Double-click guard)
    if (this.isProcessing) {
      return {
        success: false,
        isDuplicate: true,
        item: null,
        xpGained: 0,
        levelUp: false,
        newLevel: 1,
        message: 'Đang mở rương quà hoàng gia...',
      };
    }

    this.isProcessing = true;

    try {
      const rewardItem = this.resolveRewardForMission(missionId);

      // 2. Trao vật phẩm vào kho lưu trữ Dexie
      const grantResult = await grantRewardItem(profileId, rewardItem.id, missionId);

      // 3. Cập nhật kinh nghiệm và tiến trình cấp độ (chỉ cộng nếu không phải nhận trùng)
      let levelUp = false;
      let newLevel = 1;

      if (grantResult.success) {
        soundManager.playCelebration();
        const progResult = await updateProgression(
          profileId,
          expGained,
          correctAnswersCount,
          true
        );
        levelUp = progResult.didLevelUp;
        newLevel = progResult.newLevel;
      }

      return {
        success: grantResult.success,
        isDuplicate: grantResult.isDuplicate,
        item: rewardItem,
        xpGained: grantResult.success ? expGained : 0,
        levelUp,
        newLevel,
        message: grantResult.message,
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Lấy lời chúc ấm áp của Nữ hoàng Nhi Mami khi trao quà
   */
  public static getQueenCongratulationMessage(rewardItem: IRewardItem): string {
    switch (rewardItem.category) {
      case 'toy':
        return `Nữ hoàng Nhi Mami mỉm cười xoa đầu Ronie: "Con đã giải toán thật thông minh! Mẹ tặng con món đồ chơi ${rewardItem.name} này, con hãy mang về đặt lên kệ phòng riêng nhé!"`;
      case 'candy':
        return `Nữ hoàng Nhi Mami âu yếm trao quà: "Hôm nay con đã nỗ lực hết mình! Đây là ${rewardItem.name} ngọt ngào dành tặng cho hiệp sĩ nhí của mẹ!"`;
      case 'badge':
        return `Nữ hoàng Nhi Mami tự hào cài huy hiệu: "Với tài năng và lòng dũng cảm, con xứng đáng nhận ${rewardItem.name} cao quý của Vương Quốc!"`;
      case 'costume':
        return `Nữ hoàng Nhi Mami trao chiếc hộp gấm: "Mẹ đã chuẩn bị ${rewardItem.name} tuyệt đẹp này cho con. Hãy vào tủ đồ mặc thử ngay nhé Ronie!"`;
    }
  }

  /**
   * Lời động viên ấm áp của Nữ hoàng khi Ronie gặp thử thách khó (Thất bại)
   */
  public static getQueenComfortMessage(): string {
    return 'Không sao đâu bé Ronie của mẹ! Thất bại là mẹ thành công, mẹ luôn ở bên con. Mọi phần thưởng và điểm số của con vẫn an toàn nguyên vẹn. Con hãy nghỉ một chút rồi chúng ta cùng thử lại nhé!';
  }
}
