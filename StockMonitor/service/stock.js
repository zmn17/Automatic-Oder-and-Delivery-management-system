const mqtt = require("mqtt");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const topic = "stock/levels";

// connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/stock_delivery_system", {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
// mongoose.connect("mongodb://localhost:27017/stock_delivery_system");

// Connect to mqtt broker
// const client = mqtt.connect("mqtt://mqtt:1883");
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Stock monitoring service connected to MQTT Broker");

  // Simulate the stock level check every 5 seconds
  setInterval(async () => {
    try {
      const products = await Product.find(); // fetch all products
      products.forEach((pd) => {
        // publish each product's stock level to the MQTT topic
        const productStock = {
          id: pd._id,
          name: pd.name,
          stockLevel: pd.currentStockLevel,
        };

        client.publish(topic, JSON.stringify(productStock), (err) => {
          if (err) {
            console.error(
              `Error publishing stock level for product ${pd.name}:`,
              err,
            );
          } else {
            console.log(
              `Published stock level for product ${pd.name} : ${pd.currentStockLevel}`,
            );
          }
        });
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, 5000); // check stock levels every 5 seconds
});

// Handle MQTT errors
client.on("error", (err) => {
  console.error("MQTT Connection Error:", err);
});

client.on("close", () => {
  console.log("MQTT connection closed");
});
