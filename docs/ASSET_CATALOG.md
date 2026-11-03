# DANH MỤC TÀI NGUYÊN (ASSET CATALOG)
## RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC

---

### 1. QUY CHUẨN THIẾT KẾ VÀ ĐỊNH DẠNG TÀI NGUYÊN

- **Định dạng Hình ảnh 2D / 2.5D:** WebP (cho texture/ảnh vẽ nghệ thuật có độ trong suốt alpha), SVG (cho icon và giao diện sắc nét mọi độ phân giải), PNG (cho spritesheet hoạt ảnh Phaser).
- **Định dạng Âm thanh:** MP3 / OGG (nén chuẩn 128kbps, tối ưu dung lượng tải nhanh trên web).
- **Quy tắc Bản quyền:** 100% hình ảnh và âm thanh đều là tài nguyên nguyên bản (Original Art), tự do bản quyền (CC0 / MIT) hoặc được sinh từ vector đồ họa theo chuẩn thiết kế độc quyền của dự án. Tuyệt đối không sử dụng tài nguyên có bản quyền thương mại của bên thứ ba (đặc biệt là hình tượng Spider-Man của Marvel).

---

### 2. DANH MỤC NHÂN VẬT CHÍNH (CHARACTER SPRITES)

| Tên Nhân Vật | Mã Asset | Định Dạng & Độ Phân Giải | Trạng Thái Hoạt Ảnh | Mô Tả Tạo Hình & Bản Quyền |
| :--- | :--- | :--- | :--- | :--- |
| **Bé Ronie (Hiệp Sĩ Nhện Nhí)** | `char_ronie_spritesheet` | PNG (1024x1024)<br>Frame: 128x128 | - `idle` (đứng thở nhẹ, chớp mắt)<br>- `run` (chạy lon ton vui vẻ)<br>- `jump` (nhảy bắn tơ sao)<br>- `think` (tay gãi cằm suy nghĩ)<br>- `celebrate` (nhảy múa ăn mừng) | Cậu bé siêu nhân mặc áo hoodie đỏ ruby kết hợp xanh ngọc, mũ trùm có 2 tai nhện nhỏ ngộ nghĩnh, hoa văn tơ mạng ngôi sao màu vàng kim. *(Original IP)* |
| **Nữ Hoàng Nhi Mami** | `char_nhi_mami_portrait` | WebP (512x512) | - `dialogue_neutral` (mỉm cười dịu dàng)<br>- `dialogue_speak` (nói chuyện hướng dẫn)<br>- `dialogue_cheer` (vẫy quyền trượng khen ngợi)<br>- `dialogue_hint` (chỉ tay gợi ý ân cần) | Nữ hoàng hiền dịu mang phong thái người mẹ, váy dạ hội lụa tím oải hương viền vàng, vương miện kết tinh từ hình khối ngọc toán học, tay cầm Quyền trượng Thấu Suốt. *(Original IP)* |
| **Thỏ Trắng Tinh Nghịch** | `npc_rabbit_companion` | PNG (256x256) | - `hop` (nhảy lăng xăng)<br>- `happy` (vẫy tai khen ngợi) | Bạn đồng hành hướng dẫn bài tập đếm cà rốt ở Vùng 1. |
| **Bác Gấu Nâu Trầm Ngâm** | `npc_bear_companion` | PNG (256x256) | - `scratch_head` (chờ chia mật ong)<br>- `clap` (vỗ tay hào hứng) | Bạn đồng hành hướng dẫn phép cộng trái cây ở Vùng 2. |
| **Khỉ Con Tinh Tế** | `npc_monkey_companion` | PNG (256x256) | - `balance` (đu trên đĩa cân) | Bạn đồng hành trên trò chơi cán cân thăng bằng ở Vùng 3. |

---

### 3. DANH MỤC BỐI CẢNH 5 VÙNG ĐẤT (ENVIRONMENT & BACKGROUNDS)

| Vùng Đất | Mã Asset | Loại Tài Nguyên | Kích Thước | Yếu Tố Đồ Họa Nổi Bật |
| :--- | :--- | :--- | :--- | :--- |
| **1. Rừng Số Đếm** | `bg_zone1_number_forest` | WebP / Tilemap | 2048x1152 | Cây nấm phát sáng hình số 1-10, dòng suối nhỏ lấp lánh, thảm cỏ xanh mướt, hoa ngũ sắc. |
| **2. Thung Lũng Cộng** | `bg_zone2_addition_valley` | WebP / Tilemap | 2048x1152 | Toa tàu xe lửa trái cây, cánh đồng hoa hướng dương rực rỡ, đồi cỏ thoai thoải nắng vàng. |
| **3. Hẻm Núi Trừ** | `bg_zone3_subtraction_canyon` | WebP / Tilemap | 2048x1152 | Vách đá cát vàng ấm cúng, cầu treo tơ nhện bắc qua suối nước khoáng, tinh thể thạch anh tím. |
| **4. Lâu Đài Hình Khối** | `bg_zone4_geometry_citadel` | WebP / Tilemap | 2048x1152 | Tháp lâu đài hình trụ và chóp nón, cổng vòm hình tròn, các khối đá hoa cương vuông vức màu pastel. |
| **5. Đấu Trường Trăm Điểm** | `bg_zone5_centurion_arena` | WebP / Tilemap | 2048x1152 | Khán đài lễ hội rợp bóng cờ hoa ngũ sắc, ngai vàng rực rỡ của Nữ hoàng Nhi Mami, đài phun nước tri thức. |

---

