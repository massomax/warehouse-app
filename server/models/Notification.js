const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true }, // Ссылка на материал
  materialName: { type: String, required: true }, // Название материала
  quantity: { type: Number, required: true }, // Текущее количество
  status: { type: String, enum: ['Ожидает заказа', 'Заказано'], default: 'Ожидает заказа' }, // Статус заказа
  timestamp: { type: Date, default: Date.now }, // Время создания уведомления
});

module.exports = mongoose.model('Notification', notificationSchema);