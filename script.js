const API_URL = 'https://www.omdbapi.com/?apikey=ed28200d&'; 

const moviesGrid = document.getElementById('movies-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const sectionTitle = document.getElementById('section-title');
const genreButtons = document.querySelectorAll('.genre-btn');

// Modal Elements
const movieModal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-modal');

const curatedMovies = [
    'Inception', 'The Dark Knight', 'Interstellar', 'Avatar', 
    'The Matrix', 'Gladiator', 'Avengers: Endgame', 'Joker'
];

document.addEventListener('DOMContentLoaded', () => {
    loadCuratedMovies();
    setupGenreFilters();
    setupModalClose();
});

async function loadCuratedMovies() {
    showLoader();
    moviesGrid.innerHTML = '';
    sectionTitle.innerHTML = `<i class="fa-solid fa-fire"></i> Featured Hits`;

    try {
        const promises = curatedMovies.map(title => 
            fetch(`${API_URL}t=${encodeURIComponent(title)}`).then(res => res.json())
        );
        const results = await promises;
        const validMovies = results.filter(movie => movie.Response === "True");
        displayMovies(validMovies, true); 
    } catch (error) {
        showError('Failed to establish connection with the database.');
    }
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    showLoader();
    genreButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-genre="all"]').classList.add('active');

    try {
        const response = await fetch(`${API_URL}s=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.Response === "True") {
            sectionTitle.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Search Results for "${query}"`;
            displayMovies(data.Search, false); 
        } else {
            showError(`No results found for "${query}". Try another title.`);
        }
    } catch (error) {
        showError('An error occurred while matching records.');
    }
}

function displayMovies(movies, isDetailedMode) {
    moviesGrid.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        showError('Search for movies by title...');
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        
        // Setup direct data identifiers for click interaction tracking
        card.setAttribute('data-id', movie.imdbID);

        const titleText = movie.Title || 'Unknown Title';
        const yearText = movie.Year || 'N/A';
        const posterUrl = (movie.Poster && movie.Poster !== "N/A") ? movie.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
        const ratingText = isDetailedMode ? (movie.imdbRating || 'N/A') : 'View Info';
        
        card.dataset.genres = movie.Genre ? movie.Genre.toLowerCase() : 'action, drama, sci-fi'; 

        card.innerHTML = `
            <div class="poster-container">
                <img src="${posterUrl}" alt="${titleText}" onerror="this.src='https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';">
                <div class="rating-badge">
                    <i class="fa-solid fa-star"></i> ${ratingText}
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title" title="${titleText}">${titleText}</h3>
                <div class="movie-meta">
                    <span><i class="fa-solid fa-calendar-days"></i> ${yearText}</span>
                    <span><i class="fa-solid fa-video"></i> ${movie.Type || 'Feature'}</span>
                </div>
            </div>
        `;

        // Click Event listener to trigger detail fetching
        card.addEventListener('click', () => openMovieDetails(movie.imdbID));
        moviesGrid.appendChild(card);
    });
}

// Fetch single movie full specs from API
async function openMovieDetails(imdbID) {
    modalBody.innerHTML = '<div class="loader"></div>';
    movieModal.classList.add('open');

    try {
        const response = await fetch(`${API_URL}i=${imdbID}&plot=full`);
        const movie = await response.json();

        if (movie.Response === "True") {
            const poster = (movie.Poster && movie.Poster !== "N/A") ? movie.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
            
            modalBody.innerHTML = `
                <div class="modal-detail-layout">
                    <div class="modal-poster">
                        <img src="${poster}" alt="${movie.Title}">
                    </div>
                    <div class="modal-info-block">
                        <h2>${movie.Title}</h2>
                        <div class="modal-tags">
                            <span class="modal-tag rating"><i class="fa-solid fa-star"></i> ${movie.imdbRating || 'N/A'}</span>
                            <span class="modal-tag">${movie.Rated || 'Not Rated'}</span>
                            <span class="modal-tag">${movie.Runtime || 'N/A'}</span>
                            <span class="modal-tag">${movie.Year || 'N/A'}</span>
                        </div>
                        <p class="modal-plot">${movie.Plot || 'No synopsis data available.'}</p>
                        <div class="modal-meta-line"><strong>Genre:</strong> ${movie.Genre || 'N/A'}</div>
                        <div class="modal-meta-line"><strong>Director:</strong> ${movie.Director || 'N/A'}</div>
                        <div class="modal-meta-line"><strong>Writers:</strong> ${movie.Writer || 'N/A'}</div>
                        <div class="modal-meta-line"><strong>Actors:</strong> ${movie.Actors || 'N/A'}</div>
                        <div class="modal-meta-line"><strong>Awards:</strong> ${movie.Awards || 'None'}</div>
                        <div class="modal-meta-line"><strong>Box Office:</strong> ${movie.BoxOffice || 'N/A'}</div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        modalBody.innerHTML = '<p class="error-message">Could not load movie details.</p>';
    }
}

function setupModalClose() {
    closeModalBtn.addEventListener('click', () => {
        movieModal.classList.remove('open');
    });
    // Close modal if clicked outside content card container
    window.addEventListener('click', (e) => {
        if (e.target === movieModal) {
            movieModal.classList.remove('open');
        }
    });
}

function setupGenreFilters() {
    genreButtons.forEach(button => {
        button.addEventListener('click', () => {
            genreButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedGenre = button.getAttribute('data-genre');
            const allCards = document.querySelectorAll('.movie-card');

            allCards.forEach(card => {
                const itemGenres = card.dataset.genres;
                if (selectedGenre === 'all' || itemGenres.includes(selectedGenre)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function showLoader() {
    moviesGrid.innerHTML = '<div class="loader"></div>';
}

function showError(msg) {
    moviesGrid.innerHTML = `
        <div class="error-message">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>${msg}</p>
        </div>
    `;
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});
