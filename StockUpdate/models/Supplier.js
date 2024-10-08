const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    reorderCapacity: {
      type: Number,
      default: 1000,
    },
    order: {
      type: Object,
      require: true,
    },
  },
  { collection: "Suppliers" },
);

module.exports = mongoose.model("Supplier", supplierSchema);
