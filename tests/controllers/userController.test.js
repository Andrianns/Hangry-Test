const UserController = require('../../src/controllers/UserController');
const { User } = require('../../src/models');
const { compareHash } = require('../../src/helper/bcrypt');
const { createToken } = require('../../src/helper/jwt');

jest.mock('../../src/models');
jest.mock('../../src/helper/bcrypt');
jest.mock('../../src/helper/jwt');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return success message', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
          birthDate: '01-01-2000',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.create.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        birthDate: '2000-01-01',
      });

      await UserController.register(req, res, next);

      expect(User.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        birthDate: '2000-01-01',
        lastActive: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'success register customer',
        data: {
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
      });
    });

    it('should handle errors during registration', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
          birthDate: '01-01-2000',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.create.mockRejectedValue(new Error('Database error'));

      await UserController.register(req, res, next);

      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('login', () => {
    it('should log in a user and return an access token', async () => {
      const req = {
        body: {
          email: 'johndoe@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockUser = {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'hashedpassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      compareHash.mockReturnValue(true);
      createToken.mockReturnValue('fake-jwt-token');

      await UserController.login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'johndoe@example.com' },
      });
      expect(compareHash).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(createToken).toHaveBeenCalledWith({
        id: mockUser.id,
        username: mockUser.username,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        access_token: 'fake-jwt-token',
        email: 'johndoe@example.com',
        username: 'johndoe',
      });
    });

    it('should return an error if email or password is invalid', async () => {
      const req = {
        body: {
          email: 'johndoe@example.com',
          password: 'wrongpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findOne.mockResolvedValue(null);

      await UserController.login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'johndoe@example.com' },
      });
      expect(res.status).not.toHaveBeenCalled(); // next should handle the error
      expect(next).toHaveBeenCalledWith({ name: 'Invalid email/password' });
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
        { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
      ];

      User.findAll.mockResolvedValue(mockUsers);

      await UserController.getAllUsers(req, res);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors during user retrieval', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findAll.mockRejectedValue(new Error('Database error'));

      await UserController.getAllUsers(req, res);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
