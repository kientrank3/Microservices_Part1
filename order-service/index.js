const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://order-db:27017/order-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Order Model
const Order = mongoose.model('Order', new mongoose.Schema({
  customerId: String,
  products: [{
    productId: String,
    quantity: Number
  }],
  status: String,
  total: Number
}));

// Routes
app.post('/orders', async (req, res) => {
  // Validate products
  let total = 0;
  for (const item of req.body.products) {
    const product = await axios.get(`http://localhost:3001/products/${item.productId}`);
    total += product.data.price * item.quantity;
  }

  const order = new Order({
    ...req.body,
    total,
    status: 'created'
  });

  await order.save();
  res.send(order);
});

app.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

app.get('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.send(order);
});

app.put('/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(order);
});

app.delete('/orders/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.send({ message: 'Order deleted' });
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});