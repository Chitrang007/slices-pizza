import React, { useContext, useState } from 'react';
import { pizzas } from '../data/mockData';
import { CartContext } from '../context/CartContext';
import CustomizePizza from '../components/CustomizePizza';
import '../styles/pages.css';

function Menu() {
  const { addToCart } = useContext(CartContext);
  const [selectedPizza, setSelectedPizza] = useState(null);

  const handleCustomize = (pizza) => {
    setSelectedPizza(pizza);
  };

  const handleAddToCart = (customizedPizza) => {
    addToCart(customizedPizza);
    alert('Pizza added to cart!');
    setSelectedPizza(null);
  };

  return (
    <div className="page menu-page">
      <h1>Our Menu</h1>
      <div className="pizza-grid">
        {pizzas.map(pizza => (
          <div key={pizza.id} className="pizza-card">
            <div className="pizza-image">{pizza.image}</div>
            <h3>{pizza.name}</h3>
            <p>{pizza.description}</p>
            <div className="pizza-footer">
              <span className="pizza-price">${pizza.price.toFixed(2)}</span>
              <button 
                onClick={() => handleCustomize(pizza)}
                className="btn btn-secondary"
              >
                Customize
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPizza && (
        <CustomizePizza 
          pizza={selectedPizza}
          onConfirm={handleAddToCart}
          onCancel={() => setSelectedPizza(null)}
        />
      )}
    </div>
  );
}

export default Menu;