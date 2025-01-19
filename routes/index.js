const router = require('express').Router();
const authentication = require('../middleware/authentication');
const userRouter = require('./user');
const ruleRouter = require('./rule');

router.use('/user', userRouter);
router.use(authentication);
router.use('/rule', ruleRouter);

module.exports = router;
