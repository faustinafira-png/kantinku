/* ==========================================================
   DATA MENU
   Gambar memakai 4 aset yang tersedia (dipakai berulang)
   ========================================================== */
const menuData = [
  { id: 6, name: "Sate Ayam Madura",  stall: "Stan Pak Kumis",  price: 15000, rating: 4.6, reviews: null, category: "snack",        image: "assets/makanan-2.jpg", tag: "MENU BARU",     status: "Tersedia", bestSeller: false, topRated: false },
  { id: 7, name: "Bakso Urat Mantap", stall: "Bakso Pakde",     price: 13000, rating: 4.8, reviews: null, category: "mie",          image: "assets/makanan-3.jpg", tag: "FAVORIT SISWA", status: "Tersedia", bestSeller: false, topRated: false },
  { id: 8, name: "Gado-Gado Spesial", stall: "Stan Ibu Hajah",  price: 12000, rating: 4.5, reviews: null, category: "makanan-berat",image: "assets/makanan-4.jpg", tag: "FAVORIT GURU",  status: "Habis",    bestSeller: false, topRated: false },
  { id: 9, name: "Thai Tea Creamy",   stall: "Drink Station",   price: 10000, rating: 4.7, reviews: null, category: "minuman",      image: "assets/makanan-1.jpg", tag: null,             status: "Tersedia", bestSeller: false, topRated: false },
  { id: 1, name: "Nasi Goreng Spesial", stall: "Stan Bu Kantini", price: 15000, rating: 4.9, reviews: null, category: "makanan-berat", image: "assets/makanan-1.jpg", tag: null, status: "Tersedia", bestSeller: true,  topRated: false },
  { id: 2, name: "Mie Ayam Bakso",      stall: "Mie Sedap Pak Jo", price: 12000, rating: 4.8, reviews: null, category: "mie",          image: "assets/makanan-2.jpg", tag: null, status: "Tersedia", bestSeller: true,  topRated: false },
  { id: 3, name: "Jus Jeruk Segar",     stall: "Kantin Segar",    price: 8000,  rating: 4.7, reviews: null, category: "minuman",      image: "assets/makanan-3.jpg", tag: null, status: "Tersedia", bestSeller: true,  topRated: false },
  { id: 4, name: "Ayam Bakar Madu",     stall: "Stan Rasa Juara", price: 18000, rating: 5.0, reviews: 120, category: "makanan-berat", image: "assets/makanan-4.jpg", tag: null, status: "Tersedia", bestSeller: false, topRated: true },
  { id: 5, name: "Es Buah Pelangi",     stall: "Dessert Corner",  price: 10000, rating: 5.0, reviews: 95,  category: "dessert",      image: "assets/makanan-1.jpg", tag: null, status: "Tersedia", bestSeller: false, topRated: true },
];

const INITIAL_VISIBLE = 4;
let visibleCount = INITIAL_VISIBLE;
let activeCategory = "semua";
let searchTerm = "";
let sortBy = "rating";
let cartCount = 0;

/* ---------------- Helpers ---------------- */
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

