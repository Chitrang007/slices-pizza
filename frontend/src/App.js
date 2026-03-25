import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Global Styles
import './styles/App.css';
import './styles/buttons.css';

// Component Styles
import './components/Header.css';
import './components/Footer.css';
import './components/CustomizePizza.css';

// Page Styles
import './pages/Home.css';
import './pages/Menu.css';
import './pages/Cart.css';
import './pages/Checkout.css';
import './pages/OrderConfirmation.css';
import Payment from './pages/Payment';
import OrderReview from './pages/OrderReview';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-review" element={<OrderReview />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </CartProvider>
  );
}

export default App;