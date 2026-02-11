import { TestBed } from '@angular/core/testing';
import { PaymentsService } from './payments.service';
import {
  ApolloTestingModule,
  ApolloTestingController
} from 'apollo-angular/testing';
import { RegisterCreditCard, RegisterGiftCard } from './graphql/mutations/payments.mutation';
import { GetPaymentMethods } from './graphql/queries/payments.query';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [PaymentsService]
    });

    service = TestBed.inject(PaymentsService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a gift card', () => {
    const mockInput = { code: 'GIFT123', amount: 50 };
    const mockResponse = { registerGiftCard: { id: 1, code: 'GIFT123', amount: 50 } };

    service.registerGiftCard(mockInput).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(RegisterGiftCard);
    expect(op.operation.variables['data']).toEqual(mockInput);

    op.flush({ data: mockResponse });
  });

  it('should register a credit card', () => {
    const mockInput = { number: '4111111111111111', holder: 'John Doe' };
    const mockResponse = { registerCreditCard: { id: 1, number: '4111111111111111', holder: 'John Doe' } };

    service.registerCard(mockInput).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(RegisterCreditCard);
    expect(op.operation.variables['data']).toEqual(mockInput);

    op.flush({ data: mockResponse });
  });

  it('should fetch user payment methods', () => {
    const userId = 'user-123';
    const mockResponse = {
      paymentMethods: [
        { id: 1, type: 'GiftCard', code: 'GIFT123' },
        { id: 2, type: 'CreditCard', number: '4111111111111111' }
      ]
    };

    service.getUserPaymentMethods(userId).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(GetPaymentMethods);
    expect(op.operation.variables['id']).toEqual(userId); 

    op.flush({ data: mockResponse });
  });
});
