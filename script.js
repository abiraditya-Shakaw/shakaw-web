// TEMPATKAN URL WEB APP GOOGLE APPS SCRIPT KAMU DI SINI:
const SHEET_API_URL = "PASTE_URL_WEB_APP_APPS_SCRIPT_DI_SINI";

// 1. Kontrol Menu Navigasi Mobile
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

// 2. Kontrol Buka-Tutup Lirik Lagu
const lyricButtons = document.querySelectorAll(".lyric-toggle");

lyricButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lyricBox = btn.nextElementSibling;
    const isOpen = lyricBox.classList.toggle("open");
    btn.textContent = isOpen ? "TUTUP LIRIK -" : "LIHAT LIRIK +";
  });
});

// 3. Ambil & Tampilkan Data Event dari Google Sheets
const eventsContainer = document.getElementById("events-container");

function renderEvents(events) {
  if (!events || events.length === 0) {
    eventsContainer.innerHTML =
      '<div class="loading-state">BELUM ADA JADWAL PANGGUNG TERDEKAT. PANTAU TERUS MEDIA SOSIAL SHAKAW.</div>';
    return;
  }

  eventsContainer.innerHTML = events
    .map((ev) => {
      const tanggal = ev.Tanggal || "TBA";
      const namaAcara = ev.Nama_Acara || "SHAKAW LIVE";
      const venue = ev.Venue || "";
      const kota = ev.Kota || "";
      const lokasi = [venue, kota].filter(Boolean).join(" — ");
      const htm = ev.HTM ? `HTM: ${ev.HTM}` : "INFO VENUE";
      const linkTiket = ev.Link_Tiket
        ? `<a href="${ev.Link_Tiket}" target="_blank" rel="noopener" class="event-btn">TIKET / INFO ↗</a>`
        : "";

      return `
        <article class="event-item">
          <div class="event-date">${tanggal}</div>
          <div>
            <h3 class="event-name">${namaAcara}</h3>
            <p class="event-loc">${lokasi}</p>
          </div>
          <div class="event-right">
            <span class="event-htm">${htm}</span>
            ${linkTiket}
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadEvents() {
  // Jika URL Google Apps Script belum dipasang, tampilkan contoh jadwal pratinjau
  if (SHEET_API_URL === "PASTE_URL_WEB_APP_APPS_SCRIPT_DI_SINI" || !SHEET_API_URL) {
    renderEvents([
      {
        Tanggal: "20 DES 2026",
        Nama_Acara: "DISTORTION NIGHT VOL. 4 (CONTOH DATA)",
        Venue: "GOR Jayabaya",
        Kota: "Kediri",
        HTM: "Rp35.000",
        Link_Tiket: "https://instagram.com"
      }
    ]);
    return;
  }

  try {
    const response = await fetch(SHEET_API_URL);
    if (!response.ok) throw new Error("Gagal mengambil data jadwal");
    const data = await response.json();
    renderEvents(data);
  } catch (error) {
    console.error(error);
    eventsContainer.innerHTML =
      '<div class="loading-state">GAGAL MEMUAT JADWAL DARI SERVER. COBA MUAT ULANG HALAMAN.</div>';
  }
}

loadEvents();