### 4. ĐỒ VẬT TOÁN HỌC TRỰC QUAN (MATH PROPS & INTERACTIVES)

| Tên Đồ Vật | Mã Asset | Định Dạng | Mô Tả & Công Dụng |
| :--- | :--- | :--- | :--- |
| **Quả Táo Đỏ Rực** | `prop_apple_red` | SVG / WebP | Dùng để bé đếm và kéo thả vào giỏ trong phép đếm và phép cộng (1-10). |
| **Củ Cà Rốt Cam** | `prop_carrot_orange` | SVG / WebP | Dùng trong bài toán thỏ trắng nhặt cà rốt. |
| **Hạt Dẻ Vàng Nâu** | `prop_acorn_brown` | SVG / WebP | Dùng trong bài toán bớt đi (phép trừ). |
| **Que Tính Đa Sắc** | `prop_counting_sticks` | SVG | Bó que tính 10 que (1 chục) và các que rời hỗ trợ cộng trừ phạm vi 20 và 100. |
| **Cán Cân Thăng Bằng** | `prop_balance_scale` | SVG / Component | Cán cân hai đĩa tương tác trực tiếp giúp bé hiểu bản chất phương trình `a + ? = b`. |
| **Bộ Hình Khối Phẳng** | `prop_shapes_flat` | SVG | Hình vuông, hình tròn, hình tam giác, hình chữ nhật với màu sắc phân biệt rõ rệt. |
| **Bộ Khối Không Gian** | `prop_shapes_3d` | SVG / WebP 2.5D | Khối lập phương (hộp quà) và Khối hộp chữ nhật (viên gạch thần kỳ). |
| **Thước Đo Xăng-ti-mét** | `prop_ruler_cm` | SVG / Component | Thước kẻ hoạt họa độ dài 10cm và 20cm, vạch chia rõ ràng, số to dễ nhìn. |
| **Mặt Đồng Hồ Kim** | `prop_clock_face` | SVG / Component | Đồng hồ kim giờ ngắn màu đỏ, kim phút dài màu xanh, có thể quay kim để học giờ đúng. |

---

### 5. DANH MỤC GIAO DIỆN & HUY HIỆU (UI & BADGE ICONS)

| Tên Icon | Mã Asset | Định Dạng | Ứng Dụng Trong Giao Diện |
| :--- | :--- | :--- | :--- |
| **Ngôi Sao Tri Thức** | `ui_star_gold` | SVG / Lucide | Hiển thị thành tích 1-3 sao sau mỗi thử thách. |
| **Trái Tim Sinh Mệnh** | `ui_heart_pink` | SVG / Lucide | Hiển thị năng lượng của Ronie (chỉ tăng, không trừ khi làm sai). |
| **Vương Miện Nữ Hoàng** | `ui_crown_queen` | SVG | Nút mở Cung điện Hoàng Gia / Phòng truyền thống. |
| **Loa Phát Âm Thanh** | `ui_speaker_audio` | SVG / Lucide | Nút chạm để nghe đọc to đề bài bằng tiếng Việt chuẩn. |
| **Kính Lúp Gợi Ý** | `ui_hint_wand` | SVG / Lucide | Nút gọi Nữ hoàng Nhi Mami xuất hiện trợ giúp nhẹ nhàng. |
| **Ổ Khóa Phụ Huynh** | `ui_parent_lock` | SVG / Lucide | Cổng bảo vệ màn hình quản trị của cha mẹ. |
| **Bộ 12 Huy Hiệu Hoàng Gia** | `badge_queen_01..12` | PNG / SVG (128x128) | Các huy hiệu danh dự trao tặng cho Ronie khi hoàn thành cột mốc. |

---

### 6. DANH MỤC ÂM THANH & HIỆU ỨNG (AUDIO & SFX)

| Tên Âm Thanh | Mã Asset | Loại | Mô Tả & Cảm Xúc |
| :--- | :--- | :--- | :--- |
| **Math Kingdom Theme** | `bgm_kingdom_main` | BGM (MP3) | Nhạc chủ đề vương quốc tươi vui, giai điệu đàn chuông marimba và sáo flute trong trẻo. |
| **Forest Adventure** | `bgm_forest_ambient` | BGM (MP3) | Âm thanh du dương của rừng xanh, tiếng chim hót líu lo và tiếng suối chảy róc rách. |
| **Victory Fanfare** | `bgm_victory_triumph` | BGM (MP3) | Đoạn nhạc kèn đồng chiến thắng rộn rã khi hoàn thành màn chơi. |
| **Chạm Nút Nhẹ Nhàng** | `sfx_button_tap` | SFX (WAV/MP3) | Tiếng *Bloop!* mềm mại khi bé chạm tay vào nút. |
| **Trả Lời Đúng** | `sfx_correct_sparkle` | SFX (WAV/MP3) | Tiếng đàn hạc lấp lánh và tiếng chuông reo mừng rỡ. |
| **Thử Lại Thân Thiện** | `sfx_gentle_wobble` | SFX (WAV/MP3) | Tiếng rung nhẹ nhàng vui nhộn khích lệ bé làm lại, không gây cảm giác thất bại. |
| **Tơ Nhện Bắn Phóng** | `sfx_spider_web_shoot` | SFX (WAV/MP3) | Tiếng tơ nhện bay vút êm tai khi Ronie vượt chướng ngại vật. |
| **Pháo Hoa Nổ Tưng Bừng** | `sfx_fireworks_pop` | SFX (WAV/MP3) | Tiếng pháo hoa giấy nổ *Póc! Póc!* khi nhận 3 sao. |
