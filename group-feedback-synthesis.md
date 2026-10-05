# Group Feedback Synthesis

## 1. Thông tin chung

- **Tên nhóm:** BLBD

- **Case:** Case B-AI Notes: Personal Learning Notes

- **Ngày tổng hợp:** 05/10/2026.

- **Người tham gia tổng hợp:**
  1. Lê Duy Bảo.
  2. Vũ Quốc Bảo.
  3. Nguyễn Đình Anh Đức.

---

## 2. Nguồn Feedback Notes

| Feedback | Người facilitate | Tester | Thứ tự A/B/C | Link |
|---|---|---|---|---|
| Feedback 1 | Lê Duy Bảo | Đinh Tuấn Long-học viên track 3 AI20K | A → B → C | [link](prototype-feedback-note-ldbao.md) |
| Feedback 2 | Vũ Quốc Bảo | Trịnh Quốc Hoàng — học viên track 2, thường ghi ý chính vào Notepad | A → B → C | [link](prototype-feedback-note-vqbao.md) |
| Feedback 3 | Nguyễn Đình Anh Đức | Trần Quốc Sáng — học viên track AI20K, gần đây dùng ghi chú trên VLearn | A → B → C | [link](prototype-feedback-note-ndaduc.md) |

Cả tester thử đủ A/B/C đều ngoài nhóm.
---

## 3. Feedback Comparison

| Nội dung | Feedback 1 | Feedback 2 | Feedback 3 | Pattern hoặc khác biệt |
|---|---|---|---|---|
| First action | A: xem slide rồi chọn chữ. B: chọn bài ở sidebar rồi bôi đen. C: bảng ghi mở Ghi chú → Tổng hợp, nhưng chưa rõ thuộc phiên gốc hay lượt deploy. | A: dùng bút highlight. B: chọn đoạn rồi highlight. C: thử lần lượt các mục Ghi chú của tôi, Trợ giảng AI, Tài liệu, Hỗ trợ. | A: xem/chuyển slide rồi highlight. B: chọn bài rồi bôi đen. C: nhìn tổng thể rồi bôi đen đoạn. | Điểm bắt đầu khác nhau; chưa có bằng chứng cả ba tự đi vào luồng tổng hợp của C. |
| Breakdown chính | A: font lạ, bất tiện chuyển qua lại với slide. B: chọn không hết đoạn/che chữ. C: panel hoặc fullscreen bị cắt. | A: bút chọn vùng trái kỳ vọng tô chữ, dừng khoảng 6 giây. B: chưa rõ câu trả lời AI sẽ thành note, dừng khoảng 8 giây. C: nhận xét UI chưa thân thiện. | A: font lạ. B: không chọn hết đoạn. C: không thấy nút sau khi bôi đen, cần gợi ý; fullscreen lỗi. | B có lỗi chọn chữ ở F1/F3; C có lỗi bố cục ở F1/F3 và phàn nàn giao diện ở cả ba, nhưng không cùng một lỗi. |
| Evidence được đọc/bỏ qua | A/B có mở nguồn. C có thao tác Mở nguồn được ghi, nhưng cần xác minh xuất xứ quan sát. | A/C mở nguồn; B không quan sát thấy mở nguồn. | A/B/C đều mở nguồn. | Có hành vi truy về slide; chưa chứng minh đọc kỹ hoặc đối chiếu tính đúng của nội dung AI. |
| Cách lấy lại control | A: Tẩy, đóng nguồn, Về bài học. B: Xóa highlight. C: sửa/duyệt được ghi trong lượt deploy, chưa xác nhận hành vi tester. | A: Undo. B: Xóa highlight. C: không quan sát thấy. | A: Tẩy, đóng nguồn. B: Xóa highlight. C: Esc thoát fullscreen và Xóa. | Xóa/hoàn tác được sử dụng; kiểm soát thao tác chưa đồng nghĩa kiểm soát nội dung AI. |
| Option được chọn | C | C | C | Cả ba chọn C sau trải nghiệm. |
| Lý do lựa chọn | Cấu trúc ghi chú dễ theo dõi, luồng đầy đủ, trao đổi Coach tiện. | Nhiều tính năng, trao đổi 1v1 với Coach. | Có tương tác trực tiếp với Lab Coach. | Coach xuất hiện trong lý do của cả ba; có thể ảnh hưởng mạnh đến lựa chọn C. |
| Trade-off | Chấp nhận thời gian làm quen thao tác. | Chấp nhận thời gian tìm hiểu nếu đáp ứng nhu cầu note. | Chấp nhận mất thêm thời gian nếu kết quả chuẩn hơn. | Đều phát biểu chấp nhận thêm thời gian; chưa đo mức đánh đổi thực tế. |
| Evidence chống lại kỳ vọng | Chọn C dù UI bị nhận xét đơn điệu và có lỗi fullscreen; muốn AI tổng hợp, mình sửa lỗi text. | Chọn C dù UI chưa thân thiện; muốn AI làm, mình kiểm tra. | Chọn C dù giao diện rối, bước đầu cần gợi ý và fullscreen lỗi; muốn AI làm, mình sửa khi sai. | Ưa thích C không chứng minh usability tốt hay tester thực sự kiểm tra kết quả AI. |

