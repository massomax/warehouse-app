const mongoose = require('mongoose');
require('dotenv').config();
const Material = require('../models/Material');
const Warehouse = require('../models/Warehouse');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Создаем дефолтный склад
  const defaultWarehouse = await Warehouse.create({
    name: "Основной склад",
    address: "ул. Примерная, 1",
    managerId: "67c719577b3276042c1c8689" // Замените на реальный ID
  });

  // 2. Привязываем все материалы к дефолтному складу
  await Material.updateMany(
    { warehouseId: { $exists: false } },
    { $set: { warehouseId: defaultWarehouse._id } }
  );

  console.log("Миграция завершена!");
  process.exit();
}

migrate();