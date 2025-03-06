const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Notification = require('../models/Notification');

router.get('/', authMiddleware, roleMiddleware('manager'), async (req, res) => {
    try {
      const notifications = await Notification.find();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении уведомлений' });
    }
});
router.put('/:id', authMiddleware, roleMiddleware('manager'), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const notification = await Notification.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!notification) {
        return res.status(404).json({ message: 'Уведомление не найдено' });
      }
  
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при обновлении статуса уведомления' });
    }
});

router.delete('/:id', authMiddleware, roleMiddleware('manager'), async (req, res) => {
    const { id } = req.params;
  
    try {
      const notification = await Notification.findByIdAndDelete(id);
  
      if (!notification) {
        return res.status(404).json({ message: 'Уведомление не найдено' });
      }
  
      res.json({ message: 'Уведомление удалено' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при удалении уведомления' });
    }
});
  
module.exports = router;