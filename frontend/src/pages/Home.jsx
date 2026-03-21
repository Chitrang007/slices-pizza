import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

function Home() {
  return (
    <div className="page home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>🍕 Welcome to Slices Pizza</h1>
          <p>Delicious, fresh pizzas made with love</p>
          <Link to="/menu" className="btn btn-primary">
            Order Now
          </Link>
        </div>
      </div>

      <section className="features">
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <h3>Fast Delivery</h3>
          <p>Get your pizza in 30 minutes or less</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <h3>Customize</h3>
          <p>Choose from 10+ delicious toppings</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">💰</span>
          <h3>Great Prices</h3>
          <p>Affordable pizzas for everyone</p>
        </div>
      </section>
    </div>
  );
}

export default Home;