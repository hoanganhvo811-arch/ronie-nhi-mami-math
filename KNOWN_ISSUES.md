# CÁC LƯU Ý KỸ THUẬT & GIẢI PHÁP KHẮC PHỤC (KNOWN ISSUES & FAQ)
### DỰ ÁN: RONIE & NHI MAMI – VƯƠNG QUỐC TOÁN HỌC

---

## 1. CHÍNH SÁCH PHÁT ÂM THANH TRÊN TRÌNH DUYỆT (BROWSER AUTOPLAY POLICY)

### Hiện Tượng:
Khi vừa mở ứng dụng lần đầu, đôi khi tiếng nhạc nền hoặc giọng chào của Nữ hoàng Nhi Mami chưa phát ngay.

### Nguyên Nhân Kỹ Thuật:
Các trình duyệt hiện đại (Google Chrome, Microsoft Edge, Safari) áp dụng chính sách bảo mật tự động chặn âm thanh phát tự động (Autoplay Policy) cho đến khi người dùng có thao tác chạm hoặc nhấp chuột đầu tiên vào trang web.

### Cách Xử Lý:
Bé hoặc phụ huynh chỉ cần chạm vào màn hình hoặc nhấp vào nút **BẮT ĐẦU**, hệ thống Web Audio API và Web Speech API sẽ ngay lập tức được kích hoạt hoàn toàn với âm lượng chuẩn.

---

## 2. CHẾ ĐỘ TRÌNH DUYỆT ẨN DANH & LƯU TIẾN TRÌNH (INCOGNITO MODE)

### Hiện Tượng:
Nếu chơi trên tab Ẩn danh (Private / Incognito Window), sau khi tắt trình duyệt thì tiến trình sao vàng và đồ chơi có thể không còn lưu lại.

### Nguyên Nhân Kỹ Thuật:
Chế độ ẩn danh của trình duyệt mặc định xóa toàn bộ cơ sở dữ liệu IndexedDB và LocalStorage ngay khi đóng cửa sổ nhằm mục đích bảo mật quyền riêng tư của trình duyệt.

### Cách Xử Lý:
- Khuyến nghị phụ huynh mở game bằng cửa sổ trình duyệt thông thường hoặc khởi chạy thông qua file `CHAY_GAME.bat` trên máy tính để dữ liệu được lưu vĩnh viễn trên máy.
- Hoặc phụ huynh có thể sử dụng chức năng **Xuất Sao Lưu (Export Backup)** trong Bảng điều khiển phụ huynh trước khi đóng cửa sổ ẩn danh.

---

## 3. ĐỘ PHÂN GIẢI MÀN HÌNH & THIẾT BỊ DI ĐỘNG XOAY DỌC

### Hiện Tượng:
Khi mở trên điện thoại thông minh ở chế độ màn hình dọc (Portrait), giao diện bản đồ có thể bị thu nhỏ để giữ tỉ lệ hiển thị.

### Khuyến Nghị:
- Game được thiết kế tối ưu nhất cho **màn hình ngang (Landscape)** với tỉ lệ chuẩn 16:9 hoặc 16:10 trên máy tính để bàn (PC), Laptop và Máy tính bảng (Tablet / iPad).
- Trên điện thoại, phụ huynh vui lòng bật tính năng **Tự động xoay màn hình (Auto Rotate)** và xoay ngang máy để con có không gian tương tác thoải mái nhất.

---

## 4. GIỌNG ĐỌC TIẾNG VIỆT TRÊN MỘT SỐ PHIÊN BẢN HỆ ĐIỀU HÀNH CŨ

### Hiện Tượng:
Trên một số phiên bản Windows 7 hoặc thiết bị chưa cài gói ngôn ngữ tiếng Việt (Vietnamese Speech Pack), giọng đọc có thể sử dụng giọng tổng hợp mặc định của hệ thống.

### Cách Xử Lý:
- Trên Windows 10/11: Vào `Settings` $\rightarrow$ `Time & Language` $\rightarrow$ `Speech` $\rightarrow$ Nhấn `Add voices` và chọn **Vietnamese (Tiếng Việt)** để kích hoạt giọng đọc chuẩn tự nhiên nhất.
- Ứng dụng luôn hiển thị đầy đủ văn bản to rõ kèm hình vẽ trực quan nên bé vẫn hoàn toàn có thể hiểu và chơi bình thường ngay cả khi không có giọng đọc hệ thống.

---

## 5. HỖ TRỢ CHƠI HOÀN TOÀN KHÔNG CÓ KẾT NỐI INTERNET (100% OFFLINE)

### Hướng Dẫn:
Ứng dụng đã được tích hợp Service Worker PWA (`sw.js`). Sau khi tải trang lần đầu tiên, toàn bộ tài nguyên hình ảnh, mã nguồn và hệ thống âm thanh tổng hợp đã được lưu trong bộ nhớ máy. Phụ huynh hoàn toàn có thể tắt Wi-Fi hoặc mang laptop về quê, đi du lịch mà bé vẫn chơi và học toán mượt mà.
