# Track1_Day19_2A202602856_NguyenDinhAnhDuc

## 1. Thông tin cá nhân và nhóm
- **MHV:** 2A202602856
- **Họ tên:** Nguyễn Đình Anh Đức
- **Tên nhóm:** BLBD
- **Thành viên:** Nguyễn Đình Anh Đức, Lê Duy Bảo, Vũ Quốc Bảo
- **Case:** Case B — AI Notes: Personal Learning Notes

## 2. Hypothesis Problem
Khi ôn lại sau các buổi học, học viên có ghi chú/highlight trong lúc học gặp khó khăn trong việc tìm lại và hiểu lại nội dung quan trọng để ôn tập vì ghi chú nằm rời rạc theo từng slide hoặc được chép thô theo lời giảng, chưa được chắt lọc, dẫn đến mất thời gian quay lại slide/video để đối chiếu, và vẫn khó nhớ hoặc hiểu bài khi cần dùng.

Chi tiết ở [three-option-design-sheet.md](three-option-design-sheet.md).

## 3. Three Solution Options
- Option A — User tự viết, hệ thống chỉ gom theo mục: User tự highlight và viết ghi chú theo mẫu gồm ý chính, điểm chưa hiểu và câu hỏi cần giải đáp. Hệ thống chỉ sắp xếp các highlight theo slide, không diễn giải hoặc viết nội dung thay user.
- Option B — AI hỏi gợi mở, user tự tạo nội dung ghi chú: User bôi đen trực tiếp một đoạn trên slide và chọn Highlight hoặc Chưa hiểu. AI đặt câu hỏi dựa trên đoạn đã chọn; câu trả lời của user được lưu thành ghi chú có liên kết tới slide và đoạn nguồn. AI không tự thêm kết luận.
- Option C — AI tự soạn bản nháp, user kiểm tra và duyệt: Sau khi user chọn đủ highlight, AI tạo một bản nháp ghi chú có cấu trúc và gắn nguồn. User đối chiếu với slide, sửa hoặc xóa từng ý rồi quyết định xác nhận.

Chi tiết ở [three-option-design-sheet.md](three-option-design-sheet.md).

## 4. Đóng góp của tôi trong nhóm
- Phụ trách Option B - AI hỏi gợi mở, học viên tự tạo nội dung ghi chú. Thiết kế và dựng luồng tương tác: học viên bôi đen chữ trực tiếp trên slide, chọn Highlight hoặc Chưa hiểu, trả lời câu hỏi gợi mở, rồi ghép câu trả lời thành ghi chú gắn với đoạn và slide nguồn. Prototype dùng chung bộ slide mà nhóm chọn làm nội dung thử nghiệm cho A/B/C; đây là dữ liệu bài học, không phải ghi chú của người dùng được phỏng vấn.
- Trong thiết kế Human-AI, chọn để AI hỏi theo đoạn được đánh dấu, còn học viên quyết định nội dung nào cần ghi nhớ và tự diễn giải bằng câu trả lời của mình. AI không tự bổ sung kết luận vào ghi chú. Thêm cách xem lại nguồn, sửa hoặc trả lời lại, bỏ qua câu hỏi, tẩy hoặc xóa highlight và hoàn tác để học viên có thể kiểm soát kết quả. Prototype cho phép chọn chữ trên slide qua text layer của PDF và không cần model hay API thật khi test.
- Chuẩn bị annotation cho người facilitate và outcome task dùng chung: quan sát tester có tự tìm ra cách highlight, hiểu câu hỏi, trả lời hoặc bỏ qua, ghép ghi chú và quay về slide nguồn hay không. Sau khi thực hiện phiên test, ghi hành vi và lời nói thật vào Feedback Note, tách observation khỏi interpretation, rồi cùng nhóm đối chiếu ba phiên test để chọn một Next Change và nêu những điều vẫn chưa được chứng minh.

## 5. Prototype Feedback
- Feedback Note của phiên tôi facilitate: [prototype-feedback-note.md](prototype-feedback-note.md)
- Tổng hợp ba feedback: [group-feedback-synthesis.md](group-feedback-synthesis.md)
- **Next Change:** [điền sau khi tổng hợp]
- **Still Unproven:** [điền sau khi tổng hợp]

## 6. AI Support Log
[ai-support-log.md](ai-support-log.md)
