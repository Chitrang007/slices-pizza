package models

// Pizza represents a pizza item in our menu
type Pizza struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Toppings string  `json:"toppings,omitempty"`
	Size     string  `json:"size,omitempty"`
	CartId   int64   `json:"cartId,omitempty"`
}

// Customer represents order customer information
type Customer struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	City      string `json:"city"`
	ZipCode   string `json:"zipCode"`
}

// Order represents a complete pizza order
type Order struct {
	ID       string     `json:"id"`
	Items    []Pizza    `json:"items"`
	Total    string     `json:"total"`
	Customer Customer   `json:"customer"`
	Date     string     `json:"date"`
}