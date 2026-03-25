import React, { useContext, useState, useEffect } from "react";
import { pizzas as mockPizzas } from "../data/mockData";
import { CartContext } from "../context/CartContext";
import CustomizePizza from "../components/CustomizePizza";
import { fetchMenu } from "../services/api";
import { toast } from "react-toastify";
import "./Menu.css";

function Menu() {
  const { addToCart } = useContext(CartContext);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const menuData = await fetchMenu();

        if (menuData && menuData.length > 0) {
          setPizzas(menuData);
        } else {
          console.log("No data from backend, using mock data");
          setPizzas(mockPizzas);
        }
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setPizzas(mockPizzas);
        setError("Could not connect to backend. Using mock data.");

        toast.error("🍕 Connection lost! Showing our classic menu instead.", {
          theme: "colored",
          toastId: "fetch-error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleCustomize = (pizza) => {
    setSelectedPizza(pizza);
  };

  const handleAddToCart = (customizedPizza) => {
    addToCart(customizedPizza);

    toast.success(`🍕 ${customizedPizza.name || "Pizza"} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      theme: "colored",
    });

    setSelectedPizza(null);
  };

  if (loading) {
    return (
      <div className="page menu-page">
        <h1>Our Menu</h1>
        <div className="loading-spinner">
          <p>Baking the menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page menu-page">
      <h1>Our Menu</h1>

      {error && (
        <div
          className="offline-notice"
          style={{ textAlign: "center", color: "#888", marginBottom: "20px" }}
        >
          <small>Note: You are viewing the offline menu.</small>
        </div>
      )}

      <div className="pizza-grid">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="pizza-card">
            <div className="pizza-image">{pizza.image || "🍕"}</div>
            <h3>{pizza.name}</h3>
            <p>{pizza.description}</p>
            <div className="pizza-footer">
              <span className="pizza-price">${pizza.price.toFixed(2)}</span>
              <button
                onClick={() => handleCustomize(pizza)}
                className="btn btn-secondary"
              >
                Customize
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPizza && (
        <CustomizePizza
          pizza={selectedPizza}
          onConfirm={handleAddToCart}
          onCancel={() => setSelectedPizza(null)}
        />
      )}
    </div>
  );
}

export default Menu;
