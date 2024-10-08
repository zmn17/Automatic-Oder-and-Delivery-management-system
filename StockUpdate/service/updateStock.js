const mqtt = require("mqtt");
const mongoose = require("mongoose");
const Products = require("../models/Product");
const Orders = require("../models/Order");

const sub_topic = "delivery/shipped";

// connect to mongoDB
mongoose.connect("mongodb://localhost:27017/stock_delivery_system");
// connect to mqtt broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", async () => {
  console.log("Stock Update service connected to MQTT broker");

  // sub to the topic
  client.subscribe(sub_topic, (err) => {
    if (err) console.error("Failed to subscribe to ", sub_topic);
    else console.log("Subscribed to ", sub_topic);
  });
});

client.on("message", async (topic, message) => {
  if (topic == sub_topic) {
    const shippedOrder = JSON.parse(message.toString());

    // update the quantity/stock level of the product
    const order = shippedOrder.order;
    const the_order = await Orders.findOne({ orderID: order.orderID }).exec();
    the_order.status = "Completed";

    const product = order.product;
    const the_product = await Products.findOne({
      productID: product.productID,
    }).exec();
    the_product.currentStockLevel += shippedOrder.orderQuantity;
    await the_product.save();
    await the_order.save();

    console.log(
      `Product stock on hand updated: ${the_product.name}: ${the_product.currentStockLevel}`,
    );
  }
});
