const form = document.getElementById("reviewForm");
const businessNameInput = document.getElementById("businessName");
const reviewerNameInput = document.getElementById("reviewerName");
const ratingInput = document.getElementById("rating");
const reviewTextInput = document.getElementById("reviewText");
const formMessage = document.getElementById("formMessage");

const reviewsList = document.getElementById("reviewsList");
const emptyState = document.getElementById("emptyState");
const reviewCount = document.getElementById("reviewCount");

let businesses = [];
let allReviews = [];

function starRatingToNumber(stars) {
  if (stars === "★★★★★") return 5;
  if (stars === "★★★★☆") return 4;
  if (stars === "★★★☆☆") return 3;
  if (stars === "★★☆☆☆") return 2;
  if (stars === "★☆☆☆☆") return 1;
  return 0;
}

function numberToStarRating(num) {
  const rating = Number(num);
  if (rating === 5) return "★★★★★";
  if (rating === 4) return "★★★★☆";
  if (rating === 3) return "★★★☆☆";
  if (rating === 2) return "★★☆☆☆";
  if (rating === 1) return "★☆☆☆☆";
  return "☆☆☆☆☆";
}

async function loadBusinesses() {
  const res = await fetch("/api/businesses");

  if (!res.ok) {
    throw new Error("Could not load businesses.");
  }

  businesses = await res.json();
}

function findBusinessByName(name) {
  const searchName = name.trim().toLowerCase();

  return businesses.find((business) => {
    return business.name.toLowerCase() === searchName;
  });
}

async function loadReviews() {
  allReviews = [];

  for (const business of businesses) {
    try {
      const res = await fetch(`/api/businesses/${business.id}/reviews`);

      if (!res.ok) {
        continue;
      }

      const reviews = await res.json();

      reviews.forEach((review) => {
        allReviews.push({
          ...review,
          businessName: business.name
        });
      });
    } catch (err) {
      console.error("Could not load reviews for business:", business.id, err);
    }
  }
}

function createReviewCard(review) {
  const card = document.createElement("article");
  card.className = "card";
  card.style.padding = "12px";

  const title = document.createElement("h3");
  title.style.margin = "0 0 6px 0";
  title.textContent = review.businessName;

  const meta = document.createElement("p");
  meta.style.margin = "0 0 8px 0";
  meta.style.color = "#4b5563";

  const reviewer = review.reviewerName || review.username || "Anonymous";
  const stars = numberToStarRating(review.rating);

  let dateText = "Unknown date";
  if (review.created_at || review.date) {
    const created = new Date(review.created_at || review.date);
    if (!Number.isNaN(created.getTime())) {
      dateText = created.toLocaleDateString();
    }
  }

  meta.textContent = reviewer + " | " + stars + " | " + dateText;

  const body = document.createElement("p");
  body.style.margin = "0";
  body.textContent = review.comment || review.reviewText || "";

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(body);

  return card;
}

function renderReviews() {
  reviewsList.innerHTML = "";

  emptyState.style.display = allReviews.length ? "none" : "block";
  reviewCount.textContent =
    allReviews.length + (allReviews.length === 1 ? " review" : " reviews");

  allReviews.forEach((review) => {
    reviewsList.appendChild(createReviewCard(review));
  });
}

async function refreshReviews() {
  try {
    await loadBusinesses();
    await loadReviews();
    renderReviews();
  } catch (err) {
    console.error(err);
    formMessage.textContent = "Could not load reviews from the API.";
    formMessage.style.color = "#b91c1c";
  }
}

async function onSubmit(event) {
  event.preventDefault();

  const businessName = businessNameInput.value.trim();
  const reviewerName = reviewerNameInput.value.trim() || "Anonymous";
  const rating = ratingInput.value;
  const reviewText = reviewTextInput.value.trim();

  formMessage.textContent = "";

  if (!businessName) {
    formMessage.textContent = "Please enter a business name.";
    formMessage.style.color = "#b91c1c";
    return;
  }

  if (!rating) {
    formMessage.textContent = "Please select a rating.";
    formMessage.style.color = "#b91c1c";
    return;
  }

  if (!reviewText) {
    formMessage.textContent = "Please write a review.";
    formMessage.style.color = "#b91c1c";
    return;
  }

  const business = findBusinessByName(businessName);

  if (!business) {
    formMessage.textContent = "Business not found. Please enter the exact business name.";
    formMessage.style.color = "#b91c1c";
    return;
  }

  try {
    const res = await fetch(`/api/businesses/${business.id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: 1,
        rating: starRatingToNumber(rating),
        comment: reviewText
      })
    });

    const data = await res.json();

    if (!res.ok) {
      formMessage.textContent = data.error || "Could not post review.";
      formMessage.style.color = "#b91c1c";
      return;
    }

    form.reset();
    formMessage.textContent = "Review posted.";
    formMessage.style.color = "#166534";

    await refreshReviews();

  } catch (err) {
    console.error("Review submit error:", err);
    formMessage.textContent = "Could not connect to the server.";
    formMessage.style.color = "#b91c1c";
  }
}

form.addEventListener("submit", onSubmit);
refreshReviews();