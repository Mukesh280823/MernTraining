const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// Sample data (initially empty)
let items = [
    { id: 1, name: "Alice", age: 25, email: 'alice@gmial.com', address: 'farukh Nagar', country: "india" },
    { id: 2, name: "Bobby", age: 30, email: 'Bobby@gmial.com', address: 'farukh Nagar', country: "india" },
    { id: 3, name: "Chirag", age: 22, email: 'chirag@gmial.com', address: 'Yog   Nagar', country: "india" },
    { id: 4, name: "Dev", age: 28, email: 'dev@gmial.com', address: 'sonam Nagar', country: "india" },
    { id: 5, name: "Alice", age: 25, email: 'alice@gmial.com', address: 'farukh Nagar', country: "india" },
    { id: 6, name: "Bobby", age: 30, email: 'Bobby@gmial.com', address: 'preet Vihar', country: "india" },
    { id: 7, name: "Chirag", age: 22, email: 'chirag@gmial.com', address: 'Mayur Vihar', country: "india" },
    { id: 8, name: "Dev", age: 28, email: 'dev@gmial.com', address: '', country: "india" }
];

// GET route to fetch all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// POST route to add a new item
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem); // Respond with the newly created item
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
