import React, { useState } from 'react';

const MaterialActions = ({ materialId, onSubtract, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="material-actions">
      <div className="quantity-control">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <input
          type="number"
          value={quantity}
          onChange={handleChange}
          min="1"
        />
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
        <input
          type="range"
          value={quantity}
          onChange={handleChange}
          min="1"
          max="100"
        />
      </div>

      <div className="action-buttons">
        <button onClick={() => onSubtract(materialId, quantity)}>Списать</button>
        <button onClick={() => onAdd(materialId, quantity)}>Добавить</button>
      </div>
    </div>
  );
};

export default MaterialActions;