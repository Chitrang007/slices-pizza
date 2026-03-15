package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Pizza represents our data structure
type Pizza struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

func main() {
	// 1. Our mock database
	menu := []Pizza{
		{ID: 1, Name: "Classic Pepperoni", Price: 12.99},
		{ID: 2, Name: "Margherita", Price: 10.50},
		{ID: 3, Name: "The Go-Special", Price: 15.00},
	}

	// 2. Register the Menu Route
	http.HandleFunc("/api/menu", func(w http.ResponseWriter, r *http.Request) {
		// CORS Headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(menu)
	})

	// 3. Register the Order Route (MUST be above ListenAndServe)
	http.HandleFunc("/api/order", handleOrder)

	fmt.Println("🍕 Slices Pizza API is live!")
	fmt.Println("👉 Menu: http://localhost:8080/api/menu")
	fmt.Println("👉 Listening for orders on :8080...")

	// 4. Start the server (This is a blocking call)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Printf("Oven failure: %s\n", err)
	}
}

// handleOrder processes incoming POST requests from React
func handleOrder(w http.ResponseWriter, r *http.Request) {
	// Setup CORS so React can talk to Go
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// 1. Handle Pre-flight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 2. Handle the Actual POST
	if r.Method == "POST" {
		var orderedPizza Pizza

		// Decode the JSON into our struct using a Pointer (&)
		err := json.NewDecoder(r.Body).Decode(&orderedPizza)
		if err != nil {
			http.Error(w, "Invalid Order Data", http.StatusBadRequest)
			return
		}

		// 3. Log the "Success" to your terminal
		fmt.Printf("🔥 NEW ORDER RECEIVED: %s ($%.2f)\n", orderedPizza.Name, orderedPizza.Price)

		// 4. Send response back to React
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{
			"message": fmt.Sprintf("Success! Your %s is being prepared.", orderedPizza.Name),
		})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
