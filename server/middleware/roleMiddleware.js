const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      // Проверяем роль пользователя
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Доступ запрещён' });
      }
  
      // Если роль совпадает, передаём управление следующему middleware или роуту
      next();
    };
  };
  
  module.exports = roleMiddleware;