const mqtt = require("mqtt");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Products = require("../models/Product");
const Sales = require("../models/Sale");

const pub_topic = "sales/new";

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/stock_delivery_system");
// connect to mqtt broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", async () => {
  console.log("Sales simulation service connected to mqtt broker");

  // simulate sales data every 10 seconds
  setInterval(async () => {
    const products = await Products.find();
    if (products.length > 0) {
      // Randomly pick a product to simulate a sale transaction
      const product = products[Math.floor(Math.random() * products.length)];

      // Product existing quantity
      console.log(
        `${product.name} current stock level: ${product.currentStockLevel}`,
      );

      // Define a random quantity for the sale
      const salesQuantity = Math.floor(Math.random() * (100 - 1) + 1);

      if (product.currentStockLevel >= salesQuantity) {
        // decrement the product's stock level
        product.currentStockLevel -= salesQuantity;
        await product.save();
        // create a new sale record
        const sale = new Sales({
          saleID: faker.number.int(),
          product: {
            product,
          },
          quantity: salesQuantity,
          transactionDate: new Date(),
        });
        await sale.save();

        // publish the sale to the 'sales/new' topic
        client.publish(
          pub_topic,
          JSON.stringify({
            productID: product.productID,
            quantity: salesQuantity,
            transactionDate: sale.transactionDate,
          }),
        );
        console.log(
          `Simulate sale: ${product.name}, Quantity: ${salesQuantity} : Current Stock Level: ${product.currentStockLevel}`,
        );
      } else {
        console.log(
          `Insufficient stock for product: ${product.name}: current stock level: ${product.currentStockLevel} - sales quantity: ${salesQuantity}`,
        );
      }
    }
  }, 10000);
});
