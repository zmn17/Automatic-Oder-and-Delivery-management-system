const express = require("express");
const Supplier = require("../models/Supplier");

const router = express.Router();

// Get all suppliers
router.get("/", async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

// Get the supplier
router.get("/:id", async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  res.json(supplier);
});

// Add supplier
router.post("/", async (req, res) => {
  const supplier = new Supplier(req.body);
  await supplier.save();
  res.status(201).json(supplier);
});

// Delete a supplier
router.delete("/:id", async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
