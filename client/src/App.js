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
    <Router>
      <ToastContainer />
      <nav>
        <Link to="/dashboard">Склад</Link>
        <Link to="/history">История</Link>
        <span>Роль: {userRole === 'manager' ? 'Менеджер' : 'Сотрудник'}</span> {/* Отображаем роль */}
        <button onClick={handleLogout}>Выйти</button>
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