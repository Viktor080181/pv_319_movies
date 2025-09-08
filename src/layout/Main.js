import React from 'react';
import './Main.css';
import Preloader from '../components/Preloader.js';
import MovieList from '../components/MovieList.js';

class Main extends React.Component {
  state = {
    movies: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalResults: 0,
  };

  componentDidMount() {
    this.fetchMovies(this.props.searchTerm || 'matrix', 1);
  }

  componentDidUpdate(prevProps, prevState) {
    // При смене searchTerm сбрасываем страницу на 1 и загружаем заново
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.setState({ currentPage: 1 }, () => {
        this.fetchMovies(this.props.searchTerm, 1);
      });
    }
    // При смене currentPage загружаем данные для новой страницы
    else if (prevState.currentPage !== this.state.currentPage) {
      this.fetchMovies(this.props.searchTerm, this.state.currentPage);
    }
  }

  fetchMovies = (searchTerm, page = 1) => {
    if (!searchTerm) {
      this.setState({ movies: [], totalResults: 0 });
      return;
    }

    this.setState({ loading: true, error: null });

    fetch(`https://omdbapi.com/?apikey=b8502899&s=${encodeURIComponent(searchTerm)}&page=${page}`)
      .then(response => response.json())
      .then(data => {
        if (data.Response === "True") {
          this.setState({
            movies: data.Search,
            loading: false,
            error: null,
            totalResults: parseInt(data.totalResults, 10),
          });
        } else {
          this.setState({
            movies: [],
            loading: false,
            error: data.Error,
            totalResults: 0,
          });
        }
      })
      .catch(() => this.setState({ movies: [], loading: false, error: 'Ошибка загрузки', totalResults: 0 }));
  };

  handlePrevPage = () => {
    this.setState(({ currentPage }) => ({
      currentPage: currentPage > 1 ? currentPage - 1 : 1,
    }));
  };

  handleNextPage = () => {
    const totalPages = Math.ceil(this.state.totalResults / 10); // OMDB возвращает по 10 фильмов на страницу
    this.setState(({ currentPage }) => ({
      currentPage: currentPage < totalPages ? currentPage + 1 : currentPage,
    }));
  };

  render() {
    const { movies, loading, error, currentPage, totalResults } = this.state;
    const totalPages = Math.ceil(totalResults / 10);

    return (
      <div className="main">
        <div className="wrap">
          {loading && <Preloader />}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {!loading && !error && movies.length > 0 && <MovieList movies={movies} />}
          {!loading && !error && movies.length === 0 && <p style={{ textAlign: 'center' }}>Фильмы не найдены.</p>}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="pagination" style={{ textAlign: 'center', marginTop: 20 }}>
              <button onClick={this.handlePrevPage} disabled={currentPage === 1}>
                Предыдущая
              </button>
              <span style={{ margin: '0 15px' }}>
                Страница {currentPage} из {totalPages}
              </span>
              <button onClick={this.handleNextPage} disabled={currentPage === totalPages}>
                Следующая
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Main;
