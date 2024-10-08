const express = require("express");
const Delivery = require("../models/Delivery");

const router = express.Router();

// Get deliveries
router.get("/", async (req, res) => {
  const deliveries = await Delivery.find();
  res.json(deliveries);
});

// Get delivery
router.get("/:id", async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  res.json(delivery);
});

// Add delivery
router.post("/", async (req, res) => {
  const delivery = new Delivery(req.body);
  await delivery.save();
  res.status(201).json(delivery);
});

// delete delivery
router.delete("/:id", async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
