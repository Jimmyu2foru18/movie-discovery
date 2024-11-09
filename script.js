const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query='

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const loader = document.getElementById('loader')
const modal = document.getElementById('movie-modal')
const modalBody = document.getElementById('modal-body')
const closeBtn = document.querySelector('.close-btn')
const prevBtn = document.getElementById('prev')
const nextBtn = document.getElementById('next')
const currentPageSpan = document.getElementById('current-page')

let currentPage = 1
let currentSearch = ''
let favorites = JSON.parse(localStorage.getItem('favorites')) || []
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

// Add after constants
const genreFilter = document.getElementById('genre-filter')
const yearFilter = document.getElementById('year-filter')
const sortBy = document.getElementById('sort-by')

// Checks after constants
console.log('Genre Filter Element:', genreFilter);
console.log('Year Filter Element:', yearFilter);
console.log('Sort By Element:', sortBy);

if (!genreFilter || !yearFilter || !sortBy) {
    console.error('One or more filter elements not found!');
}

// Initialize genres
async function initializeGenres() {
    try {
        console.log('Initializing genres...');
        genreFilter.innerHTML = '<option value="">All Genres</option>';
        
        const response = await fetch(
            'https://api.themoviedb.org/3/genre/movie/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c'
        );
        const data = await response.json();
        console.log('Genres data:', data);
        
        if (!data.genres || !Array.isArray(data.genres)) {
            throw new Error('Invalid genres data received');
        }
        
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
        console.log('Genres initialized successfully');
    } catch (error) {
        console.error('Detailed error initializing genres:', error);
        showToast('Failed to load genres');
    }
}

// Add years
function initializeYears() {
    console.log('Initializing years...');
    yearFilter.innerHTML = '<option value="">All Years</option>';
    
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
    console.log('Years initialized successfully');
}

// Sort-by dropdown
function initializeSortBy() {
    console.log('Initializing sort options...');
    sortBy.innerHTML = `
        <option value="popularity.desc">Most Popular</option>
        <option value="vote_average.desc">Highest Rated</option>
        <option value="release_date.desc">Newest</option>
        <option value="revenue.desc">Highest Grossing</option>
    `;
    console.log('Sort options initialized successfully');
}

// Filters
genreFilter.addEventListener('change', updateMovies)
yearFilter.addEventListener('change', updateMovies)
sortBy.addEventListener('change', updateMovies)

function updateMovies() {
    currentPage = 1
    let url = API_URL

    url = url.replace(/&page=\d+/, '') + `&page=${currentPage}`

    if (genreFilter.value) {
        url += `&with_genres=${genreFilter.value}`
    }
    if (yearFilter.value) {
        url += `&year=${yearFilter.value}`
    }
    if (sortBy.value && sortBy.value !== 'popularity.desc') {
        url = url.replace('sort_by=popularity.desc', `sort_by=${sortBy.value}`)
    }

    getMovies(url)
}

// Initialize filters
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    try {
        await initializeGenres();
        initializeYears();
        initializeSortBy();
        getMovies(API_URL);
        console.log('All initializations complete');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Show loading
function showLoader() {
    loader.style.display = 'flex'
}

// Hide loading
function hideLoader() {
    loader.style.display = 'none'
}

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    showLoader()
    console.log('Fetching URL:', url)
    try {
        const res = await fetch(url)
        if (!res.ok) {
            console.log('Response status:', res.status)
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        console.log('Full API Response:', data)
        
        if (data.results && data.results.length > 0) {
            showMovies(data.results)
            updatePaginationButtons(data.page, data.total_pages)
        } else {
            main.innerHTML = `
                <div class="error-container">
                    <p class="error">No movies found</p>
                    <button class="retry-btn" onclick="retryFetch()">Try Again</button>
                </div>`
        }
    } catch (error) {
        console.error('Detailed error:', error)
        main.innerHTML = `
            <div class="error-container">
                <p class="error">Failed to fetch movies. Please try again.</p>
                <button class="retry-btn" onclick="retryFetch()">Retry</button>
            </div>`
    } finally {
        hideLoader()
    }
}

function showMovies(movies) {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { id, title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie-card')
        
        const isFavorite = favorites.includes(id)
        const isWatchlisted = watchlist.includes(id)
        
        movieEl.innerHTML = `
            <div class="movie-poster">
                <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" 
                     alt="${title}" 
                     onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <div class="movie-meta">
                    <div class="rating ${getClassByRate(vote_average)}">
                        <i class="fas fa-star"></i>
                        ${vote_average.toFixed(1)}
                    </div>
                    <div class="buttons">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                data-movie-id="${id}" title="Add to Favorites">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                        <button class="watchlist-btn ${isWatchlisted ? 'active' : ''}" 
                                data-movie-id="${id}" title="Add to Watchlist">
                            ${isWatchlisted ? '🔖' : '📑'}
                        </button>
                    </div>
                </div>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <p>${overview || 'No overview available.'}</p>
            </div>
        `

        movieEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-btn') && 
                !e.target.classList.contains('watchlist-btn')) {
                showMovieDetails(movie)
            }
        })
        main.appendChild(movieEl)
    })
}

