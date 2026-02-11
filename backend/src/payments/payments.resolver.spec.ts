import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';
import { CardInput, GiftCardCreationInput, GiftCardResgitrationInput } from '../core/domain/inputs/payments.intpu';

describe('PaymentsResolver', () => {
  let resolver: PaymentsResolver;
  let service: PaymentsService;

  const mockPaymentsService = {
    newPaymentMethods: jest.fn(),
    createGiftCard: jest.fn(),
    registerGiftCard: jest.fn(),
    getPaymentMethodsByUserId: jest.fn(),
  };

  const mockCardInput: CardInput = {
    creditCardName: 'John Doe',
    creditCardNumber: '4532015112830366',
    creditCardExpirationDate: '12/25',
    creditCardCVC: '123',
    user: '507f1f77bcf86cd799439011',
  };

  const mockGiftCardCreationInput: GiftCardCreationInput = {
    giftCardAmount: 100,
  };

  const mockGiftCardRegistrationInput: GiftCardResgitrationInput = {
    giftCardNumber: 'test-uuid-1234',
    user: '507f1f77bcf86cd799439011',
  };

  const mockPaymentMethods = [
    {
      _id: '507f1f77bcf86cd799439012',
      paymentMethod: 'credit-card',
      creditCardName: 'John Doe',
      creditCardNumber: '****0366',
      user: '507f1f77bcf86cd799439011',
    },
    {
      _id: '507f1f77bcf86cd799439013',
      paymentMethod: 'gift-card',
      giftCardAmount: 100,
      giftCardStatus: 'registered',
      user: '507f1f77bcf86cd799439011',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsResolver,
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    resolver = module.get<PaymentsResolver>(PaymentsResolver);
    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('paymentMethods', () => {
    it('should retrieve all payment methods for a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockPaymentsService.getPaymentMethodsByUserId.mockResolvedValue(mockPaymentMethods);

      const result = await resolver.paymentMethods(userId);

      expect(service.getPaymentMethodsByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockPaymentMethods);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no payment methods', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockPaymentsService.getPaymentMethodsByUserId.mockResolvedValue([]);

      const result = await resolver.paymentMethods(userId);

      expect(service.getPaymentMethodsByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });

    it('should handle different user IDs correctly', async () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f1f77bcf86cd799439012';

      mockPaymentsService.getPaymentMethodsByUserId
        .mockResolvedValueOnce(mockPaymentMethods)
        .mockResolvedValueOnce([]);

      const result1 = await resolver.paymentMethods(userId1);
      const result2 = await resolver.paymentMethods(userId2);

      expect(service.getPaymentMethodsByUserId).toHaveBeenNthCalledWith(1, userId1);
      expect(service.getPaymentMethodsByUserId).toHaveBeenNthCalledWith(2, userId2);
      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(0);
    });

    it('should handle errors thrown by service', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const error = new Error('Database query failed');
      mockPaymentsService.getPaymentMethodsByUserId.mockRejectedValue(error);

      await expect(resolver.paymentMethods(userId)).rejects.toThrow('Database query failed');
      expect(service.getPaymentMethodsByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('insertCreditCard', () => {
    it('should insert a credit card successfully', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(true);

      const result = await resolver.insertCreditCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(mockCardInput, 'credit-card');
      expect(result).toBe(true);
    });

    it('should return false when credit card insertion fails', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(false);

      const result = await resolver.insertCreditCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(mockCardInput, 'credit-card');
      expect(result).toBe(false);
    });

    it('should pass correct payment type as credit-card', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(true);

      await resolver.insertCreditCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(
        expect.anything(),
        'credit-card'
      );
    });

    it('should pass all card data to service', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(true);

      await resolver.insertCreditCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(
        expect.objectContaining({
          creditCardName: mockCardInput.creditCardName,
          creditCardNumber: mockCardInput.creditCardNumber,
          creditCardExpirationDate: mockCardInput.creditCardExpirationDate,
          creditCardCVC: mockCardInput.creditCardCVC,
          user: mockCardInput.user,
        }),
        'credit-card'
      );
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to save credit card');
      mockPaymentsService.newPaymentMethods.mockRejectedValue(error);

      await expect(resolver.insertCreditCard(mockCardInput)).rejects.toThrow('Failed to save credit card');
      expect(service.newPaymentMethods).toHaveBeenCalledWith(mockCardInput, 'credit-card');
    });
  });

  describe('insertDebitCard', () => {
    it('should insert a debit card successfully', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(true);

      const result = await resolver.insertDebitCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(mockCardInput, 'debit-card');
      expect(result).toBe(true);
    });

    it('should return false when debit card insertion fails', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(false);

      const result = await resolver.insertDebitCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(mockCardInput, 'debit-card');
      expect(result).toBe(false);
    });

    it('should pass correct payment type as debit-card', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(true);

      await resolver.insertDebitCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(
        expect.anything(),
        'debit-card'
      );
    });

    it('should pass all card data to service', async () => {
      mockPaymentsService.newPaymentMethods.mockResolvedValue(true);

      await resolver.insertDebitCard(mockCardInput);

      expect(service.newPaymentMethods).toHaveBeenCalledWith(
        expect.objectContaining({
          creditCardName: mockCardInput.creditCardName,
          creditCardNumber: mockCardInput.creditCardNumber,
          creditCardExpirationDate: mockCardInput.creditCardExpirationDate,
          creditCardCVC: mockCardInput.creditCardCVC,
          user: mockCardInput.user,
        }),
        'debit-card'
      );
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to save debit card');
      mockPaymentsService.newPaymentMethods.mockRejectedValue(error);

      await expect(resolver.insertDebitCard(mockCardInput)).rejects.toThrow('Failed to save debit card');
      expect(service.newPaymentMethods).toHaveBeenCalledWith(mockCardInput, 'debit-card');
    });
  });

  describe('insertGiftCard', () => {
    it('should create a gift card successfully', async () => {
      mockPaymentsService.createGiftCard.mockResolvedValue(true);

      const result = await resolver.insertGiftCard(mockGiftCardCreationInput);

      expect(service.createGiftCard).toHaveBeenCalledWith(mockGiftCardCreationInput);
      expect(result).toBe(true);
    });

    it('should return false when gift card creation fails', async () => {
      mockPaymentsService.createGiftCard.mockResolvedValue(false);

      const result = await resolver.insertGiftCard(mockGiftCardCreationInput);

      expect(service.createGiftCard).toHaveBeenCalledWith(mockGiftCardCreationInput);
      expect(result).toBe(false);
    });

    it('should pass gift card amount to service', async () => {
      mockPaymentsService.createGiftCard.mockResolvedValue(true);

      await resolver.insertGiftCard(mockGiftCardCreationInput);

      expect(service.createGiftCard).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardAmount: mockGiftCardCreationInput.giftCardAmount,
        })
      );
    });

    it('should handle different gift card amounts', async () => {
      mockPaymentsService.createGiftCard.mockResolvedValue(true);

      const giftCard50 = { giftCardAmount: 50 };
      const giftCard100 = { giftCardAmount: 100 };
      const giftCard200 = { giftCardAmount: 200 };

      await resolver.insertGiftCard(giftCard50);
      await resolver.insertGiftCard(giftCard100);
      await resolver.insertGiftCard(giftCard200);

      expect(service.createGiftCard).toHaveBeenNthCalledWith(1, giftCard50);
      expect(service.createGiftCard).toHaveBeenNthCalledWith(2, giftCard100);
      expect(service.createGiftCard).toHaveBeenNthCalledWith(3, giftCard200);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to create gift card');
      mockPaymentsService.createGiftCard.mockRejectedValue(error);

      await expect(resolver.insertGiftCard(mockGiftCardCreationInput)).rejects.toThrow('Failed to create gift card');
      expect(service.createGiftCard).toHaveBeenCalledWith(mockGiftCardCreationInput);
    });
  });

  describe('registerGiftCard', () => {
    it('should register a gift card successfully', async () => {
      mockPaymentsService.registerGiftCard.mockResolvedValue(true);

      const result = await resolver.registerGiftCard(mockGiftCardRegistrationInput);

      expect(service.registerGiftCard).toHaveBeenCalledWith(mockGiftCardRegistrationInput);
      expect(result).toBe(true);
    });

    it('should return false when gift card registration fails', async () => {
      mockPaymentsService.registerGiftCard.mockResolvedValue(false);

      const result = await resolver.registerGiftCard(mockGiftCardRegistrationInput);

      expect(service.registerGiftCard).toHaveBeenCalledWith(mockGiftCardRegistrationInput);
      expect(result).toBe(false);
    });

    it('should pass gift card number and user to service', async () => {
      mockPaymentsService.registerGiftCard.mockResolvedValue(true);

      await resolver.registerGiftCard(mockGiftCardRegistrationInput);

      expect(service.registerGiftCard).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardNumber: mockGiftCardRegistrationInput.giftCardNumber,
          user: mockGiftCardRegistrationInput.user,
        })
      );
    });

    it('should handle different gift card numbers', async () => {
      mockPaymentsService.registerGiftCard.mockResolvedValue(true);

      const registration1 = { giftCardNumber: 'uuid-1', user: 'user1' };
      const registration2 = { giftCardNumber: 'uuid-2', user: 'user2' };

      await resolver.registerGiftCard(registration1);
      await resolver.registerGiftCard(registration2);

      expect(service.registerGiftCard).toHaveBeenNthCalledWith(1, registration1);
      expect(service.registerGiftCard).toHaveBeenNthCalledWith(2, registration2);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Gift card not found');
      mockPaymentsService.registerGiftCard.mockRejectedValue(error);

      await expect(resolver.registerGiftCard(mockGiftCardRegistrationInput)).rejects.toThrow('Gift card not found');
      expect(service.registerGiftCard).toHaveBeenCalledWith(mockGiftCardRegistrationInput);
    });

    it('should handle invalid gift card numbers gracefully', async () => {
      const invalidRegistration = { giftCardNumber: 'invalid-uuid', user: '507f1f77bcf86cd799439011' };
      mockPaymentsService.registerGiftCard.mockResolvedValue(false);

      const result = await resolver.registerGiftCard(invalidRegistration);

      expect(service.registerGiftCard).toHaveBeenCalledWith(invalidRegistration);
      expect(result).toBe(false);
    });
  });
});
