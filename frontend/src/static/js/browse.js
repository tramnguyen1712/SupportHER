const FILTERS_KEY = "supporther_filters"; // key storing filter settings in local storage

const DEFAULT_FILTERS = {  // default filter settings when none are saved
  category: "Restaurants",
  distance: 5,
  openNow: false,
  price: ""
};

// retrieve filter settings from local storage, or return defaults if not set or on error
function getFilters() {
  const raw = localStorage.getItem(FILTERS_KEY);
  if (!raw) return { ...DEFAULT_FILTERS }; //if none stored, return default filters

  try {
    return { ...DEFAULT_FILTERS, ...JSON.parse(raw) }; // merge stored filters on top of the defaults
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}

// Persist filters for the map page to use (stores it in local storage under FILTERS_KEY)
function setFilters(filters) {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

// Update only category while keeping other existing filter selections
function goToMapWithCategory(category) {
  const nextFilters = { ...getFilters(), category };
  setFilters(nextFilters);
  window.location.href = "/map";  //redirect to the map
}

// add click handlers to each category card
document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    if (!category) return;
    goToMapWithCategory(category);
  });
});

const viewMapBtn = document.getElementById("viewMapBtn");
if (viewMapBtn) {
  viewMapBtn.addEventListener("click", () => {
    window.location.href = "/map";
  });
}

const savedBtn = document.querySelector(".saved-btn");
if (savedBtn) {
  savedBtn.addEventListener("click", () => {
    window.location.href = "/favorites";
  });
}

const viewEventsBtn = document.getElementById("viewEventsBtn");

if (viewEventsBtn) {
  viewEventsBtn.addEventListener("click", () => {
    window.location.href = "/events";
  });
}