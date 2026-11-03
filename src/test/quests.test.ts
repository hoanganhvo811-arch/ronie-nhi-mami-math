// src/test/quests.test.ts
import { describe, it, expect } from 'vitest';
import { ZONES_CONFIG, MISSIONS_DATA } from '../features/quests/questData';

describe('Quests & 5 Vùng Đất Vương Quốc Toán Học (Phase 1)', () => {
  it('cấu hình đủ 5 vùng đất chuẩn tên gọi Phase 1', () => {
    expect(ZONES_CONFIG).toHaveLength(5);

    const titles = ZONES_CONFIG.map((z) => z.title);
    expect(titles).toContain('Rừng Số Kỳ Diệu');
    expect(titles).toContain('Thung Lũng Cộng Trừ');
    expect(titles).toContain('Cầu Vồng Hình Học');
    expect(titles).toContain('Hang Kho Báu');
    expect(titles).toContain('Thành Phố Thời Gian');
  });

  it('mỗi vùng đất đều có danh sách nhiệm vụ hợp lệ', () => {
    for (let zoneId = 1; zoneId <= 5; zoneId++) {
      const missions = MISSIONS_DATA[zoneId];
      expect(missions).toBeDefined();
      expect(missions.length).toBeGreaterThanOrEqual(3);

      missions.forEach((m) => {
        expect(m.title).toBeTruthy();
        expect(m.mathTopic).toBeTruthy();
        expect(['easy', 'medium', 'hard']).toContain(m.difficulty);
        expect(['not_started', 'in_progress', 'completed']).toContain(m.status);
        expect(m.maxStars).toBe(3);
        expect(m.rewardExp).toBeGreaterThan(0);
      });
    }
  });

  it('các vùng đất hỗ trợ đầy đủ 4 trạng thái tiến trình', () => {
    const validStatuses = ['locked', 'unlocked', 'in_progress', 'completed'];
    ZONES_CONFIG.forEach((zone) => {
      expect(validStatuses).toContain(zone.status);
    });
  });
});
