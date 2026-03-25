import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page confirmation-page">
        <h1>Order Confirmation</h1>
        <p>No order found</p>
        <Link to="/menu" className="btn btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="page confirmation-page">
      <div className="confirmation-content">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your order, {order.customer.firstName}!
        </p>

        <div className="order-details">
          <h2>Order Details</h2>
          <p className="order-number">Order #: {order.id}</p>
          <p className="order-date">Order Date: {order.date}</p>

          <div className="order-items">
            <h3>Items:</h3>
            {order.items.map((item, index) => (
              <div key={index} className="item">
                <span>{item.name}</span>
                <span>${item.customPrice || item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-total">
            <strong>Total: ${order.total}</strong>
          </div>

          <div className="delivery-info">
            <h3>Delivery Address:</h3>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.zipCode}
            </p>
            <p>Phone: {order.customer.phone}</p>
          </div>

          <div className="estimated-delivery">
            <p>Estimated Delivery Time: 30 minutes</p>
          </div>
        </div>

        <Link to="/menu" className="btn btn-primary">
          Order More
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
