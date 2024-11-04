# 🎬 Movie Discovery App

A modern, responsive web application for discovering and exploring movies. Built with vanilla JavaScript, this app provides a seamless experience for browsing popular movies, searching for specific titles, and managing your favorites and watchlist.

## 🌟 Features

- **Movie Browsing**: Browse through popular, top-rated, and latest movies
- **Advanced Filtering**: Filter movies by:
  - Genre
  - Year
  - Sort preferences (popularity, rating, release date, revenue)
- **Search Functionality**: Search for specific movies with real-time results
- **Detailed Movie Information**:
  - Movie posters
  - Ratings
  - Overview
  - Cast and crew information
  - Trailers (when available)
- **Personal Lists**:
  - Add movies to Favorites
  - Maintain a Watchlist
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User-Friendly Interface**:
  - Loading animations
  - Error handling
  - Toast notifications
  - Pagination
- **Offline Support**: Network status monitoring with appropriate notifications

## 🚀 Getting Started

### Prerequisites

- Modern web browser
- Internet connection
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/documentation/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jimmyu2foru18/movie-discovery.git
```

2. Navigate to the project directory:
```
bash
cd movie-discovery
```

3. Open `index.html` in your web browser or use a local server.

## 🛠️ Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- [TMDB API](https://www.themoviedb.org/documentation/api)
- Font Awesome Icons
- Google Fonts (Poppins)

## 📱 Features Breakdown

### Movie Display
- Grid layout of movie cards
- Hover effects with movie overview
- Dynamic rating colors based on score

### Filtering System
- Genre dropdown populated from TMDB API
- Year selection from 1900 to present
- Multiple sorting options

### Search
- Real-time search with debouncing
- Clear error handling
- Loading states

### Movie Details
- Modal window with additional information
- YouTube trailer integration
- Cast and crew information

### User Features
- Local storage for favorites and watchlist
- Toggle buttons for adding/removing movies
- Visual feedback for user actions

## 🎨 Styling

The app features a modern, dark theme with:
- Consistent color scheme
- Smooth transitions and animations
- Responsive typography
- Card-based layout
- Shadow effects for depth

## 🔧 Configuration

The app uses several configuration constants that can be modified in `script.js`:

## 📱 Responsive Design

The app is fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔄 API Integration

The app integrates with TMDB API endpoints:
- `/discover/movie`
- `/search/movie`
- `/movie/{id}`
- `/genre/movie/list`

## 🚧 Error Handling

- Network error detection
- API error handling
- Friendly error messages
- Retry functionality

## 🔍 Future Enhancements

- User authentication
- Advanced filtering options
- Social sharing features
- Personal movie ratings
- Watch provider integration
- Movie recommendations

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for their excellent API
- Font Awesome for icons
- Google Fonts for the Poppins font family
