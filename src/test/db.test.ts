// src/test/db.test.ts
import { describe, it, expect } from 'vitest';
import { db } from '../services/storage/db';

describe('MathKingdomDatabase (Dexie Persistence)', () => {
  it('cơ sở dữ liệu được cấu hình đúng 6 bảng lưu trữ', () => {
    expect(db.name).toBe('MathKingdomDB_v1');
    expect(db.profiles).toBeDefined();
    expect(db.progress).toBeDefined();
    expect(db.mathSessions).toBeDefined();
    expect(db.inventory).toBeDefined();
    expect(db.quests).toBeDefined();
    expect(db.parentSettings).toBeDefined();
  });
});
