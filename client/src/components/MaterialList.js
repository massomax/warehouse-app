import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/materials', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMaterials(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке материалов:', error);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div>
      <h2>Материалы на складе</h2>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Критический порог</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material._id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>{material.threshold}</td>
              <td>{material.quantity <= material.threshold ? 'Критический уровень' : 'Норма'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialList;