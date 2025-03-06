import React, { useState } from 'react';
import axios from 'axios';

const EditMaterialForm = ({ material, onMaterialUpdated, onCancel }) => {
  const [editedMaterial, setEditedMaterial] = useState(material);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMaterial({ ...editedMaterial, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/materials/${editedMaterial._id}`,
        editedMaterial,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      onMaterialUpdated(response.data); // Передаем обновленный материал в родительский компонент
      alert('Материал успешно обновлён!');
    } catch (error) {
      console.error('Ошибка при обновлении материала:', error);
      alert('Ошибка при обновлении материала');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Название:</label>
        <input
          type="text"
          name="name"
          value={editedMaterial.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Количество:</label>
        <input
          type="number"
          name="quantity"
          value={editedMaterial.quantity}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Критический порог:</label>
        <input
          type="number"
          name="threshold"
          value={editedMaterial.threshold}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Сохранить</button>
      <button type="button" onClick={onCancel}>Отмена</button>
    </form>
  );
};

export default EditMaterialForm;