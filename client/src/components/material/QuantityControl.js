import React, { useState } from 'react';

const QuantityControl = ({ initialQuantity, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 1);

  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrement = () => {
    const newQuantity = Math.max(1, quantity - 1); // Минимальное значение — 1
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="quantity-control">
      <button onClick={decrement}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min="1"
      />
      <button onClick={increment}>+</button>
      <input
        type="range"
        value={quantity}
        onChange={handleChange}
        min="1"
        max="100" // Максимальное значение — 100 (можно изменить)
      />
    </div>
  );
};

export default QuantityControl;