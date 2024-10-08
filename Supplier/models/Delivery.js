const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      required: true,
      unique: true,
    },
    order: {
      type: Object,
      required: true,
    },
    orderQuantity: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Delivered", "In Transit", "Cancelled"],
      default: "Delivered",
    },
  },
  { collection: "Deliveries" },
);

module.exports = mongoose.model("Delivery", deliverySchema);
