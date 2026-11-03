// src/game/bridge/GameBridgeService.ts
// Cầu nối giao tiếp định kiểu (Strictly Typed Event Bus) giữa React 19 và Phaser 3

import type { GameBridgeEventMap } from '../../types/game';

type Handler<T> = (data: T) => void;

class GameBridgeService {
  private listeners: Map<keyof GameBridgeEventMap, Set<Handler<any>>> = new Map();

  /**
   * Đăng ký lắng nghe sự kiện
   */
  public on<K extends keyof GameBridgeEventMap>(
    event: K,
    handler: Handler<GameBridgeEventMap[K]>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Trả về hàm hủy đăng ký (clean up)
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Hủy đăng ký lắng nghe
   */
  public off<K extends keyof GameBridgeEventMap>(
    event: K,
    handler: Handler<GameBridgeEventMap[K]>
  ): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(handler);
  }

  /**
   * Phát đi sự kiện cho các bên quan tâm (React hoặc Phaser)
   */
  public emit<K extends keyof GameBridgeEventMap>(
    event: K,
    data: GameBridgeEventMap[K]
  ): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[GameBridgeService] Lỗi khi xử lý sự kiện "${String(event)}":`, error);
        }
      });
    }
  }

  /**
   * Xóa toàn bộ listeners khi khởi động lại hoặc unmount toàn cục
   */
  public clearAll(): void {
    this.listeners.clear();
  }
}

export const gameBridge = new GameBridgeService();
