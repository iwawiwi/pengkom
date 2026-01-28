(() => {
  const iconMap = [
    { pattern: /outline|agenda/i, icon: "bi-list-check" },
    { pattern: /tujuan|objective/i, icon: "bi-bullseye" },
    { pattern: /ringkasan|summary/i, icon: "bi-journal-text" },
    { pattern: /tugas|assignment/i, icon: "bi-pencil-square" },
    { pattern: /hands-on|latihan|practice|praktik|praktek/i, icon: "bi-activity" },
    { pattern: /quiz|kuis/i, icon: "bi-patch-question" },
    { pattern: /ujian|exam|uts|uas/i, icon: "bi-clipboard-check" },
    { pattern: /presentasi|presentation|final/i, icon: "bi-easel" },
    { pattern: /tools|persiapan/i, icon: "bi-tools" },
    { pattern: /peringatan|warning/i, icon: "bi-exclamation-triangle" },
    { pattern: /studi kasus|case/i, icon: "bi-search" },
    { pattern: /pengantar|intro/i, icon: "bi-compass" }
  ];

  const getLmsUrl = () => {
    const meta = document.querySelector("meta[name='lms-url']");
    if (meta && meta.content) return meta.content;
    return window.location.href;
  };

  // const insertSectionDivider = () => {
  //   const slides = document.querySelector(".slides");
  //   if (!slides) return;
  //   if (slides.querySelector("section.section-divider")) return;

  //   const sections = slides.querySelectorAll(":scope > section");
  //   if (!sections.length) return;

  //   const titleSection = sections[0];
  //   const subtitle = titleSection.querySelector(".title-box h3")?.textContent?.trim();

  //   const divider = document.createElement("section");
  //   divider.className = "section-divider";
  //   divider.innerHTML = `
  //     <h2>Agenda Pertemuan</h2>
  //     ${subtitle ? `<p class="text-muted">${subtitle}</p>` : ""}
  //     <hr>
  //     <p class="text-small">Fokus materi, praktik, dan evaluasi pada pertemuan ini.</p>
  //   `;

  //   slides.insertBefore(divider, sections[1] || null);
  // };

  const addHeadingIcons = () => {
    document.querySelectorAll(".slides h3, .slides h4").forEach((heading) => {
      if (heading.closest(".title-box")) return;
      if (heading.querySelector("i.section-icon")) return;
      const text = heading.textContent || "";
      const entry = iconMap.find((m) => m.pattern.test(text));
      if (!entry) return;
      const icon = document.createElement("i");
      icon.className = `bi ${entry.icon} section-icon`;
      icon.setAttribute("aria-hidden", "true");
      heading.prepend(icon);
    });
  };

  const normalizeHeadingLanguage = () => {
    const replacements = [
      { from: /\bQuiz\b/gi, to: "Kuis" },
      { from: /\bFinal Project\b/gi, to: "Proyek Akhir" },
      { from: /\bPresentation\b/gi, to: "Presentasi" },
      { from: /\bSummary\b/gi, to: "Ringkasan" },
      { from: /\bReview\b/gi, to: "Ulasan" },
      { from: /\bPractice\b/gi, to: "Latihan" }
    ];

    document.querySelectorAll(".slides h1, .slides h2, .slides h3, .slides h4").forEach((heading) => {
      if (heading.closest(".title-box")) return;
      let text = heading.textContent || "";
      replacements.forEach(({ from, to }) => {
        text = text.replace(from, to);
      });
      heading.textContent = text;
    });

    const titleBoxSubtitle = document.querySelector(".title-box h3");
    if (titleBoxSubtitle) {
      titleBoxSubtitle.textContent = titleBoxSubtitle.textContent
        .replace(/\bPertemuan\s*(\d+)\s*-\s*/i, "Pertemuan $1: ")
        .replace(/\bPertemuan\s*(\d+)\s*\|\s*/i, "Pertemuan $1: ");
    }
  };


  const normalizeImages = () => {
    document.querySelectorAll(".slides img").forEach((img) => {
      if (img.closest(".footer-logos")) return;
      if (img.classList.contains("no-media")) return;
      img.classList.add("media-16x9");
    });
  };

  const insertQrSlide = () => {
    const slides = document.querySelector(".slides");
    if (!slides) return;
    if (slides.querySelector("section[data-qr-slide='true']")) return;

    const sections = Array.from(slides.querySelectorAll(":scope > section"));
    if (!sections.length) return;

    const lmsUrl = getLmsUrl();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(lmsUrl)}`;

    const qr = document.createElement("section");
    qr.setAttribute("data-qr-slide", "true");
    qr.innerHTML = `
      <h3>Akses LMS</h3>
      <p class="text-small">Pindai QR untuk membuka LMS.</p>
      <div style="display:flex; align-items:center; justify-content:center; gap:24px;">
        <img src="${qrUrl}" alt="QR LMS" class="no-media" style="width:180px; height:180px;" />
        <div class="text-left text-small">
          <p><strong>URL:</strong></p>
          <p>${lmsUrl}</p>
        </div>
      </div>
    `;

    const last = sections[sections.length - 1];
    slides.insertBefore(qr, last);
  };

  document.addEventListener("DOMContentLoaded", () => {
    // insertSectionDivider();
    normalizeHeadingLanguage();
    addHeadingIcons();
    normalizeImages();
    // insertQrSlide();
    handleAutoPrint();
  });

  const handleAutoPrint = () => {
    if (window.location.search.includes("print-pdf")) {
      // Force light mode for printing
      document.documentElement.dataset.theme = "light";
      
      window.addEventListener("load", () => {
        setTimeout(() => {
          window.print();
        }, 1000);
      });
    }
  };
})();
