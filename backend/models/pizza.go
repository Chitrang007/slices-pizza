package models

// Pizza represents a pizza item in our menu
type Pizza struct {
	ID          int     `json:"id" bson:"id"`
	Name        string  `json:"name" bson:"name"`
	Description string  `json:"description,omitempty" bson:"description,omitempty"`
	Price       float64 `json:"price" bson:"price"`
	Toppings    string  `json:"toppings,omitempty" bson:"toppings,omitempty"`
	Size        string  `json:"size,omitempty" bson:"size,omitempty"`
	Image       string  `json:"image,omitempty" bson:"image,omitempty"`
	CartId      int64   `json:"cartId,omitempty" bson:"cart_id,omitempty"`
}

// Customer represents order customer information
type Customer struct {
	FirstName string `json:"firstName" bson:"first_name"`
	LastName  string `json:"lastName" bson:"last_name"`
	Email     string `json:"email" bson:"email"`
	Phone     string `json:"phone" bson:"phone"`
	Address   string `json:"address" bson:"address"`
	City      string `json:"city" bson:"city"`
	State     string `json:"state" bson:"state"`
	ZipCode   string `json:"zipCode" bson:"zip_code"`
	Country   string `json:"country" bson:"country"`
}

// Order represents a complete pizza order
type Order struct {
	ID       string   `json:"id" bson:"_id"` // MongoDB convention uses _id as the primary key
	Items    []Pizza  `json:"items" bson:"items"`
	Total    string   `json:"total" bson:"total"`
	Customer Customer `json:"customer" bson:"customer"`
	Date     string   `json:"date" bson:"date"`
}

// Topping represents an available pizza topping
type Topping struct {
	ID    int     `json:"id" bson:"id"`
	Name  string  `json:"name" bson:"name"`
	Price float64 `json:"price" bson:"price"`
}
