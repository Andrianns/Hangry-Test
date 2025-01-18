const RabbitMQ = require('../../infrastucture/message/rabbitmq');
const { User } = require('../../models');

async function sendNotification(to, messageContent) {
  console.log(
    `[NotifService] Preparing notification for ${to}: ${messageContent}`
  );

  console.log(`[NotifService] Notification sent to ${to}: ${messageContent}`);
}

async function startNotifConsumer() {
  await RabbitMQ.consume('notif_queue', async (message) => {
    console.log('[NotifConsumer] Received message:', message);

    try {
      const notificationContent = `Hello ${message.name}, we miss you! Check out what's new on our platform.`;

      await sendNotification(message.name, notificationContent);

      await User.update(
        { notification: notificationContent },
        { where: { id: message.userId } }
      );
      console.log(
        `[NotifConsumer] Notification successfully sent to ${message.name}`
      );
    } catch (err) {
      console.error(
        `[NotifConsumer] Failed to send notification to ${message.name}:`,
        err.message
      );
    }
  });
}

module.exports = { start: startNotifConsumer };
