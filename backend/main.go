package main

import (
	"fmt"
	"net/http"
	"slices-pizza/backend/middleware"
	"slices-pizza/backend/routes"
)

func main() {
	// Setup all routes
	mux := routes.SetupRoutes()

	// Apply CORS middleware to all requests
	handler := middleware.CORSMiddleware(mux)

	// Configuration
	port := ":8080"

	// Welcome message
	fmt.Println("🍕 ═══════════════════════════════════════")
	fmt.Println("🍕 Slices Pizza API is LIVE! 🍕")
	fmt.Println("🍕 ═══════════════════════════════════════")
	fmt.Println()
	fmt.Println("📍 Available Endpoints:")
	fmt.Println("   🔗 GET  http://localhost:8080/api/menu")
	fmt.Println("   🔗 POST http://localhost:8080/api/order")
	fmt.Println("   🔗 GET  http://localhost:8080/api/health")
	fmt.Println()
	fmt.Printf("🚀 Server listening on %s...\n", port)
	fmt.Println()

	// Start the server
	err := http.ListenAndServe(port, handler)
	if err != nil {
		fmt.Printf("❌ Oven failure: %s\n", err)
	}
}