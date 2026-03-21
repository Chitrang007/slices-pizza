import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CartContext = createContext();

// Provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Load from localStorage on mount
    try {
      const saved = localStorage.getItem('slices-pizza-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('slices-pizza-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (pizza) => {
    setCart([...cart, { ...pizza, cartId: Date.now() }]);
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}