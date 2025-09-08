import React, { useState } from 'react';
import './App.css';
import Header from './layout/Header.js';
import Footer from './layout/Footer.js';
import Main from './layout/Main.js';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const itemsPerPage = 10; // Количество фильмов на странице (можно изменить)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
  };

  return (
    <div className="App">
      <Header />

      <div style={{ margin: '20px', textAlign: 'center' }}>
        <label htmlFor="search" style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
          Поиск фильма:
        </label>
        <input
          id="search"
          type="text"
          placeholder="Введите название фильма..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ padding: '8px 12px', width: '300px', fontSize: '16px' }}
        />
      </div>

      {/* Передаём currentPage и itemsPerPage в Main */}
      <Main 
        searchTerm={searchTerm} 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        setCurrentPage={setCurrentPage}  // Функция для изменения страницы
      />
      <Footer />
    </div>
  );
}

export default App;
