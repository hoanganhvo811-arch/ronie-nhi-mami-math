# DANH MỤC TÀI NGUYÊN (ASSET CATALOG)
## RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC
*(Cập nhật hoàn thiện Phase 2: Character, Animation & Dialogue System)*

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

---

### 8. NHÂN VẬT GỐC RONIE & 12 TRẠNG THÁI BIỂU CẢM (ORIGINAL CHIBI SPIDER-KID)

- **Đặc trưng thiết kế IP nguyên bản (Original IP):**
  - Tỉ lệ chibi đáng yêu (đầu to, thân nhỏ, mắt to biểu cảm).
  - Gam màu chủ đạo: Đỏ Ruby (`#E11D48`) và Xanh Navy Hoàng Gia (`#1E3A8A`).
  - Biểu tượng ngực áo độc quyền: Ngôi sao tơ nhện cách điệu 6 cánh màu vàng kim (`#F59E0B`), tuyệt đối không mô phỏng mạng nhện hoặc logo Spider-Man Marvel.
  - Phụ kiện: Găng tay và ủng tơ sao công nghệ nhí.

| STT | Trạng Thái (`RonieAnimationState`) | Tên Gọi & Diễn Hoạt | Chi Tiết Biểu Cảm & Hiệu Ứng Trực Quan | Tình Huống Kích Hoạt |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `idle` | Đứng nghỉ / Nhún nhảy | Mắt chớp nhẹ, người nhún nhẩy mềm mại theo nhịp thở. | Đang chờ trên menu, bản đồ hoặc câu hỏi. |
| **2** | `walk` | Đi bộ thong thả | Nghiêng người qua lại nhẹ nhàng, chân bước đều. | Di chuyển thong thả giữa các cứ điểm. |
| **3** | `run` | Chạy nhanh năng động | Người hơi chúi về phía trước, bước chân gấp gáp. | Chạy nhanh tới vùng đất mới hoặc đuổi bắt. |
| **4** | `jump` | Nhảy vọt lên cao | Bật cao lên không trung, tơ sao lấp lánh nâng đỡ. | Nhảy qua chướng ngại vật, vào màn chơi. |
| **5** | `celebrate` | Nhảy múa vui mừng | Hai tay giơ cao, ngôi sao nhấp nháy, nụ cười rạng rỡ. | Khi trả lời đúng bài toán hoặc hoàn thành chặng. |
| **6** | `sad` | Buồn bã / Bối rối | Đôi mắt to tròn rưng rưng, vai rũ xuống nhẹ nhàng. | Khi chọn nhầm đáp án (thể hiện sự tiếc nuối dễ thương). |
| **7** | `surprised` | Ngạc nhiên / Thích thú | Mắt mở to tròn xoe, miệng chữ O, dấu chấm than `!` trên đầu. | Khi phát hiện rương kho báu hoặc câu đố bất ngờ. |
| **8** | `attack` | Đấm tơ sao năng lượng | Tung nắm đấm tơ sao lấp lánh về phía trước. | Giải phóng tảng đá chắn đường, tương tác chướng ngại vật. |
| **9** | `web_shoot` | Bắn sợi tơ sao | Tay phóng sợi tơ sao phát sáng kết nối với mục tiêu. | Đu dây qua vực, kéo vật phẩm về phía mình. |
| **10** | `pull` | Kéo tơ gồng sức | Chân bám trụ chắc chắn, hai tay kéo căng sợi tơ sao. | Kéo rương kho báu, kéo cần gạt cây cầu toán học. |
| **11** | `victory` | Chiến thắng rạng rỡ | Đứng trên bục vinh quang, vung tay hân hoan, pháo hoa nổ tung. | Vượt qua toàn bộ nhiệm vụ hoặc nhận cúp vàng. |
| **12** | `defeat` | Thất bại tạm thời / Cố gắng | Ngồi bệt gãi đầu cười trừ, bóng đèn ý tưởng lóe sáng để thử lại. | Hết lượt giải mà chưa đúng, chuẩn bị thử lại lần sau. |

