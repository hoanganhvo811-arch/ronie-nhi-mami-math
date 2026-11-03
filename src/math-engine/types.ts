// src/math-engine/types.ts
// Định nghĩa cấu trúc chuẩn cho Math Engine & Question Bank Toán Lớp 1 (GDPT 2018)

/**
 * 5 Nhóm chủ đề chính của Toán Lớp 1 theo Chương trình GDPT 2018
 */
export type MathTopic =
  | 'numbers' // Nhóm A: Số học (Đếm, nhận biết, đọc viết, so sánh, thứ tự, liền trước/sau)
  | 'operations' // Nhóm B: Phép tính (Cộng trừ 10, 20, tìm số chưa biết, điền dấu)
  | 'geometry' // Nhóm C: Hình học (Vuông, tròn, tam giác, chữ nhật, vị trí không gian)
  | 'measurement_time' // Nhóm D: Đo lường & Thời gian (Dài/ngắn, nặng/nhẹ, ngày tuần, xem đồng hồ đúng, cm)
  | 'word_problems'; // Nhóm E: Toán có lời văn (Thêm, bớt, trực quan, thực tế đơn giản)

/**
 * 4 Mức độ nhận thức chuẩn sư phạm
 */
export type MathDifficulty = 1 | 2 | 3 | 4;
// 1 = Level 1: Làm quen (Trực quan, hình ảnh minh họa, thao tác đếm)
// 2 = Level 2: Cơ bản (Hỏi trực tiếp, kỹ năng nền tảng)
// 3 = Level 3: Vận dụng (Tư duy 1 bước, so sánh biểu thức, giải quyết bài toán)
// 4 = Level 4: Thử thách (Tổng hợp, suy luận logic phù hợp năng lực học sinh lớp 1)

/**
 * 10 Dạng câu hỏi tương tác theo yêu cầu Phase 3
 */
export type QuestionType =
  | 'multiple_choice' // 1. Trắc nghiệm 3 - 4 lựa chọn
  | 'count_objects' // 2. Đếm số lượng vật thể trực quan
  | 'number_comparison' // 3. So sánh hai số hoặc biểu thức (>, <, =)
  | 'missing_number' // 4. Điền số còn thiếu vào chỗ trống hoặc dãy số
  | 'fill_operation' // 5. Điền dấu phép tính (+, -, =)
  | 'drag_and_drop' // 6. Kéo thả đáp án vào vị trí đích
  | 'visual_word_problem' // 7. Bài toán có lời văn kèm minh họa trực quan
  | 'true_false' // 8. Đúng / Sai (Đ / S)
  | 'number_ordering' // 9. Sắp xếp thứ tự dãy số (tăng dần / giảm dần)
  | 'shape_recognition'; // 10. Nhận biết và phân loại hình học

/**
 * Cấu trúc dữ liệu hình ảnh trực quan hỗ trợ câu hỏi
 */
export interface IQuestionVisualData {
  visualType:
    | 'COUNTING'
    | 'ADDITION_VISUAL'
    | 'SUBTRACTION_VISUAL'
    | 'COMPARISON'
    | 'GEOMETRY'
    | 'NUMBER_LINE'
    | 'RULER_CM'
    | 'CLOCK'
    | 'ORDERING'
    | 'GRID_OBJECTS';
  items?: { emoji: string; count: number; name: string }[];
  groupA?: { emoji: string; count: number; name?: string };
  groupB?: { emoji: string; count: number; name?: string };
  comparisonValues?: { left: number; right: number };
  subtractedCount?: number; // Số lượng bị gạch chéo/bớt đi
  shapes?: {
    type: 'square' | 'circle' | 'triangle' | 'rectangle' | 'cube';
    color: string;
    label?: string;
  }[];
  rulerCm?: {
    length: number;
    objectName: string;
    objectEmoji: string;
  };
  clockTime?: {
    hour: number;
    minute: number;
  };
  sequence?: (number | string | null)[];
}

/**
 * Cấu trúc gợi ý sư phạm từng bước
 */
export interface IQuestionHint {
  text: string;
  audioPrompt?: string;
  visualSteps?: {
    step: number;
    instruction: string;
    highlightCount?: number;
    actionType?: 'count' | 'add' | 'subtract' | 'observe';
  }[];
}

/**
 * Cấu trúc dữ liệu toàn diện của một câu hỏi Toán Lớp 1
 */
export interface IGrade1Question {
  id: string; // Mã định danh duy nhất (VD: "Q_NUM_001")
  topic: MathTopic; // Nhóm chủ đề (A, B, C, D, E)
  subtopic: string; // Chủ đề phụ cụ thể
  grade: 1; // Khối lớp 1
  semester: 1 | 2; // Học kỳ 1 hoặc Học kỳ 2
  difficulty: MathDifficulty; // Mức độ (1, 2, 3, 4)
  questionType: QuestionType; // 1 trong 10 dạng câu hỏi
  questionText: string; // Nội dung câu hỏi chữ to, dễ đọc
  audioId?: string; // ID âm thanh (nếu có thu âm)
  audioPrompt?: string; // Nội dung đọc thoại chuẩn tiếng Việt (TTS)
  illustrationId?: string; // ID minh họa
  visualData?: IQuestionVisualData; // Dữ liệu trực quan hóa
  correctAnswer: string | number | (string | number)[]; // Đáp án chính xác
  wrongAnswers: (string | number)[]; // Danh sách đáp án gây nhiễu hợp lý
  options: (string | number)[]; // Toàn bộ tùy chọn hiển thị
  hint: IQuestionHint; // Gợi ý sư phạm
  explanation: string; // Giải thích chi tiết sau khi làm
  curriculumReference: string; // Căn cứ chương trình GDPT 2018
  tags: string[]; // Thẻ phân loại tìm kiếm
}

/**
 * Kết quả chấm điểm và đánh giá
 */
export interface IEvaluationResult {
  isCorrect: boolean;
  score: number; // Điểm nhận được (0..100)
  difficulty: MathDifficulty;
  timeSpentMs: number;
  attemptsCount: number;
  feedbackMessage: string;
  hintTriggered: boolean;
  errorType: 'none' | 'player_wrong_answer' | 'invalid_input' | 'system_error';
}

/**
 * Thống kê phân bố ngân hàng câu hỏi
 */
export interface IBankDistributionReport {
  totalQuestions: number;
  byTopic: Record<MathTopic, number>;
  byDifficulty: Record<MathDifficulty, number>;
  byQuestionType: Record<QuestionType, number>;
  bySemester: Record<1 | 2, number>;
  valid: boolean;
  validationErrors: string[];
}
