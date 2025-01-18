const UserController = require('../controllers/userController');
// const authentication = require('../middleware/authentication');

const router = require('express').Router();

router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;
