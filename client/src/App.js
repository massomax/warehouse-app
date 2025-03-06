import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/LoginForm';
import MaterialList from './components/MaterialList';
import HistoryList from './components/HistoryList';
import './styles.css';

function App() {
  const [userRole, setUserRole] = useState('employee'); // По умолчанию роль "Сотрудник"

  // Получаем роль пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log(decodedToken) // Декодируем токен
      setUserRole(decodedToken.role); // Устанавливаем роль пользователя
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Выход выполнен успешно!');
    window.location = '/';
  };

  return (
    // <Router>
    //   <ToastContainer
    //       position="top-right"
    //       autoClose={1000}
    //       hideProgressBar={false}
    //       newestOnTop
    //     />
    //   <nav>
    //     <Link to="/dashboard">Склад</Link>
    //     <Link to="/history">История</Link>
    //     <span>Роль: {userRole === 'manager' ? 'Менеджер' : 'Сотрудник'}</span> {/* Отображаем роль */}
    //     <button onClick={handleLogout}>Выйти</button>
    //   </nav>
      
    //   <Routes>
    //     <Route path="/" element={<LoginForm />} />
    //     <Route path="/dashboard" element={<MaterialList />} />
    //     <Route path="/history" element={<HistoryList />} />
    //   </Routes>
    // </Router>
    <Router>
      <div className="app-container">
        {/* Уведомления */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
        />

        {/* Навигационная панель */}
        <nav className="main-nav">
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Склад</Link>
            <Link to="/history" className="nav-link">История</Link>
            <span>Роль: {userRole === 'manager' ? 'Менеджер' : 'Сотрудник'}</span> {/* Отображаем роль */}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </nav>

        {/* Маршруты */}
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<MaterialList />} />
          <Route path="/history" element={<HistoryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;