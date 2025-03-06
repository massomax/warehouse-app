import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import MaterialList from './components/MaterialList';
import HistoryList from './components/HistoryList';
import './styles.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/dashboard">Склад</Link>
        <Link to="/history">История</Link>
        <button onClick={() => {
          localStorage.removeItem('token');
          window.location = '/';
        }}>Выйти</button>
      </nav>
      
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<MaterialList />} />
        <Route path="/history" element={<HistoryList />} />
      </Routes>
    </Router>
  );
}

export default App;