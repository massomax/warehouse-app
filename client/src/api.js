import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Базовый URL для всех запросов
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response, // Если запрос успешен, просто возвращаем ответ
  (error) => {
    if (error.response) {
      // Ошибка с ответом от сервера
      const { status, data } = error.response;

      if (status === 401) {
        // Ошибка авторизации
        toast.error('Ошибка авторизации. Пожалуйста, войдите снова.');
        localStorage.removeItem('token'); // Удаляем токен
        window.location = '/'; // Перенаправляем на страницу входа
      } else if (status === 403) {
        // Ошибка доступа (нет прав)
        toast.error('Доступ запрещен. У вас недостаточно прав.');
      } else if (status === 400) {
        // Ошибка валидации данных
        toast.error(data.message || 'Неверные данные');
      } else if (status === 500) {
        // Ошибка сервера
        toast.error('Ошибка сервера. Пожалуйста, попробуйте позже.');
      }
    } else if (error.request) {
      // Ошибка при отправке запроса (например, нет соединения)
      toast.error('Нет соединения с сервером. Проверьте интернет.');
    } else {
      // Другие ошибки
      toast.error('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }

    return Promise.reject(error);
  }
);

// Добавляем токен в заголовки запросов
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;