const RabbitMQ = require('../infrastucture/message/rabbitmq');
const { Rule } = require('../models');

class RuleController {
  static async createRule(req, res, next) {
    try {
      const { name, condition, actions, isActive = true } = req.body;
      if (
        typeof name !== 'string' ||
        !name.trim() || // Ensure the name is not empty
        typeof condition !== 'object' || // Ensure condition is an object
        !Array.isArray(actions) ||
        actions.length === 0 || // Ensure actions is a non-empty array
        !condition ||
        !Array.isArray(actions)
      ) {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      const newRule = await Rule.create({
        name,
        condition,
        actions,
        isActive,
      });

      res.status(200).json({ message: 'Success create rule', data: newRule });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllRules(req, res, next) {
    try {
      const rules = await Rule.findAll();
      res.status(200).json(rules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendEmail(req, res) {
    const { id, email, name } = req.body;

    try {
      await RabbitMQ.publish('email_queue', {
        id,
        email,
        name,
        type: 'email',
      });
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async sendNotification(req, res) {
    const { userId, name } = req.body;

    try {
      await RabbitMQ.publish('notif_queue', { userId, name, type: 'notif' });
      res.status(200).json({ message: 'Notification sent successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RuleController;