---

## 4. Observed Patterns

### Pattern 1

- **Pattern:** Truy về slide nguồn là hành vi xuất hiện ở nhiều phiên.
- **Evidence từ Feedback 1:** Tester mở nguồn ở A và B; nhận xét A bất tiện khi chuyển qua lại để xem slide. Quan sát nguồn ở C cần xác minh có thuộc lượt deploy không.
- **Evidence từ Feedback 2:** Tester mở nguồn ở A và C; kể rằng khi xem lại note thường không rõ ghi chú thuộc phần nào và phải bật slide.
- **Evidence từ Feedback 3:** Tester mở nguồn ở A/B/C; ở C mở nguồn sau chọn chữ và sau khoanh vùng chưa hiểu.
- **Diễn giải của nhóm:** Liên kết note với slide có thể hỗ trợ nhu cầu tìm lại ngữ cảnh. Chưa đo được thời gian tìm nguồn hoặc mức giảm thao tác so với cách hiện tại.

### Pattern 2

- **Pattern:** C được chọn cùng với phát biểu muốn giao việc cho AI, nhưng chưa có bằng chứng tester kiểm tra và sửa lỗi nội dung AI.
- **Evidence:** F1 muốn AI tổng hợp note và mình sửa lỗi text; F2 muốn AI làm toàn bộ rồi mình kiểm tra; F3 muốn AI làm hết và sửa nếu sai. Cả ba nhắc Coach khi giải thích lựa chọn C. F2 không quan sát thấy recovery ở C; F3 ghi Esc/Xóa; thao tác sửa/duyệt ở F1 thuộc lượt deploy, chưa được xác nhận là tester thực hiện.
- **Diễn giải của nhóm:** Có tín hiệu quan tâm đến tự động hóa và hỗ trợ Coach. Chưa chứng minh cơ chế “AI soạn, học viên duyệt” được hiểu và sử dụng đúng, hoặc C tốt hơn A/B về chất lượng ôn bài.

---

## 5. Important Differences

### Khác biệt 1

- **Feedback/Testers liên quan:** F1/F3 so với F2, tại Option B.
- **Khác nhau ở đâu:** F1/F3 báo không chọn được hết nội dung, F1 còn báo che chữ; F2 dừng và hỏi liệu câu trả lời AI có trở thành ghi chú không.
- **Giải thích có thể có:** F1/F3 gặp trở ngại ở đầu vào; F2 gặp trở ngại hiểu cơ chế. Khác biệt có thể liên quan đoạn slide, môi trường hoặc kỳ vọng; chưa đủ dữ liệu xác định nguyên nhân.
- **Điều cần kiểm tra thêm:** Dùng cùng đoạn nhiều dòng, ghi trình duyệt/phiên bản prototype; quan sát khả năng chọn đủ chữ và hỏi tester diễn giải bước tạo note trước khi hỗ trợ.

### Khác biệt 2

- **Feedback/Testers liên quan:** F1/F3 so với F2, tại Option C.
- **Khác nhau ở đâu:** F2 tự thử các mục và không cần hỗ trợ. F3 cần gợi ý công cụ chọn chữ. F1 ghi mâu thuẫn về hỗ trợ và trộn lượt deploy. F1/F3 gặp lỗi fullscreen, F2 ghi không có sự cố kỹ thuật.
- **Điều cần kiểm tra thêm:** Xác minh ghi chép F1; thử cùng phiên bản, kích thước cửa sổ và nhiệm vụ, không gợi ý bước bắt đầu. Ghi rõ thao tác nào do tester thực hiện, thao tác nào là kiểm tra của người dựng prototype.

---

## 6. Evidence Against Our Expectations

### Kỳ vọng ban đầu

> Kỳ vọng cần kiểm tra, suy ra từ cơ chế prototype và phần phản tư của report: C sẽ cho thấy giá trị của việc AI tạo bản nháp để học viên kiểm tra, sửa và duyệt; thao tác chọn nội dung đủ rõ để tự bắt đầu. Ba report chưa có một phát biểu kỳ vọng chung được nhóm xác nhận trước test.

