const EVENTS_CACHE_KEY = "supporther_events_cache";

const eventsList = document.getElementById("eventsList");

function getCurrentUserId() {
  return localStorage.getItem("supporther_user_id") || "1";
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(t) {
  if (!t) return "";

  const [hh, mm] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);

  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
}

async function loadEventsFromApi() {
  const res = await fetch("/api/events");

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const events = await res.json();
  localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(events));

  return events;
}

async function loadSavedEventsFromApi() {
  const userId = getCurrentUserId();

  const res = await fetch(`/api/events/saved?userId=${userId}`);

  if (!res.ok) {
    return [];
  }

  return await res.json();
}

function isSaved(eventId, savedEvents) {
  return savedEvents.some((event) => String(event.id) === String(eventId));
}

async function saveEvent(eventId) {
  const userId = getCurrentUserId();

  const res = await fetch("/api/events/saved", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      eventId
    })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Could not save event.");
  }
}

async function removeSavedEvent(eventId) {
  const userId = getCurrentUserId();

  const res = await fetch(`/api/events/saved/${eventId}?userId=${userId}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Could not remove saved event.");
  }
}

function render(events, savedEvents) {
  eventsList.innerHTML = "";

  if (!events || events.length === 0) {
    eventsList.innerHTML = `
      <div class="emptyCard">
        <div class="emptyTitle">No events found</div>
        <div class="muted" style="margin-top:6px;">Check back later for upcoming events!</div>
      </div>
    `;
    return;
  }

  events
    .slice()
    .sort((a, b) => String(a.date + a.time).localeCompare(String(b.date + b.time)))
    .forEach((e) => {
      const card = document.createElement("div");
      card.className = "eventCard";

      const saved = isSaved(e.id, savedEvents);

      card.innerHTML = `
        <div class="eventTop">
          <div class="eventTitle">${e.title}</div>
          <button class="btn outline" data-save="${e.id}">
            ${saved ? "Saved" : "Save"}
          </button>
        </div>

        <div class="eventLine">
          <strong>${formatDate(String(e.date).slice(0, 10))}</strong>
          ${e.time ? ` • ${formatTime(e.time)}` : ""}
        </div>

        <div class="eventLine muted">${e.address || e.location || ""}</div>
        ${e.details ? `<div class="eventLine muted">${e.details}</div>` : ""}
      `;

      eventsList.appendChild(card);
    });

  eventsList.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const eventId = btn.getAttribute("data-save");

      try {
        if (isSaved(eventId, savedEvents)) {
          await removeSavedEvent(eventId);
          alert("Event removed from saved.");
        } else {
          await saveEvent(eventId);
          alert("Event saved.");
        }

        await loadAndRenderEvents();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  });
}

async function loadAndRenderEvents() {
  try {
    const events = await loadEventsFromApi();
    const savedEvents = await loadSavedEventsFromApi();

    render(events, savedEvents);
  } catch (err) {
    const cached = localStorage.getItem(EVENTS_CACHE_KEY);

    if (cached) {
      render(JSON.parse(cached), []);
      return;
    }

    eventsList.innerHTML = `
      <div class="emptyCard">
        <div class="emptyTitle">Could not load events from the API</div>
        <div class="muted" style="margin-top:6px;">
          Make sure Docker Compose is running and /api/events returns JSON.
        </div>
      </div>
    `;

    console.error(err);
  }
}

loadAndRenderEvents();