---

### 9. NỮ HOÀNG NHI MAMI & 8 TRẠNG THÁI HOÀNG GIA (QUEEN NHI MAMI)

- **Đặc trưng thiết kế IP nguyên bản (Original IP):**
  - Phong cách công chúa / nữ hoàng hoạt hình Disney-like ấm áp, dịu dàng, thông thái.
  - Trang phục: Váy dạ hội hồng pastel (`#F472B6`, `#FBCFE8`) xếp tầng bồng bềnh lấp lánh sao.
  - Phụ kiện: Vương miện ngọc hoàng gia vàng rực (`#FBBF24`), quyền trượng ngôi sao trí tuệ.
  - Giọng điệu ấm áp, khích lệ như một người mẹ yêu quý luôn đồng hành cùng con trẻ.

| STT | Trạng Thái (`QueenAnimationState`) | Tên Gọi & Diễn Hoạt | Chi Tiết Biểu Cảm & Hiệu Ứng Trực Quan | Tình Huống Kích Hoạt |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `idle` | Hoàng gia thanh lịch | Đứng nghiêng nhẹ, nụ cười hiền hậu, vạt váy đung đưa. | Đứng trên ngai vàng lâu đài hoàng gia. |
| **2** | `greeting` | Chào đón nồng nhiệt | Cầm quyền trượng vẫy tay chào bé, ánh sáng lấp lánh nở rộ. | Khi bé bước vào Lâu Đài hoặc mở game mỗi ngày. |
| **3** | `talking` | Đang ân cần chỉ bảo | Miệng cử động nhịp nhàng, tay ra dấu giải thích nhẹ nhàng. | Khi đọc hướng dẫn hoặc giao câu hỏi nhiệm vụ. |
| **4** | `laughing` | Cười tươi rạng rỡ | Mắt híp cười duyên dáng, cánh hoa và tim hồng bay xung quanh. | Khi Ronie trả lời câu hỏi hóm hỉnh, vui vẻ. |
| **5** | `surprised` | Trầm trồ kinh ngạc | Hai tay ôm ngực kinh ngạc trước tài năng của Ronie. | Khi bé giải đúng bài toán hóc búa với chuỗi liên tiếp. |
| **6** | `clapping` | Vỗ tay tán thưởng | Hai bàn tay vỗ nhẹ nhịp nhàng, biểu dương hiệp sĩ nhí. | Khi hoàn thành bài học toán xuất sắc. |
| **7** | `rewarding` | Trao thưởng vinh quang | Hai tay nâng cúp vàng hoặc rương báu trao tặng cho bé. | Màn hình nhận thưởng tại Lâu Đài Hoàng Gia. |
| **8** | `encouraging` | Động viên yêu thương | Cúi người ân cần, biểu tượng trái tim ấm áp bay quanh. | Khi bé làm bài sai hoặc cần gợi ý để tự tin làm lại. |

---

### 10. KIẾN TRÚC NHÂN VẬT PHỤ & ĐỐI THỦ HÀI HƯỚC (NPC SYSTEM)

Hệ thống quản lý nhân vật phụ (`npcRegistry.ts`) được xây dựng theo mẫu thiết kế **Registry Pattern**, cho phép mở rộng không giới hạn nhân vật mới trong tương lai. Tất cả nhân vật phản diện đều mang phong cách hoạt hình hài hước, vụng về, không có yếu tố hù dọa hoặc đáng sợ.

