import { Test, TestingModule } from '@nestjs/testing';
import { SellsResolver } from './sells.resolver';
import { SellsService } from './sells.service';
import { SellInput } from '../core/domain/inputs/sells.input';

describe('SellsResolver', () => {
  let resolver: SellsResolver;
  let service: SellsService;

  const mockSellsService = {
    createSell: jest.fn(),
    getSellByCustomerId: jest.fn(),
  };

  const mockSellInput: SellInput = {
    address: '123 Test Street',
    zipCode: '12345',
    contactPhone: '555-1234',
    city: '507f1f77bcf86cd799439015',
    paymentMethod: '507f1f77bcf86cd799439012',
    products: [
      {
        product: '507f1f77bcf86cd799439011',
        quantity: 2,
      },
    ],
    customer: '507f1f77bcf86cd799439013',
  };

  const mockSellsResponse = [
    {
      _id: '507f1f77bcf86cd799439020',
      address: '123 Test Street',
      zipCode: '12345',
      contactPhone: '555-1234',
      city: '507f1f77bcf86cd799439015',
      paymentMethod: {
        _id: '507f1f77bcf86cd799439012',
        paymentMethod: 'credit-card',
      },
      products: [
        {
          product: {
            _id: '507f1f77bcf86cd799439011',
            name: 'Test Product',
            price: 100,
          },
          quantity: 2,
        },
      ],
      customer: {
        _id: '507f1f77bcf86cd799439013',
        name: 'John Doe',
      },
      total: 200,
      date: new Date('2024-01-01'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellsResolver,
        {
          provide: SellsService,
          useValue: mockSellsService,
        },
      ],
    }).compile();

    resolver = module.get<SellsResolver>(SellsResolver);
    service = module.get<SellsService>(SellsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSell', () => {
    it('should create a sell and return true on success', async () => {
      mockSellsService.createSell.mockResolvedValue(true);

      const result = await resolver.createSell(mockSellInput);

      expect(service.createSell).toHaveBeenCalledWith(mockSellInput);
      expect(result).toBe(true);
    });

    it('should return false when sell creation fails', async () => {
      mockSellsService.createSell.mockResolvedValue(false);

      const result = await resolver.createSell(mockSellInput);

      expect(service.createSell).toHaveBeenCalledWith(mockSellInput);
      expect(result).toBe(false);
    });

    it('should pass correct sell data to service', async () => {
      mockSellsService.createSell.mockResolvedValue(true);

      await resolver.createSell(mockSellInput);

      expect(service.createSell).toHaveBeenCalledTimes(1);
      expect(service.createSell).toHaveBeenCalledWith(
        expect.objectContaining({
          address: mockSellInput.address,
          zipCode: mockSellInput.zipCode,
          contactPhone: mockSellInput.contactPhone,
          city: mockSellInput.city,
          paymentMethod: mockSellInput.paymentMethod,
          products: mockSellInput.products,
          customer: mockSellInput.customer,
        })
      );
    });

    it('should handle sell with multiple products', async () => {
      const multiProductSell: SellInput = {
        ...mockSellInput,
        products: [
          { product: '507f1f77bcf86cd799439011', quantity: 2 },
          { product: '507f1f77bcf86cd799439016', quantity: 3 },
          { product: '507f1f77bcf86cd799439017', quantity: 1 },
        ],
      };

      mockSellsService.createSell.mockResolvedValue(true);

      const result = await resolver.createSell(multiProductSell);

      expect(service.createSell).toHaveBeenCalledWith(multiProductSell);
      expect(result).toBe(true);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Database connection failed');
      mockSellsService.createSell.mockRejectedValue(error);

      await expect(resolver.createSell(mockSellInput)).rejects.toThrow('Database connection failed');
      expect(service.createSell).toHaveBeenCalledWith(mockSellInput);
    });
  });

  describe('getSellsByCustomerId', () => {
    it('should retrieve sells for a specific customer', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      mockSellsService.getSellByCustomerId.mockResolvedValue(mockSellsResponse);

      const result = await resolver.getSellsByCustomerId(customerId);

      expect(service.getSellByCustomerId).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(mockSellsResponse);
      expect(result).toHaveLength(1);
    });

    it('should return empty array when customer has no sells', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      mockSellsService.getSellByCustomerId.mockResolvedValue([]);

      const result = await resolver.getSellsByCustomerId(customerId);

      expect(service.getSellByCustomerId).toHaveBeenCalledWith(customerId);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return multiple sells for a customer', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      const multipleSells = [
        ...mockSellsResponse,
        {
          ...mockSellsResponse[0],
          _id: '507f1f77bcf86cd799439021',
          total: 150,
        },
        {
          ...mockSellsResponse[0],
          _id: '507f1f77bcf86cd799439022',
          total: 300,
        },
      ];

      mockSellsService.getSellByCustomerId.mockResolvedValue(multipleSells);

      const result = await resolver.getSellsByCustomerId(customerId);

      expect(service.getSellByCustomerId).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(multipleSells);
      expect(result).toHaveLength(3);
    });

    it('should handle different customer IDs correctly', async () => {
      const customerId1 = '507f1f77bcf86cd799439013';
      const customerId2 = '507f1f77bcf86cd799439014';

      mockSellsService.getSellByCustomerId
        .mockResolvedValueOnce(mockSellsResponse)
        .mockResolvedValueOnce([]);

      const result1 = await resolver.getSellsByCustomerId(customerId1);
      const result2 = await resolver.getSellsByCustomerId(customerId2);

      expect(service.getSellByCustomerId).toHaveBeenCalledWith(customerId1);
      expect(service.getSellByCustomerId).toHaveBeenCalledWith(customerId2);
      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(0);
    });

    it('should return populated data from service', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      mockSellsService.getSellByCustomerId.mockResolvedValue(mockSellsResponse);

      const result = await resolver.getSellsByCustomerId(customerId);

      expect(result[0]).toHaveProperty('customer');
      expect(result[0]).toHaveProperty('paymentMethod');
      expect(result[0]).toHaveProperty('products');
      expect(result[0].customer).toHaveProperty('_id');
      expect(result[0].paymentMethod).toHaveProperty('_id');
      expect(result[0].products[0].product).toHaveProperty('_id');
    });

    it('should handle errors thrown by service', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      const error = new Error('Database query failed');
      mockSellsService.getSellByCustomerId.mockRejectedValue(error);

      await expect(resolver.getSellsByCustomerId(customerId)).rejects.toThrow('Database query failed');
      expect(service.getSellByCustomerId).toHaveBeenCalledWith(customerId);
    });

    it('should accept valid MongoDB ObjectId format', async () => {
      const validObjectId = '507f1f77bcf86cd799439013';
      mockSellsService.getSellByCustomerId.mockResolvedValue([]);

      await resolver.getSellsByCustomerId(validObjectId);

      expect(service.getSellByCustomerId).toHaveBeenCalledWith(validObjectId);
    });
  });
});
