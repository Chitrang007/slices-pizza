// Check if the app is running on localhost
const isLocal = window.location.hostname === 'localhost';

// Automatically switch between local and production
const API_BASE_URL = isLocal 
  ? 'http://localhost:8080/api' // Your Go local port
  : 'https://slices-pizza-backend.onrender.com/api';

// Fetch all pizzas from backend
export const fetchMenu = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

// Check if backend is healthy
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return null;
  }
};

// Place an order to backend
export const placeOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to place order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};