| Mã Định Danh (`NPCId`) | Tên Nhân Vật | Vai Trò & Tính Cách | Tông Giọng (`Pitch`) | Ngoại Hình Vector & Màu Sắc | Câu Cửa Miệng Đặc Trưng |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `rabbit` | **Thỏ Trắng Tinh Nghịch** | Bạn đồng hành nhanh nhẹn, hướng dẫn viên Rừng Số | 1.30 (Vang, nhí nhảnh) | Thỏ hồng tai dài, ôm củ cà rốt cam | *"Cà rốt cà rốt! Cùng mình nhảy qua các con số nào!"* |
| `bear` | **Gấu Con Đáng Yêu** | Bạn học hiền lành, yêu thích xếp hình và chia bánh | 0.90 (Trầm ấm, chậm rãi) | Gấu nâu tròn xoe, đội mũ vàng pastel | *"Gấu thích ăn mật ong và chia bánh đều cho các bạn!"* |
| `rescued_girl` | **Cô Bé Nơ Hồng** | Cư dân cần được giải cứu trong nhiệm vụ phiêu lưu | 1.25 (Trong trẻo, dễ thương) | Váy xanh ngọc, kẹp nơ hồng to bản | *"Cứu mình với bé Ronie ơi, hãy giải đúng câu đố nhé!"* |
| `dragon` | **Rồng Con Hạt Dẻ** | Linh thú thổi lửa sưởi ấm, bảo vệ Hang Kho Báu | 1.05 (Hăng hái, ngộ nghĩnh) | Rồng xanh lá tí hon, cánh nhỏ màu cam | *"Khè khè! Rồng con thổi ra bong bóng toán học đây!"* |
| `robot` | **Robot Bíp Bíp** | Chú robot tính toán siêu tốc ở Thành Phố Thời Gian | 1.15 (Điện tử nhịp nhàng) | Robot xanh dương khối hộp, ăng-ten đèn vàng | *"Bíp bíp! Đã nạp dữ liệu! Phép tính này thật tuyệt vời!"* |
| `cookie_monster` | **Quái Vật Bánh Quy** | "Đối thủ" tham ăn dễ thương, chuyên giấu bánh đố số | 0.85 (Hóm hỉnh, vụng về) | Quái vật lông tím tròn lẳn, miệng dính vụn bánh socola | *"Rôm rốp rôm rốp! Trả lời đúng mới được ăn bánh nhé!"* |
| `candy_witch` | **Phù Thủy Kẹo Ngọt** | Nữ phù thủy tí hon chuyên tạo ra câu đố phép thuật | 1.20 (Tinh quái, vui nhộn) | Mũ chóp tím lấp lánh, đũa phép hình kẹo mút cầu vồng | *"Úm ba la kẹo ngọt! Hãy đoán xem phép tính này ra số mấy?"* |

---

### 11. HỆ THỐNG KỊCH BẢN HỘI THOẠI (DIALOGUE ENGINE & SCRIPT LIBRARY)

Cấu trúc kịch bản hội thoại (`IDialogueConversation` & `IDialogueNode`) hỗ trợ phân nhánh lựa chọn, đính kèm hoạt ảnh tương ứng của nhân vật, giọng đọc offline bằng Web Speech API và thời gian ngắt nghỉ tự nhiên.
Tất cả 11 tình huống sư phạm đều có kho dữ liệu câu ngẫu nhiên (`RANDOM_PHRASES`) tối thiểu 4 câu biến thể để tránh sự nhàm chán lặp lại cho trẻ nhỏ:

