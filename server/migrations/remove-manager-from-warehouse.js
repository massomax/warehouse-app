const mongoose = require('mongoose');
require('dotenv').config();
const Warehouse = require('../models/Warehouse');
const WarehouseAccess = require('../models/WarehouseAccess');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Переносим существующие связи менеджеров в WarehouseAccess
  const warehouses = await Warehouse.find({ managerId: { $exists: true } });

  for (const warehouse of warehouses) {
    if (warehouse.managerId) {
      await WarehouseAccess.create({
        warehouseId: warehouse._id,
        managerId: warehouse.managerId
      });
    }
  }

  // 2. Удаляем поле managerId из всех складов
  await Warehouse.updateMany(
    {}, 
    { $unset: { managerId: 1 } }
  );

  console.log("Миграция завершена!");
  process.exit();
}

migrate();