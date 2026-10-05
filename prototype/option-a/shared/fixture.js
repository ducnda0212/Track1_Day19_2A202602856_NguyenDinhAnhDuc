/*
 * CONTENT FIXTURE — dùng chung cho Option A, B, C
 * Bộ slide thật: "BLAS: AI20k LAB Workflow Guide Agent" (11 trang, ảnh trong shared/slides/).
 *
 * Chỉ chứa nội dung bài học (slide + mục). Highlight và ghi chú do tester tự tạo khi dùng prototype.
 * Mục của mỗi slide quyết định cách hệ thống "gom". Trang bìa (1) và trang cảm ơn (11) cố ý không thuộc
 * mục nào, để kiểm tra cách hệ thống xử lý khi không chắc.
 */
window.VL_FIXTURE = {
  course: {
    title: "Bài 3 · Day 18+19 Design the Experiment - Human-Centered AI Design",
    module: "MODULE 1 · DESIGN THE EXPERIMENT",
    lesson: "Slide: BLAS · Workflow Guide Agent"
  },

  sections: [
    { id: "p", title: "01 · Problem" },
    { id: "s", title: "02 · Solution" },
    { id: "v", title: "03 · Validation & Verification" }
  ],

  slides: [
    { n: 1,  section: null, title: "BLAS: AI20k LAB Workflow Guide Agent",              img: "../shared/slides/slide-01.jpg" },
    { n: 2,  section: "p",  title: "01 · Problem",                                       img: "../shared/slides/slide-02.jpg" },
    { n: 3,  section: "p",  title: "Overview – Internal Survey",                         img: "../shared/slides/slide-03.jpg" },
    { n: 4,  section: "p",  title: "Overview – Product Feasibility",                     img: "../shared/slides/slide-04.jpg" },
    { n: 5,  section: "s",  title: "02 · Solution",                                      img: "../shared/slides/slide-05.jpg" },
    { n: 6,  section: "s",  title: "Competitors Analysis – NotebookLM & ChatGPT Study Space", img: "../shared/slides/slide-06.jpg" },
    { n: 7,  section: "s",  title: "AI20k LAB Workflow Guide Agent",                     img: "../shared/slides/slide-07.jpg" },
    { n: 8,  section: "s",  title: "Workflow Guide Agent – UI Overview",                 img: "../shared/slides/slide-08.jpg" },
    { n: 9,  section: "v",  title: "03 · Validation & Verification",                     img: "../shared/slides/slide-09.jpg" },
    { n: 10, section: "v",  title: "Validation – User Testing / Golden Set – Verification", img: "../shared/slides/slide-10.jpg" },
    { n: 11, section: null, title: "Thank you!",                                         img: "../shared/slides/slide-11.jpg" }
  ]
};
