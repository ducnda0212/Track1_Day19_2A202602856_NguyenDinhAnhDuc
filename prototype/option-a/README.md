# Day 18 · Micro-prototype "Ôn bài từ ghi chú" (nhóm BLBD, Case B AI Notes)

Mở `option-a/index.html` bằng trình duyệt (Chrome/Edge). Không cần cài đặt hay chạy server.
Cần mạng chỉ để tải font; không có mạng vẫn chạy được.

## Cấu trúc

```
option-a/           Option A: user tự highlight, tự ghi chú, tự viết bản ôn tập; hệ thống chỉ gom theo mục
  index.html
  option-a.js       Toàn bộ tương tác (highlight, ghi chú, sổ ghi chú realtime, ôn bài, kết quả)
  option-a.css
shared/             Phần dùng chung, để sau này Option B/C dùng lại
  fixture.js        Nội dung bài học: 11 slide, 3 mục (dựa trên PDF 3B-Zone2-BLAS). KHÔNG có highlight dựng sẵn
  slides/           11 ảnh slide (slide-01.jpg … slide-11.jpg) xuất từ PDF
  slides-text.js    Toạ độ từng chữ trích từ chính file PDF, dùng làm lớp chữ vô hình để bôi đen
  shell.js          Giao diện VLearn: header, sidebar, modal, toast "Hoàn tác"
  vlearn.css        Màu, font, component dùng chung
ANNOTATION.md       Annotation cho facilitator (không cho tester xem)
```

## Option A — luồng 3 trạng thái

| Trạng thái | Tester làm gì |
|---|---|
| 1. Common context: bài học + **Sổ ghi chú** | Đọc slide. **Bôi đen chữ** trên slide rồi bấm nút **🖍 Highlight** hiện ra; với hình/biểu đồ thì chọn bút **🖍** rồi **kéo chuột** để tô một vùng. Ô ghi chú bật ra để ghi kèm. Công cụ **T**: bấm vào vị trí bất kỳ trên slide để viết ghi chú chữ. Công cụ **⌫**: bấm vào vùng tô/ghi chú để xóa. **↶** hoàn tác. Panel **Sổ ghi chú** bên phải tự gom mọi highlight/ghi chú theo mục ngay khi tạo; bấm một mục để nhảy về đúng slide |
| 2. Critical interaction: **Ôn bài** | Tự gắn nhãn Ý chính / Chưa hiểu / Câu hỏi và tự viết ghi chú ôn tập cho từng highlight; chọn mục cho ghi chú ở slide không thuộc mục nào; đổi mục, ẩn, xem slide gốc, xem Danh sách gốc |
| 3. Result: **Bản ghi chú ôn tập** | Xem khối "Cần làm rõ" và ghi chú theo mục; Chỉnh sửa hoặc về bài học |

**Human–AI trong Option A (khớp Decision Table Chặng 3):**
- **Expectation:** Sổ ghi chú và màn Ôn bài đều nói rõ hệ thống chỉ sắp xếp, không viết lại, không tóm tắt, không thêm nội dung.
- **Role & Agency:** hệ thống *Act* ở việc gom theo mục (dựa vào slide chứa highlight). *Don't Act* ở nội dung: mọi chữ là của user.
- **Evidence & Uncertainty:** mỗi mục ghi rõ slide nguồn, có nút **Xem slide**. Slide 1 (bìa) và slide 11 (Thank you) cố ý không thuộc mục nào → ghi chú ở đó vào nhóm **Chưa xác định được mục**, hệ thống không đoán. Mỗi mục trong Sổ ghi chú và màn Ôn bài hiện ảnh cắt đúng vùng đã tô.
- **Control & Recovery:** xóa/hoàn tác khi ghi chú; đổi mục, ẩn (có Hoàn tác), đưa trở lại, **Danh sách gốc** + **Khôi phục cách sắp xếp ban đầu**, **Chỉnh sửa** sau khi lưu.

**Reset giữa các tester:** bấm **↺ Làm lại từ đầu** ở cuối sidebar. Dữ liệu được lưu trong trình duyệt nên tải lại trang vẫn còn, cho đến khi bấm nút này.

**Giới hạn:** không dùng model/API thật; việc gom theo mục dựa trên mục của slide trong `fixture.js`. Slide hiển thị bằng ảnh xuất từ PDF, nhưng chữ để bôi đen lấy từ chính PDF (toạ độ từng từ). Hình, biểu đồ và chữ nằm trong ảnh (slide 2, 5, 9, 11 gần như không có chữ thật) dùng bút vùng 🖍. Hệ thống không đọc nội dung chữ được bôi. Các highlight có thể chồng lên nhau. Không dùng pdf.js vì trình duyệt chặn tải PDF/worker khi mở file trực tiếp (file://).

## Đóng góp cá nhân

_(Tự viết phần này.)_

## AI Support Log

| STT | Công cụ AI | Mục đích sử dụng | Kết quả AI hỗ trợ | Cách kiểm tra, chỉnh sửa |
|---|---|---|---|---|
| 1 | Claude | Dựng code HTML/CSS/JS cho Option A và phần shared (shell giao diện VLearn) | Prototype 3 trạng thái: highlight/ghi chú trực tiếp trên slide, sổ ghi chú gom theo mục realtime, ôn bài, kết quả | _(Tự điền: bạn đã mở thử, sửa gì)_ |
| 2 | Claude | Chuyển PDF slide thành ảnh và gán slide vào mục (fixture) | 11 ảnh slide, 3 mục, 2 slide cố ý không thuộc mục nào | _(Tự điền: bạn đã đối chiếu mục với nội dung PDF)_ |
