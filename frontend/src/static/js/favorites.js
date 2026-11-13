// const BUSINESSES = [
//   { id: "luna-bistro", name: "Luna Bistro", category: "Restaurants", distance: 0.4, address: "123 Main St, Suite 100" },
//   { id: "brew-bean", name: "Brew & Bean Coffee House", category: "Beverages", distance: 0.6, address: "456 Oak Avenue" },
//   { id: "radiance", name: "Radiance Beauty Studio", category: "Beauty", distance: 1.2, address: "789 Park Lane" },
//   { id: "willow", name: "Willow Boutique", category: "Clothing", distance: 0.8, address: "321 Elm Street" }
// ];



const SAVED_KEY = "supporther_saved";
const SELECTED_KEY = "supporther_selected";

const emptyState = document.getElementById("emptyState");
const savedList = document.getElementById("savedList");

function getCurrentUserId() {
  return localStorage.getItem("supporther_user_id") || "1";
}

function getSavedIds() {
  const raw = localStorage.getItem(SAVED_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setSavedIds(ids) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

function removeSavedLocalBusiness(id) {
  const ids = getSavedIds().filter((x) => String(x) !== String(id));
  setSavedIds(ids);
}


function setSelected(id) {
  localStorage.setItem(SELECTED_KEY, String(id));
}

// load businesses from API
async function loadBusinessesFromApi() {
  const res = await fetch("/api/businesses");
  if (!res.ok) { throw new Error(`Failed to load businesses: ${res.status}`); }
  return await res.json();
}

async function loadSavedEventsFromApi() {
  const userId = getCurrentUserId();

  const res = await fetch(`/api/events/saved?userId=${userId}`);

  if (!res.ok) {
    return [];
  }

  return await res.json();
}

async function removeSavedEvent(eventId) {
  const userId = getCurrentUserId();

  const res = await fetch(`/api/events/saved/${eventId}?userId=${userId}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Could not remove saved event.");
  }
}

function formatDate(iso) {
  if (!iso) return "";

  const d = new Date(String(iso).slice(0, 10) + "T00:00:00");

  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

async function render() {
  let allBusinesses = [];
  let savedEvents = [];

  try {
    allBusinesses = await loadBusinessesFromApi();
    savedEvents = await loadSavedEventsFromApi();
  } catch (err) {
    console.error(err);
    // If API fails
    emptyState.hidden = false;
    savedList.hidden = true;
    savedList.innerHTML = "";
    emptyState.querySelector(".emptyTitle").textContent = "Could not load businesses from API";
    return;
  }

  const savedBusinessIds = getSavedIds();

  const savedBusinesses = savedBusinessIds
    .map((id) => allBusinesses.find((b) => b.id === id))
    .filter(Boolean);

  // Empty state
  if (savedBusinesses.length === 0 && savedEvents.length === 0) {
    emptyState.hidden = false;
    savedList.hidden = true;
    savedList.innerHTML = "";
    return;
  }

  emptyState.hidden = true;
  savedList.hidden = false;
  savedList.innerHTML = "";

  if (savedBusinesses.length > 0) {
    const title = document.createElement("h2");
    title.textContent = "Saved Businesses";
    savedList.appendChild(title);
  }

  savedBusinesses.forEach((b) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="businessRow">
        <div class="thumb">IMAGE</div>
        <div>
          <div style="font-weight:800; font-size:16px;">${b.name}</div>
          <div style="color:#6b7280; margin-top:4px;">
            ${b.category}${b.distance ? ` • ${b.distance} mi` : ""}
          </div>
          <div style="color:#6b7280; margin-top:4px;">${b.address}</div>

          <div class="actions">
            <a class="btn primary" href="/map">Directions</a>
            <button class="btn outline" data-remove="${b.id}">Remove</button>
            <a class="btn outline" href="/details" data-details="${b.id}">Details</a>
          </div>
        </div>
      </div>
    `;

    savedList.appendChild(card);
  });

  if (savedEvents.length > 0) {
    const title = document.createElement("h2");
    title.textContent = "Saved Events";
    title.style.marginTop = "24px";
    savedList.appendChild(title);
  }

  savedEvents.forEach((e) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="businessRow">
        <div class="thumb">📅</div>
        <div>
          <div style="font-weight:800; font-size:16px;">${e.title}</div>
          <div style="color:#6b7280; margin-top:4px;">
            ${formatDate(e.date)}
          </div>
          <div style="color:#6b7280; margin-top:4px;">
            ${e.address || e.location || ""}
          </div>
          ${e.details ? `<div style="color:#6b7280; margin-top:4px;">${e.details}</div>` : ""}

          <div class="actions">
            <a class="btn primary" href="/events">View Events</a>
            <button class="btn outline" data-remove-event="${e.id}">Remove</button>
          </div>
        </div>
      </div>
    `;

    savedList.appendChild(card);
  });



  // Bind actions
  savedList.querySelectorAll("[data-remove-business]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove-business");
      removeSavedLocalBusiness(id);
      render();
    });
  });

  savedList.querySelectorAll("[data-remove-event]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-remove-event");

      try {
        await removeSavedEvent(id);
        render();
      } catch (err) {
        console.error(err);
        alert("Could not remove saved event.");
      }
    });
  });

  // Save selected business before going to details
  savedList.querySelectorAll("[data-details]").forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("data-details");
      setSelected(id);
    });
  });
}


render();