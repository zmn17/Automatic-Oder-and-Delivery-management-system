const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    supplierID: {
      type: String,
      required: true,
    },
    reorderThreshold: {
      type: Number,
      default: 10,
    },
    currentStockLevel: {
      type: Number,
      default: 100,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { collection: "Products" },
);

module.exports = mongoose.model("Products", productSchema);
