import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, Customer } from './../core/domain/schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  // ---- USER MODEL MOCK ----
  const mockUserModel: any = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
  }));

  mockUserModel.findOne = jest.fn();
  mockUserModel.updateOne = jest.fn();

  // ---- CUSTOMER MODEL MOCK ----
  const mockCustomerModel: any = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({ id: 'cust1' }),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Customer.name),
          useValue: mockCustomerModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- SIGNUP ----------------
  describe('signup', () => {
    it('should return false if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@mail.com' });

      const result = await service.singup({
        email: 'test@mail.com',
        password: '123456',
      });

      expect(result).toBe(false);
    });

    it('should create a new user and return true', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.singup({
        email: 'new@mail.com',
        password: '123456',
      });

      expect(result).toBe(true);
      expect(mockUserModel).toHaveBeenCalled();
    });
  });

  // ---------------- LOGIN ----------------
  describe('login', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = { email: 'test@mail.com' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@mail.com',
        password: '123456',
      });

      expect(result).toEqual(mockUser);
    });

    it('should return false if credentials are invalid', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.login({
        email: 'test@mail.com',
        password: 'wrong',
      });

      expect(result).toBe(false);
    });
  });

  // ---------------- MODIFY USER ----------------
  describe('modifyUser', () => {
    it('should return true when a user matches the email', async () => {
      mockUserModel.updateOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
      });

      const result = await service.modifyUser({
        email: 'test@mail.com',
        name: 'New Name',
      });

      expect(result).toBe(true);
    });

    it('should return true when the user exists but the data is unchanged', async () => {
      mockUserModel.updateOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 0,
      });

      const result = await service.modifyUser({
        email: 'test@mail.com',
        name: 'Same Name',
      });

      expect(result).toBe(true);
    });

    it('should return false when no user matches the email', async () => {
      mockUserModel.updateOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
      });

      const result = await service.modifyUser({
        email: 'missing@mail.com',
        name: 'New Name',
      });

      expect(result).toBe(false);
    });

    it('should store the new password so that login with it matches', async () => {
      mockUserModel.updateOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
      });
      mockUserModel.findOne.mockResolvedValue(null);

      await service.modifyUser({
        email: 'test@mail.com',
        password: 'new-password',
      });
      await service.login({
        email: 'test@mail.com',
        password: 'new-password',
      });

      const storedPassword = mockUserModel.updateOne.mock.calls[0][1].password;
      const loginPassword = mockUserModel.findOne.mock.calls[0][0].password;

      expect(storedPassword).not.toBe('new-password');
      expect(storedPassword).toBe(loginPassword);
    });

    it.each([undefined, null, ''])(
      'should not overwrite the password when it is %p',
      async (password) => {
        mockUserModel.updateOne.mockResolvedValue({
          acknowledged: true,
          matchedCount: 1,
        });

        await service.modifyUser({
          email: 'test@mail.com',
          name: 'New Name',
          password,
        });

        expect(mockUserModel.updateOne.mock.calls[0][1]).not.toHaveProperty(
          'password',
        );
      },
    );
  });

  // ---------------- CREATE CUSTOMER ----------------
  describe('createCustomer', () => {
    it('should return null if user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.createCustomer({
        user: '123',
      });

      expect(result).toBeNull();
    });

    it('should create customer if user exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ _id: '123' });

      const result = await service.createCustomer({
        user: '123',
        name: 'Cliente',
      });

      expect(result).toEqual({ id: 'cust1' });
      expect(mockCustomerModel).toHaveBeenCalled();
    });
  });
});
