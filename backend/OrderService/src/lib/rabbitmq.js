import amqp from 'amqplib';
import { removeCache, updateCache } from '../middleware/productData.js';

const RABBITQM_URL = process.env.RABBITQM_URL;
let channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITQM_URL);
        channel = await connection.createChannel();
        await channel.assertExchange("product_event", "fanout", { durable: false });

        const q = await channel.assertQueue("", { exclusive: true });
        console.log("Order Service listenning for Product Service");

        channel.bindQueue(q.queue, "product_event", "");
        channel.consume(q.queue, async(msg) => {
            if(msg.content){
                const { eventType, data } = JSON.parse(msg.content.toString());

                console.log(`Recieved event ${eventType}`, data);

                if(eventType === 'product.created' || eventType === 'product.updated'){
                    await updateCache(data)
                } else if(eventType === 'product.deleted'){
                    await removeCache(data._id);
                }
            }
        }, { noAck: true });
    } catch (error) {
        console.error("RabbitMQ consumer error", error);
    }
}