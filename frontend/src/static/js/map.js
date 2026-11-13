let BUSINESSES = []; 

const FILTERS_KEY = "supporther_filters";
const SAVED_KEY = "supporther_saved";
const SELECTED_KEY = "supporther_selected";

// Helper functions for local storage management
function getFilters() {
  const raw = localStorage.getItem(FILTERS_KEY);
  return raw ? JSON.parse(raw) : { category: "Restaurants", openNow: false, distance: 5, price: "" };
}
function setFilters(filters) {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}
function getSavedIds() {
  const raw = localStorage.getItem(SAVED_KEY);
  return raw ? JSON.parse(raw) : [];
}
function setSavedIds(ids) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}
function isSaved(id) {
  return getSavedIds().includes(id);
}
function toggleSaved(id) {
  const saved = new Set(getSavedIds());
  saved.has(id) ? saved.delete(id) : saved.add(id);
  setSavedIds([...saved]);
}
function setSelected(id) {
  localStorage.setItem(SELECTED_KEY, id);
}
function getSelected() {
  return localStorage.getItem(SELECTED_KEY);
}

// DOM elements
const searchInput = document.getElementById("searchInput");
const chipRow = document.getElementById("chipRow");

const panelName = document.getElementById("panelName");
const panelMeta = document.getElementById("panelMeta");
const panelAddr = document.getElementById("panelAddr");

const saveBtn = document.getElementById("saveBtn");
const directionsBtn = document.getElementById("directionsBtn");
const detailsBtn = document.getElementById("detailsBtn");

const modalBackdrop = document.getElementById("modalBackdrop");
const openFiltersBtn = document.getElementById("openFiltersBtn");
const closeFiltersBtn = document.getElementById("closeFiltersBtn");
const applyBtn = document.getElementById("applyBtn");
const clearBtn = document.getElementById("clearBtn");

const categorySelect = document.getElementById("categorySelect");
const openNowToggle = document.getElementById("openNowToggle");
const priceHelper = document.getElementById("priceHelper");

let selectedBusiness = null;
let selectedPrice = ""; // "$" | "$$" | "$$$" | ""

// load businesses from API
async function loadBusinessesFromApi() {
  const res = await fetch("/api/businesses");
  if (!res.ok) throw new Error(`Failed to load businesses: ${res.status}`);
  BUSINESSES = await res.json();
}

// render chips
function renderChips(filters) {
  chipRow.innerHTML = "";

  const chips = [
    filters.category,
    filters.openNow ? "Open Now" : null,
    `${filters.distance} mi`,
    filters.price ? `Price: ${filters.price}` : null
  ].filter(Boolean);

  chips.forEach(text => {
    const el = document.createElement("span");
    el.className = "chip";
    el.textContent = text;
    chipRow.appendChild(el);
  });
}

function getFilteredBusinesses(filters, searchText) {
  const q = (searchText || "").trim().toLowerCase();

  return BUSINESSES.filter(b => {
    if (filters.category && b.category !== filters.category) return false;
    if (b.distance > Number(filters.distance)) return false;

    if (q) {
      const hay = `${b.name} ${b.category} ${b.address}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function setPanelBusiness(biz) {
  selectedBusiness = biz;
  if (!biz) {
    panelName.textContent = "No businesses found";
    panelMeta.textContent = "Try changing filters.";
    panelAddr.textContent = "";
    saveBtn.disabled = true;
    return;
  }

  saveBtn.disabled = false;

  panelName.textContent = biz.name;
  panelMeta.textContent = `${biz.category} • ${biz.distance} mi`;
  panelAddr.textContent = biz.address;

  setSelected(biz.id);
  saveBtn.textContent = isSaved(biz.id) ? "Saved" : "Save";
}

// modal open/close
function openModal() {
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

// init modal fields from filters state
function syncModalFromFilters(filters) {
  categorySelect.value = filters.category;
  openNowToggle.checked = !!filters.openNow;

  // distance radio
  document.querySelectorAll('input[name="distance"]').forEach(r => {
    r.checked = (r.value === String(filters.distance));
  });

  selectedPrice = filters.price || "";
  updatePriceUI();
}

function updatePriceUI() {
  document.querySelectorAll(".priceChip").forEach(btn => {
    const val = btn.getAttribute("data-price");
    btn.classList.toggle("active", val === selectedPrice);
  });
  priceHelper.textContent = selectedPrice ? `Selected: ${selectedPrice}` : "Optional";
}

async function init() {
  try {
    await loadBusinessesFromApi();

    const filters = getFilters();
    renderChips(filters);
    syncModalFromFilters(filters);

    const filtered = getFilteredBusinesses(filters, "");
    const savedSelectedId = getSelected();
    const fromStorage = savedSelectedId ? BUSINESSES.find(b => b.id === savedSelectedId) : null;

    setPanelBusiness(fromStorage || filtered[0] || BUSINESSES[0] || null);
  } catch (err) {
    console.error(err);
    setPanelBusiness(null);
    panelName.textContent = "Could not load businesses from API";
    panelMeta.textContent = "Make sure Docker Compose is running and /api/businesses returns JSON.";
  }
}

init();

// events
searchInput.addEventListener("input", () => {
  const filters = getFilters();
  const filtered = getFilteredBusinesses(filters, searchInput.value);
  setPanelBusiness(filtered[0] || null);
});

openFiltersBtn.addEventListener("click", openModal);
closeFiltersBtn.addEventListener("click", closeModal);

// clicking outside modal closes it
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// price chip selection
document.querySelectorAll(".priceChip").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-price");
    selectedPrice = (selectedPrice === val) ? "" : val;
    updatePriceUI();
  });
});

applyBtn.addEventListener("click", () => {
  const distance = document.querySelector('input[name="distance"]:checked')?.value || "5";
  const filters = {
    category: categorySelect.value,
    distance: Number(distance),
    openNow: openNowToggle.checked,
    price: selectedPrice
  };
  setFilters(filters);
  renderChips(filters);

  const filtered = getFilteredBusinesses(filters, searchInput.value);
  setPanelBusiness(filtered[0] || null);

  closeModal();
});

clearBtn.addEventListener("click", () => {
  const cleared = { category: "Restaurants", distance: 5, openNow: false, price: "" };
  setFilters(cleared);
  renderChips(cleared);
  syncModalFromFilters(cleared);

  const filtered = getFilteredBusinesses(cleared, searchInput.value);
  setPanelBusiness(filtered[0] || BUSINESSES[0] || null);

  closeModal();
});

// saveBtn.addEventListener("click", () => {
//   if (!selectedBusiness) return;

//   toggleSaved(selectedBusiness.id);

//   if (isSaved(selectedBusiness.id)) {
//     saveBtn.textContent = "Saved";
//     alert(`${selectedBusiness.name} was added to your saved businesses.`);
//   } else {
//     saveBtn.textContent = "Save";
//     alert(`${selectedBusiness.name} was removed from your saved businesses.`);
//   }
// });

saveBtn.addEventListener("click", () => {
  if (!selectedBusiness) return;

  toggleSaved(selectedBusiness.id);
  saveBtn.textContent = isSaved(selectedBusiness.id) ? "Saved" : "Save";

  if (isSaved(selectedBusiness.id)) {
    window.location.href = "/favorites";
  }
});

directionsBtn.addEventListener("click", () => {
  if (!selectedBusiness) return;

  const query = encodeURIComponent(selectedBusiness.address);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
});

detailsBtn.addEventListener("click", () => {
  if (!selectedBusiness) return;

  setSelected(selectedBusiness.id);
});