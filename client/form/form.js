console.log('form.js connected');

const addMovieForm = document.getElementById('add-movie-form');
const movieNameInput = document.getElementById('movie_name');
const directorInput = document.getElementById('director');
const producerInput = document.getElementById('producer');
const notableActorsInput = document.getElementById('notable_actors');
const yearReleasedInput = document.getElementById('year_released');
const posterUrlInput = document.getElementById('poster_img_url');
const userRatingInput = document.getElementById('user_rating');
const posterImg = document.getElementById('poster-img');
const posterPlaceholder = document.getElementById('poster-placeholder');
const message = document.getElementById('message');


posterUrlInput.addEventListener('input', () => {
    const url = posterUrlInput.value.trim();
    if (url) {
        posterImg.src = url;
        posterImg.classList.add('visible');
        posterPlaceholder.style.display = 'none';
    } else {
        posterImg.classList.remove('visible');
        posterImg.src = '';
        posterPlaceholder.style.display = 'block';
    }
});


posterImg.addEventListener('error', () => {
    posterImg.classList.remove('visible');
    posterPlaceholder.style.display = 'block';
});

addMovieForm.addEventListener('submit', handleAddMovie);

async function handleAddMovie(event) {
    event.preventDefault();

    const movieData = {
        film_name: movieNameInput.value.trim(),
        director: directorInput.value.trim(),
        producer: producerInput.value.trim(),
        notable_actors: notableActorsInput.value.trim(),
        year_released: parseInt(yearReleasedInput.value.trim()),
        poster_img_url: posterUrlInput.value.trim()
    };

    if (!movieData.film_name) {
        showMessage('Please enter a movie title.');
        movieNameInput.focus();
        return;
    }
    if (!movieData.director) {
        showMessage('Please enter a director.');
        directorInput.focus();
        return;
    }
    if (!movieData.producer) {
        showMessage('Please enter a producer.');
        producerInput.focus();
        return;
    }
    if (!movieData.notable_actors) {
        showMessage('Please enter notable actors.');
        notableActorsInput.focus();
        return;
    }
    if (!movieData.year_released) {
        showMessage('Please enter a year.');
        yearReleasedInput.focus();
        return;
    }

    const userRating = userRatingInput.value ? parseInt(userRatingInput.value) : null;

    if (userRating !== null && (userRating < 1 || userRating > 10)) {
        showMessage('Rating must be between 1 and 10.');
        userRatingInput.focus();
        return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
        showMessage('You must be logged in to add a movie.');
        return;
    }

    try {
        // Step 1 — Add the movie
        const response = await fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(movieData)
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || 'Something went wrong.');
            return;
        }

        // Step 2 — Submit rating if provided
        if (userRating !== null) {
            const ratingResponse = await fetch(`http://localhost:3000/movies/${data.film_id}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ root_user_rating: userRating })
            });

            if (!ratingResponse.ok) {
                showMessage('Movie added but rating could not be saved.');
                return;
            }
        }

        showMessage('Movie added successfully!');
        addMovieForm.reset();
        posterImg.classList.remove('visible');
        posterImg.src = '';
        posterPlaceholder.style.display = 'block';

    } catch (err) {
        showMessage('Could not connect to the server.');
        console.error(err);
    }
}

function showMessage(text) {
    message.textContent = text;
}


document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = '../homepage/home.html';
});
document.getElementById('my-list-btn').addEventListener('click', () => {
    window.location.href = '../my-list/my-list.html';
});
document.getElementById('form-btn').addEventListener('click', () => {
    window.location.href = '../form/form.html';
});
