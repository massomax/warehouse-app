import React, { useEffect, useState } from 'react';
import api from '../api';

const WarehouseAccessManager = ({ warehouseId }) => {
  const [managers, setManagers] = useState([]);
  const [currentManagers, setCurrentManagers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Получаем всех менеджеров
      const managersResponse = await api.get('/users?role=manager');
      setManagers(managersResponse.data);

      // Получаем текущие доступы для склада
      const accessResponse = await api.get(`/warehouse-access/warehouse/${warehouseId}`);
      setCurrentManagers(accessResponse.data.map(access => access.managerId));
    };
    fetchData();
  }, [warehouseId]);

  const handleAssign = async (managerId) => {
    await api.post('/warehouse-access', { warehouseId, managerId });
    setCurrentManagers([...currentManagers, managerId]);
  };

  const handleRevoke = async (accessId) => {
    await api.delete(`/warehouse-access/${accessId}`);
    setCurrentManagers(currentManagers.filter(id => id !== accessId));
  };

  return (
    <div>
      <h3>Управление доступом</h3>
      <select onChange={(e) => handleAssign(e.target.value)}>
        <option value="">Выберите менеджера</option>
        {managers.map(manager => (
          <option key={manager._id} value={manager._id}>
            {manager.email}
          </option>
        ))}
      </select>

      <div>
        {currentManagers.map(managerId => (
          <div key={managerId}>
            <span>{managerId.email}</span>
            <button onClick={() => handleRevoke(managerId)}>Удалить доступ</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseAccessManager;