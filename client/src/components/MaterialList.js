import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMaterialForm from './material/AddMaterialForm';
import EditMaterialForm from './material/EditMaterialForm';
import DeleteMaterialButton from './material/DeleteMaterialButton';
import '../styles.css';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  // Загрузка материалов
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

  // Обработчики для добавления, удаления и редактирования
  const handleMaterialAdded = (newMaterial) => {
    setMaterials([...materials, newMaterial]);
    setShowAddForm(false);
  };

  const handleMaterialDeleted = (materialId) => {
    setMaterials(materials.filter((material) => material._id !== materialId));
  };

  const handleMaterialUpdated = (updatedMaterial) => {
    setMaterials(
      materials.map((material) =>
        material._id === updatedMaterial._id ? updatedMaterial : material
      )
    );
    setEditingMaterial(null);
  };

  return (
    <div className="material-list">
      <h2>Материалы на складе</h2>
      <button onClick={() => setShowAddForm(true)}>Добавить материал</button>

      {showAddForm && (
        <AddMaterialForm onMaterialAdded={handleMaterialAdded} />
      )}

      {editingMaterial && (
        <EditMaterialForm
          material={editingMaterial}
          onMaterialUpdated={handleMaterialUpdated}
          onCancel={() => setEditingMaterial(null)}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Критический порог</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material._id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>{material.threshold}</td>
              <td>
                <button onClick={() => setEditingMaterial(material)}>Редактировать</button>
                <DeleteMaterialButton
                  materialId={material._id}
                  onMaterialDeleted={handleMaterialDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialList;