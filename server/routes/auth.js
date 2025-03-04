const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').isEmail(),
    check('password', 'Пароль обязателен').exists(),
  ],
  async (req, res) => {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Поиск пользователя
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Проверка роли
    if (user.role !== role) {
      return res.status(403).json({ message: 'Доступ запрещен для этой роли' });
    }

    // Генерация JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  }
);

module.exports = router;