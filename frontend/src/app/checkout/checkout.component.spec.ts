import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { MessageService } from 'primeng/api';
import { ShippingService } from '../services/shipping.service';
import { CatalogService } from '../services/catalog.service';
import { PaymentsService } from '../services/payments.service';
import { AppComponent } from '../app.component';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';


describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let messageService: MessageService;
  let shippingService: jasmine.SpyObj<ShippingService>;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let paymentsService: jasmine.SpyObj<PaymentsService>;
  let appComponent: any;

  const mockCountryData = {
    data: {
      countries: [
        {
          name: 'España',
          states: [
            {
              name: 'Madrid',
              cities: [
                { name: 'Madrid', id: 'city1' },
                { name: 'Alcalá', id: 'city2' }
              ]
            }
          ]
        }
      ]
    },
    loading: false,
    networkStatus: 7
  };

  const mockPaymentMethods = {
    data: {
      paymentMethods: [
        { id: 'pm1', type: 'card', last4: '1234' },
        { id: 'pm2', type: 'giftCard', number: 'GIFT-123' }
      ]
    },
    loading: false,
    networkStatus: 7
  };

  beforeEach(async () => {
    const shippingServiceSpy = jasmine.createSpyObj('ShippingService', ['createCustomer', 'generateShipping']);
    const catalogServiceSpy = jasmine.createSpyObj('CatalogService', ['getCountryCatalog']);
    const paymentsServiceSpy = jasmine.createSpyObj('PaymentsService', ['registerGiftCard', 'registerCard', 'getUserPaymentMethods']);
    const appComponentMock = { currentView: 'checkout' };

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        MessageService,
        { provide: ShippingService, useValue: shippingServiceSpy },
        { provide: CatalogService, useValue: catalogServiceSpy },
        { provide: PaymentsService, useValue: paymentsServiceSpy },
        { provide: AppComponent, useValue: appComponentMock },
        provideNoopAnimations()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    messageService = TestBed.inject(MessageService);
    spyOn(messageService, 'add');
    shippingService = TestBed.inject(ShippingService) as jasmine.SpyObj<ShippingService>;
    catalogService = TestBed.inject(CatalogService) as jasmine.SpyObj<CatalogService>;
    paymentsService = TestBed.inject(PaymentsService) as jasmine.SpyObj<PaymentsService>;
    appComponent = TestBed.inject(AppComponent) as any;

    catalogService.getCountryCatalog.and.returnValue(of(mockCountryData));
    paymentsService.getUserPaymentMethods.and.returnValue(of(mockPaymentMethods));

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 'user123', name: 'Test User' }));

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isCheckoutSuccess).toBe(false);
      expect(component.customerCreated).toBe(false);
      expect(component.isValidAddressData).toBe(false);
      expect(component.isValidGiftCard).toBe(false);
      expect(component.validatePaymentData).toBe(false);
      expect(component.currentPayment).toBe('');
    });

    it('should have payment options defined', () => {
      expect(component.paymentOptions.length).toBe(3);
      expect(component.paymentOptions[0].value).toBe('card');
      expect(component.paymentOptions[1].value).toBe('giftCard');
      expect(component.paymentOptions[2].value).toBe('paypal');
    });

    it('should have checkoutEvent and onSuccessfulCheckout EventEmitters', () => {
      expect(component.checkoutEvent).toBeDefined();
      expect(component.onSuccessfulCheckout).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should load country catalog on init', () => {
      spyOn(console, 'log');
      fixture.detectChanges();

      expect(catalogService.getCountryCatalog).toHaveBeenCalled();
      expect(component.countryCatalog).toEqual(mockCountryData);
      expect(console.log).toHaveBeenCalledWith('country catalog: ', mockCountryData.data);
    });

    it('should map country catalog to combo config', () => {
      fixture.detectChanges();

      expect(component.countryComboConfig.length).toBe(1);
      expect(component.countryComboConfig[0].label).toBe('España');
    });

    it('should handle error when loading country catalog', () => {
      const testError = new Error('Catalog error');
      catalogService.getCountryCatalog.and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      fixture.detectChanges();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
    });

    it('should load session from localStorage', () => {
      fixture.detectChanges();

      expect(component.session).toEqual({ id: 'user123', name: 'Test User' });
      expect(component.customerData.user).toBe('user123');
    });

    it('should update user payment methods', () => {
      fixture.detectChanges();

      expect(paymentsService.getUserPaymentMethods).toHaveBeenCalledWith('user123');
      expect(component.userPaymentMethods).toEqual(mockPaymentMethods.data);
    });
  });

  describe('changeCurrentView', () => {
    it('should change app current view', () => {
      component.changeCurrentView('home');

      expect(appComponent.currentView).toBe('home');
    });
  });


  describe('validateCustomerData', () => {
    it('should return false when name is empty', () => {
      component.customerData = { name: '', phone: '123456789', identification: 'ABC123' };

      expect(component.validateCustomerData()).toBe(false);
    });

    it('should return false when phone is empty', () => {
      component.customerData = { name: 'John', phone: '', identification: 'ABC123' };

      expect(component.validateCustomerData()).toBe(false);
    });

    it('should return false when identification is empty', () => {
      component.customerData = { name: 'John', phone: '123456789', identification: '' };

      expect(component.validateCustomerData()).toBe(false);
    });

    it('should return true when all fields are filled', () => {
      component.customerData = { name: 'John', phone: '123456789', identification: 'ABC123' };

      expect(component.validateCustomerData()).toBe(true);
    });
  });

  describe('createCustomer', () => {
    it('should create customer successfully', () => {
      const mockResponse = { data: { createCustomer: { id: 'cust123' } }, loading: false, networkStatus: 7 };
      shippingService.createCustomer.and.returnValue(of(mockResponse));
      spyOn(console, 'log');

      component.customerData = { name: 'John', phone: '123', identification: 'ABC' };
      component.createCustomer();

      expect(shippingService.createCustomer).toHaveBeenCalledWith(component.customerData);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Customer created'
      });
      expect(component.customerCreated).toBe(true);
      expect(component.customerCreatedData).toEqual(mockResponse);
    });

    it('should handle error when creating customer', () => {
      const testError = new Error('Customer creation failed');
      shippingService.createCustomer.and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      component.createCustomer();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Error creating customer'
      });
    });
  });

  describe('validateShippingData', () => {
    it('should return false when street1 is missing', () => {
      component.shippingData = { street2: 'Street 2', zipCode: '12345' };
      component.placesId = { cityId: 'city1' };

      expect(component.validateShippingData()).toBe(false);
    });

    it('should return false when street2 is missing', () => {
      component.shippingData = { street1: 'Street 1', zipCode: '12345' };
      component.placesId = { cityId: 'city1' };

      expect(component.validateShippingData()).toBe(false);
    });

    it('should return false when zipCode is missing', () => {
      component.shippingData = { street1: 'Street 1', street2: 'Street 2' };
      component.placesId = { cityId: 'city1' };

      expect(component.validateShippingData()).toBe(false);
    });

    it('should return false when cityId is missing', () => {
      component.shippingData = { street1: 'Street 1', street2: 'Street 2', zipCode: '12345' };
      component.placesId = {};

      expect(component.validateShippingData()).toBe(false);
    });

    it('should return true when all fields are filled', () => {
      component.shippingData = { street1: 'Street 1', street2: 'Street 2', zipCode: '12345' };
      component.placesId = { cityId: 'city1' };

      expect(component.validateShippingData()).toBe(true);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const item1 = { product: { name: 'Product 1' } };
      const item2 = { product: { name: 'Product 2' } };
      component.cartItems = [item1, item2];

      component.removeItem(item1);

      expect(component.cartItems.length).toBe(1);
      expect(component.cartItems[0]).toEqual(item2);
    });
  });

  describe('validateCardData', () => {
    it('should return false when name is missing', () => {
      component.cardData = { number: '1234567890123456', expiration: '12/25', cvv: '123' };

      expect(component.validateCardData()).toBe(false);
    });

    it('should return false when card number length is not 16', () => {
      component.cardData = { name: 'John', number: '12345', expiration: '12/25', cvv: '123' };

      expect(component.validateCardData()).toBe(false);
    });

    it('should return false when cvv length is not 3', () => {
      component.cardData = { name: 'John', number: '1234567890123456', expiration: '12/25', cvv: '12' };

      expect(component.validateCardData()).toBe(false);
    });

    it('should return false when expiration format is invalid', () => {
      component.cardData = { name: 'John', number: '1234567890123456', expiration: '1225', cvv: '123' };

      expect(component.validateCardData()).toBe(false);
    });

    it('should return false when expiration has wrong length', () => {
      component.cardData = { name: 'John', number: '1234567890123456', expiration: '12/2', cvv: '123' };

      expect(component.validateCardData()).toBe(false);
    });

    it('should return true when all fields are valid', () => {
      component.cardData = { name: 'John', number: '1234567890123456', expiration: '12/25', cvv: '123' };

      expect(component.validateCardData()).toBe(true);
    });
  });

  describe('validateGiftCard', () => {
    it('should return false when gift card is empty', () => {
      component.giftCard = '';

      expect(component.validateGiftCard()).toBe(false);
    });

    it('should return false when gift card length is not 36', () => {
      component.giftCard = '12345';

      expect(component.validateGiftCard()).toBe(false);
    });

    it('should return true when gift card length is 36', () => {
      component.giftCard = '123e4567-e89b-12d3-a456-426614174000';

      expect(component.validateGiftCard()).toBe(true);
    });
  });

  describe('registerGiftCard', () => {
    it('should register gift card successfully', fakeAsync(() => {
      const mockResponse = { data: { registerGiftCard: { id: 'gc123' } }, loading: false, networkStatus: 7 };
      paymentsService.registerGiftCard.and.returnValue(of(mockResponse));
      spyOn(console, 'log');

      component.session = { id: 'user123' };
      component.giftCard = '123e4567-e89b-12d3-a456-426614174000';
      component.registerGiftCard();

      expect(paymentsService.registerGiftCard).toHaveBeenCalledWith({
        user: 'user123',
        giftCardNumber: '123e4567-e89b-12d3-a456-426614174000'
      });
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Gift card registered'
      });
      expect(component.isValidGiftCard).toBe(true);

      tick(3000);
      expect(paymentsService.getUserPaymentMethods).toHaveBeenCalled();
    }));

    it('should handle error when registering gift card', () => {
      const testError = new Error('Gift card error');
      paymentsService.registerGiftCard.and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      component.registerGiftCard();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Error registering gift card'
      });
    });
  });

  describe('registerCard', () => {
    it('should register card successfully', () => {
      const mockResponse = { data: { registerCard: { id: 'card123' } }, loading: false, networkStatus: 7 };
      paymentsService.registerCard.and.returnValue(of(mockResponse));
      spyOn(console, 'log');

      component.session = { id: 'user123' };
      component.cardData = { name: 'John', number: '1234567890123456', expiration: '12/25', cvv: '123' };
      component.registerCard();

      expect(paymentsService.registerCard).toHaveBeenCalledWith({
        creditCardName: 'John',
        creditCardNumber: '1234567890123456',
        creditCardExpirationDate: '12/25',
        creditCardCVC: '123',
        user: 'user123'
      });
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Card registered'
      });
      expect(paymentsService.getUserPaymentMethods).toHaveBeenCalled();
    });

    it('should handle error when registering card', () => {
      const testError = new Error('Card registration failed');
      paymentsService.registerCard.and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      component.registerCard();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Error registering card'
      });
    });
  });

  describe('updateUserPaymentMethods', () => {
    it('should update user payment methods successfully', () => {
      spyOn(console, 'log');

      component.session = { id: 'user123' };
      component.updateUserPaymentMethods();

      expect(console.log).toHaveBeenCalledWith('updating payment methods');
      expect(paymentsService.getUserPaymentMethods).toHaveBeenCalledWith('user123');
      expect(component.userPaymentMethods).toEqual(mockPaymentMethods.data);
    });

    it('should handle error when updating payment methods', () => {
      const testError = new Error('Payment methods error');
      paymentsService.getUserPaymentMethods.and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      component.updateUserPaymentMethods();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
    });
  });

  describe('getLast6Digits', () => {
    it('should return last 6 digits of card number', () => {
      expect(component.getLast6Digits('1234567890123456')).toBe('123456');
    });

    it('should work with shorter strings', () => {
      expect(component.getLast6Digits('12345')).toBe('12345');
    });
  });

  describe('pay', () => {
    it('should generate shipping successfully', () => {
      const mockResponse = { data: { generateShipping: { id: 'ship123' } }, loading: false, networkStatus: 7 };
      shippingService.generateShipping.and.returnValue(of(mockResponse));
      spyOn(console, 'log');
      spyOn(component.checkoutEvent, 'emit');
      spyOn(component.onSuccessfulCheckout, 'emit');

      component.shippingData = { street1: 'St1', street2: 'St2', zipCode: '12345' };
      component.placesId = { cityId: 'city1' };
      component.customerData = { phone: '123456789' };
      component.selectedPaymentMethod = { id: 'pm1' };
      component.cartItems = [{ product: { id: 'prod1' }, cuantity: 2 }];
      component.customerCreatedData = { data: { createCustomer: { id: 'cust123' } } };

      component.pay();

      expect(shippingService.generateShipping).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Shipping generated'
      });
      expect(component.isCheckoutSuccess).toBe(true);
      expect(component.onSuccessfulCheckout.emit).toHaveBeenCalledWith(true);
      expect(component.checkoutEvent.emit).toHaveBeenCalled();
    });

    it('should handle error when generating shipping', () => {
      const testError = new Error('Shipping error');
      shippingService.generateShipping.and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      component.shippingData = { street1: 'St1', street2: 'St2', zipCode: '12345' };
      component.placesId = { cityId: 'city1' };
      component.customerData = { phone: '123' };
      component.selectedPaymentMethod = { id: 'pm1' };
      component.cartItems = [];
      component.customerCreatedData = { data: { createCustomer: { id: 'cust123' } } };

      component.pay();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Error generating shipping'
      });
    });
  });

  describe('payWithPaypal', () => {
    it('should log paypal payment', () => {
      spyOn(console, 'log');

      component.payWithPaypal();

      expect(console.log).toHaveBeenCalledWith('paying with paypal');
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
