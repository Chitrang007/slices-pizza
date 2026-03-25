import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

// Initial state for the delivery form
const initialCustomerState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
};

export function CartProvider({ children }) {
  // 1. Cart State with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('slices-pizza-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // 2. Customer Details State (persists during the session)
  const [customerDetails, setCustomerDetails] = useState(initialCustomerState);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('slices-pizza-cart', JSON.stringify(cart));
  }, [cart]);

  // Add pizza to cart
  const addToCart = (pizza) => {
    // We use Date.now() to give every pizza a unique ID in the cart
    setCart([...cart, { ...pizza, cartId: Date.now() }]);
  };

  // Remove pizza from cart
  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Reset the entire order session
  const clearCart = () => {
    setCart([]);
    setCustomerDetails(initialCustomerState);
  };

  // Calculate total price robustly
  const getCartTotal = () => {
    const total = cart.reduce((sum, item) => {
      // Use Number() to prevent string concatenation or .toFixed crashes
      const price = Number(item.customPrice) || Number(item.price) || 0;
      return sum + price;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        customerDetails, 
        setCustomerDetails, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        getCartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}