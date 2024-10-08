const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    saleID: {
      type: Number,
      required: true,
      unique: true,
    },
    product: {
      type: Object,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  { collection: "Sales" },
);

module.exports = mongoose.model("Sale", salesSchema);
