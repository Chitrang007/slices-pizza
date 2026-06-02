package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"slices-pizza/backend/services"
)

// GetMenu returns the list of all pizzas available directly from MongoDB
func GetMenu(w http.ResponseWriter, r *http.Request) {
	// Fetch the menu from MongoDB database
	menu, err := services.GetAllPizzas()
	if err != nil {
		fmt.Printf("❌ Error fetching menu: %v\n", err)
		http.Error(w, "Failed to load menu", http.StatusInternalServerError)
		return
	}

	// Set the response header to JSON
	w.Header().Set("Content-Type", "application/json")

	// Encode the database results as JSON and send it back
	json.NewEncoder(w).Encode(menu)
}

// GetToppings returns the list of all available toppings directly from MongoDB
func GetToppings(w http.ResponseWriter, r *http.Request) {
	toppings, err := services.GetAllToppings()
	if err != nil {
		fmt.Printf("❌ Error fetching toppings: %v\n", err)
		http.Error(w, "Failed to load toppings", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(toppings)
}
