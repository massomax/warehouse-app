import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/LoginForm';
import MaterialList from './components/MaterialList';
import HistoryList from './components/HistoryList';
import RegisterForm from './components/RegisterForm';
import WarehouseAccessManager from './components/WarehouseAccessManager';
import './styles.css';

function App() {
  const [userRole, setUserRole] = useState('employee');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Выход выполнен успешно!');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
        />

        <nav className="main-nav">
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Склад</Link>
            <Link to="/history" className="nav-link">История</Link>
            {userRole === 'manager' && (
              <Link to="/warehouse-access" className="nav-link">Управление доступом</Link>
            )}
            <span>Роль: {userRole === 'manager' ? 'Менеджер' : 'Сотрудник'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<MaterialList />} />
          <Route path="/history" element={<HistoryList />} />
          <Route path="/warehouse-access" element={<WarehouseAccessManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;