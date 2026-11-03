# TÀI LIỆU KỸ THUẬT & KIẾN TRÚC PHASE 5
## REWARD SYSTEM, INVENTORY & CHARACTER PROGRESSION
### RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC

---

## 1. Tổng Quan Kiến Trúc Trao Thưởng (Reward Engine)

Hệ thống phần thưởng được thiết kế nhằm tạo động lực học tập dài hạn cho trẻ 6–7 tuổi, bảo đảm:
- **Kiểm soát chặt chẽ:** Không trao thưởng ngẫu nhiên bừa bãi. Mỗi phần thưởng gắn liền với điều kiện mở khóa sư phạm (hoàn thành nhiệm vụ, tích lũy số sao, đạt cấp độ Level).
- **Chống nhận trùng lặp (Idempotent Claim):** Áp dụng khóa Mutex chống click đúp (`isProcessing`) và bảng kiểm tra `rewardsHistory` trong Dexie theo cặp khóa kép `[profileId+missionId]`.
- **Nghi thức hoàng gia:**
  1. Ronie hoàn thành nhiệm vụ và trở về Lâu Đài Hoàng Gia.
  2. Nữ hoàng Nhi Mami âu yếm chào đón và cất lời khen ngợi.
  3. Rương quà xuất hiện lấp lánh; bé chạm để mở quà.
  4. Pháo hoa bung nở, vật phẩm xuất hiện với thẻ 3D Pastel, sao và EXP.
  5. Bé có thể bấm **"Cất Vào Phòng Đồ Chơi 🧸"** để ngắm hoặc đặt lên kệ.

---

## 2. Danh Mục 4 Nhóm Phần Thưởng Toàn Diện (`rewardCatalog.ts`)

| Nhóm | Mã Vật Phẩm | Tên Vật Phẩm | Biểu Tượng | Điều Kiện Mở Khóa |
|---|---|---|---|---|
| **A. Đồ Chơi** | `toy_teddy_bear` | Gấu Bông Học Đếm | 🧸 | Khởi đầu mặc định |
| | `toy_mini_robot` | Robot Bíp Bíp Tí Hon | 🤖 | Nhiệm vụ Đua Xe Toán Học |
| | `toy_race_car` | Xe Đua Tơ Nhện Siêu Tốc | 🏎️ | Đạt Cấp độ 2 |
| | `toy_princess_doll`| Búp Bê Công Chúa Nơ Hồng | 🎎 | Nhiệm vụ Giải Cứu Cô Bé |
| | `toy_dino` | Khủng Long Xanh Tí Nị | 🦖 | Nhiệm vụ Mở Rương Báu |
| | `toy_spider` | Đồ Chơi Nhện Nhí Phát Sáng | 🕷️ | Tích lũy 10 Ngôi Sao |
| **B. Kẹo** | `candy_lollipop` | Kẹo Mút Cầu Vồng 7 Màu | 🍭 | Mặc định khởi đầu |
| | `candy_gummy` | Kẹo Dẻo Gấu Hương Nho | 🍬 | Nhiệm vụ Vượt Cầu Đá |
| | `candy_chocolate` | Thanh Socola Hoàng Gia | 🍫 | Nhiệm vụ Tắt Cỗ Máy Kẹo |
| | `candy_cookie` | Bánh Quy Bơ Sao Vàng | 🍪 | Nhiệm vụ Quái Vật Bánh Quy |
| **C. Huy Hiệu** | `badge_bravery` | Huy Hiệu Dũng Cảm | 🛡️ | Đạt Cấp độ 3 |
| | `badge_super_intellect`| Huy Hiệu Siêu Trí Tuệ | 🧠 | Tích lũy 15 Ngôi Sao |
| | `badge_junior_mathematician`| Huy Hiệu Nhà Toán Học Nhí | 📐 | Đạt Cấp độ 5 |
| | `badge_rescuer` | Huy Hiệu Người Cứu Hộ | 🛟 | Nhiệm vụ Giải Cứu Cô Bé |
| | `badge_math_warrior` | Huy Hiệu Chiến Binh Toán Học | ⚔️ | Nhiệm vụ Quái Vật Bánh Quy |
| **D. Trang Phục**| `costume_star_cloak` | Áo Choàng Sao Vàng Hoàng Gia | 🌟 | Tích lũy 6 Ngôi Sao |
| | `costume_spider_mask` | Mặt Nạ Tơ Nhện Thần Bí | 🎭 | Mặc định trong tủ đồ |
| | `costume_speed_boots`| Giày Siêu Tốc Tia Chớp | 👟 | Nhiệm vụ Vượt Cầu Đá |
| | `costume_crown_hat` | Vương Miện Hoàng Gia Nhí | 👑 | Nhiệm vụ Mở Rương Báu |
| | `costume_super_spider`| Bộ Giáp Nhện Hoàng Kim | 🦸 | Đạt Cấp độ 6 |

