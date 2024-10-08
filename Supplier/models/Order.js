const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: Number,
      required: true,
      unique: true,
    },
    product: {
      type: Object,
      required: true,
    },
    supplierID: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    expectedDeliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { collection: "Orders" },
);

module.exports = mongoose.model("Order", orderSchema);
