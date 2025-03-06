const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const History = require('../models/History');

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await History.find().populate('userId', 'email role'); // Добавляем информацию о пользователе
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении истории' });
  }
});

module.exports = router;
