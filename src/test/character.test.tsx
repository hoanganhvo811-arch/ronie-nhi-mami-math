// src/test/character.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import type { RonieAnimationState, QueenAnimationState, NPCId } from '../types/character';
import { RonieAvatar } from '../features/character/RonieAvatar';
import { QueenNhiMamiAvatar } from '../features/character/QueenNhiMamiAvatar';
import { NPCAvatar } from '../features/character/NPCAvatar';
import { npcRegistry } from '../features/character/npcRegistry';

describe('Character System & 12 States Ronie, 8 States Queen (Phase 2)', () => {
  it('render đầy đủ 12 trạng thái của Ronie không lỗi', () => {
    const ronieStates: RonieAnimationState[] = [
      'idle',
      'walk',
      'run',
      'jump',
      'celebrate',
      'sad',
      'surprised',
      'attack',
      'web_shoot',
      'pull',
      'victory',
      'defeat',
    ];

    expect(ronieStates).toHaveLength(12);

    ronieStates.forEach((state) => {
      const { container } = render(<RonieAvatar size="md" state={state} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('render đầy đủ 8 trạng thái của Nữ hoàng Nhi Mami không lỗi', () => {
    const queenStates: QueenAnimationState[] = [
      'idle',
      'greeting',
      'talking',
      'laughing',
      'surprised',
      'clapping',
      'rewarding',
      'encouraging',
    ];

    expect(queenStates).toHaveLength(8);

    queenStates.forEach((state) => {
      const { container } = render(<QueenNhiMamiAvatar size="md" state={state} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('hệ thống nhân vật phụ NPC Registry có đủ 7 nhân vật theo yêu cầu', () => {
    const expectedNpcIds: NPCId[] = [
      'bear',
      'rabbit',
      'rescued_girl',
      'dragon',
      'robot',
      'cookie_monster',
      'candy_witch',
    ];

    const npcs = npcRegistry.getAll();
    expect(npcs.length).toBeGreaterThanOrEqual(7);

    expectedNpcIds.forEach((id) => {
      const npc = npcRegistry.get(id);
      expect(npc).toBeDefined();
      expect(npc.name).toBeTruthy();
      expect(npc.avatarEmoji).toBeTruthy();
      expect(npc.voicePitch).toBeGreaterThan(0.5);
      expect(npc.voicePitch).toBeLessThan(2.0);

      const { container } = render(<NPCAvatar npcId={id} showName={true} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('hỗ trợ mở rộng đăng ký thêm nhân vật phụ mới (Extensibility)', () => {
    npcRegistry.register({
      id: 'robot' as NPCId,
      name: 'Robot Trợ Lý Vàng',
      title: 'Kỹ Sư Trẻ',
      role: 'companion',
      avatarEmoji: '🤖',
      primaryColor: '#F59E0B',
      pastelColor: '#FEF3C7',
      catchphrase: 'Xin chào!',
      voicePitch: 1.0,
      description: 'Robot thông minh.',
    });

    const updated = npcRegistry.get('robot');
    expect(updated.name).toBe('Robot Trợ Lý Vàng');
  });

  it('tự động fallback sang Vector SVG khi ảnh photo gặp lỗi onError (Zero broken image)', () => {
    const { container } = render(<RonieAvatar size="md" state="idle" variant="photo" />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();

    // Kích hoạt sự kiện onError qua fireEvent trong act
    act(() => {
      fireEvent.error(img!);
    });

    // Sau khi ảnh lỗi, component tự động chuyển sang render thẻ SVG vector
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(container.querySelector('img')).toBeNull();
  });

  it('Nữ Hoàng Nhi Mami tự động fallback sang Vector SVG khi ảnh photo lỗi', () => {
    const { container } = render(<QueenNhiMamiAvatar size="md" state="greeting" variant="photo" />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();

    act(() => {
      fireEvent.error(img!);
    });

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(container.querySelector('img')).toBeNull();
  });
});
