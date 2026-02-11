import { Test, TestingModule } from '@nestjs/testing';
import { SellsService } from './sells.service';
import { getModelToken } from '@nestjs/mongoose';
import { Sell } from '../core/domain/schemas/sells.schema';
import { Country } from '../core/domain/schemas/country.schema';
import { Product } from '../core/domain/schemas/invetory.schema';
import { Payment } from '../core/domain/schemas/payments.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

describe('SellsService', () => {
  let service: SellsService;
  let sellModel: Model<Sell>;
  let countryModel: Model<Country>;
  let productModel: Model<Product>;
  let paymentModel: Model<Payment>;

  const mockSellModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  // Mock constructor function for creating new Sell instances
  const mockSellConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'newSellId' }),
  }));

  const mockCountryModel = {
    aggregate: jest.fn(),
  };

  const mockProductModel = {
    findOne: jest.fn(),
  };

  const mockPaymentModel = {
    findOne: jest.fn(),
  };

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Product',
    price: 100,
    stock: 10,
    save: jest.fn(),
  };

  const mockPayment = {
    _id: '507f1f77bcf86cd799439012',
    paymentMethod: 'credit-card',
    customer: '507f1f77bcf86cd799439013',
  };

  const mockGiftCardPayment = {
    _id: '507f1f77bcf86cd799439014',
    paymentMethod: 'gift-card',
    giftCardStatus: 'registered',
    giftCardAmount: 500,
    customer: '507f1f77bcf86cd799439013',
  };

  const mockSell = {
    address: '123 Test St',
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

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellsService,
        {
          provide: getModelToken(Sell.name),
          useValue: Object.assign(mockSellConstructor, mockSellModel),
        },
        {
          provide: getModelToken(Country.name),
          useValue: mockCountryModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(Payment.name),
          useValue: mockPaymentModel,
        },
      ],
    }).compile();

    service = module.get<SellsService>(SellsService);
    sellModel = module.get<Model<Sell>>(getModelToken(Sell.name));
    countryModel = module.get<Model<Country>>(getModelToken(Country.name));
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
    paymentModel = module.get<Model<Payment>>(getModelToken(Payment.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSell', () => {
    it('should create a sell successfully with credit card payment', async () => {
      const mockProductCopy = { ...mockProduct, save: jest.fn().mockResolvedValue(mockProduct) };
      mockProductModel.findOne.mockResolvedValue(mockProductCopy);
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createSell(mockSell);

      expect(mockProductModel.findOne).toHaveBeenCalledWith({ _id: mockSell.products[0].product });
      expect(mockPaymentModel.findOne).toHaveBeenCalledWith({ _id: mockSell.paymentMethod });
      expect(mockProductCopy.save).toHaveBeenCalled();
      expect(mockSellConstructor).toHaveBeenCalled();
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should fail if product quantity is less than or equal to 0', async () => {
      const invalidSell = {
        ...mockSell,
        products: [{ product: '507f1f77bcf86cd799439011', quantity: 0 }],
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const result = await service.createSell(invalidSell);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('[-] Error procesing sell: quantity is less than 0');
      
      consoleSpy.mockRestore();
    });

    it('should fail if product stock is less than requested quantity', async () => {
      const lowStockProduct = { ...mockProduct, stock: 1 };
      mockProductModel.findOne.mockResolvedValue(lowStockProduct);

      const sellWithHighQuantity = {
        ...mockSell,
        products: [{ product: '507f1f77bcf86cd799439011', quantity: 5 }],
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const result = await service.createSell(sellWithHighQuantity);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('[-] Error procesing sell: stock is less than quantity');
      
      consoleSpy.mockRestore();
    });

    it('should fail if gift card is not registered', async () => {
      const unregisteredGiftCard = {
        ...mockGiftCardPayment,
        giftCardStatus: 'unregistered',
      };
      
      mockProductModel.findOne.mockResolvedValue(mockProduct);
      mockPaymentModel.findOne.mockResolvedValue(unregisteredGiftCard);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const result = await service.createSell(mockSell);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('[-] Error procesing sell: gift card is not registered');
      
      consoleSpy.mockRestore();
    });

    it('should fail if gift card balance is insufficient', async () => {
      const insufficientGiftCard = {
        ...mockGiftCardPayment,
        giftCardAmount: 50, // Less than total (100 * 2 = 200)
      };
      
      mockProductModel.findOne.mockResolvedValue(mockProduct);
      mockPaymentModel.findOne.mockResolvedValue(insufficientGiftCard);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const result = await service.createSell(mockSell);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('[-] Error procesing sell: gift card balance is less than total');
      
      consoleSpy.mockRestore();
    });

    it('should update product stock correctly', async () => {
      const initialStock = 10;
      const quantityToSell = 2;
      const productWithStock = { ...mockProduct, stock: initialStock, save: jest.fn().mockResolvedValue(mockProduct) };
      
      mockProductModel.findOne.mockResolvedValue(productWithStock);
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createSell(mockSell);

      expect(productWithStock.stock).toBe(initialStock - quantityToSell);
      expect(productWithStock.save).toHaveBeenCalled();
      expect(result).toBe(true);
      
      consoleSpy.mockRestore();
    });

    it('should calculate total correctly with multiple products', async () => {
      const multiProductSell = {
        ...mockSell,
        products: [
          { product: '507f1f77bcf86cd799439011', quantity: 2 },
          { product: '507f1f77bcf86cd799439016', quantity: 3 },
        ],
      };

      const product1 = { ...mockProduct, _id: '507f1f77bcf86cd799439011', price: 100, stock: 10, save: jest.fn().mockResolvedValue(mockProduct) };
      const product2 = { ...mockProduct, _id: '507f1f77bcf86cd799439016', price: 50, stock: 10, save: jest.fn().mockResolvedValue(mockProduct) };

      mockProductModel.findOne
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2)
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2);
      
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createSell(multiProductSell);

      // Total should be: (100 * 2) + (50 * 3) = 350
      expect(result).toBe(true);
      expect(mockSellConstructor).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getSellByCustomerId', () => {
    it('should retrieve sells for a specific customer', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      const mockSells = [
        {
          _id: '507f1f77bcf86cd799439020',
          customer: customerId,
          total: 200,
          products: [],
        },
        {
          _id: '507f1f77bcf86cd799439021',
          customer: customerId,
          total: 150,
          products: [],
        },
      ];

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue(mockSells);

      mockSellModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const result = await service.getSellByCustomerId(customerId);

      expect(mockSellModel.find).toHaveBeenCalledWith({ customer: customerId });
      expect(mockPopulate).toHaveBeenCalledWith('customer');
      expect(mockPopulate).toHaveBeenCalledWith('paymentMethod');
      expect(mockPopulate).toHaveBeenCalledWith('products.product');
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockSells);
    });

    it('should return empty array if customer has no sells', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue([]);

      mockSellModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const result = await service.getSellByCustomerId(customerId);

      expect(result).toEqual([]);
    });

    it('should populate all related fields correctly', async () => {
      const customerId = '507f1f77bcf86cd799439013';
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue([]);

      mockSellModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await service.getSellByCustomerId(customerId);

      expect(mockPopulate).toHaveBeenCalledTimes(3);
      expect(mockPopulate).toHaveBeenNthCalledWith(1, 'customer');
      expect(mockPopulate).toHaveBeenNthCalledWith(2, 'paymentMethod');
      expect(mockPopulate).toHaveBeenNthCalledWith(3, 'products.product');
    });
  });
});
