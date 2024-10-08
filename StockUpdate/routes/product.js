const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// Add product
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Remove product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
