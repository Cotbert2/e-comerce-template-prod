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
    it('should return true if update succeeds', async () => {
      mockUserModel.updateOne.mockResolvedValue({ acknowledged: true });

      const result = await service.modifyUser({
        email: 'test@mail.com',
      });

      expect(result).toBe(true);
    });
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
