const mqtt = require("mqtt");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Order = require("../models/Order");

const sub_topic = "stock/levels";
const pub_topic = "orders/new";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/stock_delivery_system");

// Connect to mqtt broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Reordering Service connected to MQTT broker");

  // Subscribe to 'stock/levels'
  client.subscribe(sub_topic, (err) => {
    if (err) console.error("Failed to subscribe to", sub_topic);
    else console.log("Subscribed to", sub_topic);
  });
});

client.on("message", async (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`);
  if (topic == sub_topic) {
    const product = JSON.parse(message.toString());
    console.log("Parsed product data:", product);

    // const threshold = 10;
    if (product.currentStockLevel <= product.reorderThreshold) {
      console.log(
        `Stock for product ${product.productID} is below the threshold value`,
      );

      // create a new order (simulated)
      const newOrder = new Order({
        orderID: faker.number.int(),
        product: product,
        supplierID: faker.number.int(),
        quantity: 50,
        orderDate: new Date(),
        expectedDeliveryDate: new Date(),
        status: "Pending",
      });
      await newOrder.save();

      // publish the reorder to the `orders/new' topic
      client.publish(pub_topic, JSON.stringify(newOrder), (err) => {
        if (err) console.log(`Failed to publish to ${pub_topic}:`, err);
        console.log(
          `Successfully published reorder to ${pub_topic}: ${newOrder}`,
        );
      });
    }
  }
});
