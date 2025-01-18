const { User } = require('../models');
const { compareHash } = require('../helper/bcrypt');
const { createToken } = require('../helper/jwt');
const moment = require('moment'); // Ensure you have the moment package installed

class UserController {
  static async register(req, res, next) {
    const { name, email, password, birthDate } = req.body;
    const parsedBirthday = moment(birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD');

    try {
      let data = await User.create({
        name,
        email,
        password,
        birthDate: parsedBirthday,
        lastActive: new Date(),
      });
      res.status(201).json({
        message: 'success register customer',
        data: {
          name,
          email,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      let findUser = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!findUser) {
        throw { name: 'Invalid email/password' };
      }
      const comparePassword = compareHash(password, findUser.password);
      if (!comparePassword) {
        throw { name: 'Invalid email/password' };
      }
      const payload = {
        id: findUser.id,
        username: findUser.username,
      };
      const access_token = createToken(payload);
      let username = findUser.username;
      res.status(200).json({
        access_token: access_token,
        email,
        username,
      });
    } catch (error) {
      console.log(error, '<<<<<from controller error');
      next(error);
    }
  }
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = UserController;
