const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const products = [
  { id: 1, name: 'Pro Runner Sneakers', category: 'Footwear', price: 89.99, stock: 24, image: '👟' },
  { id: 2, name: 'Performance Training Tee', category: 'Apparel', price: 24.99, stock: 50, image: '👕' },
  { id: 3, name: 'Flex Compression Shorts', category: 'Apparel', price: 34.99, stock: 40, image: '🩳' },
  { id: 4, name: 'Court Grip Basketball Shoes', category: 'Footwear', price: 109.99, stock: 15, image: '👟' },
  { id: 5, name: 'Team Jersey', category: 'Apparel', price: 44.99, stock: 30, image: '👕' },
  { id: 6, name: 'Trail Running Jacket', category: 'Outerwear', price: 74.99, stock: 18, image: '🧥' }
];

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const result = category ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) : products;
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: process.env.APP_VERSION || '1.0.0' });
});

app.listen(PORT, () => console.log(`Sportswear store running on port ${PORT}`));

module.exports = app;