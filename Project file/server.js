const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // added

const app = express();
// ✅ Serve images from 'public' folder
app.use('/raw_images', express.static(path.join(__dirname, 'public/raw_images')));

app.use(cors());
app.use(express.json());



// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://mehtaj1014:shaikmehtaj@shopsmartculster.j1mozds.mongodb.net/shopsmart?retryWrites=true&w=majority&appName=ShopSmartCulster'
).then(() => console.log("✅ MongoDB Connected"))
 .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Models
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  unit: String
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  userEmail: String,
  customerName: String,
  items: Array,
  total: Number,
  address: String,
  paymentMethod: String,
  status: String,
  date: String,
}));

// ✅ Auth APIs
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || user.password !== password.trim()) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Product APIs
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category: { $regex: new RegExp(category, 'i') } } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ✅ Order APIs
app.post('/api/order', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.get('/api/orders/:email', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email });
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

app.get('/api/all-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// ✅ Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ Reviews (optional)
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
