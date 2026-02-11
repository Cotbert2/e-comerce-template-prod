import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from '../core/domain/schemas/payments.schema';
import { Model } from 'mongoose';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentModel: Model<Payment>;

  const mockPaymentModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  // Mock constructor function for creating new Payment instances
  const mockPaymentConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'newPaymentId' }),
  }));

  const mockCardData = {
    creditCardName: 'John Doe',
    creditCardNumber: '4532015112830366',
    creditCardExpirationDate: '12/25',
    creditCardCVC: '123',
    user: '507f1f77bcf86cd799439011',
  };

  const mockGiftCardCreation = {
    giftCardAmount: 100,
  };

  const mockGiftCardRegistration = {
    giftCardNumber: 'test-uuid-1234',
    user: '507f1f77bcf86cd799439011',
  };

  const mockSavedPayment = {
    _id: '507f1f77bcf86cd799439012',
    ...mockCardData,
    paymentMethod: 'credit-card',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Payment.name),
          useValue: Object.assign(mockPaymentConstructor, mockPaymentModel),
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentModel = module.get<Model<Payment>>(getModelToken(Payment.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('newPaymentMethods', () => {
    it('should create a credit card payment method successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.newPaymentMethods(mockCardData, 'credit-card');

      expect(mockPaymentConstructor).toHaveBeenCalledWith({
        ...mockCardData,
        paymentMethod: 'credit-card',
      });
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should create a debit card payment method successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.newPaymentMethods(mockCardData, 'debit-card');

      expect(mockPaymentConstructor).toHaveBeenCalledWith({
        ...mockCardData,
        paymentMethod: 'debit-card',
      });
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should return false when save fails', async () => {
      // Create a new failing constructor for this specific test
      const failingSave = jest.fn().mockResolvedValue(null);
      const failingConstructor = jest.fn().mockImplementation(() => ({
        save: failingSave,
      }));
      
      // Temporarily replace the paymentModel with the failing constructor
      const originalModel = paymentModel;
      (service as any).paymentRepository = failingConstructor;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.newPaymentMethods(mockCardData, 'credit-card');

      expect(result).toBe(false);
      expect(failingSave).toHaveBeenCalled();

      // Restore the original model
      (service as any).paymentRepository = originalModel;
      
      consoleSpy.mockRestore();
    });

    it('should set the correct paymentMethod parameter', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.newPaymentMethods(mockCardData, 'custom-method');

      expect(mockPaymentConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: 'custom-method',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log payment data before saving', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.newPaymentMethods(mockCardData, 'credit-card');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockCardData,
          paymentMethod: 'credit-card',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('createGiftCard', () => {
    it('should create a gift card successfully', async () => {
      mockPaymentModel.create.mockResolvedValue({ _id: 'newGiftCardId', ...mockGiftCardCreation });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createGiftCard(mockGiftCardCreation);

      expect(mockPaymentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardAmount: mockGiftCardCreation.giftCardAmount,
          paymentMethod: 'gift-card',
          giftCardStatus: 'not-registered',
        })
      );
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should generate a unique giftCardNumber', async () => {
      mockPaymentModel.create.mockResolvedValue({ _id: 'newGiftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.createGiftCard(mockGiftCardCreation);

      expect(mockPaymentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardNumber: expect.any(String),
        })
      );

      const callArgs = mockPaymentModel.create.mock.calls[0][0];
      expect(callArgs.giftCardNumber).toBeTruthy();
      expect(typeof callArgs.giftCardNumber).toBe('string');

      consoleSpy.mockRestore();
    });

    it('should set giftCardStatus to not-registered by default', async () => {
      mockPaymentModel.create.mockResolvedValue({ _id: 'newGiftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.createGiftCard(mockGiftCardCreation);

      expect(mockPaymentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardStatus: 'not-registered',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should set paymentMethod to gift-card', async () => {
      mockPaymentModel.create.mockResolvedValue({ _id: 'newGiftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.createGiftCard(mockGiftCardCreation);

      expect(mockPaymentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: 'gift-card',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should return false when create fails', async () => {
      mockPaymentModel.create.mockResolvedValue(null);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createGiftCard(mockGiftCardCreation);

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should log gift card data', async () => {
      mockPaymentModel.create.mockResolvedValue({ _id: 'newGiftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.createGiftCard(mockGiftCardCreation);

      expect(consoleSpy).toHaveBeenCalledWith('data gift card', mockGiftCardCreation);

      consoleSpy.mockRestore();
    });
  });

  describe('registerGiftCard', () => {
    it('should register a gift card successfully', async () => {
      const mockUpdatedGiftCard = {
        _id: '507f1f77bcf86cd799439013',
        giftCardNumber: mockGiftCardRegistration.giftCardNumber,
        user: mockGiftCardRegistration.user,
        giftCardStatus: 'registered',
      };

      mockPaymentModel.findOneAndUpdate.mockResolvedValue(mockUpdatedGiftCard);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.registerGiftCard(mockGiftCardRegistration);

      expect(mockPaymentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { giftCardNumber: mockGiftCardRegistration.giftCardNumber },
        { user: mockGiftCardRegistration.user, giftCardStatus: 'registered' }
      );
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should update giftCardStatus to registered', async () => {
      mockPaymentModel.findOneAndUpdate.mockResolvedValue({ _id: 'giftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.registerGiftCard(mockGiftCardRegistration);

      expect(mockPaymentModel.findOneAndUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          giftCardStatus: 'registered',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should link user to the gift card', async () => {
      mockPaymentModel.findOneAndUpdate.mockResolvedValue({ _id: 'giftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.registerGiftCard(mockGiftCardRegistration);

      expect(mockPaymentModel.findOneAndUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          user: mockGiftCardRegistration.user,
        })
      );

      consoleSpy.mockRestore();
    });

    it('should return false when gift card is not found', async () => {
      mockPaymentModel.findOneAndUpdate.mockResolvedValue(null);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.registerGiftCard(mockGiftCardRegistration);

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should search by giftCardNumber', async () => {
      mockPaymentModel.findOneAndUpdate.mockResolvedValue({ _id: 'giftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.registerGiftCard(mockGiftCardRegistration);

      expect(mockPaymentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { giftCardNumber: mockGiftCardRegistration.giftCardNumber },
        expect.anything()
      );

      consoleSpy.mockRestore();
    });

    it('should log received data', async () => {
      mockPaymentModel.findOneAndUpdate.mockResolvedValue({ _id: 'giftCardId' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.registerGiftCard(mockGiftCardRegistration);

      expect(consoleSpy).toHaveBeenCalledWith('data recived to checlk', mockGiftCardRegistration);

      consoleSpy.mockRestore();
    });
  });

  describe('getPaymentMethodsByUserId', () => {
    it('should retrieve all payment methods for a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockPayments = [
        {
          _id: '507f1f77bcf86cd799439012',
          paymentMethod: 'credit-card',
          user: userId,
          creditCardName: 'John Doe',
        },
        {
          _id: '507f1f77bcf86cd799439013',
          paymentMethod: 'debit-card',
          user: userId,
          creditCardName: 'John Doe',
        },
        {
          _id: '507f1f77bcf86cd799439014',
          paymentMethod: 'gift-card',
          user: userId,
          giftCardAmount: 100,
        },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockPayments);
      mockPaymentModel.find.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.getPaymentMethodsByUserId(userId);

      expect(mockPaymentModel.find).toHaveBeenCalledWith({ user: userId });
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockPayments);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when user has no payment methods', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockExec = jest.fn().mockResolvedValue([]);
      
      mockPaymentModel.find.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.getPaymentMethodsByUserId(userId);

      expect(mockPaymentModel.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual([]);
    });

    it('should filter by userId correctly', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockExec = jest.fn().mockResolvedValue([]);
      
      mockPaymentModel.find.mockReturnValue({
        exec: mockExec,
      });

      await service.getPaymentMethodsByUserId(userId);

      expect(mockPaymentModel.find).toHaveBeenCalledWith({ user: userId });
    });

    it('should handle different user IDs correctly', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockPaymentModel.find.mockReturnValue({ exec: mockExec });

      await service.getPaymentMethodsByUserId('user1');
      await service.getPaymentMethodsByUserId('user2');

      expect(mockPaymentModel.find).toHaveBeenNthCalledWith(1, { user: 'user1' });
      expect(mockPaymentModel.find).toHaveBeenNthCalledWith(2, { user: 'user2' });
    });
  });
});
