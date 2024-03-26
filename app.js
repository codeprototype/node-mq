const express = require("express");
const app = express();

app.use(express.json());

const amqp = require("amqplib");
let channel, connection;

connectQueue();
async function connectQueue() {
  try {
    connection = await amqp.connect(
      "amqps://ikhkxphj:7Sx1wcWkOTu0yELygplhoD4sZbXjHHOv@shrimp.rmq.cloudamqp.com/ikhkxphj"
    );
    channel = await connection.createChannel();
    await channel.assertQueue("test-queue");
  } catch (error) {
    console.log(error);
  }
}

const sendData = async (data) => {
  await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
  await channel.close();
  await connection.close();
};
app.get("/healthcheck", (req, res) => {
  console.time("healthcheck");
  res.status(200).json({
    sucess: true,
    data: "NA",
    message: "Healthcheck OK",
  });
  console.timeEnd("healthcheck");
});

app.get("/send-msg", (req, res) => {
  const data = {
    title: "Six of White Walkers",
    author: "Sir Bronn of Blackwater",
  };
  sendData(data);
  console.log("A message is sent to queue");
  res.status(200).json({
    sucess: true,
    data: "NA",
    message: "message sent",
  });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log("Server running at port " + PORT));
