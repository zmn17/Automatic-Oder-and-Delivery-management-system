const mqtt = require("mqtt");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Suppliers = require("../models/Supplier");

const sub_topic = "orders/new";
const pub_topic = "supplier/order";

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/stock_delivery_system");
// connect to mqtt broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", async () => {
  console.log("Supplier service connected to MQTT broker");

  // subscribe to the topic: orders/new
  client.subscribe(sub_topic, (err) => {
    if (err) console.error(`Failed to subscribe to: ${sub_topic}`);
    else console.log(`Subscribed to ${sub_topic}`);
  });
});

client.on("message", async (topic, message) => {
  if (topic == sub_topic) {
    const order = JSON.parse(message.toString());

    // create new Supplier object to hold the order
    const packingOrder = new Suppliers({
      supplierID: faker.number.int(),
      name: faker.company.name(),
      contactInfo: faker.phone.number(),
      order: order,
      reorderCapacity: order.quantity,
    });
    await packingOrder.save();

    // publish to supplier/order for delivery
    client.publish(pub_topic, JSON.stringify(packingOrder));
    console.log("Order is picked and packed", packingOrder);
  }
});
