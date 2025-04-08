const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://customer-db:27017/customer-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Customer Model
const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String
}));

// Routes
app.post('/customers', async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.send(customer);
});

app.get('/customers', async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

app.get('/customers/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  res.send(customer);
});

app.put('/customers/:id', async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(customer);
});

app.delete('/customers/:id', async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.send({ message: 'Customer deleted' });
});

// Start server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
});