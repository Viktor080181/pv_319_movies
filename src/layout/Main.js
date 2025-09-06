import React from 'react';
import './Main.css';
import Preloader from '../components/Preloader.js';
import MovieList from '../components/MovieList.js';

class Main extends React.Component {
  state = { movies: [], loading: false, error: null };

  componentDidMount() {
    this.fetchMovies(this.props.searchTerm || 'matrix');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.fetchMovies(this.props.searchTerm);
    }
  }

  fetchMovies = (searchTerm) => {
    if (!searchTerm) return; // если пустой запрос, не ищем

    this.setState({ loading: true, error: null });

    fetch(`https://omdbapi.com/?apikey=b8502899&s=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        if (data.Response === "True") {
          this.setState({ movies: data.Search, loading: false });
        } else {
          this.setState({ movies: [], loading: false, error: data.Error });
        }
      })
      .catch(() => this.setState({ movies: [], loading: false, error: 'Ошибка загрузки' }));
  };

  render() {
    const { movies, loading, error } = this.state;

    return (
      <div className="main">
        <div className="wrap">
          {loading && <Preloader />}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {!loading && !error && movies.length > 0 && <MovieList movies={movies} />}
          {!loading && !error && movies.length === 0 && <p style={{ textAlign: 'center' }}>Фильмы не найдены.</p>}
        </div>
      </div>
    );
  }
}

export default Main;
