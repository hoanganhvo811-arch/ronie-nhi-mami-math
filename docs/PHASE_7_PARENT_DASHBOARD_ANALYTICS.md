# TÀI LIỆU THIẾT KẾ & ĐẶC TẢ KỸ THUẬT: PHASE 7
## PARENT DASHBOARD & LEARNING ANALYTICS (BẢNG QUẢN LÝ PHỤ HUYNH & PHÂN TÍCH HỌC TẬP)
### DỰ ÁN: RONIE & NHI MAMI – VƯƠNG QUỐC TOÁN HỌC

> **Đối tượng người dùng:** Phụ huynh & Giáo viên đồng hành cùng trẻ lớp 1 (6-7 tuổi).  
> **Nguyên tắc sư phạm cốt lõi:**  
> 1. **100% Ngôn ngữ tích cực:** Tuyệt đối không gắn nhãn tiêu cực ("kém", "yếu", "dốt"). Thay vào đó là ngôn ngữ khích lệ: *"Bé Ronie đang rèn luyện thêm phép trừ trong phạm vi 10 nhé!"*.  
> 2. **Offline-First & Bảo vệ quyền riêng tư:** Toàn bộ dữ liệu được lưu trữ cục bộ trên máy qua Dexie (IndexedDB), không yêu cầu tài khoản đám mây, không thu thập dữ liệu cá nhân.  
> 3. **An toàn cảm xúc & Thời gian chơi dịu dàng:** Khi hết giờ, không khóa máy đột ngột giữa trận, cho phép bé hoàn thành màn chơi rồi mới nhắc nhở nghỉ ngơi êm dịu.

---

## 1. CỔNG BẢO VỆ PHỤ HUYNH (PARENT GATE)

Để đảm bảo trẻ 6 tuổi không vô tình truy cập nhầm vào khu vực cài đặt của người lớn, hệ thống tích hợp Cổng Bảo Vệ (`ParentGate`) với 2 cơ chế xác thực linh hoạt:

```
[ Nút Phụ Huynh (Shield / Settings) ]
                 │
                 ▼
       ┌──────────────────┐
       │   ParentGate     │
       └────────┬─────────┘
                │
     ┌──────────┴──────────┐
     ▼                     ▼
[ Chế độ Phép Tính ]   [ Chế độ Giữ 3 Giây ]
Phép tính ngẫu nhiên   Nhấn & giữ liên tục 3s
2 chữ số (VD: 34 + 19) Vòng tròn tiến trình trực quan
```

- **Phép tính 2 chữ số ngẫu nhiên:** Trẻ lớp 1 chưa học phép cộng có nhớ 2 chữ số lớn, người lớn nhẩm nhanh trong 2 giây. Có nút làm mới câu hỏi khác.
- **Nhấn và giữ 3 giây:** Trực quan với vòng tròn tiến trình SVG, phụ huynh có thể mở nhanh trên điện thoại/máy tính bảng bằng một ngón tay.

---

## 2. BẢNG ĐIỀU KHIỂN ĐA NĂNG (DASHBOARD TABS)

Bảng điều khiển được phân tách khoa học thành 5 thẻ chức năng (Tabs):

### A. Tab 1: Tổng Quan (Overview & Time Filtering)
- **Bộ lọc thời gian 4 mốc:**
  - `Hôm nay`: Theo dõi tiến trình trong ngày hiện tại (từ 00:00).
  - `7 ngày qua`: Đánh giá thói quen học tập trong tuần.
  - `30 ngày qua`: Đánh giá sự tiến bộ theo tháng.
  - `Tất cả`: Toàn bộ lịch sử từ khi cài game.
- **6 Thẻ chỉ số tổng quan (Key Metrics):**
  1. *Thời gian học tập:* Tổng số phút học toán tích lũy.
  2. *Nhiệm vụ hoàn thành:* Số màn chơi và thử thách đã vượt qua.
  3. *Tổng số câu hỏi:* Số lượng câu hỏi bé đã tiếp cận.
  4. *Số câu đúng:* Tỉ số câu làm đúng trên tổng số câu.
  5. *Tỷ lệ chính xác (%):* Tỷ lệ trả lời đúng thực tế.
  6. *Tiến độ chuẩn GDPT 2018:* Tỷ lệ hoàn thành các màn chơi của 5 vùng đất vương quốc.
- **Thống kê 10 mạch chủ đề:** Biểu đồ thanh tiến độ màu sắc phân định trạng thái: Xanh ngọc (Thành thạo >= 80%), Vàng hổ phách (Đang luyện tập >= 60%), Đỏ nhạt (Cần thêm thời gian).