| STT | Tình Huống Kịch Bản (`DialogueCategory`) | Nhân Vật Tham Gia | Mục Tiêu Sư Phạm & Trải Nghiệm Cảm Xúc | Số Lượng Câu Biến Thể |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `greeting` | Nữ hoàng & Ronie | Tạo cảm giác được chào đón yêu thương khi mở game. | 4 câu thoại |
| **2** | `quest_assign` | Nữ hoàng & Ronie | Giao mục tiêu rõ ràng, khơi gợi tinh thần phiêu lưu dũng cảm. | 4 câu thoại |
| **3** | `quest_start` | Ronie & NPC | Sẵn sàng xuất phát, khơi dậy sự tự tin và quyết tâm. | 4 câu thoại |
| **4** | `correct` | Nữ hoàng & Bạn đồng hành | Khen ngợi cụ thể, kích thích dopamine học tập tích cực. | 4 câu thoại |
| **5** | `incorrect` | Nữ hoàng & Ronie | Vỗ về nhẹ nhàng, không phán xét, nhấn mạnh việc thử lại. | 4 câu thoại |
| **6** | `hint` | Nữ hoàng & Thỏ Trắng | Đưa manh mối trực quan (que tính, quả táo) giúp tự tư duy. | 4 câu thoại |
| **7** | `victory` | Nữ hoàng & Toàn thể NPC | Vinh danh thành quả sau khi hoàn thành chuỗi thử thách. | 4 câu thoại |
| **8** | `defeat` | Nữ hoàng & Ronie | Động viên sau lần vấp ngã: "Thất bại là mẹ thành công". | 4 câu thoại |
| **9** | `reward` | Nữ hoàng & Ronie | Trao tặng huy chương, cúp sao, khơi dậy niềm tự hào. | 4 câu thoại |
| **10** | `encouragement` | Nữ hoàng & Thú cưng | Đồng hành thường nhật, nhắc nhở bé uống nước và giữ sức khỏe. | 4 câu thoại |
| **11** | `zone_unlock` | Nữ hoàng & Ronie | Hào hứng khám phá vùng đất mới trên Bản Đồ Thế Giới. | 4 câu thoại |

- **Tính năng Trợ Năng Trẻ Em:**
  - Nút **"Bỏ qua" (Skip):** Cho phép các bé đã đọc tốt hoặc đã trải nghiệm qua có thể tua nhanh hội thoại bất kỳ lúc nào.
  - Nút **"Nghe lại" (Replay Voice):** Cho phép bé chạm để máy phát âm lại câu thoại với giọng đọc ấm áp, giúp bé lớp 1 đang tập đọc dễ dàng tiếp thu bài học mà không phụ thuộc vào phụ huynh.

---

### 12. BỘ QUẢN LÝ ÂM THANH ĐA KÊNH CHỐNG CHỒNG ÂM (MULTI-CHANNEL AUDIO ENGINE)

Được thiết kế đáp ứng đặc tính hành vi của trẻ nhỏ (thường bấm nút liên tục hoặc chạm màn hình nhiều lần):

- **7 Kênh Âm Thanh Độc Lập:**
  1. `dialogue`: Kênh giọng đọc đối thoại (ưu tiên cao nhất, luôn được làm sạch trước khi phát câu mới).
  2. `bgm`: Kênh nhạc nền êm dịu, âm lượng vừa phải (50%) để không lấn át lời dạy.
  3. `sfx_success`: Kênh hiệu ứng khi làm đúng (tiếng chuông lấp lánh C5-E5-G5-C6).
  4. `sfx_failure`: Kênh hiệu ứng động viên làm lại (âm rung trầm êm ả không gây ức chế).
  5. `sfx_button`: Kênh phản hồi xúc giác khi chạm nút (âm *Bloop* 80ms).
  6. `sfx_reward`: Kênh âm hưởng vinh danh Fanfare hoàng gia.
  7. `sfx_game_effect`: Kênh hiệu ứng kỹ năng của Ronie (bắn tơ, kéo tơ, tung nắm đấm tơ).
- **Bộ Kiểm Soát Chống Chồng Lấn Âm Thanh (Concurrency & Spam Limiter):**
  - Giới hạn tối đa `MAX_CONCURRENT_SFX = 3` âm thanh hiệu ứng tại một thời điểm.
  - Bộ đệm điều tiết tần số bấm phím: Ngăn chặn các âm chạm nút cách nhau dưới 40ms, tránh gây rè màng loa hoặc âm thanh quá tải trên thiết bị di động/tablet của trẻ.
  - 100% Thuần Web Audio API & Web Speech API: Chạy offline hoàn toàn, không phụ thuộc vào kết nối mạng Internet.
