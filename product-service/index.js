const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://product-db:27017/product-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Product Model
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number
}));

// Routes
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send(product);
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.send(product);
});

app.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(product);
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ message: 'Product deleted' });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});