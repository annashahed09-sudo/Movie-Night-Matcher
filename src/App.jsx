// --- CONFIGURATION & STATE ---
const TMDB_API_KEY = "YOUR_TMDB_API_KEY"; // Replace with your TMDB API key
let movies = [];
let currentIndex = 0;

// Elements
const lobbyScreen = document.getElementById("lobby-screen");
const swiperScreen = document.getElementById("swiper-screen");
const receiptScreen = document.getElementById("receipt-screen");

const btnSolo = document.getElementById("btn-solo");
const btnSkip = document.getElementById("btn-skip");
const btnLike = document.getElementById("btn-like");
const btnRestart = document.getElementById("btn-restart");

// Fetch Movies from TMDB
async function fetchMovies() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    movies = data.results || [];
    renderCurrentMovie();
  } catch (err) {
    console.error("TMDB Fetch Error:", err);
  }
}

// Render active movie card
function renderCurrentMovie() {
  if (currentIndex >= movies.length) {
    document.getElementById("card-title").innerText = "No more movies!";
    return;
  }

  const movie = movies[currentIndex];
  document.getElementById("card-title").innerText = movie.title;
  document.getElementById("card-overview").innerText = movie.overview || "No overview available.";
  document.getElementById("card-rating").innerText = `⭐ ${movie.vote_average}`;
  document.getElementById("card-img").src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
}

// Handle Swipe Actions
function handleSwipe(liked) {
  if (liked) {
    showMatchReceipt(movies[currentIndex]);
  } else {
    currentIndex++;
    renderCurrentMovie();
  }
}

// Show Receipt
function showMatchReceipt(movie) {
  swiperScreen.classList.add("hidden");
  receiptScreen.classList.remove("hidden");

  document.getElementById("receipt-movie-title").innerText = `1x ${movie.title.toUpperCase()}`;
  document.getElementById("receipt-movie-rating").innerText = `RATING: ⭐ ${movie.vote_average}/10`;
  document.getElementById("receipt-serial").innerText = `ID: #${movie.id}`;
  document.getElementById("receipt-date").innerText = new Date().toLocaleDateString();
}

// Event Listeners
btnSolo.addEventListener("click", () => {
  lobbyScreen.classList.add("hidden");
  swiperScreen.classList.remove("hidden");
  fetchMovies();
});

btnSkip.addEventListener("click", () => handleSwipe(false));
btnLike.addEventListener("click", () => handleSwipe(true));

btnRestart.addEventListener("click", () => {
  receiptScreen.classList.add("hidden");
  swiperScreen.classList.remove("hidden");
  currentIndex++;
  renderCurrentMovie();
});
