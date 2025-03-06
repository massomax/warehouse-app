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
      userId: req.user.userId,
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

// Обновить материал (доступно менеджерам и сотрудникам с ограничениями)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, quantity, threshold } = req.body; // Принимаем все поля
  const user = req.user;

  try {
    const material = await Material.findById(id);
    if (!material) return res.status(404).json({ message: 'Материал не найден' });

    // Проверка прав для сотрудников
    if (user.role === 'employee' && quantity === material.quantity) {
      return res.status(403).json({ 
        message: 'Сотрудник должен изменить количество материала' 
      });
    }

    // Логика проверки критического порога
    if (quantity <= material.threshold) {
      const existingNotification = await Notification.findOne({ 
        materialId: material._id 
      });

      if (!existingNotification) {
        const notification = new Notification({
          materialId: material._id,
          materialName: material.name,
          quantity,
        });
        await notification.save();
      }
    } else {
      await Notification.deleteOne({ materialId: material._id });
    }

    // Определяем тип действия для истории
    let action;
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
      action,
      details: {
        materialId: material._id,
        name: material.name,
        oldQuantity: material.quantity,
        newQuantity: quantity
      },
    });
    await history.save();

    // Обновляем материал
    material.name = name; // Обновляем имя
    material.quantity = quantity; // Обновляем количество
    material.threshold = threshold; // Обновляем критический порог
    await material.save();

    res.json(material);
  } catch (error) {
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
      userId: req.user.userId,
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

module.exports = router;