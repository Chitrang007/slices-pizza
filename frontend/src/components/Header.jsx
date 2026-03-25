import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Header.css";

function Header() {
  const { cart } = useContext(CartContext);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🍕 Slices Pizza
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/menu" className="nav-link">
            Menu
          </Link>
          <Link to="/cart" className="nav-link">
            Cart{" "}
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>
          <Link to="/checkout" className="nav-link checkout-btn">
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
