const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кто выполнил действие
  materialId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Material', 
    required: true 
  },
  action: { type: String, required: true }, // Тип действия (например, "Добавление материала")
  details: { type: Object }, // Дополнительные данные (например, название материала, количество)
  timestamp: { type: Date, default: Date.now, index: true }, // Время действия
});

module.exports = mongoose.model('History', historySchema);