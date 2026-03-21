import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/pages.css';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  if (cart.length === 0) {
    return (
      <div className="page checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    // Create order
    const order = {
      id: Date.now(),
      items: cart,
      total: (parseFloat(getCartTotal()) * 1.1).toFixed(2),
      customer: formData,
      date: new Date().toLocaleString(),
    };

    console.log('Order placed:', order);

    // Clear cart and navigate
    clearCart();
    navigate('/order-confirmation', { state: { order } });
  };

  const total = (parseFloat(getCartTotal()) * 1.1).toFixed(2);

  return (
    <div className="page checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Delivery Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary full-width">
              Place Order
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div key={item.cartId} className="summary-item">
              <span>{item.name}</span>
              <span>${item.customPrice || item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;