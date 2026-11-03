# LỘ TRÌNH PHÁT TRIỂN DỰ ÁN (PHASE ROADMAP)
## RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC

Lộ trình phát triển được phân chia thành 10 giai đoạn (Phase 0 đến Phase 9) theo mô hình lặp cuốn chiếu (Iterative & Agile), đảm bảo kiểm thử và nghiệm thu chặt chẽ sau từng giai đoạn trước khi bàn giao.

---

### BẢNG TỔNG HỢP CÁC GIAI ĐOẠN

| Phase | Tên Giai Đoạn | Trọng Tâm Phát Triển | Sản Phẩm Bàn Giao Cốt Lõi |
| :--- | :--- | :--- | :--- |
| **Phase 0** | **Project Discovery & Technical Foundation** | Khảo sát môi trường, thiết lập kiến trúc, scaffolding dự án | Bộ 6 tài liệu kiến trúc, cấu hình Vite/React/Phaser/Dexie/Vitest, màn hình nền móng |
| **Phase 1** | **Core Engine & Bridge Architecture** | Xây dựng Game Canvas, Phaser Game Loop, Typed EventBus Bridge | Cầu nối React-Phaser hoạt động hai chiều, Scene Manager cơ bản |
| **Phase 2** | **Persistence & Profile System** | Tầng dữ liệu Dexie.js (IndexedDB), quản lý nhiều hồ sơ bé, Parent Gate | Hệ thống lưu trữ offline, tạo/chọn nhân vật bé, mã khóa phụ huynh |
| **Phase 3** | **World Map & Exploration Engine** | Bản đồ thế giới 5 Vùng đất 2.5D, điều khiển Ronie di chuyển, tương tác | Bản đồ tương tác, di chuyển Ronie mượt mà, camera bám theo nhân vật |
| **Phase 4** | **Dialogue & Queen Nhi Mami System** | Hệ thống hội thoại truyện tranh, biểu cảm nhân vật, giọng đọc tiếng Việt | Hộp thoại hoạt hình Nữ hoàng & Ronie, âm thanh voice line trực quan |
| **Phase 5** | **Math Question Engine (GDPT 2018)** | Bộ sinh 6 dạng bài tập toán tương tác đa giác quan Lớp 1 chuẩn Bộ GD&ĐT | Module giải đố trực quan (Đếm quả, Cán cân, Ghép hình, Thước cm, Đồng hồ) |
| **Phase 6** | **Mission & Quest Progression Engine** | Hệ thống nhiệm vụ chính tuyến & phụ tuyến, điều kiện mở khóa | Vòng lặp nhiệm vụ 5 Vùng đất, tính điểm 3 sao, mở sương mù bản đồ |
| **Phase 7** | **Reward, Inventory & Customization** | Hệ thống Huy hiệu Nữ hoàng, Tủ đồ trang phục Ronie, Pháo hoa chiến thắng | Kho đồ Ronie, thay trang phục, phòng cúp truyền thống hoàng gia |
| **Phase 8** | **Parent Dashboard & Learning Analytics** | Bảng phân tích học tập, biểu đồ năng lực toán học, giới hạn giờ chơi | Dashboard phụ huynh, thống kê điểm mạnh/yếu, hẹn giờ chơi an toàn |
| **Phase 9** | **Polish, Audio, PWA & Production Release** | Hoàn thiện âm thanh đa tầng, tối ưu 60 FPS, đóng gói PWA offline | Bản phát hành hoàn chỉnh, cài đặt PWA chơi không cần mạng, tài liệu bàn giao |

---

### CHI TIẾT CÁC GIAI ĐOẠN PHÁT TRIỂN

