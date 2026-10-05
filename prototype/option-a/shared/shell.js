/*
 * VLearn shell — common context dùng chung cho Option A, B, C.
 * Gồm: header, sidebar, modal, toast hoàn tác.
 */
(function () {
  const F = window.VL_FIXTURE;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slideBy = (n) => F.slides.find((s) => s.n === n);
  const sectionBy = (id) => F.sections.find((s) => s.id === id);

  const ICON = {
    slide: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    video: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg>',
    book: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3z"/><path d="M4 17a3 3 0 013-3h11"/></svg>',
    review: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h7"/><path d="M17 15l2 2 3-4"/></svg>'
  };

  const SIDEBAR = [
    { h: "Slide bài giảng", items: [["slide", "Slide: Design the experiment"], ["video", "Video: Tổng quan ngày 18"]] },
    { h: "1. Prototype nhiều phương án", items: [["slide", "Slide: Design the experiment"], ["video", "1.1 Hãy đưa prototype ra", "4 phút"], ["video", "1.2 Parallel Prototype", "4 phút"], ["video", "1.3 Thiết kế khác nhau thế nào", "5 phút"], ["video", "1.4 Thí nghiệm không phải trình diễn"]] },
    { h: "2. Thiết kế khi AI sai", items: [["slide", F.course.lesson, "Đang học", true], ["video", "2.0 Khoảng cách giữa người dùng và AI", "6 phút"], ["video", "2.1 Người dùng nghĩ AI làm được gì", "5 phút"], ["video", "2.2a AI nên làm, hỏi, hay đứng yên", "5 phút"], ["video", "2.2b Hỏi cũng có giá", "5 phút"], ["video", "2.3a Trust đúng mức", "5 phút"], ["video", "2.3b AI đưa lời giải thích", "5 phút"], ["video", "2.4a Thiết kế lối thoát", "5 phút"], ["video", "2.4b Hai kiểu lỗi", "5 phút"], ["video", "2.5 Feedback từ người dùng", "5 phút"]] }
  ];

  function mountShell(root, { onReset } = {}) {
    const side = SIDEBAR.map((g) => `
      <div class="vl-side-group"><h4>${esc(g.h)}</h4>
        ${g.items.map(([ic, t, m, cur]) => `<div class="vl-side-item${cur ? " is-current" : ""}">${ICON[ic]}<span class="t">${esc(t)}</span>${m ? `<span class="m">${esc(m)}</span>` : ""}</div>`).join("")}
      </div>`).join("");

    root.innerHTML = `
      <div class="vl-app">
        <header class="vl-top">
          <button class="vl-icon-btn" aria-label="Quay lại">←</button>
          <div class="vl-top-title">${esc(F.course.title)}</div>
          <div class="vl-top-right">
            <span class="vl-progress">0/26 bài <span class="vl-progress-bar"></span></span>
            <span class="vl-top-link">✦ Đặt câu hỏi với AI</span>
            <span class="vl-top-link">✋ Gửi yêu cầu</span>
            <span class="vl-avatar">V</span>
          </div>
        </header>
        <aside class="vl-side">
          <div class="vl-side-mod"><span>${esc(F.course.module)}</span><span>✕</span></div>
          <div class="vl-side-sub">DESIGN THE EXPERIMENT ▾</div>
          ${side}
          <div class="vl-side-foot"><button class="vl-reset" id="vl-reset">↺ Làm lại từ đầu</button></div>
        </aside>
        <main class="vl-main" id="vl-main"></main>
      </div>`;
    root.querySelector("#vl-reset").onclick = () => onReset && onReset();
    return root.querySelector("#vl-main");
  }

  /* Modal dùng chung (ví dụ: xem slide gốc). bodyHTML do option tự render. */
  function openModal(title, bodyHTML) {
    const ov = document.createElement("div");
    ov.className = "vl-modal";
    ov.innerHTML = `<div class="vl-modal-box"><div class="vl-modal-h"><span>${esc(title)}</span><button class="vl-icon-btn" data-close aria-label="Đóng">✕</button></div>${bodyHTML}</div>`;
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => e.key === "Escape" && close();
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(ov);
  }

  /* Toast có nút Hoàn tác */
  function toast(msg, action, onAction) {
    document.querySelectorAll(".vl-toast").forEach((t) => t.remove());
    const t = document.createElement("div");
    t.className = "vl-toast";
    t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button>${esc(action)}</button>` : ""}`;
    if (action) t.querySelector("button").onclick = () => { onAction(); t.remove(); };
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 6000);
  }

  window.VL = { F, esc, slideBy, sectionBy, ICON, mountShell, openModal, toast };
})();
