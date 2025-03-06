import React from 'react';
import { toast } from 'react-toastify';
import api from '../../api'

const DeleteMaterialButton = ({ materialId, onMaterialDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот материал?')) {
      try {
        await api.delete(`/materials/${materialId}`);
        onMaterialDeleted(materialId);
        toast.success('Материал успешно удалён!');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Дополнительная обработка для ошибки 403
          toast.error('Вы не можете удалить этот материал.');
        } else {
          console.error('Ошибка при удалении материала:', error);
        }
      }
    }
  };

  return (
    <button onClick={handleDelete}>Удалить</button>
  );
};

export default DeleteMaterialButton;