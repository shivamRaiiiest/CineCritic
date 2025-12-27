// DOM Elements
const moviesContainer = document.getElementById('moviesContainer');
const addMovieBtn = document.getElementById('addMovieBtn');
const addMovieModal = document.getElementById('addMovieModal');
const movieDetailsModal = document.getElementById('movieDetailsModal');
const closeButtons = document.querySelectorAll('.close, .close-details');
const movieForm = document.getElementById('movieForm');

// API Base URL
const API_URL = 'http://localhost:3000/api/movies';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Add movie button
    addMovieBtn.addEventListener('click', () => {
        addMovieModal.style.display = 'block';
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            addMovieModal.style.display = 'none';
            movieDetailsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === addMovieModal) {
            addMovieModal.style.display = 'none';
        }
        if (event.target === movieDetailsModal) {
            movieDetailsModal.style.display = 'none';
        }
    });

    // Movie form submission
    movieForm.addEventListener('submit', handleMovieSubmit);
}

// Load all movies from API
async function loadMovies() {
    try {
        const response = await fetch(API_URL);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
        moviesContainer.innerHTML = '<p class="error">Error loading movies. Please try again later.</p>';
    }
}

// Display movies in the grid
function displayMovies(movies) {
    if (!movies.length) {
        moviesContainer.innerHTML = '<p class="no-movies">No movies found. Add the first one!</p>';
        return;
    }

    moviesContainer.innerHTML = movies.map(movie => `
        <div class="movie-card" data-id="${movie._id}">
            <img src="${movie.posterUrl}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <span>${movie.releaseYear}</span>
                </div>
                <p class="movie-description">${movie.description}</p>
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    <span>${movie.averageRating.toFixed(1)}/5 (${movie.reviews.length} reviews)</span>
                </div>
                <button class="btn-secondary view-details" data-id="${movie._id}">
                    View Details & Reviews
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = button.getAttribute('data-id');
            showMovieDetails(movieId);
        });
    });

    // Add event listeners to movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('view-details')) {
                const movieId = card.getAttribute('data-id');
                showMovieDetails(movieId);
            }
        });
    });
}

// Handle movie form submission
async function handleMovieSubmit(e) {
    e.preventDefault();

    const movieData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        genre: document.getElementById('genre').value,
        releaseYear: parseInt(document.getElementById('releaseYear').value),
        director: document.getElementById('director').value,
        posterUrl: document.getElementById('posterUrl').value || 'https://via.placeholder.com/300x450'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        });

        if (response.ok) {
            const newMovie = await response.json();
            addMovieModal.style.display = 'none';
            movieForm.reset();
            loadMovies();
            
            // Show success message
            alert('Movie added successfully!');
        } else {
            throw new Error('Failed to add movie');
        }
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Error adding movie. Please try again.');
    }
}

// Show movie details and reviews
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_URL}/${movieId}`);
        const movie = await response.json();
        
        const detailsContent = document.getElementById('movieDetailsContent');
        detailsContent.innerHTML = `
            <div class="movie-details">
                <div class="details-header">
                    <h2>${movie.title} (${movie.releaseYear})</h2>
                    <div class="movie-meta">
                        <span><strong>Genre:</strong> ${movie.genre}</span>
                        <span><strong>Director:</strong> ${movie.director}</span>
                    </div>
                    <div class="overall-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.averageRating.toFixed(1)}/5 from ${movie.reviews.length} reviews</span>
                    </div>
                </div>
                
                <div class="details-body">
                    <img src="${movie.posterUrl}" alt="${movie.title}" class="details-poster">
                    <div class="details-info">
                        <h3>Synopsis</h3>
                        <p>${movie.description}</p>
                    </div>
                </div>
                
                <div class="reviews-section">
                    <h3>Reviews (${movie.reviews.length})</h3>
                    
                    <div class="review-form">
                        <h4>Add Your Review</h4>
                        <form id="reviewForm" data-movie-id="${movie._id}">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="reviewerName">Your Name</label>
                                    <input type="text" id="reviewerName" required>
                                </div>
                                <div class="form-group">
                                    <label for="reviewRating">Rating</label>
                                    <select id="reviewRating" required>
                                        <option value="">Select rating</option>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Good</option>
                                        <option value="3">3 - Average</option>
                                        <option value="2">2 - Poor</option>
                                        <option value="1">1 - Terrible</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="reviewComment">Your Review</label>
                                <textarea id="reviewComment" rows="3" required></textarea>
                            </div>
                            <button type="submit" class="btn-primary">Submit Review</button>
                        </form>
                    </div>
                    
                    <div id="reviewsList">
                        ${movie.reviews.length > 0 ? 
                            movie.reviews.map(review => `
                                <div class="review-item">
                                    <div class="review-header">
                                        <span class="review-user">${review.userName}</span>
                                        <span class="review-rating">
                                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                                            (${review.rating}/5)
                                        </span>
                                    </div>
                                    <p class="review-comment">${review.comment}</p>
                                    <div class="review-date">
                                        ${new Date(review.date).toLocaleDateString()}
                                    </div>
                                </div>
                            `).join('') : 
                            '<p>No reviews yet. Be the first to review this movie!</p>'
                        }
                    </div>
                </div>
            </div>
        `;

        // Add event listener for review form
        const reviewForm = document.getElementById('reviewForm');
        reviewForm.addEventListener('submit', handleReviewSubmit);

        // Show the modal
        movieDetailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading movie details:', error);
        alert('Error loading movie details. Please try again.');
    }
}

// Handle review submission
async function handleReviewSubmit(e) {
    e.preventDefault();
    
    const movieId = e.target.getAttribute('data-movie-id');
    const reviewData = {
        userName: document.getElementById('reviewerName').value,
        rating: parseInt(document.getElementById('reviewRating').value),
        comment: document.getElementById('reviewComment').value
    };

    try {
        const response = await fetch(`${API_URL}/${movieId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            const updatedMovie = await response.json();
            
            // Clear the form
            e.target.reset();
            
            // Reload the movie details
            showMovieDetails(movieId);
            
            // Reload the movie list to update ratings
            loadMovies();
        } else {
            throw new Error('Failed to submit review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again.');
    }
}