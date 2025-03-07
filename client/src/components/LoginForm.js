import React, { useState } from 'react';
import api from '../api'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // По умолчанию выбрана роль "Сотрудник"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password, role });
      localStorage.setItem('token', response.data.token);
      toast.success('Вход выполнен успешно!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      // Ошибка уже обработана в интерцепторе
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