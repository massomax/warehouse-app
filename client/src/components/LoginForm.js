import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // По умолчанию выбрана роль "Сотрудник"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });
      localStorage.setItem('token', response.data.token); // Сохраняем токен
      navigate('/dashboard'); // Перенаправляем на главную страницу
    } catch (error) {
      alert('Ошибка авторизации: ' + error.response.data.message);
    }
  };

  return (
    <div className="login-form">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Роль:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Сотрудник</option>
            <option value="manager">Менеджер</option>
          </select>
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginForm;