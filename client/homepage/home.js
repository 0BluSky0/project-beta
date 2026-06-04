console.log('home.js connected');

const homeBtn = document.getElementById('home-btn');
const myListBtn = document.getElementById('my-list-btn');
const formBtn = document.getElementById('form-btn');
const movieMessage = document.getElementById('movie-message');
const movieListBox = document.querySelector('.movie-list-box');
const searchBar = document.getElementById('search-bar');

homeBtn.addEventListener('click', goToHomePage);
myListBtn.addEventListener('click', goToMyListPage);
formBtn.addEventListener('click', goToFormPage);

document.addEventListener('DOMContentLoaded', getMovies);

// Filter movies as user types in search bar
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        const title = card.querySelector('.movie-title').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'flex' : 'none';
    });
});

async function getMovies() {
    const token = localStorage.getItem('token');

    if (!token) {
        movieMessage.textContent = 'Please log in to see movies.';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/movies', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const movies = await response.json();

        if (!response.ok) {
            movieMessage.textContent = movies.error || 'Could not load movies.';
            return;
        }

        renderMovies(movies);
    } catch (err) {
        console.error(err);
        movieMessage.textContent = 'Could not connect to server.';
    }
}

function renderMovies(movies) {
    movieListBox.innerHTML = '';

    if (movies.length === 0) {
        movieListBox.innerHTML = `<p id="movie-message">No movies found.</p>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster_img_url || 'https://placehold.co/80x120'}" alt="${movie.film_name} poster">
            <div class="movie-info">
                <h2 class="movie-title">${movie.film_name}</h2>
                <p class="movie-year">Year: ${movie.year_released}</p>
                <p class="movie-director">Director: ${movie.director}</p>
                <p class="movie-actors">Actors: ${movie.notable_actors}</p>
                <p class="movie-rating">External Rating: ${movie.external_rating || 'N/A'}/10</p>
                <p class="movie-rating">Avg User Rating: ${movie.avg_user_rating || 'No ratings yet'}</p>
            </div>
        `;
        movieListBox.appendChild(card);
    });
}

function goToHomePage() {
    window.location.href = '../homepage/home.html';
}

function goToMyListPage() {
    window.location.href = '../my-list/my-list.html';
}

function goToFormPage() {
    window.location.href = '../form/form.html';
}