### B. Tab 2: Năng Lực & Nhận Định Sư Phạm (Learning Diagnostics)
- **Thế mạnh nổi trội của bé:** Nhận diện các chủ đề có độ chính xác cao nhất (>= 75%) và khen ngợi năng khiếu quan sát, tư duy logic của bé.
- **Chủ đề đang rèn luyện thêm:** Phân tích những dạng bài bé còn bỡ ngỡ, đưa ra lời khuyên âu yếm: *"Bé Ronie đang rèn luyện thêm về Đo độ dài bằng thước xăng-ti-mét để ngày càng tự tin hơn nhé!"*.
- **Tốc độ phản xạ:** Đo đạc thời gian trung bình (giây/câu), đánh giá thói quen quan sát cẩn thận hay phản xạ nhanh nhẹn.
- **Thói quen sử dụng gợi ý:** Đếm số lần nghe lời khuyên của Nữ Hoàng, ghi nhận sự chủ động tự học.
- **Xu hướng phát triển:** Đối chiếu tỷ lệ đúng giữa các phiên học cũ và mới để ghi nhận sự tiến bộ vượt bậc.

### C. Tab 3: Quản Lý Thời Gian Chơi (Screen Time & Health)
- **Cấu hình giới hạn:** Cho phép chọn 15, 20, 30, 45 phút/ngày, hoặc tắt giới hạn.
- **Đồng hồ thời gian thực:** Hiển thị số phút bé đã chơi trong ngày hôm nay.
- **Cơ chế Gentle Time's Up:**
  - Không khóa máy gián đoạn giữa câu hỏi hoặc giữa pha hành động bắn tơ nhện.
  - Chờ bé hoàn tất màn chơi hiện tại.
  - Khi bé quay về Lâu đài hoặc Menu, hiển thị `GentleTimeNoticeModal` với Nữ hoàng Nhi Mami vỗ về: *"Bé yêu ơi, đôi mắt sáng của hiệp sĩ Ronie hôm nay đã chăm chỉ học toán rồi! Chúng mình cùng tạm nghỉ để uống nước, tập thể dục và bảo vệ mắt nhé!"*.
  - Cho phép cha mẹ cấp thêm 10 phút nếu cần thiết qua cổng xác thực.

### D. Tab 4: Quản Lý Nội Dung & Mức Độ Thử Thách (Content Configuration)
- **Bật/tắt 10 mạch chủ đề:** Cha mẹ có thể tùy chỉnh chỉ bật các chủ đề con đang học ở trường (ví dụ tuần này chỉ bật Phép cộng và Phép trừ trong phạm vi 10).
- **Chọn độ khó:**
  - *Dễ Dàng:* Số nhỏ, nhiều hình ảnh trực quan, gợi ý xuất hiện sớm.
  - *Tiêu Chuẩn:* Bám sát sách giáo khoa GDPT 2018.
  - *Thử Thách:* Tăng cường câu đố tư duy so sánh và bài toán có lời văn.
- **Số câu hỏi mỗi nhiệm vụ:** Cho phép chọn 3, 5, 8 hoặc 10 câu phù hợp với sự tập trung của bé.

### E. Tab 5: Sao Lưu & Khôi Phục Dữ Liệu (Local Backup & Restore)
- **Xuất sao lưu (Export JSON):** Đóng gói toàn bộ cơ sở dữ liệu `profiles`, `progress`, `mathSessions`, `inventory`, `rewardsHistory`, `parentSettings` thành file JSON chuẩn có gắn nhãn thời gian và `appId: 'ronie-nhi-mami-math'`.
- **Khôi phục (Import JSON):** Cho phép chọn file `.json` từ máy tính bảng hoặc máy tính. Kiểm tra tính hợp lệ của schema, hiện hộp thoại xác nhận trước khi ghi đè để bảo vệ dữ liệu phụ huynh.
- **Đặt lại ban đầu (Reset Profile):** Hộp thoại xác nhận 2 bước cho phép phụ huynh đưa trò chơi về trạng thái mới cài đặt ban đầu.

---

## 3. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & ĐÓNG GÓI

- **Kiểm thử Unit & Integration:** Đạt **100/100 tests passed trên 13 test suites** (bao gồm `src/test/parentDashboardPhase7.test.ts`).
- **Production Build:** `npm.cmd run build` biên dịch thành công 100% không cảnh báo lỗi type.
