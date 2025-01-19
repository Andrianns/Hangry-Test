const RuleController = require('../controllers/ruleController');

const router = require('express').Router();

router.get('/get-rule', RuleController.getAllRules);
router.post('/create-rule', RuleController.createRule);
router.post('/send-email', RuleController.sendEmail);
router.post('/send-notif', RuleController.sendNotification);

module.exports = router;
