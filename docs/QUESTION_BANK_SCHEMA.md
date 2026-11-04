# ĐẶC TẢ CẤU TRÚC NGÂN HÀNG CÂU HỎI MỞ RỘNG
# QUESTION BANK SCHEMA SPECIFICATION (v2.0)

> **Dự án:** RONIE & NHI MAMI – MATH KINGDOM  
> **Phiên bản:** Schema v2.0 (Tương thích 100% ngược với Schema v1.0 hiện hành)  
> **Mục tiêu:** Định chuẩn cấu trúc dữ liệu cho câu hỏi tĩnh, câu hỏi sinh động, dữ liệu trực quan đa giác quan và hệ thống phân loại sư phạm.

---

## I. CẤU TRÚC DỮ LIỆU CÂU HỎI MỞ RỘNG (`IEnhancedGrade1Question`)

Kế thừa toàn diện interface `IGrade1Question` hiện có, bổ sung các trường nâng cao phục vụ cá nhân hóa và đo lường độ thuần thục:

```typescript
import type { MathTopic, MathDifficulty, QuestionType, IQuestionVisualData, IQuestionHint } from './types';

/**
 * 4 Bậc nhận thức chuẩn giáo dục tiểu học (Phát triển từ Bloom Taxonomy)
 */
export type CognitiveLevel =
  | 'RECOGNITION'    // Nhận biết (Hỏi trực tiếp, đếm số, nhận dạng hình ảnh)
  | 'COMPREHENSION'  // Thông hiểu (Hiểu bản chất phép tính, so sánh giá trị)
  | 'APPLICATION'    // Vận dụng (Tính nhẩm, bài toán lời văn 1 bước, giải quyết tình huống)
  | 'HIGH_ORDER';    // Vận dụng cao (Toán 2 bước, tìm quy luật, suy luận logic)

/**
 * Cấu trúc dữ liệu trực quan mở rộng cho toán nâng cao
 */
export interface IEnhancedVisualData extends IQuestionVisualData {
  // Bổ sung dạng tháp số / tách gộp số (Number Bonds)
  numberBonds?: {
    whole: number;          // Số tổng ở đỉnh
    parts: (number | '?')[]; // Các phần thành phần ở dưới
  };
  // Bổ sung kim tự tháp số 3 tầng
  pyramidBlocks?: {
    rows: (number | '?')[][];
  };
  // Bổ sung lưới ô tọa độ hoặc bảng biểu đơn giản
  gridTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  // Bổ sung thước kẻ không bắt đầu từ số 0 (Đo khoảng cách lệch)
  offsetRuler?: {
    startCm: number;
    endCm: number;
    objectName: string;
    objectEmoji: string;
  };
}

/**
 * Interface câu hỏi hoàn chỉnh chuẩn Schema v2.0
 */
export interface IEnhancedGrade1Question {
  // --- 1. ĐỊNH DANH VÀ PHÂN LOẠI CƠ BẢN (PRESERVED) ---
  id: string;                     // Mã duy nhất (VD: "Q_OP_046", "GEN_ADV_101")
  topic: MathTopic;              // numbers | operations | geometry | measurement_time | word_problems
  subtopic: string;              // Mã kỹ năng chi tiết (VD: "two_step_operations", "number_bonds")
  grade: 1;                      // Cố định khối lớp 1
  semester: 1 | 2;               // Học kỳ 1 hoặc Học kỳ 2
  difficulty: MathDifficulty;    // 1 | 2 | 3 | 4
  cognitiveLevel: CognitiveLevel;// Bậc nhận thức

  // --- 2. NỘI DUNG VÀ TRÌNH BÀY CHO TRẺ NHỎ ---
  questionType: QuestionType;    // 1 trong 10 dạng tương tác
  questionText: string;          // Nội dung câu hỏi (Ngắn gọn, < 35 từ, font Baloo 2 to rõ)
  audioPrompt: string;           // Kịch bản đọc giọng chuẩn tiếng Việt (VoiceSystem)
  visualData?: IEnhancedVisualData; // Dữ liệu trực quan hóa

  // --- 3. ĐÁP ÁN VÀ PHƯƠNG ÁN NHIỄU SƯ PHẠM ---
  correctAnswer: string | number | (string | number)[];
  wrongAnswers: (string | number)[];
  options: (string | number)[];  // Danh sách các nút 3D hiển thị cho bé chọn

  // --- 4. HỖ TRỢ VÀ GIẢI THÍCH SƯ PHẠM ---
  hint: IQuestionHint;           // Lời mách nhỏ dịu dàng của Nữ hoàng
  explanation: string;           // Lời giải thích tích cực sau khi bé hoàn thành
  curriculumReference: string;   // Mã căn cứ chuẩn GDPT 2018

  // --- 5. METADATA PHỤC VỤ CÁ NHÂN HÓA & ADAPTIVE LEARNING (NEW) ---
  isGenerated?: boolean;         // Đánh dấu câu hỏi sinh động runtime
  estimatedSeconds?: number;     // Thời gian chuẩn để làm (10s - 45s)
  tags: string[];                // Thẻ tìm kiếm (VD: ["cộng 2 bước", "phạm vi 20", "vận dụng cao"])
}
```

