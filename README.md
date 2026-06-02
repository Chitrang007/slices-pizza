# 🍕 Slices Pizza App

A full-stack web application for a pizza shop, allowing customers to browse a dynamic menu, customize their pizzas with toppings, and place orders. 

This project demonstrates a clean, separated-concerns architecture using a React frontend, a Go (Golang) backend, and a native MongoDB database integration.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Create React App)
* Plain CSS for styling
* Asynchronous Data Fetching (`fetch` API)

**Backend:**
* Go (Golang)
* Standard Library Router (`net/http`)
* Custom Middleware (CORS)

**Database:**
* MongoDB Atlas (Cloud Database)
* Official Go MongoDB Driver (`go.mongodb.org/mongo-driver`)

**Deployment:**
* Backend: Hosted on Render
* Database: Hosted on MongoDB Atlas

---

## ✨ Features

* **Dynamic Menu:** Pizzas and available toppings are fetched directly from MongoDB, allowing for easy updates without altering code.
* **Customization Engine:** Customers can add between 2 and 10 toppings to their pizza, with dynamic real-time price calculation.
* **Order Processing:** Fully integrated checkout flow that saves comprehensive order details, including nested topping arrays, directly into the database as native BSON documents.
* **Environment Configuration:** Secure credential management and dynamic API routing using `.env` variables for both local development and production environments.

---

## 📂 Project Structure

```text
SLICES-PIZZA/
│
├── frontend/                 # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/       # UI Components (CustomizePizza, etc.)
│   │   ├── styles/           # CSS Files
│   │   ├── App.js            # Main React Entry point
│   │   └── ...
│   └── .env                  # Frontend Environment Variables
│
└── backend/                  # Go Application
    ├── handlers/             # HTTP Handlers (menu.go, order.go)
    ├── middleware/           # CORS and standard middleware
    ├── models/               # Go Structs with JSON/BSON tags (pizza.go)
    ├── routes/               # API Router setup
    ├── services/             # Database connection & queries (database.go)
    ├── main.go               # Go Server Entry Point
    └── .env                  # Backend Environment Variables