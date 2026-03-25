import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, customerDetails, setCustomerDetails } =
    useContext(CartContext);

  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="page checkout-page">
        <h1>Checkout</h1>
        <div className="empty-checkout">
          <p>Your pizza box is empty! 🍕</p>
          <button onClick={() => navigate("/menu")} className="btn btn-primary">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const validateField = (name, value) => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }

    // 🍕 Alpha-only Validation (No numbers) for Name, City, State, Country
    const alphaFields = ["firstName", "lastName", "city", "state", "country"];
    if (alphaFields.includes(name)) {
      const alphaRegex = /^[A-Za-z\s-]+$/;
      if (!alphaRegex.test(value)) {
        return "Numbers and special characters are not allowed here";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (name === "phone") {
      const phoneDigits = value.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        return "Please enter a valid 10-digit phone number";
      }
    }

    if (name === "zipCode") {
      const zipRegex = /^\d{6}$/;
      if (!zipRegex.test(value)) {
        return "Zip Code must be exactly 6 digits";
      }
    }

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const fieldsToValidate = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, customerDetails[field] || "");
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please check your delivery details.", { theme: "colored" });
      return;
    }

    const generatedId = `SLPZ-${Date.now().toString().slice(-6)}`;

    const orderData = {
      id: generatedId,
      customer: customerDetails,
      items: cart,
      subtotal: getCartTotal(),
      tax: (getCartTotal() * 0.1).toFixed(2),
      total: (parseFloat(getCartTotal()) * 1.1).toFixed(2),
      date: new Date().toISOString(),
    };

    navigate("/payment", { state: { orderData } });
  };

  const grandTotal = (parseFloat(getCartTotal()) * 1.1).toFixed(2);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-form">
          <div className="form-header">
            <h2>Delivery Information</h2>
            <p>Fill in the details for a hot & fresh arrival.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Row 1: Names */}
            <div className="form-row">
              <div
                className={`input-group ${errors.firstName ? "has-error" : ""}`}
              >
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={customerDetails.firstName || ""}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span className="error-msg">{errors.firstName}</span>
                )}
              </div>
              <div
                className={`input-group ${errors.lastName ? "has-error" : ""}`}
              >
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={customerDetails.lastName || ""}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span className="error-msg">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`input-group ${errors.email ? "has-error" : ""}`}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={customerDetails.email || ""}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="error-msg">{errors.email}</span>
                )}
              </div>
              <div className={`input-group ${errors.phone ? "has-error" : ""}`}>
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile"
                  value={customerDetails.phone || ""}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className="error-msg">{errors.phone}</span>
                )}
              </div>
            </div>

            <div className={`input-group ${errors.address ? "has-error" : ""}`}>
              <label>Street Address</label>
              <input
                type="text"
                name="address"
                placeholder="House No, Street, Landmark"
                value={customerDetails.address || ""}
                onChange={handleChange}
              />
              {errors.address && (
                <span className="error-msg">{errors.address}</span>
              )}
            </div>

            <div className="form-row">
              <div className={`input-group ${errors.city ? "has-error" : ""}`}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={customerDetails.city || ""}
                  onChange={handleChange}
                />
                {errors.city && (
                  <span className="error-msg">{errors.city}</span>
                )}
              </div>
              <div className={`input-group ${errors.state ? "has-error" : ""}`}>
                <label>State / Province</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={customerDetails.state || ""}
                  onChange={handleChange}
                />
                {errors.state && (
                  <span className="error-msg">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div
                className={`input-group ${errors.zipCode ? "has-error" : ""}`}
              >
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="6-digit Zip"
                  value={customerDetails.zipCode || ""}
                  onChange={handleChange}
                />
                {errors.zipCode && (
                  <span className="error-msg">{errors.zipCode}</span>
                )}
              </div>
              <div
                className={`input-group ${errors.country ? "has-error" : ""}`}
              >
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={customerDetails.country || ""}
                  onChange={handleChange}
                />
                {errors.country && (
                  <span className="error-msg">{errors.country}</span>
                )}
              </div>
            </div>

            <button type="submit" className="submit-checkout">
              Proceed to Payment
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.cartId} className="summary-item">
                <span>
                  {item.name} x {item.quantity || 1}
                </span>
                <span>
                  $
                  {(
                    Number(item.customPrice) ||
                    Number(item.price) ||
                    0
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getCartTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row grand-total">
              <span>Total:</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
