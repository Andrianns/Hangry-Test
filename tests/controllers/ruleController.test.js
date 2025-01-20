const RuleController = require('../../src/controllers/RuleController');
const { Rule } = require('../../src/models');
const RabbitMQ = require('../../src/infrastucture/message/rabbitmq');
jest.mock('../../src/models');

jest.mock('../../src/infrastucture/message/rabbitmq');

describe('RuleController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createRule', () => {
    test('should create a new rule and return success message', async () => {
      req.body = {
        name: 'Test Rule',
        condition: { key: 'value' },
        actions: ['action1', 'action2'],
      };

      Rule.create.mockResolvedValue(req.body);

      await RuleController.createRule(req, res);

      expect(Rule.create).toHaveBeenCalledWith({
        name: 'Test Rule',
        condition: { key: 'value' },
        actions: ['action1', 'action2'],
        isActive: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Success create rule',
        data: req.body,
      });
    });

    test('should return 400 if data format is invalid', async () => {
      req.body = { name: '', condition: 'invalid', actions: 'invalid' };

      await RuleController.createRule(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data format' });
    });

    test('should return 500 on database error', async () => {
      req.body = {
        name: 'Test Rule',
        condition: { key: 'value' },
        actions: ['action1'],
      };

      Rule.create.mockRejectedValue(new Error('Database error'));

      await RuleController.createRule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getAllRules', () => {
    test('should return all rules', async () => {
      const mockRules = [
        { id: 1, name: 'Rule 1' },
        { id: 2, name: 'Rule 2' },
      ];
      Rule.findAll.mockResolvedValue(mockRules);

      await RuleController.getAllRules(req, res);

      expect(Rule.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRules);
    });

    test('should return 500 on error', async () => {
      Rule.findAll.mockRejectedValue(new Error('Database error'));

      await RuleController.getAllRules(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('sendEmail', () => {
    test('should send an email and return success message', async () => {
      req.body = {
        id: 1,
        email: 'test@example.com',
        name: 'Test Name',
        type: 'welcome',
      };

      await RuleController.sendEmail(req, res);

      expect(RabbitMQ.publish).toHaveBeenCalledWith('email_queue', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email sent successfully',
      });
    });

    test('should return 500 if RabbitMQ fails', async () => {
      req.body = {
        id: 1,
        email: 'test@example.com',
        name: 'Test Name',
        type: 'welcome',
      };
      RabbitMQ.publish.mockRejectedValue(new Error('RabbitMQ error'));

      await RuleController.sendEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'RabbitMQ error' });
    });
  });

  describe('sendNotification', () => {
    test('should send a notification and return success message', async () => {
      const req = {
        body: {
          userId: 1,
          name: 'Test User',
          type: 'info',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      RabbitMQ.publish.mockResolvedValue(); // Simulasi publish berhasil

      await RuleController.sendNotification(req, res);

      expect(RabbitMQ.publish).toHaveBeenCalledWith('notif_queue', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Notification sent successfully',
      });
    });

    test('should return 500 if RabbitMQ fails', async () => {
      req.body = {
        userId: 1,
        name: 'Test Notification',
        type: 'alert',
      };
      RabbitMQ.publish.mockRejectedValue(new Error('RabbitMQ error'));

      await RuleController.sendNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'RabbitMQ error' });
    });
  });
});
