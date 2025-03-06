const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

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
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении материала' });
  }
});

// Обновить материал (только для менеджеров)
router.put('/:id', authMiddleware, roleMiddleware('manager'), async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
  
    try {
      const material = await Material.findById(id);
  
      if (!material) {
        return res.status(404).json({ message: 'Материал не найден' });
      }
  
      // Обновляем количество
      material.quantity = quantity;
      await material.save();
  
      // Проверяем критический порог
      if (material.quantity <= material.threshold) {
        console.log(`Внимание! Материал "${material.name}" достиг критического порога.`);
      }
  
      res.json(material);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при обновлении материала' });
    }
  });

// Удалить материал (только для менеджеров)
router.delete('/:id', authMiddleware, roleMiddleware('manager'), async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    res.json({ message: 'Материал удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении материала' });
  }
});

module.exports = router;