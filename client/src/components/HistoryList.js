import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const HistoryList = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>История операций</h2>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Пользователь</th>
            <th>Действие</th>
            <th>Детали</th>
          </tr>
        </thead>
        <tbody>
          {history.map(entry => (
            <tr key={entry._id}>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
              <td>{entry.userId?.email || 'Система'}</td>
              <td>{entry.action}</td>
              <td>
                {entry.details && (
                  <div>
                    Материал: {entry.details.name}, 
                    Было: {entry.details.oldQuantity}, 
                    Стало: {entry.details.newQuantity}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryList;