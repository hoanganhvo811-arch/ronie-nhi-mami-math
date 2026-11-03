# TÀI LIỆU THIẾT KẾ & ĐẶC TẢ KỸ THUẬT: PHASE 8
## WORLD PROGRESSION & ADVENTURE CONTENT (TIẾN TRÌNH THẾ GIỚI & CỐT TRUYỆN PHIÊU LƯU)
### DỰ ÁN: RONIE & NHI MAMI – VƯƠNG QUỐC TOÁN HỌC

> **Kiến trúc sư trưởng:** Senior Educational Game Architect & Lead Designer  
> **Mục tiêu:** Chuyển hóa các bài toán và nhiệm vụ riêng lẻ thành một cuộc phiêu lưu sử thi dài hạn có cốt truyện lôi cuốn, thế giới quan kỳ ảo, cơ chế mở khóa linh hoạt và sự kiện bất ngờ giàu cảm xúc cho trẻ lớp 1 (6-7 tuổi).

---

## 1. HỆ THỐNG 6 VÙNG ĐẤT KHÁM PHÁ (6 ADVENTURE REGIONS)

Thế giới Vương Quốc Toán Học được phân định thành 6 vùng đất độc đáo. Mỗi vùng sở hữu:
- **Background & Màu sắc đặc trưng**
- **Nhân vật đồng hành & dẫn đường riêng**
- **Chuỗi nhiệm vụ theo chuẩn GDPT 2018**
- **Chủ đề toán học chuyên biệt**
- **Phần thưởng độc quyền (Trang phục / Đồ chơi / Huy hiệu / Kẹo)**
- **Cốt truyện ngắn (Lore)**

| Vùng | Tên Vùng Đất | Biểu tượng & Gam màu | Nhân vật chính | Chủ đề Toán học Lớp 1 | Phần thưởng độc quyền | Cốt truyện ngắn |
|:---:|:---|:---|:---|:---|:---|:---|
| 1 | **Lâu Đài Nhi Mami** | 👑 Hồng Pastel & Vàng Kim | Nữ Hoàng Nhi Mami | Nhận biết mặt số & Đếm 1 - 5 | Vương Miện Vàng Hoàng Gia (`costume_crown`) | Kinh đô tráng lệ nơi Nữ hoàng Nhi Mami trị vì và truyền cảm hứng phiêu lưu cho Ronie. |
| 2 | **Rừng Số Kỳ Diệu** | 🌲 Xanh Ngọc Lục Bảo | Thỏ Con & Bác Sóc Nâu | Đếm số lượng 1 - 10 & So sánh (> < =) | Gấu Bông Học Đếm (`toy_teddy_bear`) | Khu rừng nấm khổng lồ phát sáng nơi các bạn thú nhỏ đang cần Ronie đếm giúp hạt dẻ và dâu tây. |
| 3 | **Thung Lũng Cộng Trừ** | 🚂 Vàng Hướng Dương & Cam | Bác Gấu Nâu Trưởng Tàu | Phép cộng & Phép trừ trong phạm vi 10, 20 | Siêu Xe Ronie Tơ Đỏ (`toy_race_car`) | Thung lũng với những đoàn tàu hoa quả chở quả chín và chiếc cân thăng bằng thần kỳ. |
| 4 | **Cầu Vồng Hình Học** | 🌈 Hồng Kẹo & Tím Mộng Mơ | Phù Thủy Kẹo Mật Ong | Hình phẳng (vuông, tròn, tam giác, chữ nhật) & Khối lập phương | Kẹo Mút Cầu Vồng 7 Màu (`candy_lollipop`) | Chiếc cầu vồng ma thuật bị nứt một nhịp đá, cần Ronie ghép các viên gạch hình học sắc màu. |
| 5 | **Hang Kho Báu** | 💎 Thạch Anh Tím & Ánh Vàng | Rồng Con Đuôi Lửa | Số tròn chục tới 100 & Phép tính không nhớ | Robot Bíp Bíp Thông Minh (`toy_smart_robot`) | Hang động sâu chứa các rương vàng hoàng kim và mật mã số tròn chục do chú rồng con canh giữ. |
| 6 | **Thành Phố Thời Gian** | ⏰ Xanh Thiên Thanh & Cyan | Robot Bíp Bíp & Đồng Hồ Tháp | Thước đo xăng-ti-mét (cm), Xem đồng hồ kim & Ngày trong tuần | Áo Choàng Hiệp Sĩ Tơ Sao (`costume_spider_cloak`) | Thành phố kỳ ảo của tương lai với những cỗ máy bánh răng và nhịp sống chuẩn xác từng giây phút. |

---

## 2. CƠ CHẾ MỞ KHÓA VÙNG ĐẤT LINH HOẠT (FLEXIBLE UNLOCK)

> [!IMPORTANT]
> **Triết lý chống nản chí (Zero Frustration Policy):**  
> Trẻ 6 tuổi có tốc độ tiếp thu khác nhau ở từng mạch kiến thức. Hệ thống **tuyệt đối không ép buộc bé phải làm toàn bộ nhiệm vụ khó** mới được đi tiếp sang vùng mới.

Vùng mới được mở khóa khi bé đạt **MỘT TRONG CÁC ĐIỀU KIỆN SAU**:
1. **Thu thập đủ số sao tích lũy:**
   - Vùng 1: 0 sao (Mở sẵn từ đầu)
   - Vùng 2: 2 sao
   - Vùng 3: 5 sao
   - Vùng 4: 8 sao
   - Vùng 5: 11 sao
   - Vùng 6: 14 sao
