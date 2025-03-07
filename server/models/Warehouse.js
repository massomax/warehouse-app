const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  address: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Warehouse', warehouseSchema);