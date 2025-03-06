import React, { useEffect, useState } from 'react';
import api from '../api';
import AddMaterialForm from './material/AddMaterialForm';
import EditMaterialForm from './material/EditMaterialForm';
import DeleteMaterialButton from './material/DeleteMaterialButton';
import MaterialActions from './material/MaterialActions';
import { toast } from 'react-toastify';
import '../styles.css';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [userRole, setUserRole] = useState('employee');

  // Загрузка материалов и роли пользователя
  useEffect(() => {
    const fetchMaterialsAndRole = async () => {
      try {
        const materialsResponse = await api.get('/materials');
        setMaterials(materialsResponse.data);

        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUserRole(decodedToken.role);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchMaterialsAndRole();
  }, []);

  // Функция для списания материала
  const handleSubtract = async (materialId, quantity) => {
    try {
      const material = materials.find(m => m._id === materialId);
      const newQuantity = material.quantity - quantity;

      if (newQuantity < 0) {
        toast.error('Недостаточно материала на складе');
        return;
      }

      await api.put(`/materials/${materialId}`, { quantity: newQuantity });
      setMaterials(materials.map(m => 
        m._id === materialId ? { ...m, quantity: newQuantity } : m
      ));
      toast.success('Материал успешно списан!');
    } catch (error) {
      console.error('Ошибка при списании материала:', error);
      toast.error('Ошибка при списании материала');
    }
  };

  // Функция для добавления материала
  const handleAdd = async (materialId, quantity) => {
    try {
      const material = materials.find(m => m._id === materialId);
      const newQuantity = material.quantity + quantity;

      await api.put(`/materials/${materialId}`, { quantity: newQuantity });
      setMaterials(materials.map(m => 
        m._id === materialId ? { ...m, quantity: newQuantity } : m
      ));
      toast.success('Материал успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении материала:', error);
      toast.error('Ошибка при добавлении материала');
    }
  };

  return (
    <div className="material-list">
      <h2>Материалы на складе</h2>
      
      {userRole === 'manager' && (
        <button 
          className="add-material-btn"
          onClick={() => setShowAddForm(true)}
        >
          Добавить материал
        </button>
      )}

      {showAddForm && (
        <AddMaterialForm 
          onMaterialAdded={(newMaterial) => {
            setMaterials([...materials, newMaterial]);
            setShowAddForm(false);
          }}
        />
      )}

      {editingMaterial && (
        <EditMaterialForm
          material={editingMaterial}
          onMaterialUpdated={(updatedMaterial) => {
            setMaterials(materials.map(material =>
              material._id === updatedMaterial._id ? updatedMaterial : material
            ));
            setEditingMaterial(null);
          }}
          onCancel={() => setEditingMaterial(null)}
        />
      )}

      <table className="materials-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Критический порог</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material._id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>{material.threshold}</td>
              <td>
                {userRole === 'manager' ? (
                  <>
                    <button 
                      className="edit-btn"
                      onClick={() => setEditingMaterial(material)}
                    >
                      Редактировать
                    </button>
                    <DeleteMaterialButton
                      materialId={material._id}
                      onMaterialDeleted={(materialId) => {
                        setMaterials(materials.filter(m => m._id !== materialId));
                      }}
                    />
                  </>
                ) : (
                  <MaterialActions
                    materialId={material._id}
                    onSubtract={handleSubtract}
                    onAdd={handleAdd}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialList;