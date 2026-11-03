# DANH MỤC TÀI NGUYÊN (ASSET CATALOG)
## RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC
*(Cập nhật hoàn thiện Phase 1: Visual World & User Interface)*

---

### 1. QUY CHUẨN THIẾT KẾ VÀ ĐỊNH DẠNG TÀI NGUYÊN

- **Phong Cách Mỹ Thuật:** 3D Cartoon / 2.5D Cute Fantasy, đường nét bo tròn mềm mại, ánh sáng ấm áp, thân thiện tuyệt đối với trẻ 6–7 tuổi.
- **Hệ Màu Pastel Định Hướng:**
  - **Hồng Pastel:** `#FCE7F3` / `#F472B6` (Sự ngọt ngào, dịu dàng)
  - **Xanh Da Trời Pastel:** `#E0F2FE` / `#38BDF8` (Bầu trời bao la, trí tưởng tượng)
  - **Xanh Lá Pastel:** `#DCFCE7` / `#4ADE80` (Mầm xanh tươi mới, rừng cây kỳ diệu)
  - **Vàng Kim Hoàng Gia:** `#FEF08A` / `#FBBF24` (Ánh sao tri thức, ngai vàng vinh quang)
  - **Tím Nhạt Oải Hương:** `#EDE9FE` / `#A855F7` (Áo dạ hội Nữ hoàng Nhi Mami, phép màu)
  - **Trắng Kem / Nắng Ấm:** `#FFFBEB` / `#FEF3C7` (Màu nền êm dịu bảo vệ mắt trẻ nhỏ)
- **Quy tắc Bản quyền:** 100% hình ảnh vector SVG và đồ họa hoạt họa đều là tài nguyên nguyên bản (Original IP), do đội ngũ thiết kế độc quyền. Không sử dụng hình ảnh có bản quyền của Spider-Man (Marvel) hay bất kỳ bên thứ ba nào.

---

### 2. DANH MỤC CÁC MÀN HÌNH GIAO DIỆN (UI SCREENS & LAYOUTS)

| Màn Hình | Tên Kỹ Thuật | Yếu Tố Đồ Họa Cốt Lõi | Cơ Chế Tương Tác Trực Quan |
| :--- | :--- | :--- | :--- |
| **A. Splash Screen** | `src/features/splash/SplashScreen.tsx` | - Logo game 3D chiseled rực rỡ.<br>- Hoạt ảnh Ronie đu tơ nhện hạ cánh.<br>- Nữ hoàng Nhi Mami chào đón.<br>- Nút BẮT ĐẦU Jelly Button 3D. | Chạm nút bắt đầu có hiệu ứng pháo hoa và âm thanh hân hoan, chuyển mềm sang Menu. |
| **B. Main Menu** | `src/features/main-menu/MainMenu.tsx` | - Lâu đài 2.5D pastel ở trung tâm.<br>- Ronie đứng nổi bật vẫy chào.<br>- 5 Nút Lớn (Phiêu lưu, Phòng đồ chơi, Hồ sơ, Góc học toán, Cài đặt).<br>- Nút vào Lâu Đài Hoàng Gia. | Bố cục responsive, nút bấm lớn touch target >= 64px, phản hồi âm thanh lập tức. |
| **C. Royal Castle** | `src/features/castle/RoyalCastle.tsx` | - Ngai vàng hoàng kim rực rỡ.<br>- Nữ hoàng Nhi Mami với vương trượng.<br>- Khu vực giao nhiệm vụ hàng ngày.<br>- Khu vực mở hộp quà trao thưởng. | Cho phép bé nhận nhiệm vụ trực tiếp hoặc nhận thưởng cúp vàng, áo choàng. |
| **D. World Map** | `src/game/scenes/WorldMapScene.ts` | - Bản đồ 2.5D trên Phaser 3.<br>- Con đường tơ sao vàng uốn lượn.<br>- 5 Vùng Đất Toán Học với 4 trạng thái.<br>- Token Ronie chạy mượt mà. | Chạm vùng đất làm Ronie chạy tới và mở bảng chọn nhiệm vụ tương ứng. |
| **E. Mission Selection** | `src/features/missions/MissionSelection.tsx` | - Các thẻ nhiệm vụ lớn (Large Cards).<br>- Huy hiệu độ khó (Dễ, Vừa, Thử thách).<br>- Trạng thái (Chưa làm, Đang làm, 3 Sao).<br>- Nút BẮT ĐẦU NHIỆM VỤ rõ ràng. | Bấm vào mở ngay Đấu trường Toán học giải đố tương tác. |
| **F. Toy Room** | `src/features/toy-room/ToyRoom.tsx` | - Gương soi và Ronie thử đồ.<br>- Tủ 4 bộ trang phục nhện nhí.<br>- Kệ 4 món đồ chơi biết phát âm.<br>- Tủ trưng bày cúp & huân chương. | Bé chạm vào đồ chơi để nghe tiếng đọc toán, đổi trang phục trực tiếp cho Ronie. |
| **G. Profile** | `src/features/profile/ProfileScreen.tsx` | - Cấp độ Hiệp sĩ Nhí Cấp 3.<br>- Thanh EXP lên cấp.<br>- 4 Thẻ chỉ số (Sao, Nhiệm vụ, Huy hiệu, Ngày học).<br>- Bảng kỹ năng toán thành thạo. | Giúp trẻ và phụ huynh tự hào về hành trình tiến bộ môn Toán Lớp 1. |

