import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserInput, CustomerInput } from '../core/domain/inputs/user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  const mockUsersService = {
    login: jest.fn(),
    singup: jest.fn(),
    modifyUser: jest.fn(),
    createCustomer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // ---------------- LOGIN ----------------
  describe('login', () => {
    it('should return user from service when login succeeds', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        password: '123456',
        name: 'Test User',
        phone: '555-1111',
        role: 'customer'
      };
      const mockUser = { 
        _id: '1', 
        email: 'test@mail.com',
        name: 'Test User',
        role: 'customer'
      };

      mockUsersService.login.mockResolvedValue(mockUser);

      const result = await resolver.login(data);

      expect(result).toEqual(mockUser);
      expect(usersService.login).toHaveBeenCalledWith(data);
      expect(usersService.login).toHaveBeenCalledTimes(1);
    });

    it('should return null when login fails with wrong credentials', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        password: 'wrongpass',
        name: 'Test User',
        phone: '555-2222',
        role: 'customer'
      };

      mockUsersService.login.mockResolvedValue(null);

      const result = await resolver.login(data);

      expect(result).toBeNull();
      expect(usersService.login).toHaveBeenCalledWith(data);
    });

    it('should pass correct email and password to service', async () => {
      const data: UserInput = { 
        email: 'user@example.com', 
        password: 'securepass',
        name: 'Example User',
        phone: '555-3333',
        role: 'customer'
      };
      mockUsersService.login.mockResolvedValue({ email: data.email });

      await resolver.login(data);

      expect(usersService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user@example.com',
          password: 'securepass',
        })
      );
    });

    it('should handle errors thrown by service', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        password: '123456',
        name: 'Test User',
        phone: '555-4444',
        role: 'customer'
      };
      const error = new Error('Database connection failed');
      
      mockUsersService.login.mockRejectedValue(error);

      await expect(resolver.login(data)).rejects.toThrow('Database connection failed');
      expect(usersService.login).toHaveBeenCalledWith(data);
    });
  });

  // ---------------- SIGNUP ----------------
  describe('singup', () => {
    it('should return true when signup succeeds', async () => {
      const data: UserInput = { 
        email: 'new@mail.com', 
        password: '123456',
        name: 'New User',
        phone: '555-5555',
        role: 'customer'
      };

      mockUsersService.singup.mockResolvedValue(true);

      const result = await resolver.singup(data);

      expect(result).toBe(true);
      expect(usersService.singup).toHaveBeenCalledWith(data);
      expect(usersService.singup).toHaveBeenCalledTimes(1);
    });

    it('should return false when signup fails', async () => {
      const data: UserInput = { 
        email: 'existing@mail.com', 
        password: '123456',
        name: 'Existing User',
        phone: '555-9999',
        role: 'customer'
      };

      mockUsersService.singup.mockResolvedValue(false);

      const result = await resolver.singup(data);

      expect(result).toBe(false);
      expect(usersService.singup).toHaveBeenCalledWith(data);
    });

    it('should pass all user data to service', async () => {
      const data: UserInput = { 
        email: 'newuser@mail.com', 
        password: 'strongpass123',
        name: 'New User',
        phone: '555-4444',
        role: 'customer'
      };

      mockUsersService.singup.mockResolvedValue(true);

      await resolver.singup(data);

      expect(usersService.singup).toHaveBeenCalledWith(
        expect.objectContaining({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
        })
      );
    });

    it('should handle errors thrown by service during signup', async () => {
      const data: UserInput = { 
        email: 'new@mail.com', 
        password: '123456',
        name: 'Error User',
        phone: '555-5555',
        role: 'customer'
      };
      const error = new Error('Failed to create user');
      
      mockUsersService.singup.mockRejectedValue(error);

      await expect(resolver.singup(data)).rejects.toThrow('Failed to create user');
      expect(usersService.singup).toHaveBeenCalledWith(data);
    });
  });

  // ---------------- MODIFY USER ----------------
  describe('modifyUser', () => {
    it('should return true when user is modified successfully', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        name: 'Mateo',
        password: 'pass123',
        phone: '555-6666',
        role: 'customer'
      };

      mockUsersService.modifyUser.mockResolvedValue(true);

      const result = await resolver.modifyUser(data);

      expect(result).toBe(true);
      expect(usersService.modifyUser).toHaveBeenCalledWith(data);
      expect(usersService.modifyUser).toHaveBeenCalledTimes(1);
    });

    it('should return false when user modification fails', async () => {
      const data: UserInput = { 
        email: 'nonexistent@mail.com', 
        name: 'John',
        password: 'pass456',
        phone: '555-7777',
        role: 'customer'
      };

      mockUsersService.modifyUser.mockResolvedValue(false);

      const result = await resolver.modifyUser(data);

      expect(result).toBe(false);
      expect(usersService.modifyUser).toHaveBeenCalledWith(data);
    });

    it('should pass updated user data to service', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        name: 'Updated Name',
        password: 'newpass',
        phone: '555-8888',
        role: 'admin'
      };

      mockUsersService.modifyUser.mockResolvedValue(true);

      await resolver.modifyUser(data);

      expect(usersService.modifyUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: data.email,
          name: data.name,
          role: data.role,
        })
      );
    });

    it('should handle partial user updates', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        name: 'Only Name Change',
        password: 'pass789',
        phone: '555-9999',
        role: 'customer'
      };

      mockUsersService.modifyUser.mockResolvedValue(true);

      const result = await resolver.modifyUser(data);

      expect(result).toBe(true);
      expect(usersService.modifyUser).toHaveBeenCalledWith(data);
    });

    it('should handle errors thrown by service during modification', async () => {
      const data: UserInput = { 
        email: 'test@mail.com', 
        name: 'New Name',
        password: 'errorpass',
        phone: '555-0000',
        role: 'customer'
      };
      const error = new Error('Failed to update user');
      
      mockUsersService.modifyUser.mockRejectedValue(error);

      await expect(resolver.modifyUser(data)).rejects.toThrow('Failed to update user');
      expect(usersService.modifyUser).toHaveBeenCalledWith(data);
    });
  });

  // ---------------- CREATE CUSTOMER ----------------
  describe('createCustomer', () => {
    it('should return customer from service when creation succeeds', async () => {
      const data: CustomerInput = { 
        user: '123', 
        name: 'Cliente',
        phone: '555-1234',
        identification: 'ID123'
      };
      const mockCustomer = { 
        _id: 'cust1', 
        name: 'Cliente',
        user: '123',
        phone: '555-1234',
        identification: 'ID123'
      };

      mockUsersService.createCustomer.mockResolvedValue(mockCustomer);

      const result = await resolver.createCustomer(data);

      expect(result).toEqual(mockCustomer);
      expect(usersService.createCustomer).toHaveBeenCalledWith(data);
      expect(usersService.createCustomer).toHaveBeenCalledTimes(1);
    });

    it('should return null when customer creation fails', async () => {
      const data: CustomerInput = { 
        user: '999', 
        name: 'Cliente',
        phone: '555-9999',
        identification: 'ID999'
      };

      mockUsersService.createCustomer.mockResolvedValue(null);

      const result = await resolver.createCustomer(data);

      expect(result).toBeNull();
      expect(usersService.createCustomer).toHaveBeenCalledWith(data);
    });

    it('should pass all customer data to service', async () => {
      const data: CustomerInput = { 
        user: '123', 
        name: 'John Doe',
        phone: '555-1234',
        identification: 'ID12345'
      };

      const mockCustomer = { _id: 'cust1', ...data };
      mockUsersService.createCustomer.mockResolvedValue(mockCustomer);

      await resolver.createCustomer(data);

      expect(usersService.createCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          user: data.user,
          name: data.name,
          phone: data.phone,
          identification: data.identification,
        })
      );
    });

    it('should handle customer with minimal data', async () => {
      const data: CustomerInput = { 
        user: '123',
        name: 'Min Customer',
        phone: '555-0000',
        identification: 'MIN001'
      };
      const mockCustomer = { _id: 'cust1', ...data };

      mockUsersService.createCustomer.mockResolvedValue(mockCustomer);

      const result = await resolver.createCustomer(data);

      expect(result).toEqual(mockCustomer);
      expect(usersService.createCustomer).toHaveBeenCalledWith(data);
    });

    it('should handle errors thrown by service during customer creation', async () => {
      const data: CustomerInput = { 
        user: '123', 
        name: 'Cliente',
        phone: '555-1234',
        identification: 'ID123'
      };
      const error = new Error('Failed to create customer');
      
      mockUsersService.createCustomer.mockRejectedValue(error);

      await expect(resolver.createCustomer(data)).rejects.toThrow('Failed to create customer');
      expect(usersService.createCustomer).toHaveBeenCalledWith(data);
    });

    it('should handle different user IDs correctly', async () => {
      mockUsersService.createCustomer.mockResolvedValue({ _id: 'c1' });

      await resolver.createCustomer({ 
        user: 'user1', 
        name: 'Customer 1',
        phone: '555-0001',
        identification: 'ID001'
      });
      await resolver.createCustomer({ 
        user: 'user2', 
        name: 'Customer 2',
        phone: '555-0002',
        identification: 'ID002'
      });

      expect(usersService.createCustomer).toHaveBeenNthCalledWith(1, { 
        user: 'user1', 
        name: 'Customer 1',
        phone: '555-0001',
        identification: 'ID001'
      });
      expect(usersService.createCustomer).toHaveBeenNthCalledWith(2, { 
        user: 'user2', 
        name: 'Customer 2',
        phone: '555-0002',
        identification: 'ID002'
      });
    });
  });
});
