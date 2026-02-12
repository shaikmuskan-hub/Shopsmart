const express = require("express");
const router = express.Router();
const Product = require("../models/productModel"); // Make sure this path is correct

// ✅ GET /api/categories → returns all categories like ["Fruits", "Snacks"]
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ GET /api/products → returns all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
