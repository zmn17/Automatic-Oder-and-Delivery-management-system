const express = require("express");
const Sale = require("../models/Sale");

const router = express.Router();

// Get sales
router.get("/", async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

// Get the order
router.get("/:id", async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  res.json(sale);
});

// Add order
router.post("/", async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.status(201).json(sale);
});

// Delete sale record
router.delete("/", async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
