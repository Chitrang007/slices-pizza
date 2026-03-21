import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { placeOrder } from '../services/api';
import '../styles/pages.css';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create order object
      const order = {
        id: Date.now().toString().slice(-8),
        items: cart,
        total: (parseFloat(getCartTotal()) * 1.1).toFixed(2),
        customer: formData,
        date: new Date().toISOString(),
      };

      // Send order to backend
      console.log('Sending order to backend:', order);
      const response = await placeOrder(order);
      console.log('Backend response:', response);

      // Show success message
      alert(`Order placed successfully! ${response.message}`);

      // Clear cart and navigate
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = (parseFloat(getCartTotal()) * 1.1).toFixed(2);

  return (
    <div className="page checkout-page">
      <h1>Checkout</h1>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
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
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
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