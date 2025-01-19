if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); //development
}
// console.log(process.env.SECRET_KEY);
const cors = require('cors');
const express = require('express');
// const errorHandler = require('../middleware/errorHandle');
const router = require('./src/routes');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const errorHandler = require('./src/middleware/errorHandler');

const RuleScheduler = require('./src/scheduler/RuleScheduler');
const EmailConsumer = require('./src/infrastucture/consumer/emailConsumer');
const NotifConsumer = require('./src/infrastucture/consumer/notifConsumer');
const RabbitMQ = require('./src/infrastucture/message/rabbitmq');

app.use('/', router);
(async function initializeApp() {
  try {
    // Connect to RabbitMQ
    await RabbitMQ.connect();
    console.log('[App] RabbitMQ connected');

    // Start Consumers
    EmailConsumer.start();
    NotifConsumer.start();

    // Start Scheduler
    RuleScheduler.start();
    app.use(errorHandler);
    // Start Express Server
    app.listen(port, () => {
      console.log(`[App] Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('[App] Initialization failed:', err.message);
    process.exit(1); // Exit with error
  }
})();

module.exports = app;