#### PHASE 0: PROJECT DISCOVERY & TECHNICAL FOUNDATION (HIỆN TẠI)
- **Mục tiêu:** Khảo sát toàn diện môi trường kỹ thuật hiện tại, thiết lập dự án chuẩn mực, xác định bộ công nghệ tối ưu, viết tài liệu kiến trúc toàn diện và khởi tạo màn hình thử nghiệm ban đầu.
- **Danh sách công việc:**
  - [x] Khảo sát môi trường: Node.js v26, npm v11, Git 2.56, Windows environment.
  - [x] Đánh giá các dự án cũ (`sieu-nhan-ronie-math`, `tony-math-hero`), bảo tồn toàn vẹn dữ liệu cũ.
  - [x] Khởi tạo dự án độc lập `ronie-nhi-mami-math` với Vite, React 19, TypeScript, Phaser 3, Dexie.js, Vitest, Tailwind CSS.
  - [x] Xây dựng trọn bộ 6 tài liệu kiến trúc chuẩn mực trong thư mục `docs/`.
  - [x] Thiết lập cấu hình TypeScript, Vite config, setup file Vitest.
  - [x] Viết unit test kiểm thử nền tảng ban đầu và màn hình khởi động (App Shell).
- **Tiêu chí nghiệm thu:**
  - Biên dịch TypeScript thành công không lỗi (`npm run build`).
  - Toàn bộ unit test chạy qua 100% (`npm run test`).
  - Màn hình khởi động React + Phaser Canvas hiển thị mượt mà.

---

#### PHASE 1: CORE ENGINE & BRIDGE ARCHITECTURE
- **Mục tiêu:** Hiện thực hóa cầu nối giao tiếp hai chiều không đồng bộ (`GameBridgeService` và `EventBus`) giữa React 19 và Phaser 3.
- **Danh sách công việc:**
  - [ ] Xây dựng `PhaserGameContainer.tsx` đảm bảo tự động điều chỉnh tỷ lệ khung hình (Responsive 16:9 Canvas Scale).
  - [ ] Hiện thực hóa lớp `GameBridgeService.ts` với đầy đủ các sự kiện định kiểu `GameEvents`.
  - [ ] Tạo `BootScene` và `PreloadScene` trong Phaser để nạp asset texture, spritesheet và âm thanh mượt mà có thanh tiến trình.
  - [ ] Đảm bảo cơ chế dọn dẹp bộ nhớ (Clean-up & Destroy) khi chuyển đổi hoặc unmount component.
- **Tiêu chí nghiệm thu:** Gửi tín hiệu từ nút bấm React làm cho Sprite trong Phaser phản hồi tức thì và ngược lại.

---

#### PHASE 2: PERSISTENCE & PROFILE SYSTEM
- **Mục tiêu:** Xây dựng hệ thống lưu trữ ngoại tuyến bằng Dexie.js, cho phép nhiều bé cùng chơi trên một thiết bị gia đình mà không bị ghi đè tiến trình.
- **Danh sách công việc:**
  - [ ] Định nghĩa cơ sở dữ liệu `MathKingdomDB` kế thừa từ `Dexie`.
  - [ ] Xây dựng giao diện Chọn & Tạo Hồ Sơ Bé (Profile Picker) với các avatar hiệp sĩ nhí ngộ nghĩnh.
  - [ ] Hiện thực hóa Cổng Khóa Phụ Huynh (Parent Gate) bảo vệ khu vực cài đặt.
  - [ ] Xây dựng tính năng Xuất/Nhập dữ liệu lưu trữ dạng file JSON để phụ huynh sao lưu.
- **Tiêu chí nghiệm thu:** Dữ liệu hồ sơ, số sao, cài đặt âm thanh vẫn còn nguyên vẹn 100% sau khi tải lại trang web hoặc đóng trình duyệt.

---

#### PHASE 3: WORLD MAP & EXPLORATION ENGINE
- **Mục tiêu:** Dựng bản đồ tương tác 2.5D của Vương Quốc Toán Học gồm 5 Vùng đất kỳ thú.
- **Danh sách công việc:**
  - [ ] Dựng `WorldMapScene` trong Phaser với địa hình 5 vùng đất và hiệu ứng mây bồng bềnh.
  - [ ] Xây dựng bộ điều khiển nhân vật Ronie (Touch D-pad ảo cho màn hình cảm ứng + Phím mũi tên/WASD cho máy tính).
  - [ ] Thiết lập camera bám sát Ronie (`Camera.startFollow`) và giới hạn ranh giới bản đồ thế giới.
  - [ ] Hệ thống điểm mốc thử thách (Encounter Nodes) phát sáng khi Ronie tiến lại gần.
- **Tiêu chí nghiệm thu:** Bé điều khiển Ronie chạy nhảy mượt mà trên bản đồ thế giới, camera lia êm dịu, không giật lag.

