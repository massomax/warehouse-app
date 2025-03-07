const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 0 
  },
  threshold: { 
    type: Number, 
    default: 10 
  },
  warehouseId: { // Новое поле!
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Warehouse', 
    required: true 
  }
});

module.exports = mongoose.model('Material', materialSchema);