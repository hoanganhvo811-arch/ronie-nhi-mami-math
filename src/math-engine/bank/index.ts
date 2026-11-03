// src/math-engine/bank/index.ts
// Tập hợp Ngân hàng 205+ Câu hỏi Toán Lớp 1 chuẩn GDPT 2018 (Vietnam Curriculum)

import type {
  IGrade1Question,
  MathTopic,
  MathDifficulty,
  QuestionType,
  IBankDistributionReport,
} from '../types';
import { NUMBERS_BANK } from './numbersBank';
import { OPERATIONS_BANK } from './operationsBank';
import { GEOMETRY_BANK } from './geometryBank';
import { MEASUREMENT_TIME_BANK } from './measurementTimeBank';
import { WORD_PROBLEMS_BANK } from './wordProblemsBank';

// TOÀN BỘ NGÂN HÀNG CÂU HỎI ĐÃ ĐƯỢC KIỂM ĐỊNH (205 CÂU)
export const QUESTION_BANK: IGrade1Question[] = [
  ...NUMBERS_BANK,
  ...OPERATIONS_BANK,
  ...GEOMETRY_BANK,
  ...MEASUREMENT_TIME_BANK,
  ...WORD_PROBLEMS_BANK,
];

// Bản đồ tra cứu nhanh theo ID (O(1))
const QUESTION_MAP: Map<string, IGrade1Question> = new Map(
  QUESTION_BANK.map((q) => [q.id, q])
);

/**
 * Lấy câu hỏi theo ID
 */
export function getQuestionById(id: string): IGrade1Question | undefined {
  return QUESTION_MAP.get(id);
}

/**
 * Lấy danh sách câu hỏi theo chủ đề (Topic)
 */
export function getQuestionsByTopic(topic: MathTopic): IGrade1Question[] {
  return QUESTION_BANK.filter((q) => q.topic === topic);
}

/**
 * Lấy danh sách câu hỏi theo mức độ (Difficulty 1..4)
 */
export function getQuestionsByDifficulty(difficulty: MathDifficulty): IGrade1Question[] {
  return QUESTION_BANK.filter((q) => q.difficulty === difficulty);
}

/**
 * Lấy danh sách câu hỏi kết hợp chủ đề và mức độ
 */
export function getQuestionsByTopicAndDifficulty(
  topic: MathTopic,
  difficulty: MathDifficulty
): IGrade1Question[] {
  return QUESTION_BANK.filter((q) => q.topic === topic && q.difficulty === difficulty);
}

/**
 * Lấy danh sách câu hỏi theo chủ đề phụ (Subtopic)
 */
export function getQuestionsBySubtopic(subtopic: string): IGrade1Question[] {
  return QUESTION_BANK.filter((q) => q.subtopic === subtopic);
}

/**
 * Lấy danh sách câu hỏi theo dạng (QuestionType)
 */
export function getQuestionsByType(type: QuestionType): IGrade1Question[] {
  return QUESTION_BANK.filter((q) => q.questionType === type);
}

/**
 * Lấy danh sách câu hỏi ngẫu nhiên theo tiêu chí lọc, tránh trùng lặp
 */
export function getRandomQuestions(options: {
  topic?: MathTopic;
  difficulty?: MathDifficulty;
  questionType?: QuestionType;
  semester?: 1 | 2;
  count?: number;
  excludeIds?: string[];
}): IGrade1Question[] {
  const {
    topic,
    difficulty,
    questionType,
    semester,
    count = 5,
    excludeIds = [],
  } = options;

  let pool = QUESTION_BANK.filter((q) => !excludeIds.includes(q.id));

  if (topic) {
    pool = pool.filter((q) => q.topic === topic);
  }
  if (difficulty) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  if (questionType) {
    pool = pool.filter((q) => q.questionType === questionType);
  }
  if (semester) {
    pool = pool.filter((q) => q.semester === semester);
  }

  // Nếu không đủ câu hỏi sau khi loại trừ, dùng lại toàn bộ pool theo tiêu chí
  if (pool.length === 0) {
    pool = QUESTION_BANK.filter((q) => {
      if (topic && q.topic !== topic) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      if (questionType && q.questionType !== questionType) return false;
      if (semester && q.semester !== semester) return false;
      return true;
    });
  }

  // Xáo trộn ngẫu nhiên (Fisher-Yates)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Tạo báo cáo phân bố ngân hàng câu hỏi theo chủ đề, mức độ, dạng bài và học kỳ
 */
export function getQuestionDistribution(): IBankDistributionReport {
  const byTopic: Record<MathTopic, number> = {
    numbers: 0,
    operations: 0,
    geometry: 0,
    measurement_time: 0,
    word_problems: 0,
  };

  const byDifficulty: Record<MathDifficulty, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  const byQuestionType: Record<QuestionType, number> = {
    multiple_choice: 0,
    count_objects: 0,
    number_comparison: 0,
    missing_number: 0,
    fill_operation: 0,
    drag_and_drop: 0,
    visual_word_problem: 0,
    true_false: 0,
    number_ordering: 0,
    shape_recognition: 0,
  };

  const bySemester: Record<1 | 2, number> = {
    1: 0,
    2: 0,
  };

  const validationErrors: string[] = [];
  const seenIds = new Set<string>();

  for (const q of QUESTION_BANK) {
    // Kiểm tra trùng ID
    if (seenIds.has(q.id)) {
      validationErrors.push(`Duplicate question ID detected: ${q.id}`);
    }
    seenIds.add(q.id);

    // Đếm theo nhóm
    if (byTopic[q.topic] !== undefined) byTopic[q.topic]++;
    if (byDifficulty[q.difficulty] !== undefined) byDifficulty[q.difficulty]++;
    if (byQuestionType[q.questionType] !== undefined) byQuestionType[q.questionType]++;
    if (bySemester[q.semester] !== undefined) bySemester[q.semester]++;
  }

  return {
    totalQuestions: QUESTION_BANK.length,
    byTopic,
    byDifficulty,
    byQuestionType,
    bySemester,
    valid: validationErrors.length === 0,
    validationErrors,
  };
}