---

#### PHASE 4: DIALOGUE & QUEEN NHI MAMI SYSTEM
- **Mục tiêu:** Hệ thống thoại truyện tranh giàu cảm xúc giữa Nữ hoàng Nhi Mami và Ronie.
- **Danh sách công việc:**
  - [ ] Xây dựng component `DialogueBubble.tsx` phong cách truyện tranh hoạt họa với avatar nhấp nháy mắt, mấp máy môi.
  - [ ] Tích hợp bộ kịch bản lời thoại tiếng Việt đầy đủ cho từng vùng đất (Chào đón, Hướng dẫn, Động viên, Khen ngợi).
  - [ ] Tích hợp tính năng Đọc lời thoại tự động (Web Speech API tiếng Việt hoặc âm thanh lồng tiếng thu sẵn).
- **Tiêu chí nghiệm thu:** Khi chạm vào Nữ hoàng hoặc mở màn chơi, lời thoại hiện ra êm ái kèm âm thanh giọng nói ấm áp.

---

#### PHASE 5: MATH QUESTION ENGINE (CHUẨN GDPT 2018 LỚP 1)
- **Mục tiêu:** Trái tim giáo dục của dự án - bộ sinh câu hỏi thông minh trực quan đa giác quan bám sát chương trình Lớp 1.
- **Danh sách công việc:**
  - [ ] Dạng 1: Đếm quả táo, chú ếch, hạt dẻ trực quan (Phạm vi 0-10 và 11-20).
  - [ ] Dạng 2: Phép cộng có hình ảnh trực quan và mô hình Tách - Gộp số.
  - [ ] Dạng 3: Phép trừ với hình tượng bớt đi, cán cân thăng bằng tìm số còn thiếu.
  - [ ] Dạng 4: Nhận biết và ghép các hình phẳng (Vuông, Tròn, Tam giác, Chữ nhật) và khối không gian.
  - [ ] Dạng 5: Thước đo xăng-ti-mét (cm) kéo thả đo đồ vật.
  - [ ] Dạng 6: Xem đồng hồ kim đúng giờ và phân biệt các ngày trong tuần.
  - [ ] Cơ chế gợi ý thông minh 3 cấp độ (Visual Hint & Scaffolding).
- **Tiêu chí nghiệm thu:** Sinh câu hỏi ngẫu nhiên không trùng lặp, logic kiểm tra kết quả chính xác 100%, có gợi ý dịu dàng khi trẻ gặp khó khăn.

---

#### PHASE 6: MISSION & QUEST PROGRESSION ENGINE
- **Mục tiêu:** Xâu chuỗi các câu đố thành chuỗi nhiệm vụ hấp dẫn giải cứu 5 Vùng đất.
- **Danh sách công việc:**
  - [ ] Quản lý trạng thái mở khóa vùng đất (Zone 1 -> Zone 2 -> Zone 3 -> Zone 4 -> Zone 5).
  - [ ] Tính điểm thưởng 1-3 sao dựa trên độ chính xác và mức độ tự chủ của bé.
  - [ ] Mở khóa sương mù che phủ bản đồ khi giải cứu thành công vùng đất.
  - [ ] Màn chơi trùm cuối (Boss Friendly Challenge) kết hợp kiểm tra tổng hợp.
- **Tiêu chí nghiệm thu:** Trẻ có cảm giác thám hiểm liền mạch, có động lực chinh phục từng vùng đất.

---

#### PHASE 7: REWARD, INVENTORY & CUSTOMIZATION
- **Mục tiêu:** Hệ thống phần thưởng phong phú khích lệ nỗ lực học tập của bé.
- **Danh sách công việc:**
  - [ ] Xây dựng Tủ đồ của Ronie (`WardrobeModal.tsx`): Đổi trang phục, đổi mũ tai nhện, đổi găng tay tơ.
  - [ ] Bộ sưu tập Huy hiệu Nữ hoàng (`BadgesCollection.tsx`): 12 huy hiệu vinh danh các kỹ năng toán học.
  - [ ] Phòng truyền thống trưng bày cúp vàng và ngọc thần tri thức.
  - [ ] Hiệu ứng pháo hoa, kim tuyến rơi rực rỡ ăn mừng chiến thắng.
