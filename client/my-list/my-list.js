console.log("my-list.js connected");

const movieList = document.getElementById("movie-list");
const homeBtn = document.getElementById("home-btn");
const myListBtn = document.getElementById("mylist-btn");
const formBtn = document.getElementById("form-btn");

document.addEventListener("DOMContentLoaded", getMovies);

homeBtn.addEventListener("click", goToHomePage);
myListBtn.addEventListener("click", goToMyListPage);
formBtn.addEventListener("click", goToFormPage);

async function getMovies() {
  const token = localStorage.getItem("token");

  if (!token) {
    movieList.innerHTML = `<p class="movie-rating">Please log in first.</p>`;
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/movies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const movies = await response.json();

    if (!response.ok) {
      movieList.innerHTML = `<p class="movie-rating">${movies.error}</p>`;
      return;
    }

    renderMovies(movies);
  } catch (error) {
    console.log(error);

    movieList.innerHTML = `<p class="movie-rating">Could not connect to server.</p>`;
  }
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (movies.length === 0) {
    movieList.innerHTML = `<p class="movie-rating">No movies found.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");

    movieCard.className = "movie-card";

    movieCard.innerHTML = `
            <img
                src="${movie.poster_img_url || "https://placehold.co/80x120"}"
                alt="${movie.film_name} poster"
            >

            <div class="movie-info">
              <h2 class="movie-title">${movie.film_name}</h2>
              <p class="movie-year">Year: ${formatYear(movie.year_released)}</p>
              <p class="movie-director">Director: ${movie.director}</p>
              <p class="movie-actors">Actors: ${movie.notable_actors}</p>
              <p class="movie-rating">⭐ Avg User Rating: ${movie.avg_user_rating ? movie.avg_user_rating + '/10' : 'No ratings yet'}</p>
              <p class="movie-rating">🌐 External Rating: ${movie.external_rating ? movie.external_rating + '/10' : 'N/A'}</p>
            </div>
        `;

    movieList.appendChild(movieCard);
  });
}

function formatYear(yearReleased) {
  if (!yearReleased) {
    return "Unknown";
  }

  return yearReleased.toString().slice(0, 4);
}

function goToHomePage() {
  window.location.href = "../homepage/home.html";
}

function goToMyListPage() {
  window.location.href = "../my-list/my-list.html";
}

function goToFormPage() {
  window.location.href = "../form/form.html";
}
