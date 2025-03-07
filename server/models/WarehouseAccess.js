const mongoose = require('mongoose');

const warehouseAccessSchema = new mongoose.Schema({
  warehouseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Warehouse', 
    required: true 
  },
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
});

module.exports = mongoose.model('WarehouseAccess', warehouseAccessSchema);