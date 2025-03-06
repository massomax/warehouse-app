const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const History = require('../models/History');
const Notification = require('../models/Notification');
const { Parser } = require('json2csv');

router.get('/materials', authMiddleware, roleMiddleware('manager'), async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', status } = req.query;

    try {
      const query = {};
      if (status) {
        query.quantity = { $lte: await Material.findOne({ name: status }).threshold };
      }
  
      const materials = await Material.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      const count = await Material.countDocuments(query);
  
      const report = materials.map(material => ({
        name: material.name,
        quantity: material.quantity,
        threshold: material.threshold,
        status: material.quantity <= material.threshold ? 'Критический уровень' : 'Норма',
      }));
  
      res.json({
        report,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении отчёта' });
    }
  });

router.get('/history', authMiddleware, roleMiddleware('manager'), async (req, res) => {
  try {
    const history = await History.find().populate('userId', 'email role');
    const report = history.map(entry => ({
      user: entry.userId.email,
      role: entry.userId.role,
      action: entry.action,
      details: entry.details,
      timestamp: entry.timestamp,
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отчёта' });
  }
});

router.get('/notifications', authMiddleware, roleMiddleware('manager'), async (req, res) => {
  try {
    const notifications = await Notification.find();
    const report = notifications.map(notification => ({
      materialName: notification.materialName,
      quantity: notification.quantity,
      status: notification.status,
      timestamp: notification.timestamp,
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отчёта' });
  }
});

router.get('/materials/export', authMiddleware, roleMiddleware('manager'), async (req, res) => {
    try {
      const materials = await Material.find();
      const report = materials.map(material => ({
        name: material.name,
        quantity: material.quantity,
        threshold: material.threshold,
        status: material.quantity <= material.threshold ? 'Критический уровень' : 'Норма',
      }));
  
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(report);
  
      res.header('Content-Type', 'text/csv');
      res.attachment('materials-report.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при экспорте отчёта' });
    }
});

module.exports = router;