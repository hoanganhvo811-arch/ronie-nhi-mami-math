# TÀI LIỆU KỸ THUẬT & HƯỚNG DẪN GAMEPLAY PHASE 4
## RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC

Tài liệu này tổng hợp toàn bộ kiến trúc **Mission Engine & Gameplay Mechanics** của Phase 4, kết nối sâu rộng giữa các tương tác toán học GDPT 2018 và thế giới trò chơi trực quan cho trẻ 6–7 tuổi.

---

## 1. Kiến Trúc Bộ Điều Phối Nhiệm Vụ Dùng Chung (Unified Mission Engine)

Tất cả 6 cơ chế gameplay đều vận hành trên một **State Machine trung tâm** duy nhất (`MissionEngine.ts`):
- **Trạng thái vòng đời (`MissionState`):**
  - `INTRO`: Lắng nghe lệnh giao nhiệm vụ và lời dặn dò của Nữ Hoàng Nhi Mami / NPC đồng hành.
  - `PLAYING`: Trẻ tương tác giải toán; mỗi câu trả lời tác động trực tiếp lên thế giới game theo thời gian thực.
  - `PAUSED`: Tạm dừng màn chơi, cho phép tiếp tục, chơi lại hoặc **quay về Lâu Đài Hoàng Gia** bất kỳ lúc nào.
  - `VICTORY`: Đạt 100% mục tiêu, pháo hoa ăn mừng, nhận sao (1-3 sao), EXP, vật phẩm hoàng gia.
  - `DEFEAT`: Đạt ngưỡng sai tối đa (`maxMistakes`), phản hồi êm ái, khích lệ trẻ thử lại, không tạo áp lực trừng phạt.
- **Cơ chế chống nhấp loạn (`isActionAnimating` lock):**
  Khóa tương tác trong 1.2s khi Ronie thực hiện động tác (bắn tơ, kéo dây, nhảy đá, vặn van), đảm bảo diễn hoạt và âm thanh mượt mà.

---

## 2. Danh Mục 6 Cơ Chế Gameplay Cốt Lõi

| Gameplay Type | Tên Nhiệm Vụ | Vùng Đất & Chủ Đề | Nhân Vật | Cơ Chế Trực Quan Hóa Khi Trả Lời Đúng / Sai |
|---|---|---|---|---|
| **`RESCUE_ROPE`** | Giải Cứu Cô Bé Khỏi Vực Sâu | Rừng Số Kỳ Diệu (Số học 0-10) | Ronie & Cô Bé Nơ Hồng | Ronie kéo sợi dây tơ nhện. Đúng: kéo cô bé dâng lên vách đá (+25m). Sai: sợi tơ trượt nhẹ xuống (-15m). |
| **`PUSH_BACK_MONSTER`** | Đẩy Lùi Quái Vật Bánh Quy | Thung Lũng Cộng Trừ (Phép tính) | Ronie & Quái Vật Bánh Quy | Đúng: Ronie tung chưởng tơ sao đẩy lùi quái vật ra xa (+25m). Sai: quái vật nhón chân tiến lại gần. |
| **`BRIDGE_CROSSING`** | Vượt Cầu Đá Kỳ Diệu Qua Sông | Cầu Vồng Hình Học (Hình khối) | Ronie & Thỏ Con Tinh Nghịch | Đúng: một viên đá ma thuật phát sáng nổi lên khỏi mặt nước, Ronie nhảy vọt qua. Sai: viên đá rung rinh nhẹ. |
| **`TREASURE_CHEST`** | Mở Rương Kho Báu Hoàng Gia | Hang Kho Báu (Phép tính) | Ronie & Rồng Con Hạt Dẻ | Rương báu cổ phong ấn bằng 4 ổ khóa ma thuật. Đúng: 1 ổ khóa nảy chốt bung mở kèm tia sáng. Đủ 4 khóa: rương mở bung kho báu hoàng gia. |
| **`SHUTDOWN_MACHINE`** | Tắt Cỗ Máy Kẹo Quá Tải | Thành Phố Thời Gian (Thời gian & cm) | Ronie & Phù Thủy Kẹo | Cỗ máy kẹo đang quá nhiệt (100%). Đúng: Ronie gạt cần xả van hạ nhiệt (-25%). Đạt 0%: cỗ máy làm mát an toàn, dừng xì khói. |
| **`MATH_RACING`** | Đua Xe Toán Học Siêu Tốc | Đấu Trường Hoàng Gia (Toán lời văn) | Ronie (Spider-Kart) & Robot (Speed-Bot) | Đường đua 2 làn. Đúng: xe nhện phun lửa phản lực tăng tốc vượt lên phía trước cán đích cờ ca-rô. |

---

## 3. Quy Trình Điều Hướng Khép Kín Về Lâu Đài (Castle Return Flow)

Theo tiêu chí đặc tả (Criterion 10: *"Khi nhiệm vụ kết thúc phải chuyển được về lâu đài"*):
1. **Từ Lâu Đài (`RoyalCastle`):** Nữ Hoàng Nhi Mami mở danh sách 6 Nhiệm Vụ Hoàng Gia -> Trẻ bấm **"Làm Ngay"** -> Mở thẳng `MissionArena`.
2. **Trong lúc chơi:** Bấm nút **"Tạm dừng"** -> Modal hiện các lựa chọn: Tiếp tục, Chơi lại, **Về Lâu Đài Hoàng Gia 🏰**.
3. **Khi kết thúc:**
   - **Chiến Thắng (`VICTORY`):** Nút chính nổi bật: **"Về Lâu Đài Hoàng Gia 🏰"** để báo công với Nữ hoàng Nhi Mami và nhận thêm quà tri thức.
   - **Thử Lại (`DEFEAT`):** Nút **"Về Lâu Đài Nghỉ Ngơi 🏰"** cho phép trẻ quay về an toàn mà không bị mắc kẹt.

---

## 4. Kiểm Thử & Thẩm Định Chất Lượng

- **Tổng số tệp test tự động:** 10/10 tệp passed.
- **Tổng số ca kiểm thử:** 66/66 unit & integration tests passed.
- **Biên dịch:** `tsc -b && vite build` hoàn thành với **0 lỗi**.
