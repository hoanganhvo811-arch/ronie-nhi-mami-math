// src/math-engine/advanced-bank/index.ts
// Tổng hợp Ngân hàng câu hỏi nâng cao 12 Nhóm kiến thức (120 câu hỏi) - Phase 1

import type { IGrade1Question, AdvancedMathTopic, MathDifficulty } from '../types';
import { COUNTING_RECOGNITION_BANK } from './countingRecognitionBank';
import { NUMBER_COMPARISON_BANK } from './numberComparisonBank';
import { ADDITION_BANK } from './additionBank';
import { SUBTRACTION_BANK } from './subtractionBank';
import { MISSING_NUMBERS_BANK } from './missingNumbersBank';
import { NUMBER_COMPOSITION_BANK } from './numberCompositionBank';
import { TENS_AND_ONES_BANK } from './tensAndOnesBank';
import { WORD_PROBLEMS_BANK_ADV } from './wordProblemsBank';
import { NUMBER_PATTERNS_BANK } from './numberPatternsBank';
import { GEOMETRY_BANK_ADV } from './geometryBank';
import { MEASUREMENT_TIME_BANK_ADV } from './measurementTimeBank';
import { LOGICAL_THINKING_BANK } from './logicalThinkingBank';

export {
  COUNTING_RECOGNITION_BANK,
  NUMBER_COMPARISON_BANK,
  ADDITION_BANK,
  SUBTRACTION_BANK,
  MISSING_NUMBERS_BANK,
  NUMBER_COMPOSITION_BANK,
  TENS_AND_ONES_BANK,
  WORD_PROBLEMS_BANK_ADV,
  NUMBER_PATTERNS_BANK,
  GEOMETRY_BANK_ADV,
  MEASUREMENT_TIME_BANK_ADV,
  LOGICAL_THINKING_BANK,
};

/**
 * Danh sách tên hiển thị tiếng Việt chuẩn của 12 nhóm kiến thức
 */
export const ADVANCED_TOPIC_NAMES_VI: Record<AdvancedMathTopic, string> = {
  counting_recognition: 'Đếm và nhận biết số',
  number_comparison: 'So sánh số và biểu thức',
  addition: 'Phép cộng',
  subtraction: 'Phép trừ',
  missing_numbers: 'Điền số còn thiếu',
  number_composition: 'Cấu tạo và tách gộp số',
  tens_and_ones: 'Số chục và số đơn vị',
  word_problems: 'Toán có lời văn',
  number_patterns: 'Dãy số có quy luật',
  geometry: 'Hình học và không gian',
  measurement_time: 'Đo lường và thời gian',
  logical_thinking: 'Tư duy logic và đố vui',
};

/**
 * Toàn bộ 120 câu hỏi nâng cao thuộc 12 nhóm kiến thức chuẩn v2.0
 */
export const ADVANCED_QUESTION_BANK_12: IGrade1Question[] = [
  ...COUNTING_RECOGNITION_BANK,
  ...NUMBER_COMPARISON_BANK,
  ...ADDITION_BANK,
  ...SUBTRACTION_BANK,
  ...MISSING_NUMBERS_BANK,
  ...NUMBER_COMPOSITION_BANK,
  ...TENS_AND_ONES_BANK,
  ...WORD_PROBLEMS_BANK_ADV,
  ...NUMBER_PATTERNS_BANK,
  ...GEOMETRY_BANK_ADV,
  ...MEASUREMENT_TIME_BANK_ADV,
  ...LOGICAL_THINKING_BANK,
];

// Bản đồ tra cứu nhanh theo ID
const ADV_QUESTION_MAP = new Map<string, IGrade1Question>(
  ADVANCED_QUESTION_BANK_12.map((q) => [q.id, q])
);

/**
 * Lấy câu hỏi nâng cao theo ID
 */
export function getAdvancedQuestionById(id: string): IGrade1Question | undefined {
  return ADV_QUESTION_MAP.get(id);
}

/**
 * Lấy danh sách câu hỏi nâng cao theo 1 trong 12 chủ đề
 */
export function getAdvancedQuestionsByTopic(topic: AdvancedMathTopic): IGrade1Question[] {
  return ADVANCED_QUESTION_BANK_12.filter((q) => q.topic === topic);
}

/**
 * Lấy danh sách câu hỏi nâng cao theo mức độ khó (1..5)
 */
export function getAdvancedQuestionsByDifficulty(difficulty: MathDifficulty): IGrade1Question[] {
  return ADVANCED_QUESTION_BANK_12.filter((q) => q.difficulty === difficulty);
}

/**
 * Lấy danh sách câu hỏi nâng cao theo chủ đề và mức độ khó
 */
export function getAdvancedQuestionsByTopicAndDifficulty(
  topic: AdvancedMathTopic,
  difficulty: MathDifficulty
): IGrade1Question[] {
  return ADVANCED_QUESTION_BANK_12.filter(
    (q) => q.topic === topic && q.difficulty === difficulty
  );
}
