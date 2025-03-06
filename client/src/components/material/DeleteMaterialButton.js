import React from 'react';
import axios from 'axios';

const DeleteMaterialButton = ({ materialId, onMaterialDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот материал?')) {
      try {
        await axios.delete(`http://localhost:5000/api/materials/${materialId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onMaterialDeleted(materialId); // Передаем ID удаленного материала в родительский компонент
        alert('Материал успешно удалён!');
      } catch (error) {
        console.error('Ошибка при удалении материала:', error);
        alert('Ошибка при удалении материала');
      }
    }
  };

  return (
    <button onClick={handleDelete}>Удалить</button>
  );
};

export default DeleteMaterialButton;