### Điều thực sự quan sát được

> Cả ba chọn C và đều nhắc đến Coach. F3 cần gợi ý để chọn chữ; F1 ghi mâu thuẫn về hỗ trợ. Chưa có ghi nhận chắc chắn tester đi hết luồng kiểm tra và sửa nội dung AI. F2 cũng cần hỏi cơ chế câu trả lời trở thành note ở B.

### Nhóm học được gì?

> Sự thích thú với nhiều tính năng. Cần kiểm tra riêng nhiệm vụ tạo bản ôn tập, truy nguồn và duyệt nội dung trước khi kết luận C đáp ứng tốt mục tiêu này. Nhãn công cụ và bước kế tiếp cũng chưa luôn tự giải thích.

---

## 7. Option Comparison

### Option A

- **Điểm hoạt động tốt:** Có ghi nhận tạo/lưu note ở F1/F3; cả ba mở slide nguồn và dùng Tẩy hoặc Undo.
- **Breakdown:** F1/F3 nhận xét font lạ; F1 thấy bất tiện chuyển qua lại với slide; F2 hiểu bút highlight là tô chữ nhưng thực tế chọn vùng, cần hỗ trợ.
- **Trade-off:** Có thể tự nhập và sửa note trực tiếp, nhưng phải thao tác và chuyển ngữ cảnh. Chưa đo effort tương đối.
- **Điều cần sửa:** Phân biệt rõ chọn chữ và chọn vùng; kiểm tra font và cách đối chiếu note với slide.

### Option B

- **Điểm hoạt động tốt:** F1/F3 tạo Highlight/Chưa hiểu, trả lời câu hỏi và ghép note; có sử dụng xóa highlight.
- **Breakdown:** F1/F3 không chọn đủ đoạn; F2 chưa rõ câu trả lời sẽ trở thành note và cần giải thích.
- **Trade-off:** Học viên tự diễn giải nội dung qua câu trả lời, nhưng cần thêm bước. Chưa chứng minh giúp hiểu sâu hơn hoặc ghi nhớ tốt hơn.
- **Điều cần sửa:** Sửa chọn chữ nhiều dòng/che chữ; hiển thị rõ câu trả lời sẽ được ghép thành note và bước lưu tiếp theo.

### Option C

- **Điểm hoạt động tốt:** Cả ba chọn C; đều quan tâm Coach. F1 đánh giá cấu trúc note dễ theo dõi; F2/F3 có mở nguồn.
- **Breakdown:** Phản hồi UI chưa thân thiện/rối/đơn điệu; F1/F3 lỗi panel/fullscreen; F3 cần gợi ý chọn chữ. Chưa xác nhận đủ luồng tổng hợp ở phiên tester.
- **Trade-off:** Tester phát biểu chấp nhận thời gian làm quen hoặc chờ thêm để đổi lấy tiện ích/chất lượng kỳ vọng; chưa kiểm chứng bằng hành vi dùng thật.
- **Điều cần sửa:** Làm rõ luồng tổng hợp và giữ note, nguồn, nút sửa/duyệt hiển thị đầy đủ; đánh giá Coach bằng nhiệm vụ riêng.

---

## 8. Group Next Change

Nhóm chỉ chốt một thay đổi tiếp theo quan trọng nhất.

> **Đề xuất để nhóm chốt:** Giữ Option C để sửa một luồng ưu tiên: **tạo và duyệt bản ôn tập có đối chiếu nguồn**, rồi test lại.

### Thay đổi cụ thể

Trong “Ghi chú của tôi”, hiển thị rõ đường đi **Chọn ghi chú → Tạo bản nháp → Đối chiếu slide nguồn → Sửa → Duyệt & lưu**. Bản nháp, nguồn và nút sửa/duyệt phải đọc và thao tác được trên màn hình laptop, không bị cắt khi fullscreen. Các bước đã có trên bản deploy cần được làm rõ và kiểm tra lại, không coi là chức năng mới đã được tester xác nhận.

### Evidence dẫn tới quyết định

- **F1:** Panel/fullscreen bị cắt; report tự nêu phiên gốc chưa ghi nhận tester đi hết luồng tổng hợp. Tester nhận xét cấu trúc note dễ theo dõi nhưng cũng nhắc Coach.
- **F2:** Tester mở nguồn ở C, muốn AI làm rồi mình kiểm tra; chưa quan sát được việc sửa lỗi AI và lý do chọn C tập trung vào tính năng/Coach.
- **F3:** Cần gợi ý thao tác đầu, fullscreen lỗi; mở nguồn nhưng vẫn chọn C vì Coach, chưa có bằng chứng kiểm tra nội dung bản nháp.

