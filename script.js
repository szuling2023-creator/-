async function loadContent() {
  const res = await fetch("content.json");
  const data = await res.json();

  // ===== 基本資訊 =====
  document.title = `${data.site.name}｜${data.site.title}`;
  const brand = document.getElementById("brand");
  const siteTitle = document.getElementById("siteTitle");
  const tagline = document.getElementById("tagline");
  const intro = document.getElementById("intro");

  if (brand) brand.textContent = `${data.site.name}｜Portfolio`;
  if (siteTitle) siteTitle.textContent = data.site.title;
  if (tagline) tagline.textContent = data.site.tagline;
  if (intro) intro.textContent = data.site.intro;

  // ===== Email =====
  const mailto = `mailto:${data.site.email}?subject=合作洽談｜作品集詢問`;
  const emailBtn = document.getElementById("emailBtn");
  const emailBtn2 = document.getElementById("emailBtn2");
  const emailText = document.getElementById("emailText");
  if (emailBtn) emailBtn.setAttribute("href", mailto);
  if (emailBtn2) emailBtn2.setAttribute("href", mailto);
  if (emailText) emailText.innerHTML = `<b>${data.site.email}</b>`;

  // ===== 服務快速清單（Hero 右側）=====
  const quick = document.getElementById("servicesQuick");
  if (quick) {
    const quickItems = (data.services || []).flatMap(s => s.items || []).slice(0, 7);
    quick.innerHTML = quickItems.map(i => `<li>${i}</li>`).join("");
  }

  // ===== 服務區塊 =====
  const servicesList = document.getElementById("servicesList");
  if (servicesList) {
    servicesList.innerHTML = (data.services || []).map(s => `
      <div class="card">
        <div class="kicker">${s.name}</div>
        <ul class="small">
          ${(s.items || []).map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    `).join("");
  }

  // ===== 作品：分類 → 橫向滑動瀏覽 =====
  const CATEGORY_ORDER = [
    "Banner",
    "傳單",
    "文宣/社群圖",
    "一頁式",
    "縮圖設計",
    "Logo 設計",
    "展示架設計"
  ];

  const worksWrap = document.getElementById("worksByCategory");

  function renderWorksByCategory() {
    if (!worksWrap) return;

    const works = Array.isArray(data.works) ? data.works : [];

    worksWrap.innerHTML = CATEGORY_ORDER.map(cat => {
      const list = works.filter(w => w.category === cat);
      if (!list.length) return "";

      return `
        <div class="work-section">
          <div class="work-head">
            <h3 class="work-title">${cat}</h3>
            <div class="work-count">${list.length} 件</div>
          </div>

          <div class="work-scroll">
            ${list.map(w => `
              <div class="work-card">
                <div class="thumb-wrap" data-wm="© ${data.site.name}" data-preview="${w.thumb}">
                  <img class="thumb" src="${w.thumb}" alt="${w.title}">
                </div>
                <p class="small"><b>${w.title}</b></p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  renderWorksByCategory();

  // ===== 關於 =====
  const aboutText = document.getElementById("aboutText");
  if (aboutText) aboutText.textContent = data.about?.text || "";

  // ===== Footer 年份 =====
  const footer = document.getElementById("footer");
  if (footer) footer.textContent = `© ${new Date().getFullYear()} ${data.site.name}｜All rights reserved`;

  // ===== 燈箱放大預覽（無下載按鈕）=====
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (lightbox && lightboxImg) {
    document.addEventListener("click", (e) => {
      const box = e.target.closest(".thumb-wrap[data-preview]");
      if (!box) return;

      lightboxImg.src = box.dataset.preview;
      lightbox.classList.remove("hidden");
    });

    lightbox.addEventListener("click", () => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        lightbox.classList.add("hidden");
        lightboxImg.src = "";
      }
    });
  }
}

loadContent().catch(err => {
  console.error("loadContent error:", err);
});
