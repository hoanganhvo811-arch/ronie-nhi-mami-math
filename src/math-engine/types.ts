// src/math-engine/types.ts
// Định nghĩa cấu trúc chuẩn cho Math Engine & Question Bank Toán Lớp 1 (GDPT 2018)

/**
 * 5 Nhóm chủ đề cơ bản (Core Topics)
 */
export type CoreMathTopic =
  | 'numbers' // Nhóm A: Số học (Đếm, nhận biết, đọc viết, so sánh, thứ tự, liền trước/sau)
  | 'operations' // Nhóm B: Phép tính (Cộng trừ 10, 20, tìm số chưa biết, điền dấu)
  | 'geometry' // Nhóm C: Hình học (Vuông, tròn, tam giác, chữ nhật, vị trí không gian)
  | 'measurement_time' // Nhóm D: Đo lường & Thời gian (Dài/ngắn, nặng/nhẹ, ngày tuần, xem đồng hồ đúng, cm)
  | 'word_problems'; // Nhóm E: Toán có lời văn (Thêm, bớt, trực quan, thực tế đơn giản)

/**
 * 12 Nhóm kiến thức chuẩn chuyên sâu (Advanced 12 Topics - Phase 1)
 */
export type AdvancedMathTopic =
  | 'counting_recognition'      // 1. Counting and Number Recognition
  | 'number_comparison'         // 2. Number Comparison
  | 'addition'                  // 3. Addition
  | 'subtraction'               // 4. Subtraction
  | 'missing_numbers'           // 5. Missing Numbers
  | 'number_composition'        // 6. Number Composition and Decomposition
  | 'tens_and_ones'             // 7. Tens and Ones
  | 'word_problems'             // 8. Word Problems
  | 'number_patterns'           // 9. Number Patterns
  | 'geometry'                  // 10. Geometry
  | 'measurement_time'          // 11. Measurement and Time
  | 'logical_thinking';         // 12. Logical Thinking

/**
 * Toàn bộ các chủ đề toán học hợp lệ (Bao gồm cả Core và 12 Advanced Topics)
 */
export type MathTopic = CoreMathTopic | AdvancedMathTopic;

/**
 * 5 Mức độ nhận thức chuẩn sư phạm (Blooms Taxonomy / GDPT 2018)
 */
export type MathDifficulty = 1 | 2 | 3 | 4 | 5;
// 1 = Level 1: Nhận biết (Recognition / Trực quan, đếm, thao tác đơn giản)
// 2 = Level 2: Thông hiểu (Comprehension / Hiểu bản chất phép tính, so sánh, dạng cơ bản)
// 3 = Level 3: Vận dụng (Application / Tính toán 1 bước, số có 2 chữ số, giải quyết bài toán)
// 4 = Level 4: Vận dụng nâng cao (Advanced Application / Toán 2 bước, cấu tạo số, thước lệch)
// 5 = Level 5: Thử thách (Challenge / Suy luận logic, phát hiện quy luật, Olympiad nhí)

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
    | 'GRID_OBJECTS'
    | 'NUMBER_BONDS'
    | 'DICE';
  items?: { emoji: string; count: number; name: string }[];
  groupA?: { emoji: string; count: number; name?: string };
  groupB?: { emoji: string; count: number; name?: string };
  comparisonValues?: { left: number | string; right: number | string };
  subtractedCount?: number; // Số lượng bị gạch chéo/bớt đi
  shapes?: {
    type: 'square' | 'circle' | 'triangle' | 'rectangle' | 'cube';
    color: string;
    label?: string;
  }[];
  rulerCm?: {
    length: number;
    startCm?: number;
    endCm?: number;
    objectName: string;
    objectEmoji: string;
  };
  clockTime?: {
    hour: number;
    minute: number;
  };
  sequence?: (number | string | null)[];
  numberBonds?: {
    whole: number;
    parts: (number | string)[];
  };
  diceValues?: number[];
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
 * Cấu trúc dữ liệu toàn diện của một câu hỏi Toán Lớp 1 (Chuẩn v2.0)
 */
export interface IGrade1Question {
  id: string; // Mã định danh duy nhất (VD: "ADV_ADD_001", "Q_NUM_001")
  questionId?: string; // Tương đương id
  topic: MathTopic; // Nhóm chủ đề (Core hoặc Advanced)
  subtopic: string; // Chủ đề phụ cụ thể
  grade: 1; // Khối lớp 1
  semester: 1 | 2; // Học kỳ 1 hoặc Học kỳ 2
  difficulty: MathDifficulty; // Mức độ (1, 2, 3, 4, 5)
  questionType: QuestionType; // 1 trong 10 dạng câu hỏi
  questionText: string; // Nội dung câu hỏi chữ to, dễ đọc
  audioId?: string; // ID âm thanh (nếu có thu âm)
  audioPrompt?: string; // Nội dung đọc thoại chuẩn tiếng Việt (TTS)
  illustrationId?: string; // ID minh họa
  visualData?: IQuestionVisualData; // Dữ liệu trực quan hóa
  correctAnswer: string | number | (string | number)[]; // Đáp án chính xác
  wrongAnswers: (string | number)[]; // Danh sách đáp án gây nhiễu hợp lý
  options: (string | number)[]; // Toàn bộ tùy chọn hiển thị
  hint: IQuestionHint; // Gợi ý sư phạm gốc
  hintLevel1?: string; // Gợi ý cấp 1: định hướng nhẹ nhàng
  hintLevel2?: string; // Gợi ý cấp 2: phân tích bước giải
  hintLevel3?: string; // Gợi ý cấp 3: chỉ rõ cách tính
  explanation: string; // Giải thích chi tiết sau khi làm
  estimatedTime?: number; // Thời gian làm bài dự kiến (giây)
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
  byTopic: Record<string, number>;
  byDifficulty: Record<MathDifficulty, number>;
  byQuestionType: Record<QuestionType, number>;
  bySemester: Record<1 | 2, number>;
  valid: boolean;
  validationErrors: string[];
}
