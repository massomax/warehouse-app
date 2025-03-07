
import React, { useState, useEffect } from 'react';
import api from '../api';

const WarehouseSelector = ({ onSelect }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await api.get('/warehouses');
        setWarehouses(response.data);
      } catch (error) {
        console.error('Ошибка загрузки складов:', error);
      }
    };
    fetchWarehouses();
  }, []);

  return (
    <select 
      value={selectedWarehouse} 
      onChange={(e) => {
        setSelectedWarehouse(e.target.value);
        onSelect(e.target.value);
      }}
    >
      <option value="">Выберите склад</option>
      {warehouses.map(warehouse => (
        <option key={warehouse._id} value={warehouse._id}>
          {warehouse.name}
        </option>
      ))}
    </select>
  );
};

export default WarehouseSelector;