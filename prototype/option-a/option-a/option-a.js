/*
 * OPTION A — User tự highlight, tự ghi chú, tự viết bản ôn tập. Hệ thống chỉ gom theo mục bài.
 *
 * Luồng:
 *  1. Bài học: user kéo chuột trên slide để tô một vùng (highlight), thêm ghi chú cho vùng đó,
 *     hoặc dùng công cụ T để viết ghi chú chữ lên slide. Panel "Sổ ghi chú" gom theo mục ngay lập tức.
 *  2. Ôn bài (critical interaction): user tự gắn nhãn và tự viết ghi chú ôn tập cho từng mục.
 *  3. Bản ghi chú ôn tập (kết quả).
 *
 * Slide là ảnh (giống VLearn), nên highlight là một vùng chữ nhật (toạ độ chuẩn hoá 0..1 trên slide).
 * "AI" chỉ làm một việc: xếp mỗi highlight vào mục của slide chứa nó. Không đọc, không diễn giải nội dung
 * slide, không dùng model/API thật. Slide không thuộc mục nào → "Chưa xác định được mục", không đoán.
 * Dữ liệu lưu trong localStorage; nút "Làm lại từ đầu" xóa sạch.
 */
(function () {
  const { F, esc, slideBy, sectionBy, ICON } = VL;
  const STORE = "vlearn-option-a-v4";
  const IMG_W = 1500; // độ rộng ảnh slide gốc (px), dùng để không phóng to ảnh cắt quá mức

  const LABELS = {
    main: { name: "Ý chính", ph: "Viết lại ý này bằng lời của bạn…" },
    unclear: { name: "Chưa hiểu", ph: "Bạn chưa hiểu chỗ nào? Viết ra để lần sau hỏi hoặc tra cứu…" },
    question: { name: "Câu hỏi", ph: "Câu hỏi bạn muốn được giải đáp…" }
  };
  const DEFAULT_PH = "Viết ghi chú ôn tập cho mục này…";
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  const fresh = () => ({ view: "lesson", slide: 1, tool: "pointer", panel: true, tab: "sorted", marks: [], items: {}, savedAt: null, seq: 0 });
  const load = () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && Array.isArray(s.marks)) return Object.assign(fresh(), s);
    } catch (e) { /* bỏ qua */ }
    return null;
  };
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* bỏ qua */ } };

  let state = load() || fresh();
  let history = [];          // ảnh chụp {marks, items} trước mỗi thay đổi ở màn bài học
  let pop = null;            // popover đang mở
  let flashId = null;        // mục vừa tạo, nhấp nháy một lần
  let focusId = null;        // mục cần làm nổi bật khi nhảy tới slide
  let pendingRender = false;
  let suppressClick = false;
  let drag = null;

  const main = VL.mountShell(document.getElementById("app"), { onReset: reset });

  /* ---------- Dữ liệu ---------- */
  const markBy = (id) => state.marks.find((m) => m.id === id);
  const defSection = (m) => slideBy(m.slide).section;
  const item = (id) => {
    if (!state.items[id]) { const m = markBy(id); state.items[id] = { section: m ? defSection(m) : null, hidden: false, label: null, text: "" }; }
    return state.items[id];
  };
  const sortedMarks = () => [...state.marks].sort((a, b) => a.slide - b.slide || a.y - b.y || a.x - b.x);
  const visible = () => sortedMarks().filter((m) => !item(m.id).hidden);
  const writtenCount = () => visible().filter((m) => item(m.id).text.trim()).length;
  const secName = (id) => (id ? sectionBy(id).title : "Chưa xác định được mục");
  const snap = () => JSON.stringify({ marks: state.marks, items: state.items });
  const pushHistory = (s = snap()) => { history.push(s); if (history.length > 50) history.shift(); };
  const restore = (s) => { const o = JSON.parse(s); state.marks = o.marks; state.items = o.items; };
  const groupsOf = (list) => F.sections.map((s) => ({ id: s.id, title: s.title, list: list.filter((m) => item(m.id).section === s.id) }))
    .concat([{ id: null, title: "Chưa xác định được mục", list: list.filter((m) => !item(m.id).section) }])
    .filter((g) => g.list.length);

  /* Ảnh cắt đúng vùng đã tô (không cần nhận dạng chữ) */
  function thumb(m, maxW, maxH) {
    const aspect = (m.w * 16) / (m.h * 9);
    const tw = Math.max(24, Math.min(maxW, maxH * aspect, m.w * IMG_W));
    const th = tw / aspect;
    return `<span class="a-thumb" role="img" aria-label="Vùng đã tô ở slide ${m.slide}" style="width:${tw.toFixed(1)}px;height:${th.toFixed(1)}px;background-image:url('${slideBy(m.slide).img}');background-size:${(tw / m.w).toFixed(1)}px ${(th / m.h).toFixed(1)}px;background-position:${(-m.x * tw / m.w).toFixed(1)}px ${(-m.y * th / m.h).toFixed(1)}px">${(m.rects || []).map((r) => `<i style="left:${((r.x - m.x) / m.w * 100).toFixed(2)}%;top:${((r.y - m.y) / m.h * 100).toFixed(2)}%;width:${(r.w / m.w * 100).toFixed(2)}%;height:${(r.h / m.h * 100).toFixed(2)}%"></i>`).join("")}</span>`;
  }
  const plain = (m) => (m.kind === "highlight" ? `vùng đã tô${m.note.trim() ? ` (“${m.note.trim()}”)` : ""}` : `ghi chú “${m.text}”`);

  function reset() {
    try { localStorage.removeItem(STORE); } catch (e) { /* bỏ qua */ }
    closePop(false, true);
    state = fresh(); history = [];
    render();
  }

  function undo() {
    if (!history.length) return;
    restore(history.pop());
    render();
  }

  function removeMark(id) {
    const before = snap();
    pushHistory(before);
    state.marks = state.marks.filter((m) => m.id !== id);
    delete state.items[id];
    render();
    VL.toast("Đã xóa.", "Hoàn tác", () => { restore(before); history.pop(); render(); });
  }

  /* ---------- Lớp chữ thật của PDF (vô hình, để bôi đen) ---------- */
  const PW = 720, PH = 405;
  const ctx = document.createElement("canvas").getContext("2d");
  const textCache = {};
  function textLayer(n) {
    if (textCache[n]) return textCache[n];
    const words = (window.VL_TEXT && VL_TEXT[n]) || [];
    ctx.font = "100px Arial, Helvetica, sans-serif";
    textCache[n] = words.map((w, i) => {
      const [t, x0, y0, x1, y1] = w, h = y1 - y0, fs = h * 0.85;
      const nat = (ctx.measureText(t).width / 100) * fs || 1;
      const f = Math.min(3, Math.max(0.3, (x1 - x0) / nat));
      return `<span data-i="${i}" style="left:${(x0 / PW * 100).toFixed(3)}%;top:${(y0 / PH * 100).toFixed(3)}%;font-size:${(fs / PW * 100).toFixed(3)}cqw;line-height:${(h / PW * 100).toFixed(3)}cqw;transform:scaleX(${f.toFixed(3)})">${esc(t)} </span>`;
    }).join("");
    return textCache[n];
  }

  /* ---------- Slide (ảnh + lớp phủ) ---------- */
  function slideHTML(n, { focus = null } = {}) {
    const s = slideBy(n);
    const ms = state.marks.filter((m) => m.slide === n);
    const pct = (v) => `${(v * 100).toFixed(2)}%`;
    const cls = (m, base) => `${base}${focus === m.id ? " is-focus" : ""}${flashId === m.id ? " is-new" : ""}`;
    const over = ms.map((m) => {
      if (m.kind === "text") {
        return `<div class="${cls(m, "vl-textnote")}" data-hid="${m.id}" style="left:${pct(m.x)};top:${pct(m.y)};max-width:${pct(1 - m.x)}">${esc(m.text)}</div>`;
      }
      const note = m.note.trim()
        ? `<div class="${cls(m, "vl-hand")}" data-hid="${m.id}" style="left:${pct(m.x)};max-width:${pct(1 - m.x)};${m.y + m.h > 0.88 ? `top:${pct(m.y)};transform:translateY(-100%)` : `top:${pct(m.y + m.h)}`}">${esc(m.note)}</div>`
        : "";
      const boxes = (m.rects || [m]).map((r) => `<div class="${cls(m, "vl-mark")}" data-hid="${m.id}" style="left:${pct(r.x)};top:${pct(r.y)};width:${pct(r.w)};height:${pct(r.h)}"></div>`).join("");
      return `${boxes}${note}`;
    }).join("");
    return `<div class="vl-slide" data-n="${n}"><img src="${s.img}" alt="${esc(s.title)}" draggable="false"><div class="vl-text" aria-hidden="true">${textLayer(n)}</div><div class="vl-over">${over}</div></div>`;
  }

  const openSlide = (m) => VL.openModal(`Slide ${m.slide} / ${F.slides.length} · ${slideBy(m.slide).title}`, slideHTML(m.slide, { focus: m.id }));

  /* ---------- Render chung ---------- */
  function render() {
    pendingRender = false;
    hideSelBtn();
    if (state.view === "lesson") renderLesson();
    else if (state.view === "review") renderReview();
    else renderResult();
    flashId = null; focusId = null;
    persist();
  }
  const go = (view) => { closePop(true, true); document.querySelectorAll(".vl-toast").forEach((t) => t.remove()); state.view = view; render(); main.scrollTop = 0; };

  /* ---------- 1. Màn bài học + Sổ ghi chú realtime ---------- */
  const TOOLS = [
    ["pointer", "➤", "Chọn"],
    ["pen", "✎", "Bút vẽ", true],
    ["highlight", "🖍", "Bút vùng: kéo chuột để tô một khung trên slide (hình, biểu đồ)"],
    ["circle", "◯", "Hình", true],
    ["eraser", "⌫", "Tẩy: bấm vào vùng tô hoặc ghi chú để xóa"],
    ["bulb", "💡", "Gợi ý", true],
    ["text", "T", "Ghi chú chữ: bấm vào vị trí trên slide để viết"]
  ];
  const HINT = {
    pointer: "Bôi đen chữ trên slide rồi bấm “🖍 Highlight”. Với hình/biểu đồ: chọn bút 🖍 rồi kéo chuột để tô vùng. Bấm vào vùng đã tô để thêm ghi chú.",
    highlight: "Bút vùng: kéo chuột để tô một khung chữ nhật (dùng cho hình, biểu đồ, ảnh chụp màn hình).",
    text: "Ghi chú chữ: bấm vào vị trí bất kỳ trên slide để viết ghi chú.",
    eraser: "Tẩy: bấm vào vùng đã tô hoặc ghi chú trên slide để xóa."
  };

  function renderLesson() {
    const keepScroll = main.querySelector(".a-live-body")?.scrollTop || 0;
    main.innerHTML = `
      <div class="a-lesson${state.panel ? " with-panel" : ""}">
        <div class="a-col">
          <div class="vl-stage tool-${state.tool}">${slideHTML(state.slide, { focus: focusId })}</div>
          <div class="vl-toolbar">
            <div class="vl-tools">
              ${TOOLS.map(([k, ic, t, dis]) => `<button class="vl-tool${state.tool === k ? " on" : ""}" ${dis ? "disabled" : `data-tool="${k}"`} title="${esc(t)}" aria-label="${esc(t)}">${ic}</button>`).join("")}
              <span class="vl-tool-sep"></span>
              <button class="vl-tool" data-act="undo" title="Hoàn tác" aria-label="Hoàn tác" ${history.length ? "" : "disabled"}>↶</button>
            </div>
            <div class="vl-pager">
              <button data-nav="-1" ${state.slide <= 1 ? "disabled" : ""} aria-label="Slide trước">‹</button>
              <span><b>${state.slide}</b> / ${F.slides.length}</span>
              <button data-nav="1" ${state.slide >= F.slides.length ? "disabled" : ""} aria-label="Slide sau">›</button>
            </div>
            <button class="vl-tb-btn${state.panel ? " is-on" : ""}" data-act="panel">${ICON.book} Sổ ghi chú</button>
            <button class="vl-tb-btn vl-review-btn" data-act="review">${ICON.review} ${state.savedAt ? "Bản ôn tập" : "Ôn bài"}</button>
          </div>
          <div class="a-hint">${esc(HINT[state.tool])}</div>
          <div class="vl-teacher"><div class="vl-teacher-h">▢ Ghi chú của giảng viên</div><div>Chưa có ghi chú cho phần này.</div></div>
          <div class="vl-footnav"><button class="vl-btn-ghost">‹ Bài trước</button><button class="vl-btn-primary">Đi tới bài tiếp theo ›</button></div>
        </div>
        ${state.panel ? `<aside class="a-live">${liveHTML()}</aside>` : ""}
      </div>`;
    const body = main.querySelector(".a-live-body");
    if (body) body.scrollTop = keepScroll;
    const fresh = main.querySelector(".a-live-it.is-new");
    if (fresh) fresh.scrollIntoView({ block: "nearest" });
  }

  function liveItemHTML(m) {
    const q = m.kind === "highlight"
      ? `${thumb(m, 250, 84)}${m.note.trim() ? `<span class="a-live-note">${esc(m.note)}</span>` : ""}`
      : `<span class="a-live-t">${esc(m.text)}</span>`;
    return `<button class="a-live-it${flashId === m.id ? " is-new" : ""}" data-goto="${m.id}"><span class="a-live-s">Slide ${m.slide}</span>${q}</button>`;
  }

  function liveHTML() {
    const ms = sortedMarks();
    const head = `
      <div class="a-live-h"><div><b>Sổ ghi chú</b> <span class="a-live-n">${ms.length}</span></div>
        <button class="vl-icon-btn" data-act="panel" aria-label="Đóng sổ ghi chú">✕</button></div>
      <div class="a-live-sub">Tự xếp theo mục của slide bạn ghi chú. Không viết lại nội dung.</div>`;
    const body = ms.length
      ? groupsOf(ms).map((g) => `
          <div class="a-live-g${g.id ? "" : " is-unsorted"}">
            <div class="a-live-gh">${esc(g.title)} <span>${g.list.length}</span></div>
            ${g.id ? "" : `<div class="a-live-unsorted">Slide này không thuộc mục nào. Bạn chọn mục khi ôn bài.</div>`}
            ${g.list.map(liveItemHTML).join("")}
          </div>`).join("")
      : `<div class="a-live-empty">Chưa có highlight hay ghi chú nào.<br><br>Bôi đen chữ trên slide rồi bấm <b>🖍 Highlight</b> (hình/biểu đồ: chọn bút <b>🖍</b> rồi kéo vùng), hoặc chọn công cụ <b>T</b> rồi bấm vào slide để viết ghi chú.</div>`;
    return `${head}<div class="a-live-body">${body}</div>
      <div class="a-live-foot"><button class="vl-btn-primary" data-act="review" ${ms.length ? "" : "disabled"}>Ôn bài từ ghi chú →</button></div>`;
  }

  function refreshLive() {
    const aside = main.querySelector(".a-live");
    if (!aside) return;
    const keep = aside.querySelector(".a-live-body")?.scrollTop || 0;
    aside.innerHTML = liveHTML();
    aside.querySelector(".a-live-body").scrollTop = keep;
  }

  /* --- Kéo chuột để tô một vùng --- */
  const relPoint = (over, e) => {
    const r = over.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
  };

  main.addEventListener("pointerdown", (e) => {
    if (state.view !== "lesson" || state.tool !== "highlight" || e.button !== 0) return;
    const over = e.target.closest(".vl-over");
    if (!over) return;
    const p = relPoint(over, e);
    drag = { over, id: e.pointerId, x0: p.x, y0: p.y, x1: p.x, y1: p.y, el: null };
    try { over.setPointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
  });

  main.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = relPoint(drag.over, e);
    drag.x1 = p.x; drag.y1 = p.y;
    if (Math.abs(drag.x1 - drag.x0) < 0.008 && Math.abs(drag.y1 - drag.y0) < 0.008) return;
    if (!drag.el) { drag.el = document.createElement("div"); drag.el.className = "vl-drag"; drag.over.appendChild(drag.el); }
    Object.assign(drag.el.style, {
      left: `${Math.min(drag.x0, drag.x1) * 100}%`, top: `${Math.min(drag.y0, drag.y1) * 100}%`,
      width: `${Math.abs(drag.x1 - drag.x0) * 100}%`, height: `${Math.abs(drag.y1 - drag.y0) * 100}%`
    });
  });

  const endDrag = (e, cancelled) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.el) d.el.remove();
    if (cancelled || !d.el) return;
    let x = Math.min(d.x0, d.x1), y = Math.min(d.y0, d.y1);
    let w = Math.abs(d.x1 - d.x0), h = Math.abs(d.y1 - d.y0);
    if (w < 0.03) { w = 0.03; x = Math.min(x, 1 - w); }
    if (h < 0.03) { h = 0.03; y = Math.min(y, 1 - h); }
    suppressClick = true;
    createHighlight({ x, y, w, h });
  };
  main.addEventListener("pointerup", (e) => endDrag(e, false));
  main.addEventListener("pointercancel", (e) => endDrag(e, true));

  function createHighlight({ x, y, w, h, rects }) {
    pushHistory();
    const id = `m${++state.seq}`;
    state.marks.push({ id, slide: state.slide, kind: "highlight", x, y, w, h, rects: rects || null, note: "", at: Date.now() });
    item(id);
    flashId = id;
    openPop(id);
  }

  /* --- Popover: ghi chú cho vùng tô / ghi chú chữ --- */
  function openPop(id, { pos, client } = {}) {
    closePop(false, true);
    render();
    const m = id ? markBy(id) : null;
    const kind = m ? m.kind : "text";
    const el = document.createElement("div");
    el.className = "a-pop";
    el.innerHTML = kind === "highlight"
      ? `<div class="a-pop-h">Vùng đã tô · Slide ${m.slide}</div>
         ${thumb(m, 280, 70)}
         <textarea rows="2" placeholder="Thêm ghi chú cho vùng này (không bắt buộc)">${esc(m.note)}</textarea>
         <div class="a-pop-row"><button class="a-link danger" data-pop="del">Xóa vùng tô</button><button class="vl-btn-primary vl-btn-sm" data-pop="done">Xong</button></div>`
      : `<div class="a-pop-h">Ghi chú chữ · Slide ${m ? m.slide : state.slide}</div>
         <textarea rows="2" placeholder="Viết ghi chú lên slide…">${m ? esc(m.text) : ""}</textarea>
         <div class="a-pop-row">${m ? `<button class="a-link danger" data-pop="del">Xóa ghi chú</button>` : "<span></span>"}
           <button class="vl-btn-primary vl-btn-sm" data-pop="done">${m ? "Xong" : "Thêm"}</button></div>`;
    document.body.appendChild(el);

    let r;
    const anchor = id ? main.querySelector(`.vl-stage [data-hid="${id}"]`) : null;
    if (anchor) r = anchor.getBoundingClientRect();
    else if (client) r = { left: client.x, top: client.y, bottom: client.y };
    else r = main.querySelector(".vl-stage").getBoundingClientRect();
    const w = el.offsetWidth, h = el.offsetHeight;
    let top = r.bottom + 8;
    if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 8);
    el.style.left = `${Math.min(Math.max(8, r.left), innerWidth - w - 8)}px`;
    el.style.top = `${top}px`;

    pop = { el, id, kind, pos, slide: m ? m.slide : state.slide, before: snap(), original: m ? (kind === "highlight" ? m.note : m.text) : "" };
    const ta = el.querySelector("textarea");
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);

    ta.addEventListener("input", () => {
      const mm = pop.id && markBy(pop.id);
      if (!mm) return;
      if (mm.kind === "highlight") mm.note = ta.value; else mm.text = ta.value;
      persist(); refreshLive();
    });
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); closePop(true); }
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); closePop(true); }
    });
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pop]");
      if (!b) return;
      if (b.dataset.pop === "done") closePop(true);
      if (b.dataset.pop === "del") { const pid = pop.id; closePop(false, true); removeMark(pid); }
    });
  }

  /* commit: lưu nội dung gõ; silent: không render lại ngay; deferRender: render sau khi nhả chuột */
  function closePop(commit = true, silent = false, deferRender = false) {
    if (!pop) return;
    const p = pop;
    pop = null;
    const value = p.el.querySelector("textarea").value.trim();
    p.el.remove();
    if (commit) {
      if (p.kind === "text" && !p.id) {
        if (value && p.pos) {
          history.push(p.before);
          const id = `m${++state.seq}`;
          state.marks.push({ id, slide: p.slide, kind: "text", x: p.pos.x, y: p.pos.y, text: value, at: Date.now() });
          item(id);
          flashId = id;
        }
      } else {
        const m = markBy(p.id);
        if (m) {
          if (m.kind === "text" && !value) { history.push(p.before); state.marks = state.marks.filter((x) => x !== m); delete state.items[m.id]; }
          else if (value !== p.original.trim()) history.push(p.before);
          if (m.kind === "highlight") m.note = value; else if (value) m.text = value;
        }
      }
    }
    if (silent) return;
    if (deferRender) { pendingRender = true; persist(); refreshLive(); } else render();
  }

  /* ---------- 2. Màn Ôn bài ---------- */
  function sourceHTML(m) {
    return m.kind === "highlight"
      ? `<div class="a-thumbwrap">${thumb(m, 560, 150)}</div>${m.note.trim() ? `<div class="a-orig">Bạn đã ghi kèm: <span class="hand">“${esc(m.note)}”</span></div>` : ""}`
      : `<div class="a-orig only">Ghi chú chữ bạn viết trên slide: <span class="hand red">“${esc(m.text)}”</span></div>`;
  }

  function sectionSelect(m) {
    const cur = item(m.id).section;
    const opts = [`<option value="" ${cur ? "" : "selected"} disabled>Chọn mục…</option>`]
      .concat(F.sections.map((s) => `<option value="${s.id}" ${cur === s.id ? "selected" : ""}>${esc(s.title)}</option>`));
    return `<select data-move="${m.id}" aria-label="Chuyển sang mục">${opts.join("")}</select>`;
  }

  function cardHTML(m) {
    const it = item(m.id);
    const chips = Object.entries(LABELS).map(([k, v]) =>
      `<button class="a-chip${it.label === k ? " on" : ""}" data-l="${k}" data-label="${m.id}" aria-pressed="${it.label === k}">${v.name}</button>`).join("");
    return `
      <div class="a-card" data-card="${m.id}">
        <div class="a-card-top">
          <span class="a-src">Slide ${m.slide} · ${esc(slideBy(m.slide).title)}</span>
          <div class="a-card-actions">
            <button class="a-link" data-view="${m.id}">Xem slide</button>
            <span>Mục:</span>${sectionSelect(m)}
            <button class="a-link danger" data-hide="${m.id}">Ẩn khỏi bản ôn</button>
          </div>
        </div>
        ${sourceHTML(m)}
        <div class="a-labels"><span>Đánh dấu:</span>${chips}</div>
        <textarea data-text="${m.id}" placeholder="${esc(it.label ? LABELS[it.label].ph : DEFAULT_PH)}">${esc(it.text)}</textarea>
      </div>`;
  }

  function sortedHTML() {
    const vis = visible();
    let html = groupsOf(vis).sort((a, b) => (a.id ? 1 : 0) - (b.id ? 1 : 0)).map((g) => g.id
      ? `<div class="a-group"><h3 class="a-group-h">${esc(g.title)} <small>${g.list.length} mục</small></h3>${g.list.map(cardHTML).join("")}</div>`
      : `<div class="a-group is-unsorted"><h3 class="a-group-h">Chưa xác định được mục <small>${g.list.length} mục</small></h3>
          <div class="a-unsorted-note">Các ghi chú này nằm ở slide không thuộc mục nào của bài. Hệ thống không tự đoán. Bạn chọn mục, hoặc để nguyên.</div>
          ${g.list.map(cardHTML).join("")}</div>`).join("");
    const hidden = sortedMarks().filter((m) => item(m.id).hidden);
    if (hidden.length) {
      html += `<details class="a-hidden" open><summary>Đã ẩn khỏi bản ôn (${hidden.length})</summary>
        ${hidden.map((m) => `<div class="a-hidden-row"><span>Slide ${m.slide}: ${esc(plain(m))}</span><button class="a-link" data-unhide="${m.id}">Đưa trở lại</button></div>`).join("")}</details>`;
    }
    return html;
  }

  function rawHTML() {
    const ms = sortedMarks();
    const moved = ms.some((m) => { const it = item(m.id); return it.hidden || it.section !== defSection(m); });
    return `
      <div class="a-raw-tools"><span>Toàn bộ vùng tô và ghi chú bạn đã tạo, theo đúng thứ tự slide. Chưa qua sắp xếp.</span>
        ${moved ? `<button class="vl-btn-ghost vl-btn-sm" data-act="restore">Khôi phục cách sắp xếp ban đầu</button>` : ""}</div>
      ${ms.map((m) => {
        const it = item(m.id);
        return `<div class="a-raw-row"><div class="n">Slide ${m.slide}</div>
          <div>${sourceHTML(m)}<div class="a-raw-meta">Đang ở: ${it.hidden ? "đã ẩn" : esc(secName(it.section))}${it.text.trim() ? ` · Ghi chú ôn tập: “${esc(it.text.trim())}”` : ""}</div></div>
          <button class="a-link" data-view="${m.id}">Xem slide</button></div>`;
      }).join("")}`;
  }

  function renderReview() {
    const n = state.marks.length;
    const head = `
      <div class="a-head">
        <button class="vl-btn-ghost vl-btn-sm" data-act="back">← Bài học</button>
        <div><div class="a-eyebrow">Ôn bài</div><h1>${esc(F.course.lesson)}</h1></div>
      </div>`;
    if (!n) {
      main.innerHTML = `<div class="a-wrap">${head}<div class="a-info">Bạn chưa có highlight hay ghi chú nào trong bài này. Quay lại bài học để tô những chỗ bạn muốn ôn.</div></div>`;
      return;
    }
    main.innerHTML = `
      <div class="a-wrap">
        ${head}
        <div class="a-info">
          Hệ thống <b>chỉ sắp xếp</b> ${n} vùng tô và ghi chú bạn đã tạo theo từng mục của bài học.
          Hệ thống <b>không đọc, không viết lại, không tóm tắt và không thêm nội dung</b>. Ghi chú ôn tập bên dưới do bạn tự viết.
          <div class="a-info-sub">Cách sắp xếp: dựa vào slide mà bạn đặt highlight. Nếu slide không thuộc mục nào, bạn tự chọn mục.</div>
        </div>
        <div class="a-tabs">
          <button class="${state.tab === "sorted" ? "on" : ""}" data-tab="sorted">Theo mục bài</button>
          <button class="${state.tab === "raw" ? "on" : ""}" data-tab="raw">Danh sách gốc (theo slide)</button>
          <span class="a-count" id="a-count">Đã viết <b>${writtenCount()}</b>/${visible().length}</span>
        </div>
        ${state.tab === "sorted" ? sortedHTML() : rawHTML()}
      </div>
      <div class="a-bar">
        <span class="a-bar-note">Những gì bạn đã viết được giữ lại khi quay về bài học.</span>
        <button class="vl-btn-ghost" data-act="back">Quay lại bài học</button>
        <button class="vl-btn-primary" data-act="save">Lưu bản ghi chú ôn tập</button>
      </div>`;
  }

  /* ---------- 3. Bản ghi chú ôn tập ---------- */
  function entryHTML(m) {
    const it = item(m.id);
    const badge = it.label ? `<span class="a-badge ${it.label}">${LABELS[it.label].name}</span>` : "";
    const body = it.text.trim() ? esc(it.text.trim()) : `<span class="a-empty">Bạn chưa viết ghi chú ôn tập cho mục này</span>`;
    const src = m.kind === "highlight"
      ? `${thumb(m, 360, 90)}${m.note.trim() ? `<div>bạn ghi kèm: <span class="hand">${esc(m.note)}</span></div>` : ""}`
      : `ghi chú chữ “${esc(m.text)}”`;
    return `<div class="a-entry">${badge}${body}<div class="a-entry-src">${src}<div>↳ <button class="a-link" data-view="${m.id}">Xem Slide ${m.slide}</button></div></div></div>`;
  }

  function renderResult() {
    const vis = visible();
    const t = new Date(state.savedAt);
    const time = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
    const focus = vis.filter((m) => ["unclear", "question"].includes(item(m.id).label));
    const hiddenN = state.marks.length - vis.length;
    main.innerHTML = `
      <div class="a-wrap">
        <div class="a-head">
          <div><div class="a-eyebrow">Bản ghi chú ôn tập · đã lưu lúc ${time}</div><h1>${esc(F.course.lesson)}</h1></div>
          <div class="a-res-actions">
            <button class="vl-btn-ghost" data-act="edit">Chỉnh sửa</button>
            <button class="vl-btn-primary" data-act="back">Về bài học</button>
          </div>
        </div>
        <section class="a-focus">
          <h3>Cần làm rõ (${focus.length})</h3>
          ${focus.length ? focus.map(entryHTML).join("") : `<div class="a-muted">Bạn chưa đánh dấu mục nào là “Chưa hiểu” hoặc “Câu hỏi”.</div>`}
        </section>
        ${groupsOf(vis).map((g) => `<section class="a-sec"><h3>${esc(g.title)}</h3>${g.list.map(entryHTML).join("")}</section>`).join("")}
        ${hiddenN ? `<p class="a-muted" style="margin-top:20px">${hiddenN} mục đã ẩn, không có trong bản ôn tập. Bấm “Chỉnh sửa” để đưa trở lại.</p>` : ""}
      </div>`;
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener("mousedown", (e) => {
    suppressClick = false;
    if (selBtn && !selBtn.contains(e.target)) hideSelBtn();
    if (pop && !pop.el.contains(e.target)) closePop(true, false, true);
  });

  /* --- Bôi đen chữ trên slide → nút Highlight --- */
  let selBtn = null, selData = null;
  const hideSelBtn = () => { if (selBtn) { selBtn.remove(); selBtn = null; } selData = null; };

  function readSelection() {
    const sel = getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    const layer = main.querySelector(".vl-stage .vl-text");
    if (!layer || !layer.contains(sel.anchorNode) && !layer.contains(sel.focusNode)) return null;
    const words = (VL_TEXT[state.slide] || []);
    const hit = [...layer.children].filter((sp) => sel.containsNode(sp, true)).map((sp) => words[+sp.dataset.i]);
    if (!hit.length) return null;
    const lines = [];
    hit.forEach((w) => {
      const mid = (w[2] + w[4]) / 2;
      const ln = lines.find((l) => mid > l.y0 && mid < l.y1);
      if (ln) { ln.x0 = Math.min(ln.x0, w[1]); ln.x1 = Math.max(ln.x1, w[3]); ln.y0 = Math.min(ln.y0, w[2]); ln.y1 = Math.max(ln.y1, w[4]); }
      else lines.push({ x0: w[1], x1: w[3], y0: w[2], y1: w[4] });
    });
    const rects = lines.map((l) => ({ x: clamp((l.x0 - 1.5) / PW), y: clamp((l.y0 - 0.5) / PH), w: (l.x1 - l.x0 + 3) / PW, h: (l.y1 - l.y0 + 1) / PH }));
    const x = Math.min(...rects.map((r) => r.x)), y = Math.min(...rects.map((r) => r.y));
    const x2 = Math.max(...rects.map((r) => r.x + r.w)), y2 = Math.max(...rects.map((r) => r.y + r.h));
    const rg = sel.getRangeAt(0).getBoundingClientRect();
    return { rects, x, y, w: x2 - x, h: y2 - y, at: { x: rg.left, y: rg.bottom } };
  }

  function showSelBtn() {
    hideSelBtn();
    if (state.view !== "lesson" || state.tool !== "pointer" || pop) return;
    const d = readSelection();
    if (!d) return;
    selData = d;
    selBtn = document.createElement("button");
    selBtn.className = "a-selbtn";
    selBtn.textContent = "🖍 Highlight";
    selBtn.style.left = `${Math.min(Math.max(8, d.at.x), innerWidth - 130)}px`;
    selBtn.style.top = `${Math.min(d.at.y + 8, innerHeight - 44)}px`;
    selBtn.addEventListener("mousedown", (e) => e.preventDefault());
    selBtn.addEventListener("click", () => {
      const data = selData;
      hideSelBtn();
      getSelection().removeAllRanges();
      suppressClick = true;
      createHighlight(data);
    });
    document.body.appendChild(selBtn);
  }

  document.addEventListener("mouseup", (e) => {
    if (selBtn && selBtn.contains(e.target)) return;
    setTimeout(() => {
      if (pendingRender && !pop) render();
      else if (e.target.closest && e.target.closest(".vl-text")) showSelBtn();
    }, 0);
  });

  main.addEventListener("click", (e) => {
    if (suppressClick) { suppressClick = false; return; }
    const d0 = e.target.closest("[data-hid]");
    const el = e.target.closest("button, [data-hid]");

    /* --- Màn bài học --- */
    if (state.view === "lesson") {
      if (d0 && e.target.closest(".vl-stage")) {
        if (state.tool === "eraser") return removeMark(d0.dataset.hid);
        return openPop(d0.dataset.hid);
      }
      const over = e.target.closest(".vl-over");
      if (over && state.tool === "text") {
        const p = relPoint(over, e);
        return openPop(null, { pos: { x: Math.min(p.x, 0.92), y: Math.min(p.y, 0.95) }, client: { x: e.clientX, y: e.clientY } });
      }
      if (!el) return;
      const d = el.dataset;
      if (d.tool) { state.tool = d.tool; return render(); }
      if (d.nav) { state.slide = Math.min(F.slides.length, Math.max(1, state.slide + Number(d.nav))); return render(); }
      if (d.act === "panel") { state.panel = !state.panel; return render(); }
      if (d.act === "undo") return undo();
      if (d.act === "review") return go(state.savedAt ? "result" : "review");
      if (d.goto) { const m = markBy(d.goto); state.slide = m.slide; focusId = m.id; return render(); }
      return;
    }

    /* --- Ôn bài / Kết quả --- */
    if (!el) return;
    const d = el.dataset;
    if (d.act === "back") return go("lesson");
    if (d.act === "edit") return go("review");
    if (d.act === "save") { state.savedAt = Date.now(); return go("result"); }
    if (d.tab) { state.tab = d.tab; return render(); }
    if (d.view) return openSlide(markBy(d.view));
    if (d.act === "restore") {
      const prev = JSON.stringify(state.items);
      state.marks.forEach((m) => { const it = item(m.id); it.section = defSection(m); it.hidden = false; });
      render();
      return VL.toast("Đã khôi phục cách sắp xếp ban đầu. Ghi chú bạn viết vẫn giữ nguyên.", "Hoàn tác", () => { state.items = JSON.parse(prev); render(); });
    }
    if (d.hide) {
      const prev = JSON.stringify(state.items);
      item(d.hide).hidden = true;
      render();
      return VL.toast("Đã ẩn khỏi bản ôn.", "Hoàn tác", () => { state.items = JSON.parse(prev); render(); });
    }
    if (d.unhide) { item(d.unhide).hidden = false; return render(); }
    if (d.label) {
      const it = item(d.label);
      it.label = it.label === d.l ? null : d.l;
      persist();
      const card = main.querySelector(`[data-card="${d.label}"]`);
      card.querySelectorAll(".a-chip").forEach((c) => { const on = c.dataset.l === it.label; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
      card.querySelector("textarea").placeholder = it.label ? LABELS[it.label].ph : DEFAULT_PH;
    }
  });

  main.addEventListener("input", (e) => {
    const id = e.target.dataset.text;
    if (!id) return;
    item(id).text = e.target.value;
    persist();
    const c = main.querySelector("#a-count");
    if (c) c.innerHTML = `Đã viết <b>${writtenCount()}</b>/${visible().length}`;
  });

  main.addEventListener("change", (e) => {
    const id = e.target.dataset.move;
    if (!id) return;
    const prev = JSON.stringify(state.items);
    item(id).section = e.target.value;
    render();
    VL.toast(`Đã chuyển sang mục “${secName(e.target.value)}”.`, "Hoàn tác", () => { state.items = JSON.parse(prev); render(); });
  });

  render();
})();
