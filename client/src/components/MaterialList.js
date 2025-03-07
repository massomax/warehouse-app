import React, { useEffect, useState } from 'react';
import api from '../api';
import AddMaterialForm from './material/AddMaterialForm';
import EditMaterialForm from './material/EditMaterialForm';
import DeleteMaterialButton from './material/DeleteMaterialButton';
import MaterialActions from './material/MaterialActions';
import WarehouseSelector from './WarehouseSelector';
import { toast } from 'react-toastify';
import '../styles.css';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [userRole, setUserRole] = useState('employee');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка материалов при изменении выбранного склада
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!selectedWarehouse) return;
      setIsLoading(true);
      
      try {
        const response = await api.get(`/materials?warehouse=${selectedWarehouse}`);
        setMaterials(response.data);
      } catch (error) {
        toast.error('Ошибка загрузки материалов');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [selectedWarehouse]);

  // Загрузка роли пользователя
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }, []);

  // Списание материала
  const handleSubtract = async (materialId, quantity) => {
    if (!selectedWarehouse) {
      toast.error('Выберите склад!');
      return;
    }

    try {
      const material = materials.find(m => m._id === materialId);
      const newQuantity = material.quantity - quantity;

      if (newQuantity < 0) {
        toast.error('Недостаточно материала');
        return;
      }

      await api.put(`/materials/${materialId}`, { 
        quantity: newQuantity,
        warehouseId: selectedWarehouse
      });
      
      setMaterials(materials.map(m => 
        m._id === materialId ? { ...m, quantity: newQuantity } : m
      ));
      toast.success('Материал списан!');
    } catch (error) {
      toast.error('Ошибка при списании');
    }
  };

  // Добавление материала
  const handleAdd = async (materialId, quantity) => {
    if (!selectedWarehouse) {
      toast.error('Выберите склад!');
      return;
    }

    try {
      const material = materials.find(m => m._id === materialId);
      const newQuantity = material.quantity + quantity;

      await api.put(`/materials/${materialId}`, { 
        quantity: newQuantity,
        warehouseId: selectedWarehouse
      });
      
      setMaterials(materials.map(m => 
        m._id === materialId ? { ...m, quantity: newQuantity } : m
      ));
      toast.success('Материал добавлен!');
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  return (
    <div className="material-list">
      <WarehouseSelector onSelect={setSelectedWarehouse} />
      <h2>Материалы {selectedWarehouse ? 'на складе' : ''}</h2>

      {isLoading && <div>Загрузка...</div>}

      {userRole === 'manager' && (
        <button 
          className="add-material-btn"
          onClick={() => setShowAddForm(true)}
          disabled={!selectedWarehouse}
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
          warehouseId={selectedWarehouse} // Передаем ID склада
          onCancel={() => setShowAddForm(false)}
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
          warehouseId={selectedWarehouse} // Передаем ID склада
        />
      )}

      {materials.length > 0 ? (
        <table className="materials-table">
          {/* ... таблица материалов ... */}
        </table>
      ) : (
        selectedWarehouse && <div>На складе нет материалов</div>
      )}
    </div>
  );
};

export default MaterialList;