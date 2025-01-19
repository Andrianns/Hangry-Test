const moment = require('moment');
const { Rule } = require('../models');
async function fetchRules() {
  try {
    const rules = await Rule.findAll({
      where: { isActive: true },
    });

    if (rules.length === 0) {
      console.log('[Scheduler] No active rules found.');
      return []; // Return empty array if no active rules
    }

    console.log(`[Scheduler] Found ${rules.length} active rules.`);
    return rules;
  } catch (err) {
    console.error('[Scheduler] Error fetching rules:', err.message);
    return []; // Return empty array in case of an error
  }
}

// Check if a condition is met based on the user data
function checkCondition(condition, user) {
  try {
    if (condition.lastActive) {
      const { operator, value } = condition.lastActive;
      const lastActiveDate = user.lastActive;

      const daysSinceLastActive = Math.floor(
        (new Date() - new Date(lastActiveDate)) / (1000 * 3600 * 24)
      );

      switch (operator) {
        case '>':
          return daysSinceLastActive > value;
        case '<':
          return daysSinceLastActive < value;
        case '=':
          return daysSinceLastActive === value;
        default:
          return false;
      }
    }

    if (condition.birthDate) {
      const { operator } = condition.birthDate;
      const today = moment().format('MM-DD');
      const userBirthDate = moment(user.birthDate).format('MM-DD');

      switch (operator) {
        case '=':
          return today === userBirthDate;
        default:
          return false;
      }
    }

    return false; // Return false if no conditions match
  } catch (error) {
    console.error('[Scheduler] Error checking condition:', error.message);
    return false;
  }
}

module.exports = {
  fetchRules,
  checkCondition,
};
