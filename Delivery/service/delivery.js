const mqtt = require("mqtt");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Delivery = require("../models/Delivery");

const sub_topic = "supplier/order";
const pub_topic = "delivery/shipped";

// connect to mongoDB
mongoose.connect("mongodb://localhost:27017/stock_delivery_system");
// connect to mqtt broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", async () => {
  console.log("Delivery service connected to MQTT broker");

  // subscribe to the topic
  client.subscribe(sub_topic, (err) => {
    if (err) console.error(`Failed to subscribe to: ${sub_topic}`);
    else console.log(`Subscribed to: ${sub_topic}`);
  });
});

client.on("message", async (topic, message) => {
  console.log(`Received message on ${topic}: `, message.toString());
  if (topic == sub_topic) {
    try {
      const packedOrder = JSON.parse(message.toString());

      // create a new delivery record - for delivery
      const delivery = new Delivery({
        ID: faker.number.int(),
        order: packedOrder.order,
        orderQuantity: packedOrder.reorderCapacity,
        deliveryDate: new Date(),
        status: "Delivered",
      });
      await delivery.save();

      // publish to delivery/shipped
      client.publish(pub_topic, JSON.stringify(delivery), (err) => {
        if (err) console.error(`Failed to publish to ${pub_topic}:`, err);
        console.log(`Successfully published to ${pub_topic}`);
      });
    } catch (err) {
      console.error("Error parsing message: ", err);
    }
  }
});
