import React, { useState } from 'react';
import { toppings } from '../data/mockData';
import '../styles/components.css';

function CustomizePizza({ pizza, onConfirm, onCancel }) {
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleToppingChange = (topping) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      // Remove topping
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      // Add topping if under limit
      if (selectedToppings.length < 10) {
        setSelectedToppings([...selectedToppings, topping]);
      }
    }
  };

  const isToppingSelected = (id) => {
    return selectedToppings.some(t => t.id === id);
  };

  const getTotalPrice = () => {
    const toppingPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (pizza.price + toppingPrice).toFixed(2);
  };

  const handleConfirm = () => {
    // Make sure toppings count is between 2 and 10
    if (selectedToppings.length < 2 || selectedToppings.length > 10) {
      alert('Please select between 2 and 10 toppings');
      return;
    }
    onConfirm({ ...pizza, selectedToppings, customPrice: getTotalPrice() });
  };

  return (
    <div className="customize-pizza-modal">
      <div className="customize-pizza-content">
        <h2>Customize Your Pizza</h2>
        <p className="pizza-name">{pizza.name}</p>
        
        <div className="toppings-container">
          <p className="toppings-label">
            Select 2-10 toppings ({selectedToppings.length}/10)
          </p>
          
          <div className="toppings-grid">
            {toppings.map(topping => (
              <label key={topping.id} className="topping-item">
                <input
                  type="checkbox"
                  checked={isToppingSelected(topping.id)}
                  onChange={() => handleToppingChange(topping)}
                  disabled={!isToppingSelected(topping.id) && selectedToppings.length >= 10}
                />
                <span className="topping-name">{topping.name}</span>
                <span className="topping-price">+${topping.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="customize-footer">
          <div className="price-display">
            <span>Base: ${pizza.price.toFixed(2)}</span>
            <span className="total-price">Total: ${getTotalPrice()}</span>
          </div>
          
          <div className="button-group">
            <button onClick={onCancel} className="btn-cancel">Cancel</button>
            <button 
              onClick={handleConfirm} 
              className="btn-confirm"
              disabled={selectedToppings.length < 2 || selectedToppings.length > 10}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizePizza;