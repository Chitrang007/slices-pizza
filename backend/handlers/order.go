package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"slices-pizza/backend/models"
	"slices-pizza/backend/services"
)

// CreateOrder handles incoming pizza orders from React and saves to database
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	// Only allow POST requests
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the incoming JSON from React into an Order struct
	var order models.Order
	err := json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		fmt.Printf("❌ Error decoding order: %v\n", err)
		http.Error(w, "Invalid order data", http.StatusBadRequest)
		return
	}

	// Validate the order
	if order.Customer.FirstName == "" {
		http.Error(w, "First name is required", http.StatusBadRequest)
		return
	}

	if order.Customer.Email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	if len(order.Items) == 0 {
		http.Error(w, "Order must contain at least one item", http.StatusBadRequest)
		return
	}

	// Log the order to the terminal
	fmt.Println("🔥 ═══════════════════════════════════════════")
	fmt.Println("🔥 NEW ORDER RECEIVED!")
	fmt.Println("🔥 ═══════════════════════════════════════════")
	fmt.Printf("📋 Order ID: %s\n", order.ID)
	fmt.Printf("👤 Customer: %s %s\n", order.Customer.FirstName, order.Customer.LastName)
	fmt.Printf("📧 Email: %s\n", order.Customer.Email)
	fmt.Printf("📞 Phone: %s\n", order.Customer.Phone)
	fmt.Printf("📍 Address: %s, %s %s\n", order.Customer.Address, order.Customer.City, order.Customer.ZipCode)
	fmt.Println("\n🍕 Items:")
	for i, item := range order.Items {
		fmt.Printf("   %d. %s - $%.2f\n", i+1, item.Name, item.Price)
		if item.Toppings != "" {
			fmt.Printf("      Toppings: %s\n", item.Toppings)
		}
	}
	fmt.Printf("\n💰 Total: %s\n", order.Total)
	fmt.Printf("📅 Order Date: %s\n", order.Date)

	// Save order to database
	dbID, err := services.SaveOrder(order)

	if err != nil {
		fmt.Printf("❌ Error saving order to database: %v\n", err)
		fmt.Println("🔥 ═══════════════════════════════════════════")
		fmt.Println()
		http.Error(w, "Failed to save order", http.StatusInternalServerError)
		return
	}

	// Note: Changed %d to %s because MongoDB IDs and your custom SLPZ IDs are strings
	fmt.Printf("💾 Saved to database with ID: %s\n", dbID)
	fmt.Println("🔥 ═══════════════════════════════════════════")

	// Set response header
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	// Send success response back to React
	response := map[string]interface{}{
		"message": fmt.Sprintf("Success! Your order #%s is being prepared. Thank you %s!", order.ID, order.Customer.FirstName),
		"order":   order,
	}

	json.NewEncoder(w).Encode(response)
}
