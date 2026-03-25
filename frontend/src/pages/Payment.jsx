import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the order data from Checkout.jsx
  const { orderData } = location.state || {};

  const [cardInfo, setCardInfo] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format Card Number (0000 0000 0000 0000)
    if (name === "number") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }
    // Format Expiry (MM/YY)
    if (name === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(.{2})/g, "$1/")
        .trim()
        .slice(0, 5);
    }
    // Format CVV (Max 3 digits)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardInfo({ ...cardInfo, [name]: formattedValue });
  };

  const handleContinue = (e) => {
    e.preventDefault();

    // Security check: simple validation
    if (
      cardInfo.number.length < 19 ||
      cardInfo.expiry.length < 5 ||
      cardInfo.cvv.length < 3
    ) {
      toast.error("Please enter valid card details");
      return;
    }

    const paymentSummary = {
      method: "Credit Card (Visa)",
      cardHolder: cardInfo.name || "CardHolder Name",
      cardNumber: `Visa **** **** **** ${cardInfo.number.slice(-4)}`,
    };

    const updatedOrder = {
      ...orderData,
      payment: paymentSummary,
    };

    navigate("/order-review", { state: { finalOrder: updatedOrder } });
  };

  if (!orderData) {
    return (
      <div className="payment-page">
        <div className="payment-container error-state">
          <h2>Order session expired.</h2>
          <button onClick={() => navigate("/menu")} className="continue-btn">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Payment Method</h1>
          <p>
            Total Amount: <span>${orderData.total}</span>
          </p>
        </div>

        {/* --- LIVE VIRTUAL CARD (Horizontal Image 1 Layout) --- */}
        <div className="card-preview">
          <div className="card-top-row">
            <div className="card-chip"></div>
            <div className="card-brand">Visa</div>
          </div>

          <div className="card-number-display">
            {cardInfo.number || "XXXX XXXX XXXX XXXX"}
          </div>

          <div className="card-footer-row">
            <div className="footer-group">
              <label>CARD HOLDER</label>
              <div className="footer-val">
                {cardInfo.name.toUpperCase() || "YOUR NAME"}
              </div>
            </div>
            <div className="footer-group expiration-group">
              <label>EXPIRES</label>
              <div className="footer-val">{cardInfo.expiry || "MM/YY"}</div>
            </div>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleContinue}>
          <div className="input-group">
            <label>Name on Card</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={cardInfo.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Card Number</label>
            <input
              type="text"
              name="number"
              placeholder="0000 0000 0000 0000"
              value={cardInfo.number}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Expiration</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={cardInfo.expiry}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>CVV</label>
              <input
                type="password"
                name="cvv"
                placeholder="***"
                value={cardInfo.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="continue-btn">
            CONTINUE TO REVIEW
          </button>

          <div className="secure-footer">
            <span>🛡️</span> Secure 256-bit SSL Encrypted Payment
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
