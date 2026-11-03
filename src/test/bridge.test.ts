// src/test/bridge.test.ts
import { describe, it, expect, vi } from 'vitest';
import { gameBridge } from '../game/bridge/GameBridgeService';

describe('GameBridgeService (Typed EventBus)', () => {
  it('đăng ký và kích hoạt sự kiện thành công', () => {
    const handler = vi.fn();
    const unsubscribe = gameBridge.on('ZONE_SELECTED', handler);

    gameBridge.emit('ZONE_SELECTED', { zoneId: 3 });
    expect(handler).toHaveBeenCalledWith({ zoneId: 3 });

    unsubscribe();
    gameBridge.emit('ZONE_SELECTED', { zoneId: 4 });
    expect(handler).toHaveBeenCalledTimes(1); // Không gọi thêm sau khi unsubscribe
  });

  it('xử lý an toàn khi không có người lắng nghe', () => {
    expect(() => {
      gameBridge.emit('CHANGE_SCREEN', { screen: 'WORLD_MAP' });
    }).not.toThrow();
  });
});