async function showMovieDetails(movie) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=3fd2be6f0c70a2a598f084ddfb75487c&append_to_response=credits,videos`
        )
        
        if (!response.ok) {
            throw new Error('Failed to fetch movie details')
        }

        const movieDetails = await response.json()
        
        modalBody.innerHTML = `
            <div class="movie-detail">
                <div class="movie-poster">
                    <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'placeholder.png'}" 
                         alt="${movie.title}"
                         onerror="this.src='placeholder.png'">
                </div>
                <div class="movie-info-detail">
                    <h2>${movie.title}</h2>
                    <p><strong>Rating:</strong> ${movie.vote_average.toFixed(1)}</p>
                    <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
                    <p><strong>Director:</strong> ${getDirector(movieDetails.credits)}</p>
                    <p><strong>Cast:</strong> ${getCast(movieDetails.credits)}</p>
                    <p>${movie.overview || 'No overview available.'}</p>
                    ${getTrailer(movieDetails.videos)}
                </div>
            </div>
        `
        
        modal.style.display = 'block'
    } catch (error) {
        console.error('Error fetching movie details:', error)
        showToast('Failed to load movie details. Please try again later.')
    }
}

function getDirector(credits) {
    const director = credits.crew.find(person => person.job === 'Director')
    return director ? director.name : 'Not available'
}

function getCast(credits) {
    return credits.cast
        .slice(0, 5)
        .map(actor => actor.name)
        .join(', ')
}

function getTrailer(videos) {
    const trailer = videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
    )
    
    return trailer 
        ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailer.key}" 
           frameborder="0" allowfullscreen></iframe>`
        : ''
}

function toggleFavorite(movieId) {
    const index = favorites.indexOf(movieId)
    if (index === -1) {
        favorites.push(movieId)
    } else {
        favorites.splice(index, 1)
    }
    localStorage.setItem('favorites', JSON.stringify(favorites))
}

function toggleWatchlist(movieId) {
    const index = watchlist.indexOf(movieId)
    if (index === -1) {
        watchlist.push(movieId)
        showToast('Added to Watchlist!', 'success')
    } else {
        watchlist.splice(index, 1)
        showToast('Removed from Watchlist!', 'success')
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
}

function updatePaginationButtons(currentPage, totalPages) {
    const prevBtn = document.getElementById('prev')
    const nextBtn = document.getElementById('next')
    const currentPageSpan = document.getElementById('current-page')
    
    if (prevBtn && nextBtn && currentPageSpan) {
        prevBtn.disabled = currentPage === 1
        nextBtn.disabled = currentPage === totalPages
        currentPageSpan.textContent = `Page ${currentPage}`
    }
}

// Event Listeners
form.addEventListener('input', debounce((e) => {
    const searchTerm = search.value.trim()
    if (searchTerm.length === 0) {
        currentSearch = ''
        currentPage = 1
        getMovies(API_URL)
        return
    }
    
    if (searchTerm.length < 2) return // Don't search for concise terms
    
    currentSearch = searchTerm
    currentPage = 1
    getMovies(SEARCH_API + encodeURIComponent(searchTerm))
}, 500))

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        const url = currentSearch 
            ? `${SEARCH_API}${encodeURIComponent(currentSearch)}&page=${currentPage}`
            : `${API_URL.replace(/&page=\d+/, '')}&page=${currentPage}`
        getMovies(url)
    }
})

nextBtn.addEventListener('click', () => {
    currentPage++
    const url = currentSearch 
        ? `${SEARCH_API}${encodeURIComponent(currentSearch)}&page=${currentPage}`
        : `${API_URL.replace(/&page=\d+/, '')}&page=${currentPage}`
    getMovies(url)
})

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
})

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
    }
})

main.addEventListener('click', (e) => {
    if (e.target.classList.contains('favorite-btn')) {
        e.stopPropagation()
        const movieId = parseInt(e.target.dataset.movieId)
        toggleFavorite(movieId)
        e.target.classList.toggle('active')
        e.target.textContent = e.target.classList.contains('active') 
            ? '❤️' 
            : '🤍'
    }
    
    if (e.target.classList.contains('watchlist-btn')) {
        e.stopPropagation()
        const movieId = parseInt(e.target.dataset.movieId)
        toggleWatchlist(movieId)
        e.target.classList.toggle('active')
        e.target.textContent = e.target.classList.contains('active') 
            ? '🔖' 
            : '📑'
    }
})

// Utility Functions
function getClassByRate(vote) {
    if(vote >= 8) return 'green'
    if(vote >= 5) return 'orange'
    return 'red'
}

function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
}

// Retry function
function retryFetch() {
    if (currentSearch) {
        getMovies(SEARCH_API + encodeURIComponent(currentSearch))
    } else {
        getMovies(API_URL)
    }
}

// Add Toast Notification Function
function showToast(message, type = 'error') {
    const toast = document.createElement('div')
    toast.className = `toast ${type}`
    toast.textContent = message
    
    const toastContainer = document.getElementById('toast-container')
    toastContainer.appendChild(toast)
    
    setTimeout(() => {
        toast.remove()
    }, 3000)
}

// Add network status monitoring
window.addEventListener('online', () => {
    showToast('Connection restored. Refreshing...', 'success')
    retryFetch()
})

window.addEventListener('offline', () => {
    showToast('No internet connection.', 'error')
})

// Add this after your constants
const navIcon = document.querySelector('.nav-brand i');

// Add click event listener to the icon
navIcon.addEventListener('click', () => {
    window.location.reload();
});