---

### 3. DANH MỤC 5 VÙNG ĐẤT BẢN ĐỒ THẾ GIỚI (WORLD MAP 5 ZONES)

| STT | Tên Vùng Đất | Mã Định Danh | Màu Sắc Chủ Đạo | Icon | 4 Trạng Thái Hiển Thị | Chủ Đề Toán Học GDPT 2018 |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **1** | **Rừng Số Kỳ Diệu** | `zone_1_number_forest` | Xanh ngọc bích (`#10B981`) | 🌲 | • Locked: Ổ khóa xám<br>• Unlocked: Viền xanh lá<br>• In-Progress: Sao vàng<br>• Completed: Vương miện | Nhận biết chữ số, đếm số lượng quả 0–10, so sánh lớn bé bằng. |
| **2** | **Thung Lũng Cộng Trừ** | `zone_2_plus_minus_valley` | Vàng hổ phách (`#F59E0B`) | 🚂 | • Locked: Ổ khóa xám<br>• Unlocked: Viền cam<br>• In-Progress: Sao vàng<br>• Completed: Vương miện | Đoàn tàu gộp số (phép cộng) và bớt số (phép trừ) trong phạm vi 10 và 20. |
| **3** | **Cầu Vồng Hình Học** | `zone_3_geometry_rainbow` | Hồng kẹo ngọt (`#EC4899`) | 🌈 | • Locked: Ổ khóa xám<br>• Unlocked: Viền hồng<br>• In-Progress: Sao vàng<br>• Completed: Vương miện | Hình vuông, tròn, tam giác, chữ nhật, khối lập phương & ghép tranh sáng tạo. |
| **4** | **Hang Kho Báu** | `zone_4_treasure_cave` | Tím thạch anh (`#8B5CF6`) | 💎 | • Locked: Ổ khóa xám<br>• Unlocked: Viền tím<br>• In-Progress: Sao vàng<br>• Completed: Vương miện | Số tròn chục tới 100, cộng trừ tròn chục, phép tính không nhớ tới 100. |
| **5** | **Thành Phố Thời Gian** | `zone_5_time_city` | Xanh thiên thanh (`#0284C7`) | ⏰ | • Locked: Ổ khóa xám<br>• Unlocked: Viền xanh<br>• In-Progress: Sao vàng<br>• Completed: Vương miện | Thước đo xăng-ti-mét (cm), xem đồng hồ kim đúng giờ, các ngày trong tuần. |

---

### 4. TỦ TRANG PHỤC CỦA BÉ RONIE (WARDROBE COLLECTION)

