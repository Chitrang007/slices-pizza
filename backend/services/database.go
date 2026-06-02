package services

import (
	"context"
	"fmt"
	"log"
	"os"
	"slices-pizza/backend/models"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var OrderCollection *mongo.Collection
var MenuCollection *mongo.Collection
var ToppingCollection *mongo.Collection

// InitDatabase initializes MongoDB connection using environment variables
func InitDatabase() error {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  No .env file found, using system environment variables")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		return fmt.Errorf("missing required environment variable: MONGO_URI")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Configure client
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
		return err
	}

	// Test connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
		return err
	}

	MongoClient = client
	// Set up reference to the orders collection in the slices_pizza database
	OrderCollection = client.Database("slices_pizza").Collection("orders")

	// Set up reference to the menu collection in the slices_pizza database
	MenuCollection = client.Database("slices_pizza").Collection("menu")

	// Set up reference to the toppings collection in the slices_pizza database
	ToppingCollection = client.Database("slices_pizza").Collection("toppings")

	fmt.Println("✅ MongoDB connected successfully!")
	return nil
}

// SaveOrder saves an order to the database
// Notice how much simpler this is: we just pass the whole Order struct!
func SaveOrder(order models.Order) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Add created_at timestamp if you want to sort by it later
	// If you added a CreatedAt field to your Order struct, you could set it here:
	// order.CreatedAt = time.Now()

	result, err := OrderCollection.InsertOne(ctx, order)
	if err != nil {
		log.Printf("Error saving order: %v", err)
		return "", err
	}

	fmt.Printf("✅ Order saved to database with MongoDB Object ID: %v\n", result.InsertedID)
	// Returning the string ID (e.g., SLPZ-123) for consistency with your old func
	return order.ID, nil
}

// GetOrder retrieves an order from the database by its custom string ID
func GetOrder(orderNumber string) (models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var order models.Order
	// Search for a document where the _id field matches the orderNumber
	filter := bson.M{"_id": orderNumber}

	err := OrderCollection.FindOne(ctx, filter).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return order, fmt.Errorf("order not found")
		}
		log.Printf("Error retrieving order: %v", err)
		return order, err
	}

	return order, nil
}

// GetAllOrders retrieves all orders
func GetAllOrders() ([]models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var orders []models.Order

	// Find all documents. Passing an empty bson.M{} matches everything.
	cursor, err := OrderCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Error retrieving orders: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode all matched documents directly into our slice of Order structs
	if err = cursor.All(ctx, &orders); err != nil {
		log.Printf("Error decoding orders: %v", err)
		return nil, err
	}

	return orders, nil
}

// CloseDatabase closes the MongoDB connection
func CloseDatabase() error {
	if MongoClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		return MongoClient.Disconnect(ctx)
	}
	return nil
}

// GetAllPizzas retrieves the entire menu from the database
func GetAllPizzas() ([]models.Pizza, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var menu []models.Pizza

	// Find all documents in the menu collection
	cursor, err := MenuCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode all matched documents into our slice of Pizza structs
	if err = cursor.All(ctx, &menu); err != nil {
		return nil, err
	}

	return menu, nil
}

// GetAllToppings retrieves the list of toppings from the database
func GetAllToppings() ([]models.Topping, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var toppings []models.Topping

	cursor, err := ToppingCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &toppings); err != nil {
		return nil, err
	}

	return toppings, nil
}
