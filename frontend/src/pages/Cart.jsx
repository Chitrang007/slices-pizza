import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, getCartTotal } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="page cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.cartId} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              {item.selectedToppings && item.selectedToppings.length > 0 && (
                <p className="toppings-list">
                  Toppings: {item.selectedToppings.map(t => t.name).join(', ')}
                </p>
              )}
            </div>
            <div className="item-price">
              ${(Number(item.customPrice) || Number(item.price) || 0).toFixed(2)}
            </div>
            <button 
              onClick={() => removeFromCart(item.cartId)}
              className="btn-remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
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
          <span>${(parseFloat(getCartTotal()) * 1.1).toFixed(2)}</span>
        </div>
        
        <Link to="/checkout" className="btn btn-primary full-width">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;