const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');


router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
  
    try {
        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);    
        // Сохраняем пользователя в базу
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
    
        // Проверяем, что хеш сохранён в базе
        const savedUser = await User.findOne({ email });    
        res.status(201).json({ message: 'Пользователь создан' });
      } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании пользователя' });
      }
});

// POST /api/auth/login
router.post('/login', [
    check('email', 'Введите корректный email').isEmail(),
    check('password', 'Пароль обязателен').exists(),
  ], async (req, res) => {  
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
  
    // Очистка пароля
    const cleanPassword = password.trim();  
    // Проверка пароля
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
  
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
  });

module.exports = router;