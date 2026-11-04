# HƯỚNG DẪN SỬ DỤNG TÀI NGUYÊN VÀ THIẾT KẾ ĐỒ HỌA
## ASSET USAGE & DESIGN SYSTEM GUIDE (RONIE & NHI MAMI)

> Dành cho Frontend Engineers, Game Designers & Content Creators phát triển mở rộng cho Vương Quốc Toán Học Lớp 1.

---

## 1. HỆ THỐNG PHÔNG CHỮ TIẾNG VIỆT CHUẨN

Để đảm bảo hiển thị hoàn mỹ không bị lỗi vỡ dấu thanh (diacritics), font stack dự án quy định:

```css
/* Tiêu đề, nút bấm hoạt hình, số đếm to */
font-family: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;

/* Lời thoại, mô tả câu chuyện, hướng dẫn phụ huynh */
font-family: 'Nunito', 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
```

> **Quy tắc vàng:** Tuyệt đối không dùng `Comic Sans MS` trên môi trường web đa nền tảng vì font này thiếu glyph dấu tiếng Việt gây rớt font sang Arial/Times New Roman.

---

## 2. BỘ NÚT BẤM 3D HOẠT HÌNH (`CartoonButton`)

Các nút bấm dành cho trẻ lớp 1 phải có kích thước tối thiểu $48 \times 48\text{px}$, viền nổi bật và hiệu ứng nhấn lún xuống:

```tsx
import { CartoonButton } from '@/design-system/CartoonButton';

// Nút xuất phát chính (Xanh lá)
<CartoonButton color="emerald" size="lg" onClick={handlePlay}>
  🚀 XUẤT PHÁT NGAY!
</CartoonButton>

// Nút Lâu đài (Tím hoàng gia)
<CartoonButton color="purple" size="md" onClick={handleGoCastle}>
  👑 Về Lâu Đài
</CartoonButton>

// Nút Thử lại (Cam nắng)
<CartoonButton color="amber" size="sm" onClick={handleRetry}>
  🔄 Thử Lại
</CartoonButton>
```

### Bảng màu nút bấm:
- `amber` / `orange`: Kêu gọi chú ý, phần thưởng, mở rương.
- `emerald` / `green`: Bắt đầu, xuất phát, trả lời đúng, xác nhận.
- `rose` / `pink`: Về lâu đài, rương quà, bé gái, trang phục.
- `purple`: Cốt truyện, nhiệm vụ hoàng gia, học thuật.
- `sky`: Âm thanh, nghe đọc, gợi ý hỗ trợ.

---

## 3. BẢNG ĐEN GỖ THẦN KỲ (`WoodenChalkboard`)

Sử dụng khi hiển thị câu hỏi toán học, thử thách đố vui, hoặc thông báo lớp học rừng xanh:

```tsx
import { WoodenChalkboard } from '@/design-system/WoodenChalkboard';

<WoodenChalkboard
  title="BÀI TOÁN ĐẾM SỐ LƯỢNG"
  headerAddon={<button>🔊 Nghe Đề</button>}
>
  {/* Nội dung minh họa & chữ phấn phát sáng */}
</WoodenChalkboard>
```

---

## 4. TỔ CHỨC VÀ SỬ DỤNG NHÂN VẬT

### A. Bé Hiệp Sĩ Nhện Ronie (`RonieAvatar`)
- **Ảnh gốc chuẩn:** `public/assets/ronie-official.png` (cắt nền trong suốt, viền drop-shadow mềm).
- **Trạng thái hoạt họa:**
  - `idle`: Đứng tươi cười sẵn sàng.
  - `celebrating` / `victory`: Giơ tay chữ V hoặc nhảy múa khi làm đúng.
  - `jumping`: Đang hành động, di chuyển hoặc đu tơ.
  - `sad`: Buồn nhẹ, gãi đầu suy nghĩ khi chưa trả lời đúng (không tạo cảm giác trừng phạt).

### B. Nữ Hoàng Nhi Mami (`QueenNhiMamiAvatar`)
- **Ảnh gốc chuẩn:** `public/assets/queen-nhi-mami-official.png` (PNG 32-bit trong suốt 100%, đã khử toàn bộ ô caro giả lập).
- **Trạng thái hoạt họa:**
  - `greeting`: Mỉm cười vẫy tay chào đón con yêu.
  - `encouraging`: Nghiêng đầu trìu mến mách nhỏ bài toán.
  - `clapping`: Vỗ tay khen ngợi khi hoàn thành nhiệm vụ.

---

## 5. RƯƠNG BÁU ĂN MỪNG CHIẾN THẮNG (`TreasureChestCelebration`)

Dùng trong modal hoàn thành màn chơi, nhận quà hoàng gia:

```tsx
import { TreasureChestCelebration } from '@/design-system/TreasureChestCelebration';

<TreasureChestCelebration stars={3} score={150}>
  <div className="flex gap-2">
    <QueenNhiMamiAvatar size="sm" state="clapping" />
    <RonieAvatar size="lg" state="victory" />
  </div>
</TreasureChestCelebration>
```