| Mã Trang Phục | Tên Bộ Đồ | Gam Màu | Biểu Tượng | Điều Kiện Mở Khóa |
| :--- | :--- | :--- | :---: | :--- |
| `costume_classic` | **Bộ Nhện Đỏ Ruby Khám Phá** | Đỏ Ruby & Xanh Biển (#E11D48) | 🕷️ | Mặc định ban đầu cho mọi người chơi |
| `costume_emerald` | **Bộ Nhện Ngọc Bích Rừng Xanh** | Xanh Lá Pastel (#10B981) | 🌿 | Vượt qua Vùng 1: Rừng Số Kỳ Diệu |
| `costume_gold` | **Áo Choàng Sao Vàng Hoàng Gia** | Vàng Kim Quý Phái (#F59E0B) | 👑 | Nữ hoàng Nhi Mami trao thưởng tại Lâu Đài |
| `costume_candy` | **Bộ Nhện Cầu Vồng Kẹo Ngọt** | Hồng & Tím Pastel (#EC4899) | 🍭 | Tích lũy đủ 10 Ngôi Sao Tri Thức |

---

### 5. KỆ ĐỒ CHƠI TOÁN HỌC TƯƠNG TÁC (INTERACTIVE TOY SHELF)

| Món Đồ Chơi | Biểu Tượng | Mạch Kiến Thức | Lời Thoại Âm Thanh Khi Chạm |
| :--- | :---: | :--- | :--- |
| **Gấu Bông Học Đếm** | 🧸 | Đếm số 1 đến 10 | *"Một, hai, ba, bốn, năm! Chúc bé Ronie học giỏi toán nhé!"* |
| **Xe Lửa Khối Gỗ** | 🚂 | Hình khối lập phương & chữ nhật | *"Tu tu xình xịch! Đoàn tàu chở các khối lập phương và khối hộp chữ nhật!"* |
| **Cán Cân Mini** | ⚖️ | Cân bằng phép tính cộng trừ | *"Bên trái bằng bên phải rồi, cán cân thật thăng bằng!"* |
| **Đồng Hồ Quả Lắc Cún Con** | ⏰ | Xem giờ đúng | *"Tích tắc tích tắc! Kim ngắn chỉ giờ, kim dài chỉ phút!"* |

---

### 6. CÚP & BỘ HUY HIỆU HOÀNG GIA (TROPHIES & BADGES)

- ⭐ **Huy Hiệu Khởi Đầu May Mắn:** Bước chân đầu tiên vào Vương Quốc.
- 🖐️ **Bàn Tay Vàng Đếm Số:** Đếm chính xác 5 bài toán không cần gợi ý.
- 🚂 **Bậc Thầy Xe Lửa Phép Cộng:** Chở đủ 10 quả táo đến Thung Lũng.
- 🌈 **Nhà Kiến Trúc Cầu Vồng:** Ghép tranh hình học chính xác 100%.
- 🕰️ **Hiệp Sĩ Thời Gian Hoàng Gia:** Xem đúng 5 đồng hồ kim liên tiếp.
- 👑 **Đại Huân Chương Trăm Điểm:** Chinh phục trọn vẹn 5 Vùng Đất Toán Học.

---

### 7. DANH MỤC ÂM THANH & HIỆU ỨNG (AUDIO & VOICE ENGINE)

- **`playTap()`:** Tiếng *Bloop!* mềm mại khi chạm các nút lớn.
- **`playCorrect()`:** Hợp âm Đô Trưởng C5-E5-G5-C6 vang lên lấp lánh khi trả lời đúng.
- **`playTryAgain()`:** Âm rung nhẹ 240Hz êm dịu, không phạt, động viên bé thử lại.
- **`playWebShoot()`:** Tiếng tơ nhện bay vút êm tai khi Ronie đu dây hoặc di chuyển.
- **`playCelebration()`:** Khúc nhạc kèn đồng mừng chiến thắng (Fanfare) C5-E5-G5-C6-E6 khi nhận thưởng.
- **`speakVietnamese(text)`:** Tích hợp bộ đọc giọng nói tiếng Việt chuẩn, tốc độ 0.9 phù hợp với trẻ lớp 1.
