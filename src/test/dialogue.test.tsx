// src/test/dialogue.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { DialogueCategory } from '../types/dialogue';
import { DIALOGUE_LIBRARY, RANDOM_PHRASES, getRandomPhrase } from '../features/dialogue/dialogueLibrary';
import { DialoguePlayer } from '../features/dialogue/DialoguePlayer';

describe('Dialogue Engine & Script Library (Phase 2)', () => {
  it('thư viện có đầy đủ 11 tình huống hội thoại', () => {
    const categories: DialogueCategory[] = [
      'greeting',
      'quest_assign',
      'quest_start',
      'answer_correct',
      'answer_wrong',
      'hint',
      'victory',
      'defeat',
      'rewarding',
      'encouragement',
      'new_zone',
    ];

    categories.forEach((cat) => {
      const phrases = RANDOM_PHRASES[cat];
      expect(phrases).toBeDefined();
      expect(phrases.length).toBeGreaterThanOrEqual(3);

      const randomOne = getRandomPhrase(cat);
      expect(randomOne).toBeTruthy();
      expect(typeof randomOne).toBe('string');
    });
  });

  it('toàn bộ đồ thị kịch bản trong DIALOGUE_LIBRARY hợp lệ', () => {
    Object.values(DIALOGUE_LIBRARY).forEach((conversation) => {
      expect(conversation.startNodeId).toBeTruthy();
      expect(conversation.nodes[conversation.startNodeId]).toBeDefined();

      Object.values(conversation.nodes).forEach((node) => {
        expect(node.characterId).toBeTruthy();
        expect(node.characterName).toBeTruthy();
        expect(node.text).toBeTruthy();

        if (node.nextDialogueId) {
          expect(conversation.nodes[node.nextDialogueId]).toBeDefined();
        }
      });
    });
  });

  it('DialoguePlayer hiển thị lời thoại, hỗ trợ Bỏ qua và Tiếp tục', () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    const sampleConversation = DIALOGUE_LIBRARY.greeting_main;

    render(
      <DialoguePlayer
        conversation={sampleConversation}
        onComplete={onComplete}
        onSkip={onSkip}
      />
    );

    // Kiểm tra tên người nói ban đầu
    expect(screen.getByText(/Nữ Hoàng Nhi Mami/i)).toBeTruthy();

    // Bấm nút Nghe lại
    const replayBtn = screen.getByRole('button', { name: /Nghe lại/i });
    expect(replayBtn).toBeTruthy();
    fireEvent.click(replayBtn);

    // Bấm nút Tiếp tục
    const nextBtn = screen.getByRole('button', { name: /Tiếp tục/i });
    expect(nextBtn).toBeTruthy();
    fireEvent.click(nextBtn);

    // Chuyển sang lượt thoại tiếp theo của Ronie
    expect(screen.getByText(/Bé Ronie/i)).toBeTruthy();

    // Bấm nút Bỏ qua
    const skipBtn = screen.getByTitle(/Bỏ qua đoạn hội thoại này/i);
    expect(skipBtn).toBeTruthy();
    fireEvent.click(skipBtn);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
