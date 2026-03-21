package models

// Pizza represents a pizza item in our menu
type Pizza struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Toppings string  `json:"toppings,omitempty"`	// Optional, to handle the empty case
	Size     string  `json:"size,omitempty"`		// Optional, to handle the empty case
}