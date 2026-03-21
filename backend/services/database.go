package services

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitDatabase initializes PostgreSQL connection using environment variables
func InitDatabase() error {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  No .env file found, using system environment variables")
	}

	// Get database credentials from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	// Validate required variables
	if dbUser == "" || dbPassword == "" || dbName == "" {
		return fmt.Errorf("missing required environment variables: DB_USER, DB_PASSWORD, DB_NAME")
	}

	// Build connection string
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		dbUser, dbPassword, dbName, dbHost, dbPort)

	var openErr error
	DB, openErr = sql.Open("postgres", connStr)
	if openErr != nil {
		log.Fatalf("Failed to connect to database: %v", openErr)
		return openErr
	}

	// Test connection
	pingErr := DB.Ping()
	if pingErr != nil {
		log.Fatalf("Failed to ping database: %v", pingErr)
		return pingErr
	}

	fmt.Println("✅ Database connected successfully!")
	return nil
}

// SaveOrder saves an order to the database
func SaveOrder(orderNumber string, firstName string, lastName string, email string,
	phone string, address string, city string, zipCode string, items string, total string, orderDate string) (int, error) {

	query := `
		INSERT INTO orders (order_number, customer_first_name, customer_last_name,
			customer_email, customer_phone, customer_address, customer_city,
			customer_zip_code, items, total, order_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id
	`

	var id int
	err := DB.QueryRow(query, orderNumber, firstName, lastName, email, phone,
		address, city, zipCode, items, total, orderDate).Scan(&id)

	if err != nil {
		log.Printf("Error saving order: %v", err)
		return 0, err
	}

	fmt.Printf("✅ Order saved to database with ID: %d\n", id)
	return id, nil
}

// GetOrder retrieves an order from the database
func GetOrder(orderNumber string) (map[string]interface{}, error) {
	query := `
		SELECT order_number, customer_first_name, customer_last_name, customer_email,
			customer_phone, customer_address, customer_city, customer_zip_code,
			items, total, order_date, created_at
		FROM orders
		WHERE order_number = $1
	`

	var orderNum, firstName, lastName, email, phone, address, city, zipCode, items, total, orderDate string
	var createdAt string

	err := DB.QueryRow(query, orderNumber).Scan(&orderNum, &firstName, &lastName, &email,
		&phone, &address, &city, &zipCode, &items, &total, &orderDate, &createdAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("order not found")
		}
		log.Printf("Error retrieving order: %v", err)
		return nil, err
	}

	orderData := map[string]interface{}{
		"order_number": orderNum,
		"customer": map[string]string{
			"first_name": firstName,
			"last_name":  lastName,
			"email":      email,
			"phone":      phone,
			"address":    address,
			"city":       city,
			"zip_code":   zipCode,
		},
		"items":      items,
		"total":      total,
		"order_date": orderDate,
		"created_at": createdAt,
	}

	return orderData, nil
}

// GetAllOrders retrieves all orders (for admin)
func GetAllOrders() ([]map[string]interface{}, error) {
	query := `
		SELECT order_number, customer_first_name, customer_last_name, customer_email,
			total, order_date, created_at
		FROM orders
		ORDER BY created_at DESC
	`

	rows, err := DB.Query(query)
	if err != nil {
		log.Printf("Error retrieving orders: %v", err)
		return nil, err
	}
	defer rows.Close()

	var orders []map[string]interface{}

	for rows.Next() {
		var orderNum, firstName, lastName, email, total, orderDate, createdAt string

		err := rows.Scan(&orderNum, &firstName, &lastName, &email, &total, &orderDate, &createdAt)
		if err != nil {
			log.Printf("Error scanning order: %v", err)
			continue
		}

		order := map[string]interface{}{
			"order_number": orderNum,
			"customer_name": firstName + " " + lastName,
			"email":        email,
			"total":        total,
			"order_date":   orderDate,
			"created_at":   createdAt,
		}

		orders = append(orders, order)
	}

	return orders, nil
}

// CloseDatabase closes the database connection
func CloseDatabase() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}