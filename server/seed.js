const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review-db';

const movies = [
    {
        title: "Inception",
        year: 2010,
        genre: "Sci-Fi",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        director: "Christopher Nolan",
        averageRating: 4.8,
        reviews: [
            { username: "MovieLover42", rating: 5, comment: "Mind-blowing concept and execution!" },
            { username: "CinemaFan", rating: 4, comment: "Great visuals but confusing plot" }
        ]
    },
    {
        title: "The Shawshank Redemption",
        year: 1994,
        genre: "Drama",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        director: "Frank Darabont",
        averageRating: 4.9,
        reviews: [
            { username: "ClassicFilmBuff", rating: 5, comment: "One of the greatest films ever made!" },
            { username: "TimRobbinsFan", rating: 5, comment: "Powerful story about hope and friendship" }
        ]
    },
    {
        title: "The Dark Knight",
        year: 2008,
        genre: "Action",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        director: "Christopher Nolan",
        averageRating: 4.7,
        reviews: [
            { username: "BatmanFan", rating: 5, comment: "Heath Ledger's Joker is legendary!" },
            { username: "ActionLover", rating: 4, comment: "Best superhero movie ever" },
            { username: "MovieCritic", rating: 5, comment: "Masterpiece of modern cinema" }
        ]
    },
    {
        title: "Parasite",
        year: 2019,
        genre: "Thriller",
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        director: "Bong Joon Ho",
        averageRating: 4.6,
        reviews: [
            { username: "FilmStudent", rating: 5, comment: "Brilliant social commentary" },
            { username: "OscarWatcher", rating: 4, comment: "Deserved all the awards!" }
        ]
    },
    {
        title: "Spirited Away",
        year: 2001,
        genre: "Animation",
        description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
        director: "Hayao Miyazaki",
        averageRating: 4.8,
        reviews: [
            { username: "AnimeFan", rating: 5, comment: "Studio Ghibli at its best!" },
            { username: "FamilyViewer", rating: 5, comment: "Beautiful animation and story" }
        ]
    },
    {
        title: "Interstellar",
        year: 2014,
        genre: "Sci-Fi",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        director: "Christopher Nolan",
        averageRating: 4.5,
        reviews: [
            { username: "SpaceGeek", rating: 5, comment: "Scientific accuracy mixed with great storytelling" },
            { username: "MusicLover", rating: 4, comment: "Hans Zimmer's score is incredible" },
            { username: "MovieBuff", rating: 4, comment: "Visually stunning" }
        ]
    },
    {
        title: "Pulp Fiction",
        year: 1994,
        genre: "Crime",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        director: "Quentin Tarantino",
        averageRating: 4.7,
        reviews: [
            { username: "TarantinoFan", rating: 5, comment: "Iconic dialogue and characters!" },
            { username: "90sKid", rating: 4, comment: "Changed cinema forever" }
        ]
    },
    {
        title: "The Godfather",
        year: 1972,
        genre: "Crime",
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        director: "Francis Ford Coppola",
        averageRating: 4.9,
        reviews: [
            { username: "ClassicMafia", rating: 5, comment: "Made him an offer he couldn't refuse!" },
            { username: "FilmHistory", rating: 5, comment: "Perfect in every way" },
            { username: "BrandoFan", rating: 5, comment: "Marlon Brando is incredible" }
        ]
    },
    {
        title: "Avengers: Endgame",
        year: 2019,
        genre: "Action",
        description: "After the devastating events of Avengers: Infinity War, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        director: "Anthony Russo, Joe Russo",
        averageRating: 4.4,
        reviews: [
            { username: "MarvelFan", rating: 5, comment: "Perfect conclusion to 11 years of movies!" },
            { username: "SuperheroLover", rating: 4, comment: "Epic finale" },
            { username: "CasualViewer", rating: 4, comment: "Great entertainment" }
        ]
    },
    {
        title: "La La Land",
        year: 2016,
        genre: "Musical",
        description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
        director: "Damien Chazelle",
        averageRating: 4.3,
        reviews: [
            { username: "MusicalFan", rating: 5, comment: "Beautiful music and choreography" },
            { username: "RyanGoslingFan", rating: 4, comment: "Great chemistry between leads" },
            { username: "Oscar2017", rating: 4, comment: "Should have won Best Picture!" }
        ]
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Starting database seeding...');
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Insert new movies
        const insertedMovies = await Movie.insertMany(movies);
        console.log(` Successfully seeded ${insertedMovies.length} movies`);

        // Calculate statistics
        const allMovies = await Movie.find();
        const totalReviews = allMovies.reduce((sum, movie) => sum + movie.reviews.length, 0);
        const avgRating = allMovies.reduce((sum, movie) => sum + movie.averageRating, 0) / allMovies.length;

        console.log('\n Database Statistics:');
        console.log(`   Total Movies: ${allMovies.length}`);
        console.log(`   Total Reviews: ${totalReviews}`);
        console.log(`   Average Rating: ${avgRating.toFixed(2)}/5`);

        console.log('\nSeeded Movies:');
        allMovies.forEach((movie, index) => {
            console.log(`   ${index + 1}. ${movie.title} (${movie.year}) - ${movie.genre} - ${movie.averageRating.toFixed(1)}/5`);
        });

        console.log('\nSeeding completed successfully!');
        console.log('\nNext steps:');
        console.log('   1. Run: npm start');
        console.log('   2. Open: http://localhost:3000');
        console.log('   3. Enjoy your movie review website!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase();
