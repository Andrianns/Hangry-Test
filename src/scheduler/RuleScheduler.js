require('dotenv').config(); // Load environment variables
const nodeSchedule = require('node-schedule');
const moment = require('moment');
const { User } = require('../models');
const RabbitMQ = require('../infrastucture/message/rabbitmq');
const { timeToCron } = require('../utils/time');
const { Op, Sequelize } = require('sequelize');
const scheduleTime = process.env.SCHEDULE_TIME;
const { fetchRules, checkCondition } = require('../utils/condition'); // Import the functions

class RuleScheduler {
  static async processDormantUsers(rule) {
    console.log('[Scheduler] Checking dormant users...');

    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      const dormantUsers = await User.findAll({
        where: {
          lastActive: { [Op.lt]: ninetyDaysAgo },
        },
        attributes: ['id', 'email', 'name', 'birthDate', 'lastActive'],
      });

      if (dormantUsers.length > 0) {
        console.log(`[Scheduler] Found ${dormantUsers.length} dormant users.`);
      } else {
        console.log('[Scheduler] No dormant users found.');
        return;
      }

      for (const user of dormantUsers) {
        if (checkCondition(rule.condition, user)) {
          const message = {
            userId: user.id,
            email: user.email,
            name: user.name,
          };

          // Check if action is to send email and notification
          if (rule.actions.includes('send_email')) {
            await RabbitMQ.publish('email_queue', {
              ...message,
              type: 'email',
            });
          }
          if (rule.actions.includes('send_notification')) {
            await RabbitMQ.publish('notif_queue', {
              ...message,
              type: 'notif',
            });
          }

          console.log(
            `[Scheduler] Published messages for dormant user ${user.name} (${user.email}).`
          );
        } else {
          console.log(
            `[Scheduler] User ${user.name} did not meet the rule condition.`
          );
        }
      }
    } catch (err) {
      console.error('[Scheduler] Error processing dormant users:', err.message);
    }
  }
  static async processBirthdayUsers(rule) {
    console.log('[Scheduler] Checking birthday users...');

    try {
      const today = moment().format('MM-DD');
      const birthdayUsers = await User.findAll({
        where: {
          [Op.and]: [
            { birthDate: { [Op.ne]: null } }, // Ensure birthDate is not null
            Sequelize.where(
              Sequelize.fn('to_char', Sequelize.col('birthDate'), 'MM-DD'),
              today
            ),
          ],
        },
      });

      if (birthdayUsers.length > 0) {
        console.log(
          `[Scheduler] Found ${birthdayUsers.length} users with birthday today.`
        );
      } else {
        console.log('[Scheduler] No users with birthday today.');
        return;
      }

      for (const user of birthdayUsers) {
        if (checkCondition(rule.condition, user)) {
          const message = {
            userId: user.id,
            email: user.email,
            name: user.name,
          };

          // Check if action is to send email and notification
          if (rule.actions.includes('send_email')) {
            await RabbitMQ.publish('email_queue', {
              ...message,
              type: 'birthday_email',
            });
          }
          if (rule.actions.includes('send_notification')) {
            await RabbitMQ.publish('notif_queue', {
              ...message,
              type: 'birthday_notif',
            });
          }
          console.log(
            `[Scheduler] Published birthday messages for user ${user.name} (${user.email}).`
          );
        } else {
          console.log(
            `[Scheduler] User ${user.name} did not meet the rule condition.`
          );
        }
      }
    } catch (err) {
      console.error(
        '[Scheduler] Error processing birthday users:',
        err.message
      );
    }
  }
  static start() {
    const cronTime = timeToCron(scheduleTime);

    console.log(
      `[Scheduler] Starting scheduler to run daily at ${scheduleTime}`
    );

    // Schedule the job
    nodeSchedule.scheduleJob(cronTime, async () => {
      console.log('[Scheduler] Running scheduled job...');
      // await RuleScheduler.processDormantUsers(rules);
      // await RuleScheduler.processBirthdayUsers(rules);
      const rules = await fetchRules();
      for (const rule of rules) {
        if (rule.condition.lastActive) {
          await RuleScheduler.processDormantUsers(rule);
        } else if (rule.condition.birthDate) {
          await RuleScheduler.processBirthdayUsers(rule);
        }
      }
    });
  }
}

module.exports = RuleScheduler;
