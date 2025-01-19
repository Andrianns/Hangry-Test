const amqp = require('amqplib');

let channel;

async function connect() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('[RabbitMQ] Connected to RabbitMQ');
  } catch (err) {
    console.error('[RabbitMQ] Error connecting:', err.message);
  }
}

async function publish(queue, message) {
  if (!channel) {
    console.error('[RabbitMQ] Channel is not initialized');
    return;
  }
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(`[RabbitMQ] Message published to queue "${queue}"`);
}

async function consume(queue, callback) {
  if (!channel) {
    console.error('[RabbitMQ] Channel is not initialized');
    return;
  }
  await channel.assertQueue(queue);
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await callback(content);
      channel.ack(msg);
    }
  });
  console.log(`[RabbitMQ] Consuming messages from queue "${queue}"`);
}

module.exports = { connect, publish, consume };