function tagClass(tag) {
  switch (tag) {
    case "MENU BARU": return "chip-new";
    case "FAVORIT SISWA": return "chip-siswa";
    case "FAVORIT GURU": return "chip-guru";
    default: return "";
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateCartBadge() {
  document.getElementById("cartBadge").textContent = cartCount;
}

/* ---------------- Render: Best Seller ---------------- */
function renderBestSellers() {
  const grid = document.getElementById("bestSellerGrid");
  const items = menuData.filter((m) => m.bestSeller);

  grid.innerHTML = items
    .map(
      (item) => `
    <div class="food-card">
      <div class="card-image">
        <img src="${item.image}" alt="${item.name}">
        <span class="chip chip-best">BEST SELLER</span>
      </div>
      <div class="card-body">
        <div class="card-name">${item.name} <span class="star">★ ${item.rating}</span></div>
        <div class="card-stall">${item.stall}</div>
        <div class="card-footer">
          <span class="card-price">${formatRupiah(item.price)}</span>
          <button class="add-btn" data-id="${item.id}" aria-label="Tambah ke keranjang">+</button>
        </div>
      </div>
    </div>`
    )
    .join("");
}

/* ---------------- Render: Rating Tertinggi ---------------- */
function renderRating() {
  const grid = document.getElementById("ratingGrid");
  const items = menuData.filter((m) => m.topRated);

  grid.innerHTML = items
    .map(
      (item) => `
    <div class="rating-card">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <div class="rating-stars">★★★★★ <span class="reviews">(${item.reviews}+ Ulasan)</span></div>
        <div class="rating-name">${item.name}</div>
        <div class="rating-stall">${item.stall}</div>
        <div class="rating-bottom">
          <span class="card-price">${formatRupiah(item.price)}</span>
          <button class="detail-btn" data-id="${item.id}">Detail</button>
        </div>
      </div>
    </div>`
    )
    .join("");
}

/* ---------------- Render: Semua Menu ---------------- */
function getFilteredMenu() {
  let items = [...menuData];

  if (activeCategory !== "semua") {
    items = items.filter((m) => m.category === activeCategory);
  }
  if (searchTerm.trim() !== "") {
    const q = searchTerm.toLowerCase();
    items = items.filter((m) => m.name.toLowerCase().includes(q));
  }

  if (sortBy === "rating") items.sort((a, b) => b.rating - a.rating);
  if (sortBy === "harga-rendah") items.sort((a, b) => a.price - b.price);
  if (sortBy === "harga-tinggi") items.sort((a, b) => b.price - a.price);

  return items;
}

function renderAllMenu() {
  const grid = document.getElementById("allMenuGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const filtered = getFilteredMenu();
  const toShow = filtered.slice(0, visibleCount);

  if (toShow.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;color:var(--text-gray)">Menu tidak ditemukan.</p>`;
  } else {
    grid.innerHTML = toShow
      .map(
        (item) => `
      <div class="food-card">
        <div class="card-image">
          <img src="${item.image}" alt="${item.name}">
          ${item.tag ? `<span class="chip ${tagClass(item.tag)}">${item.tag}</span>` : ""}
          <span class="chip-status ${item.status === "Habis" ? "habis" : ""}">${item.status}</span>
        </div>
        <div class="card-body">
          <div class="card-name">${item.name}</div>
          <div class="card-stall">${item.stall}</div>
          <div class="card-footer">
            <span class="card-price">${formatRupiah(item.price)}</span>
            <span class="star">★ ${item.rating}</span>
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  loadMoreBtn.style.display = visibleCount >= filtered.length ? "none" : "inline-flex";
}

/* ---------------- Event Bindings ---------------- */
function bindAddToCart() {
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    cartCount++;
    updateCartBadge();
    const item = menuData.find((m) => m.id == btn.dataset.id);
    showToast(`${item ? item.name : "Menu"} ditambahkan ke keranjang`);
  });
}

function bindDetailButtons() {
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".detail-btn");
    if (!btn) return;
    const item = menuData.find((m) => m.id == btn.dataset.id);
    if (item) showToast(`Menampilkan detail: ${item.name}`);
  });
}

function bindCategoryFilter() {
  const buttons = document.querySelectorAll(".category-item");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      document.getElementById("filterCategory").value = activeCategory;
      visibleCount = INITIAL_VISIBLE;
      renderAllMenu();
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function bindDropdownFilters() {
  document.getElementById("filterCategory").addEventListener("change", (e) => {
    activeCategory = e.target.value;
    visibleCount = INITIAL_VISIBLE;
    document.querySelectorAll(".category-item").forEach((b) => {
      b.classList.toggle("active", b.dataset.category === activeCategory);
    });
    renderAllMenu();
  });

  document.getElementById("filterSort").addEventListener("change", (e) => {
    sortBy = e.target.value;
    renderAllMenu();
  });
}

function bindSearch() {
  const heroInput = document.getElementById("heroSearch");
  const heroBtn = document.getElementById("heroSearchBtn");
  const quickInput = document.getElementById("quickSearch");

  function doSearch(value) {
    searchTerm = value;
    visibleCount = INITIAL_VISIBLE;
    renderAllMenu();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  }

  heroBtn.addEventListener("click", () => doSearch(heroInput.value));
  heroInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch(heroInput.value);
  });
  quickInput.addEventListener("input", (e) => doSearch(e.target.value));
}

function bindLoadMore() {
  document.getElementById("loadMoreBtn").addEventListener("click", () => {
    visibleCount += 4;
    renderAllMenu();
  });
}

function bindHeaderInteractions() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");

  hamburger.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "64px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "#fff";
    nav.style.padding = "16px 24px";
    nav.style.borderBottom = "1px solid var(--border)";
  });

  document.getElementById("searchToggle").addEventListener("click", () => {
    document.getElementById("mobileSearch").classList.toggle("open");
  });

  document.getElementById("orderBtn").addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll("[data-nav]").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      if (window.innerWidth <= 720) nav.style.display = "none";
    });
  });
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderBestSellers();
  renderRating();
  renderAllMenu();
  updateCartBadge();

  bindAddToCart();
  bindDetailButtons();
  bindCategoryFilter();
  bindDropdownFilters();
  bindSearch();
  bindLoadMore();
  bindHeaderInteractions();
});
