const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Название материала
  quantity: { type: Number, default: 0 }, // Количество на складе
  threshold: { type: Number, default: 10 }, // Критический порог
});

module.exports = mongoose.model('Material', materialSchema);