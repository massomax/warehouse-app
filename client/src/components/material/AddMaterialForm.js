import React, { useState } from 'react';
import axios from 'axios';

const AddMaterialForm = ({ onMaterialAdded }) => {
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: 0,
    threshold: 10,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/materials',
        newMaterial,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      onMaterialAdded(response.data); // Передаем новый материал в родительский компонент
      setNewMaterial({ name: '', quantity: 0, threshold: 10 }); // Сбрасываем форму
      alert('Материал успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении материала:', error);
      alert('Ошибка при добавлении материала');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Название:</label>
        <input
          type="text"
          name="name"
          value={newMaterial.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Количество:</label>
        <input
          type="number"
          name="quantity"
          value={newMaterial.quantity}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Критический порог:</label>
        <input
          type="number"
          name="threshold"
          value={newMaterial.threshold}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default AddMaterialForm;