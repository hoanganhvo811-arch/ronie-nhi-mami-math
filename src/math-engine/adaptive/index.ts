// src/math-engine/adaptive/index.ts
// Entrypoint cho Adaptive Difficulty Engine (Phase 2)

import { AdaptiveDifficultyEngine } from './AdaptiveDifficultyEngine';
import type { GameMode } from './types';

export * from './types';
export * from './AdaptiveDifficultyEngine';
export * from './AdaptiveStorageService';

let globalAdaptiveEngine: AdaptiveDifficultyEngine | null = null;

/**
 * Lấy thể hiện đơn nhất (Singleton) của AdaptiveDifficultyEngine
 */
export function getAdaptiveEngine(
  profileId: string = 'profile_ronie_default',
  defaultMode: GameMode = 'story'
): AdaptiveDifficultyEngine {
  if (!globalAdaptiveEngine || globalAdaptiveEngine.getState().profileId !== profileId) {
    globalAdaptiveEngine = new AdaptiveDifficultyEngine(profileId, defaultMode);
  }
  return globalAdaptiveEngine;
}
