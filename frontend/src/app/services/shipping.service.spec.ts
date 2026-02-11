import { TestBed } from '@angular/core/testing';
import { ShippingService } from './shipping.service';
import {
  ApolloTestingModule,
  ApolloTestingController
} from 'apollo-angular/testing';
import { createCustomer, createSell } from './graphql/mutations/shipping.mutation';

describe('ShippingService', () => {
  let service: ShippingService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [ShippingService]
    });

    service = TestBed.inject(ShippingService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a customer', () => {
    const mockInput = { name: 'John Doe', email: 'john@example.com' };
    const mockResponse = { createCustomer: { id: 1, name: 'John Doe', email: 'john@example.com' } };

    service.createCustomer(mockInput).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(createCustomer);
    expect(op.operation.variables['data']).toEqual(mockInput); // ✅ TS4111 safe

    op.flush({ data: mockResponse });
  });

  it('should generate a shipping', () => {
    const mockInput = { customerId: 1, products: [{ id: 1, quantity: 2 }] };
    const mockResponse = { createSell: { id: 1, status: 'Created' } };

    service.generateShipping(mockInput).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(createSell);
    expect(op.operation.variables['data']).toEqual(mockInput);

    op.flush({ data: mockResponse });
  });
});
