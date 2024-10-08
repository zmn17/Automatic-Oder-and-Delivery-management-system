const mqtt = require("mqtt");
const sub_topic = "stock/levels";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Checking stock level");

  client.subscribe(sub_topic, (err) => {
    if (err) console.error("failed to sub");
    else console.log("Subscribed to", sub_topic);
  });
});

client.on("message", (topic, message) => {
  if (topic == sub_topic) {
    const p = JSON.parse(message.toString());
    console.log(p);
  }
});
