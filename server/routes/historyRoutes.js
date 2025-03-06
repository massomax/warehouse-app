const express = require('express');
const router = express.Router();
const History = require('../models/History');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Личная история (для сотрудника)
router.get('/personal', authMiddleware, async (req, res) => {
  try {
    console.log("User ID:", req.user.userId);
    const history = await History.find({ userId: req.user.userId })
    .populate({
      path: 'materialId',
      select: 'name',
      model: 'Material' // Явно укажите модель
    })
      .sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    console.error("Ошибка в /personal:", error.message, error.stack);
    res.status(500).json({ message: 'Ошибка при получении истории' });
  }
});

// Полная история (для менеджера)
router.get('/full', authMiddleware, roleMiddleware('manager'), async (req, res) => {
  try {
    const history = await History.find()
      .populate('userId', 'email')
      .populate('materialId', 'name')
      .sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении истории' });
  }
});

module.exports = router;