---

## II. QUY TẮC SINH ĐÁP ÁN NHIỄU THÔNG MINH (DISTRACTOR RULES)

Học sinh lớp 1 (6–7 tuổi) thường mắc các lỗi nhận thức đặc thù. Bộ sinh đáp án nhiễu thông minh phải tuân thủ các nguyên tắc:

### 1. Lỗi Lệch Đơn Vị Nhỏ ($\pm 1, \pm 2$)
* *Lý do:* Trẻ đếm thiếu hoặc đếm dư 1 ngón tay khi chuyển tiếp qua vạch 10.
* *Công thức:* $D_1 = \text{Correct} + 1$, $D_2 = \text{Correct} - 1$ (với $D_2 \ge 0$).

### 2. Lỗi Nhầm Hàng Chục ($\pm 10$)
* *Lý do:* Trẻ nhìn số $14$ nhưng nhầm thành $24$ hoặc quên cộng thêm 1 chục.
* *Công thức:* $D_3 = \text{Correct} \pm 10$ (trong phạm vi 100).

### 3. Lỗi Nhầm Dấu Phép Tính ($+ \leftrightarrow -$)
* *Lý do:* Đề bài yêu cầu $7 - 2 = ?$, trẻ nhầm thành $7 + 2 = 9$.
* *Công thức:* Sinh ra đáp án của phép tính ngược lại nếu hợp lệ.

### 4. Lỗi Đảo Ngược Chữ Số (Reversal Error)
* *Lý do:* Trẻ mới học nhìn nhận không gian dễ nhầm $12 \leftrightarrow 21$, $15 \leftrightarrow 51$, $6 \leftrightarrow 9$.
* *Công thức:* Nếu đáp án đúng là số có 2 chữ số khác nhau $ab$, sinh phương án nhiễu $ba$.

---

## III. MẪU THIẾT KẾ DẠNG BÀI TOÁN SINH ĐỘNG (GENERATOR TEMPLATES)

### 1. Phép Tính Kết Hợp 2 Bước ($a + b - c$)
```typescript
interface ITwoStepTemplate {
  pattern: 'a + b - c' | 'a - b + c';
  maxTotal: 10 | 20 | 100;
  allowParentheses: false; // Lớp 1 chưa học dấu ngoặc, tính từ trái sang phải
}
```
* **Quy tắc an toàn:**
  * Bước 1: $a + b \le \text{maxTotal}$ hoặc $a - b \ge 0$.
  * Bước 2: Kết quả cuối cùng $\ge 0$.

### 2. Cấu Tạo Số (Chục và Đơn Vị)
```typescript
interface INumberCompositionTemplate {
  number: number; // 11 .. 99
  tens: number;   // Math.floor(number / 10)
  units: number;  // number % 10
  questionType: 'find_tens' | 'find_units' | 'compose_number';
}
// Ví dụ: "Số 35 gồm mấy chục và mấy đơn vị?" -> "3 chục và 5 đơn vị"
```

### 3. Thước Đo Lệch Không Đi Qua Vạch 0
```typescript
interface IOffsetRulerTemplate {
  startPos: number; // VD: 2 cm
  length: number;   // VD: 5 cm
  endPos: number;   // startPos + length = 7 cm
  // Câu hỏi: "Bút chì đặt từ vạch 2cm đến vạch 7cm. Hỏi bút chì dài bao nhiêu cm?"
  // Đáp án: 7 - 2 = 5 cm (Tránh học sinh chỉ nhìn vào số 7 ở đuôi thước)
}
```

---

## IV. BẢNG MÃ HÓA KỸ NĂNG VÀ CHUẨN ĐẦU RA (TAXONOMY CODING)

```
[MÃ_KHOA_HỌC]_[CHỦ_ĐỀ]_[SỐ_THỨ_TỰ]
```

* `NUM` = Numbers (Số học)
* `OP` = Operations (Phép tính)
* `GEO` = Geometry (Hình học)
* `MEA` = Measurement & Time (Đo lường & Thời gian)
* `WRD` = Word Problems (Toán có lời văn)
* `ADV` = Advanced Thinking (Tư duy nâng cao)

*Ví dụ:*
* `SKILL_NUM_01`: Đếm số 1 đến 5 (Level 1).
* `SKILL_OP_09`: Cộng 2 chữ số không nhớ (Level 3).
* `SKILL_ADV_01`: Phép tính kết hợp 2 bước (Level 4).
