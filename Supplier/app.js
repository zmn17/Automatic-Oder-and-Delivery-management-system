const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Connecto mongoDb
mongoose.connect("mongodb://localhost:27017/stock_delivery_system");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// middleware
app.use(bodyParser.json());

// Routes
const productRoute = require("./routes/product");
const deliveryRoute = require("./routes/delivery");
const orderRoute = require("./routes/order");
const saleRoute = require("./routes/sale");
const supplierRoute = require("./routes/supplier");

app.use("/products", productRoute);
app.use("/deliveries", deliveryRoute);
app.use("/orders", orderRoute);
app.use("/sales", saleRoute);
app.use("/suppliers", supplierRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
