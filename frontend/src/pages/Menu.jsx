import React, { useContext, useState, useEffect } from 'react';
import { pizzas as mockPizzas } from '../data/mockData';
import { CartContext } from '../context/CartContext';
import CustomizePizza from '../components/CustomizePizza';
import { fetchMenu } from '../services/api';
import '../styles/pages.css';

function Menu() {
  const { addToCart } = useContext(CartContext);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pizzas from backend
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const menuData = await fetchMenu();
        
        // If backend returns data, use it; otherwise use mock data
        if (menuData && menuData.length > 0) {
          setPizzas(menuData);
        } else {
          console.log('No data from backend, using mock data');
          setPizzas(mockPizzas);
        }
      } catch (err) {
        console.error('Failed to fetch menu:', err);
        // Fallback to mock data on error
        setPizzas(mockPizzas);
        setError('Could not connect to backend. Using mock data.');
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleCustomize = (pizza) => {
    setSelectedPizza(pizza);
  };

  const handleAddToCart = (customizedPizza) => {
    addToCart(customizedPizza);
    alert('Pizza added to cart!');
    setSelectedPizza(null);
  };

  if (loading) {
    return (
      <div className="page menu-page">
        <h1>Our Menu</h1>
        <p>Loading pizzas...</p>
      </div>
    );
  }

  return (
    <div className="page menu-page">
      <h1>Our Menu</h1>
      
      {error && (
        <div className="warning-message">
          ⚠️ {error}
        </div>
      )}

      <div className="pizza-grid">
        {pizzas.map(pizza => (
          <div key={pizza.id} className="pizza-card">
            <div className="pizza-image">{pizza.image || '🍕'}</div>
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