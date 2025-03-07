const WarehouseAccess = require('../models/WarehouseAccess');

const checkWarehouseAccess = async (req, res, next) => {
  const { warehouseId } = req.params;
  const userId = req.user.userId;

  const access = await WarehouseAccess.findOne({ 
    warehouseId, 
    managerId: userId 
  });

  if (!access) {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }

  next();
};

module.exports = checkWarehouseAccess;