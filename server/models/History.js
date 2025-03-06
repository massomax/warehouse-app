const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кто выполнил действие
  action: { type: String, required: true }, // Тип действия (например, "Добавление материала")
  details: { type: Object }, // Дополнительные данные (например, название материала, количество)
  timestamp: { type: Date, default: Date.now }, // Время действия
});

module.exports = mongoose.model('History', historySchema);