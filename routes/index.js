const router = require('express').Router();
const path = require('path');

// const authentication = require('../middleware/authentication');
const userRouter = require('./user');
const ruleRouter = require('./rule');
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});
router.use('/user', userRouter);
router.use('/rule', ruleRouter);

//authentication

module.exports = router;
