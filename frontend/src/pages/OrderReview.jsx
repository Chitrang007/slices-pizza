import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { placeOrder } from "../services/api";
import { CartContext } from "../context/CartContext";
import "./OrderReview.css";

function OrderReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clearCart } = useContext(CartContext);

  const { finalOrder } = location.state || {};

  if (!finalOrder) {
    return (
      <div className="page">No slices found. Please return to the menu.</div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    if (!finalOrder.id) {
      toast.error("Error: Order ID is missing. Please restart checkout.");
      setIsSubmitting(false);
      return;
    }
    const toastId = toast.loading("Sending your order to the kitchen...");

    try {
      await placeOrder(finalOrder);
      clearCart();

      toast.update(toastId, {
        render: "Order Received! The oven is preheating. 🍕",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      navigate("/order-confirmation", { state: { order: finalOrder } });
    } catch (err) {
      toast.update(toastId, {
        render: "Oven error! Please try placing your order again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-review-page">
      {/* Pizzeria Themed Heading */}
      <h2 className="page-title">Ready to bake? Review your feast. 🍕</h2>

      <div className="review-container">
        {/* LEFT SECTION: Delivery & Payment */}
        <div className="review-main-left">
          <section className="review-box">
            <div className="box-header">
              <h3>Delivery Details</h3>
              <button
                className="edit-link"
                onClick={() => navigate("/checkout")}
              >
                Change
              </button>
            </div>
            <div className="box-content">
              <p>
                <strong>Method:</strong> Fast & Fresh Pizza Delivery - FREE
              </p>
              <p>
                <strong>Arriving:</strong> Approx. 30-45 minutes
              </p>

              <div className="address-block" style={{ marginTop: "15px" }}>
                <p>
                  <strong>Deliver To:</strong>
                </p>
                <p>
                  {finalOrder.customer.firstName} {finalOrder.customer.lastName}
                </p>
                <p>{finalOrder.customer.address}</p>
                <p>
                  {finalOrder.customer.city}, {finalOrder.customer.state}{" "}
                  {finalOrder.customer.zipCode}
                </p>
                <p>{finalOrder.customer.country}</p>
                <p>{finalOrder.customer.phone}</p>
              </div>
            </div>
          </section>

          <section className="review-box">
            <div className="box-header">
              <h3>Payment Info</h3>
              <button
                className="edit-link"
                onClick={() =>
                  navigate("/payment", { state: { orderData: finalOrder } })
                }
              >
                Change
              </button>
            </div>
            <div className="box-content">
              <p>
                <strong>Payment Method: </strong>{" "}
                {finalOrder.payment?.method || "Credit Card"} 💳
              </p>
              <p>
                <strong>Cardholder: </strong>
                <span className="uppercase-text">
                  {finalOrder.payment?.cardHolder?.toUpperCase() ||
                    "NOT PROVIDED"}
                </span>
              </p>

              <p>
                <strong>Card Number: </strong>{" "}
                {finalOrder.payment?.cardNumber || "Visa **** **** **** ****"}
              </p>
            </div>
          </section>
        </div>

        <aside className="review-sidebar-right">
          <div className="bag-summary-card">
            <h3>Your Slices ({finalOrder.items.length})</h3>

            <div className="bag-items-list">
              {finalOrder.items.map((item, idx) => (
                <div key={idx} className="small-item-row">
                  <div className="item-icon">🍕</div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.crust || "Classic"} crust</p>
                    <div className="qty-price">
                      <span>Qty: {item.quantity || 1}</span>
                      <span>
                        $
                        {(
                          Number(item.customPrice) || Number(item.price)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="row">
                <span>Subtotal</span>
                <span>${finalOrder.subtotal}</span>
              </div>
              <div className="row">
                <span>Delivery</span>
                <span className="free-text">FREE</span>
              </div>
              <div className="row">
                <span>Tax</span>
                <span>${finalOrder.tax}</span>
              </div>
              <div className="row total-final">
                <span>Grand Total</span>
                <span>${finalOrder.total}</span>
              </div>
            </div>

            <button
              className="confirm-order-btn"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "FIRING UP THE OVEN..." : "SEND TO KITCHEN"}
            </button>

            <div
              className="trust-badges"
              style={{ marginTop: "15px", fontSize: "0.85rem", color: "#666" }}
            >
              <p>
                💎 You're earning {Math.floor(finalOrder.total)} Pizza Points!
              </p>
              <p>🔥 Hot & Fresh Guarantee included.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OrderReview;
