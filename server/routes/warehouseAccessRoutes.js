const express = require('express');
const router = express.Router();
const WarehouseAccess = require('../models/WarehouseAccess');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Назначить доступ менеджеру
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { warehouseId, managerId } = req.body;
    const access = new WarehouseAccess({ warehouseId, managerId });
    await access.save();
    res.json(access);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка назначения доступа' });
  }
});

// Отозвать доступ
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    await WarehouseAccess.findByIdAndDelete(req.params.id);
    res.json({ message: 'Доступ отозван' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления доступа' });
  }
});

// Получить все доступы для склада
router.get('/warehouse/:warehouseId', authMiddleware, async (req, res) => {
  try {
    const accesses = await WarehouseAccess.find({ 
      warehouseId: req.params.warehouseId 
    }).populate('managerId', 'email');
    res.json(accesses);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения доступов' });
  }
});

module.exports = router;