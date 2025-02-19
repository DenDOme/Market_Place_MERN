import amqp from "amqplib";

let channel;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange("product_event", "fanout", { durable: false });
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Not connected to RabbitMQ", error);
  }
};

export const publishEvent = async (eventType, data) => {
  if (!channel) {
    console.error("RabbitMQ channel not init");
    return;
  }

  channel.publish(
    "product_event",
    "",
    Buffer.from(JSON.stringify({ eventType, data })),
    { persistent: true }
  );
};
