const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Получаем токен из заголовка Authorization
  const token = req.headers.authorization?.split(' ')[1];

  // Если токен отсутствует, возвращаем ошибку
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Добавляем данные пользователя в запрос
    req.user = decoded;

    // Передаём управление следующему middleware или роуту
    next();
  } catch (error) {
    // Если токен неверный, возвращаем ошибку
    res.status(401).json({ message: 'Неверный токен' });
  }
};

module.exports = authMiddleware;