2. **HOẶC Hoàn thành ít nhất 1 nhiệm vụ cơ bản (`isBasic = true`)** tại vùng đất liền trước.
3. **HOẶC Sở hữu Huy Hiệu Danh Dự** tương ứng (ví dụ Huy Hiệu Dũng Cảm, Siêu Trí Tuệ).

---

## 3. CỐT TRUYỆN 6 CHƯƠNG LIỀN MẠCH (6-CHAPTER NARRATIVE)

Cuộc phiêu lưu được kết nối mạch lạc thành 6 chương sử thi thiếu nhi:

```
[ Chương 1: Lời Gọi Từ Nữ Hoàng ]
               │
               ▼
[ Chương 2: Giải Cứu Khu Rừng (Thỏ Trắng & Sóc Nâu) ]
               │
               ▼
[ Chương 3: Quái Vật Bánh Quy (Đẩy lùi kẻ trộm bánh) ]
               │
               ▼
[ Chương 4: Bí Mật Hang Kho Báu (Rồng Con Thạch Anh) ]
               │
               ▼
[ Chương 5: Thành Phố Kẹo & Thời Gian (Cỗ máy bánh răng) ]
               │
               ▼
[ Chương 6: Đại Hội Siêu Anh Hùng Toán Học (Đại Vinh Danh) ]
```

Mỗi chương được thiết kế trọn vẹn theo cấu trúc:
1. **Opening Dialogue:** Đoạn hội thoại mở màn có lồng tiếng diễn cảm (Queen Nhi Mami hoặc nhân vật đại diện).
2. **Mission Sequence:** Chuỗi 2-3 nhiệm vụ cốt truyện bám sát chủ đề toán học.
3. **Boss / Final Challenge:** Cửa ải cao trào thử thách trí tuệ (Ví dụ: Cá sấu giữ cầu, Quái vật bánh quy khổng lồ, Rương báu hoàng kim).
4. **Reward Item:** Phần thưởng vinh danh (Huy hiệu, đồ chơi, trang phục).
5. **Ending Scene:** Hoạt cảnh ăn mừng kết thúc chương trước khi mở tiếp chương sau.

---

## 4. SỰ KIỆN NGẪU NHIÊN BẤT NGỜ (WORLD RANDOM EVENTS)

Khi bé di chuyển trên bản đồ hoặc bấm vào nút **"🎲 Sự Kiện Bất Ngờ"**, hệ thống kích hoạt ngẫu nhiên 1 trong 5 tình huống bất ngờ:
1. **`help_friend` (Giúp bạn nhỏ):** Cô bé nơ hồng làm rơi giỏ dâu tây, Ronie tính nhẩm giúp và nhận được một quả dâu thơm ngọt.
2. **`secret_item` (Vật phẩm bí mật):** Chiếc rương gỗ ẩn sau bụi cỏ hoa ven đường trao tặng sao vàng may mắn.
3. **`surprise_gift` (Quà bất ngờ):** Bồ câu hoàng gia mang kẹo dẻo từ Nữ hoàng Nhi Mami tới tiếp thêm năng lượng.
4. **`funny_npc` (Nhân vật hài hước):** Quái vật bánh quy nhào lộn trượt chân ngã vào đống bột mì làm trò hề ngộ nghĩnh.
5. **`quick_challenge` (Câu đố thần tốc):** Bác Gấu đố 1 câu tính nhẩm nhanh, trả lời đúng nhận ngay sao thưởng nóng.

> [!TIP]
> **Nguyên tắc an toàn dữ liệu:** Toàn bộ các sự kiện ngẫu nhiên mang tính chất thưởng thêm và tạo tiếng cười. Tuyệt đối không làm mất dữ liệu, không trừ điểm hay phạt bé nếu bé trả lời chưa đúng.

---

## 5. NHIỆM VỤ HÀNG NGÀY DỊU DÀNG (GENTLE DAILY QUEST)

- Mỗi ngày ứng dụng tự động chọn 1 thử thách nhỏ, ngọt ngào (ví dụ: *"Hôm nay bé hãy đếm 5 quả dâu cùng bạn Thỏ nhé!"*).
- **Tuyệt đối KHÔNG sử dụng chuỗi streak trừng phạt:** Nếu bé hoặc gia đình bận nghỉ ngơi vài ngày, không có bất kỳ thông báo đe dọa hay trừ điểm streak nào. Trò chơi luôn chào đón bé quay lại với niềm vui và tình thương.

---

## 6. KHẢ NĂNG MỞ RỘNG KIẾN TRÚC (EXTENSIBILITY)

- Lớp `AdventureEngine` hỗ trợ phương thức `registerCustomRegion(newRegion)` cho phép bổ sung thêm các vùng đất mới (Vùng 7, Vùng 8...) trong tương lai mà **hoàn toàn không cần sửa đổi mã nguồn cốt lõi của `MissionEngine`**.
- Đảm bảo tính độc lập và khả năng bảo trì bền vững của dự án.

---

## 7. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & BẢO ĐẢM CHẤT LƯỢNG

- **Vitest Suites:** **113/113 tests Passed (14/14 test suites)**.
  - `src/test/adventurePhase8.test.ts`: 13 tests chuyên sâu kiểm tra 6 vùng đất, cơ chế mở khóa linh hoạt, 6 chương cốt truyện, sự kiện ngẫu nhiên, nhiệm vụ hàng ngày và khả năng mở rộng kiến trúc.
  - Các test suite trước (Phase 0 đến Phase 7) đều duy trì trạng thái xanh 100%.
- **Vite Production Build:** `npm.cmd run build` hoàn thành trong 1.64s không lỗi type hay module.
