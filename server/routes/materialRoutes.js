const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const History = require('../models/History');
const Notification = require('../models/Notification');

// Получить все материалы (доступно всем авторизованным пользователям)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении материалов' });
  }
});

// Добавить материал (только для менеджеров)
router.post('/', authMiddleware, roleMiddleware('manager'), async (req, res) => {
  const { name, quantity, threshold } = req.body;

  try {
    const material = new Material({ name, quantity, threshold });
    await material.save();

    // Запись в историю
    const history = new History({
      userId: req.user._id,
      materialId: material._id,
      action: 'Добавление материала',
      details: { 
        materialId: material._id, 
        name, 
        quantity, 
        threshold 
      },
    });
    await history.save();

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении материала' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, quantity, threshold } = req.body; // Принимаем все поля, но они могут быть undefined
  const user = req.user;

  try {
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    // Проверка прав для сотрудников
    if (user.role === 'employee' && quantity === material.quantity) {
      return res.status(403).json({ 
        message: 'Сотрудник должен изменить количество материала' 
      });
    }

    // Проверяем, что новое количество не отрицательное (если quantity передано)
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ message: 'Количество не может быть отрицательным' });
    }

    // Логика проверки критического порога (если quantity передано)
    if (quantity !== undefined && quantity <= material.threshold) {
      const existingNotification = await Notification.findOne({ 
        materialId: material._id 
      });

      if (!existingNotification) {
        const notification = new Notification({
          materialId: material._id,
          materialName: material.name,
          quantity,
          status: 'Ожидает заказа', // Добавляем статус уведомления
        });
        await notification.save();
      }
    } else if (quantity !== undefined) {
      await Notification.deleteOne({ materialId: material._id });
    }

    // Определяем тип действия для истории (если quantity передано)
    let action;
    if (quantity !== undefined) {
      if (user.role === 'manager') {
        action = 'Ручное обновление материала';
      } else {
        action = quantity > material.quantity 
          ? 'Добавление материала' 
          : 'Забор материала';
      }

      // Запись в историю
      const history = new History({
        userId: user.userId,
        materialId: material._id,
        action,
        details: {
          materialId: material._id,
          name: material.name,
          oldQuantity: material.quantity,
          newQuantity: quantity,
          threshold: material.threshold, // Сохраняем порог в истории
        },
      });
      await history.save();
    }

    // Обновляем только те поля, которые были переданы
    if (name !== undefined) material.name = name;
    if (quantity !== undefined) material.quantity = quantity;
    if (threshold !== undefined) material.threshold = threshold;

    await material.save();

    res.json(material);
  } catch (error) {
    console.error('Ошибка при обновлении материала:', error.message, error.stack);
    res.status(500).json({ message: 'Ошибка при обновлении материала' });
  }
});

// Удалить материал (только для менеджеров)
router.delete('/:id', authMiddleware, roleMiddleware('manager'), async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    // Запись в историю
    const history = new History({
      userId: req.user._id,
      materialId: material._id,
      action: 'Удаление материала',
      details: { 
        materialId: material._id, 
        name: material.name 
      },
    });
    await history.save();

    await Material.deleteOne({ _id: id });

    res.json({ message: 'Материал удалён' });
  } catch (error) {
    console.error('Ошибка при удалении материала:', error);
    res.status(500).json({ message: 'Ошибка при удалении материала' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find({ 
      warehouseId: req.query.warehouse // Фильтр по складу
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении материалов' });
  }
});

module.exports = router;