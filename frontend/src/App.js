import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(err => console.error("Connection Error:", err));
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <h1 className="logo-text">
          SLICES <span className="logo-accent">PIZZA</span>
        </h1>
        <p className="sub-header">BACKEND: GOLANG | FRONTEND: REACT</p>
      </nav>
      
      <main className="menu-container">
        <div className="pizza-grid">
          {menu.map(pizza => (
            <div key={pizza.id} className="pizza-card">
              <span className="pizza-name">{pizza.name}</span>
              <div className="card-footer">
                <span className="pizza-price">
                  ${pizza.price.toFixed(2)}
                </span>
                <button className="add-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;