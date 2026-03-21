package routes

import (
	"encoding/json"
	"net/http"
	"slices-pizza/backend/handlers"
)

// SetupRoutes registers all API routes and middleware
func SetupRoutes() *http.ServeMux {
	// Create a new router
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/api/menu", handlers.GetMenu)
	mux.HandleFunc("/api/order", handlers.CreateOrder)
	mux.HandleFunc("/api/health", HealthCheck)

	return mux
}

// HealthCheck is a simple endpoint to check if the server is running
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "🍕 Server is alive!"})
}