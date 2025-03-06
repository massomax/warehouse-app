import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [userRole, setUserRole] = useState('employee');
  const [filterDate, setFilterDate] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const navigate = useNavigate();

  // Получение истории и роли пользователя
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Декодируем токен для получения роли
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);

        // Формируем URL запроса с фильтрами
        let endpoint = '/history/personal';
        let params = {};
        
        if (decodedToken.role === 'manager') {
          endpoint = '/history/full';
          params = {
            date: filterDate,
            user: filterUser
          };
        }

        // Выполняем запрос
        const response = await api.get(endpoint, { params });
        setHistory(response.data);
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        navigate('/login'); // Перенаправление при ошибке авторизации
      }
    };

    fetchHistory();
  }, [filterDate, filterUser, navigate]);

  return (
    <div className="history-container">
      <h2>{userRole === 'manager' ? 'История операций' : 'Ваши действия'}</h2>
      
      {/* Фильтры для менеджера */}
      {userRole === 'manager' && (
        <div className="history-filters">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Фильтр по email"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="filter-input"
          />
        </div>
      )}

      {/* Таблица истории */}
      <table className="history-table">
        <thead>
          <tr>
            {userRole === 'manager' && <th>Пользователь</th>}
            <th>Дата и время</th>
            <th>Действие</th>
            <th>Материал</th>
            <th>Изменение</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry._id}>
              {userRole === 'manager' && (
                <td>{entry.userId?.email || 'Система'}</td>
              )}
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
              <td>{entry.action}</td>
              <td>{entry.details.name}</td>
              <td>
                {entry.action.includes('Забор') ? '-' : '+'}
                {Math.abs(entry.details.newQuantity - entry.details.oldQuantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryList;