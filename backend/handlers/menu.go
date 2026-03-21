package handlers

import (
	"encoding/json"
	"net/http"
	"slices-pizza/backend/models"
)

// GetMenu returns the list of all pizzas available
func GetMenu(w http.ResponseWriter, r *http.Request) {
	// Our mock database
	menu := []models.Pizza{
		{ID: 1, Name: "Classic Pepperoni", Price: 12.99, Size: "large"},
		{ID: 2, Name: "Margherita", Price: 10.50, Size: "medium"},
		{ID: 3, Name: "The Go-Special", Price: 15.00, Toppings: "Go lang special toppings"},
	}

	// Set the response header to JSON
	w.Header().Set("Content-Type", "application/json")

	// Encode the menu slice as JSON and send it back
	json.NewEncoder(w).Encode(menu)
}