### Tại sao đây là thay đổi ưu tiên?

Luồng này kiểm tra trực tiếp ý tưởng chính của C và quyền kiểm soát nội dung AI, hiện còn thiếu bằng chứng. Sửa hiển thị trong cùng luồng giúp tránh việc lỗi bố cục làm gián đoạn test. Đây là ưu tiên đề xuất cho mục tiêu đánh giá cơ chế tổng hợp, không phải kết luận mọi lỗi A/B ít quan trọng hơn.

### Điều gì được giữ nguyên?

- Học viên AI20K tạo ghi chú từ bài học và xem lại để ôn tập.
- Cùng nội dung slide và nhiệm vụ tạo bản ôn tập, tìm lại nguồn.
- Note gắn nguồn; AI tạo nháp; học viên có thể sửa và duyệt. Bản ghi chú gốc được giữ trong thiết kế C.
- Coach vẫn là một chức năng của prototype, nhưng được thử bằng nhiệm vụ riêng để xác định giá trị từng cơ chế.

---

## 9. Still Unproven

Sau ba phiên test, nhóm vẫn chưa thể kết luận:

- C tốt hơn A/B nhờ cơ chế tổng hợp AI, hay được chọn chủ yếu vì Coach và nhiều tính năng.
- Học viên tự đi hết luồng tạo nháp → kiểm tra nguồn → sửa → duyệt, nhất là khi không có hướng dẫn.
- Học viên đọc kỹ, phát hiện và sửa lỗi nội dung AI trước khi lưu; phát biểu “sẽ kiểm tra” chưa đủ chứng minh hành vi này.
- AI thật tạo nội dung chính xác; phần tổng hợp được ghi nhận ở lượt deploy F1 đang dùng mock.
- Sản phẩm giúp giảm thời gian tìm note, tăng chất lượng ôn tập hoặc ghi nhớ sau vài ngày.
- Các lỗi chọn chữ B và fullscreen C phổ biến đến mức nào trên các môi trường khác nhau.
- Coach hoạt động giữa các thiết bị/tài khoản; chuyển vai cùng trình duyệt chưa chứng minh trao đổi thực tế.
- Cả ba tester ngoài nhóm và kết quả không bị ảnh hưởng bởi thứ tự A → B → C, thời lượng hoặc hỗ trợ của người điều phối.


---

## 10. Proposed Follow-up Test

- **Giả thuyết tiếp theo:** Sau khi làm rõ luồng tổng hợp C và sửa hiển thị, học viên có thể tự tạo bản ôn tập, mở đúng nguồn, phát hiện một ý sai và sửa trước khi duyệt.
- **Đối tượng cần test:** Học viên AI20K ngoài nhóm, có kinh nghiệm ghi chú/ôn bài, chưa dùng bản C sửa đổi; xác nhận rõ quan hệ với nhóm.
- **Critical interaction cần test:** Chọn 2–3 note → tạo nháp → mở slide tương ứng → sửa một lỗi nội dung đã cài trong nháp thử nghiệm → duyệt lưu. Nếu dùng mock, ghi rõ đây là test tương tác kiểm tra, không phải đánh giá chất lượng AI thật.
- **Hành vi cần quan sát:** Có tự tìm điểm bắt đầu không; có mở và đọc nguồn không; có phát hiện/sửa lỗi trước khi duyệt không; có tìm lại được note gắn với slide không. Không điều hướng sang Coach trong nhiệm vụ tổng hợp.
- **Evidence cần thu thập:** Ghi màn hình, điểm dừng, thời gian tìm nguồn, số lần cần hỗ trợ, nội dung trước/sau sửa và kết quả lưu. Ghi phiên bản prototype, trình duyệt, kích thước cửa sổ; xác nhận fullscreen không che thao tác. Nếu tiếp tục so sánh A/B/C, đổi thứ tự giữa tester và giữ nhiệm vụ/nội dung tương đương.

---

## 11. Gate 5 Checklist

- [x] Có đủ ba Feedback Notes độc lập.
- [x] Mỗi tester trải nghiệm đủ A/B/C.
- [x] Observation được tách khỏi interpretation.
- [x] Có pattern hoặc khác biệt giữa ba tester.
- [x] Có evidence chống lại kỳ vọng nếu xuất hiện.
- [x] Group Next Change dựa trên evidence.
- [x] Chỉ chốt một Next Change ưu tiên.
- [x] Có Still Unproven.
- [x] Không chỉ kết luận “ba tester thích option X”.
- [x] Không tuyên bố solution đã được validated.