---

## 3. Phòng Đồ Chơi Của Ronie (`ToyRoom.tsx`)

Không gian riêng tương tác của bé Ronie bao gồm:
1. **Kệ Đồ Chơi Gỗ (6 ngăn):**
   - Chạm vào đồ chơi trên kệ để nghe âm thanh phát âm và lời chúc dễ thương.
   - Chạm vào ô trống có dấu `(+)` để chọn đồ chơi từ kho đặt lên kệ.
   - Có nút gỡ đồ chơi cất về kho.
2. **Tủ Trang Phục:**
   - Quản lý các món đồ thời trang (Áo choàng, Mặt nạ, Giày, Mũ, Giáp).
   - Nút "Mặc Ngay" thay trang phục trực tiếp lên avatar Ronie ở trung tâm màn hình.
3. **Bảng Huy Hiệu (Cúp & Huy Hiệu):**
   - Trưng bày các huy hiệu đạt được với hiệu ứng ánh sáng.
4. **Lọ Kẹo Ngọt Ngào & Thống Kê:**
   - Lọ kẹo lưu trữ kẹo dẻo, kẹo mút, socola, bánh quy.
   - Bảng thống kê tổng nhiệm vụ, tổng câu đúng, tổng số sao.
5. **Trang Trí Phòng:**
   - Bảng chọn màu giấy dán tường pastel (Hồng, Xanh da trời, Bạc hà, Lavender, Vàng nắng).
   - Bảng chọn màu thảm trải sàn (Vàng kem, Hồng phấn, Xanh biển, Xanh lá).
   - Trạng thái được lưu tự động và phục hồi từ Dexie.

---

## 4. Hệ Thống Tiến Trình Nhân Vật (`ProgressionEngine.ts`)

- **10 Cấp Độ (Level 1 ➔ Level 10):**
  - Cấp 1 (0 XP): Hiệp Sĩ Tập Sự
  - Cấp 2 (100 XP): Bé Đếm Số Cừ Khôi
  - Cấp 3 (250 XP): Thợ Săn Phép Tính
  - Cấp 4 (450 XP): Dũng Sĩ Rừng Xanh
  - Cấp 5 (700 XP): Nhà Thám Hiểm Hình Học
  - Cấp 6 (1000 XP): Bậc Thầy Đo Lường
  - Cấp 7 (1400 XP): Tay Đua Siêu Tốc
  - Cấp 8 (1900 XP): Chiến Binh Toán Học
  - Cấp 9 (2500 XP): Đại Hiệp Sĩ Tri Thức
  - Cấp 10 (3200+ XP): Huyền Thoại Vương Quốc
- **Hệ Thống Thành Tích:** 8 thành tích mở khóa tự động khi đạt mốc câu đúng, đồ chơi, trang phục, hoặc nhiệm vụ.

---

## 5. Cơ Chế Thất Bại Không Trừng Phạt (Defeat Encouragement Flow)

- Khi thất bại ở nhiệm vụ:
  - Ronie trở về lâu đài gặp Nữ hoàng Nhi Mami.
  - Nữ hoàng cất lời động viên: *"Không sao đâu bé Ronie của mẹ! Thất bại là mẹ thành công, mẹ luôn ở bên con..."*
  - **Cam kết kỹ thuật:** 100% đồ chơi, kẹo, huy hiệu, trang phục và XP đã đạt đều được bảo lưu nguyên vẹn, không bao giờ bị xóa hay trừ điểm phạt.
  - Các nút hành động: "Thử Lại Nhiệm Vụ 🚀", "Chọn Nhiệm Vụ Dễ Hơn 🗺️", "Vào Phòng Đồ Chơi Thư Giãn 🧸".

---

## 6. Kiểm Thử & Nghiệm Thu Kỹ Thuật

- **Số tệp test tự động:** 11/11 passed (`rewardEngine.test.ts` có 14 bài kiểm tra chuyên sâu).
- **Tổng số ca test:** 80/80 passed (100%).
- **Biên dịch:** `tsc -b && vite build` hoàn thành với **0 lỗi**.
