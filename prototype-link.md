# Prototype A/B/C

**Prototype A:** `prototype/option-a/option-a/index.html`

**Prototype B:** `prototype/option-b/index.html`

**Prototype C:** `https://prototype-oot9qgk6c-myself-fb39.vercel.app/`


## Cách dùng (flow end-to-end)

Cả ba phương án dùng cùng 1 bộ slide, cùng tình huống: học viên vừa học xong và muốn tạo ghi chú để ôn lại, đồng thời biết mỗi ý đến từ slide nào. Mỗi phương án thay đổi **cách chuyển nội dung được đánh dấu thành ghi chú**.

1. **Xem nội dung nguồn:** Mở prototype của A, B hoặc C; chọn slide từ danh sách và đọc nội dung. Đánh dấu khoảng 2–3 ý muốn ghi nhớ hoặc chưa hiểu.
2. **Tạo ghi chú theo từng phương án:**
   - **A — Học viên tự viết:** Tự ghi ý chính, điểm chưa hiểu hoặc câu hỏi cho nội dung đã đánh dấu. Hệ thống tập hợp ghi chú theo slide hoặc mục bài học, không viết hay diễn giải thay.
   - **B — AI hỏi gợi mở:** Bôi đen chữ trực tiếp trên slide, chọn **Highlight** hoặc **Chưa hiểu**. AI đặt câu hỏi dựa trên đoạn đã chọn; học viên trả lời hoặc bỏ qua. Câu trả lời được ghép thành ghi chú, không tự thêm kết luận.
   - **C — AI soạn bản nháp:** Sau khi học viên đánh dấu nội dung, AI đề xuất bản nháp ghi chú có cấu trúc và gắn nguồn. Học viên đối chiếu với slide, sửa hoặc xóa từng ý, rồi quyết định có lưu hay không.
3. **Xem lại và kiểm soát kết quả:** Kiểm tra ghi chú cùng đoạn trích và số slide nguồn. Học viên có thể quay về slide để đối chiếu. Các thao tác sửa, xóa, bỏ qua hoặc từ chối đề xuất được thể hiện theo cơ chế của từng phương án.
4. **Thử phương án khác:** Quay lại điểm bắt đầu của prototype tương ứng và thực hiện **cùng một nhiệm vụ trên cùng bộ slide**. Khi test, facilitator giữ nguyên outcome task để so sánh cách học viên thao tác với A/B/C.

## Ghi chú kỹ thuật

- Bộ slide là **nội dung dùng để thử prototype**.
- Không cần model hay API thật để thử nghiệm. Câu hỏi hoặc bản nháp do AI đưa ra trong prototype là nội dung mô phỏng; kết quả test cần đánh giá **cách tương tác**, không dùng để kết luận chất lượng của một model.