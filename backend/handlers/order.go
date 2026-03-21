package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"slices-pizza/backend/models"
)

// CreateOrder handles incoming pizza orders from React
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	// Only allow POST requests
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the incoming JSON from React into a Pizza struct
	var orderedPizza models.Pizza
	err := json.NewDecoder(r.Body).Decode(&orderedPizza)
	if err != nil {
		http.Error(w, "Invalid order data", http.StatusBadRequest)
		return
	}

	// Validate the order
	if orderedPizza.Name == "" {
		http.Error(w, "Pizza name is required", http.StatusBadRequest)
		return
	}

	if orderedPizza.Price <= 0 {
		http.Error(w, "Price must be greater than 0", http.StatusBadRequest)
		return
	}

	// Log the order
	fmt.Printf("🔥 NEW ORDER RECEIVED: %s ($%.2f)\n", orderedPizza.Name, orderedPizza.Price)

	// Set response header
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	// Send success response back to React
	response := map[string]interface{}{
		"message": fmt.Sprintf("Success! Your %s is being prepared.", orderedPizza.Name),
		"order":   orderedPizza,
	}

	json.NewEncoder(w).Encode(response)
}