- **Tiêu chí nghiệm thu:** Ronie thay đổi trang phục ngay lập tức cả trong giao diện React lẫn trong Game Engine Phaser.

---

#### PHASE 8: PARENT DASHBOARD & LEARNING ANALYTICS
- **Mục tiêu:** Công cụ hỗ trợ cha mẹ đồng hành cùng con, nắm bắt năng lực học tập toán học của trẻ.
- **Danh sách công việc:**
  - [ ] Biểu đồ trực quan radar năng lực 5 mạch kiến thức Toán Lớp 1 (Số học, Cộng, Trừ, Hình học, Đo lường).
  - [ ] Lịch sử các phiên học: Thời gian học, tỉ lệ chính xác, dạng bài bé làm nhanh nhất và dạng bài cần ôn thêm.
  - [ ] Cài đặt giới hạn giờ chơi mỗi ngày (ví dụ: tối đa 20 phút/ngày, tự động nhắc nhở bé nghỉ ngơi mát mắt).
  - [ ] Lời khuyên sư phạm gợi ý cho phụ huynh cách chơi đố toán cùng con ở đời thực.
- **Tiêu chí nghiệm thu:** Phụ huynh chỉ mất 30 giây để nắm bắt được toàn bộ điểm mạnh và điểm yếu toán học của con.

---

#### PHASE 9: POLISH, AUDIO, PWA & PRODUCTION RELEASE
- **Mục tiêu:** Tinh chỉnh toàn diện, tích hợp âm thanh chuyên nghiệp, tối ưu hóa 60 FPS và đóng gói ứng dụng.
- **Danh sách công việc:**
  - [ ] Hoàn thiện thư viện âm thanh: BGM tươi vui du dương, SFX hoạt họa lách cách vui tai cho mọi thao tác chạm.
  - [ ] Tối ưu hóa bộ nhớ, kiểm tra không có hiện tượng giật khung hình (Zero Frame Drop).
  - [ ] Đóng gói Progressive Web App (PWA) với Service Worker cache 100% offline.
  - [ ] Viết tài liệu hướng dẫn sử dụng cho phụ huynh và tài liệu triển khai kỹ thuật.
- **Tiêu chí nghiệm thu:** Ứng dụng chạy mượt mà ngay cả khi ngắt kết nối Wi-Fi hoàn toàn, đạt điểm Lighthouse Performance & PWA >= 90 điểm.

---

### BẢNG ĐÁNH GIÁ RỦI RO KỸ THUẬT & BIỆN PHÁP PHÒNG NGỪA

| Rủi Ro Kỹ Thuật | Mức Độ | Biện Pháp Phòng Ngừa & Giảm Thiểu |
| :--- | :---: | :--- |
| **Xung đột vòng đời React 19 và Phaser 3 Canvas** | Cao | Sử dụng `GameBridgeService` đơn hướng qua EventBus, unmount và destroy Phaser game instance sạch sẽ trong `useEffect` cleanup. |
| **Trẻ bấm liên tục nhiều lần (Spam Click) gây lỗi logic** | Trung bình | Thêm cơ chế Debounce / Cooldown khóa nhận thao tác (input lock) trong 350ms khi đang xử lý hoạt ảnh phản hồi câu hỏi. |
| **Mất dữ liệu lưu trữ khi trình duyệt dọn cache** | Trung bình | Sử dụng Dexie.js (IndexedDB) với cờ `persistent-storage` qua `navigator.storage.persist()`, kèm tính năng xuất file JSON sao lưu. |
| **Giao diện vỡ tỉ lệ trên các tỷ lệ màn hình dị biệt (Tablet 4:3 vs Phone 20:9)** | Trung bình | Cố định logic canvas tỷ lệ chuẩn 16:9 với chế độ `Phaser.Scale.FIT`, kết hợp layout React CSS flexbox/grid có padding an toàn (safe-area). |
| **Trẻ nhỏ 6 tuổi chưa biết đọc chữ trôi chảy** | Cao | 100% câu hỏi và hướng dẫn đều có nút âm thanh đọc đề bài bằng giọng tiếng Việt, biểu tượng trực quan thay thế chữ viết phức tạp. |
