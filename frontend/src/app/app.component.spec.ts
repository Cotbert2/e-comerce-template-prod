import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';
import { InventoryService } from './services/inventory.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let messageService: MessageService;
  let inventoryService: jasmine.SpyObj<InventoryService>;

  const mockProducts = {
    data: {
      products: [
        {
          id: '1',
          name: 'Test Product 1',
          price: 100,
          discount: 10,
          image: 'test1.jpg',
          inventoryStatus: 'In Stock'
        },
        {
          id: '2',
          name: 'Test Product 2',
          price: 200,
          discount: 20,
          image: 'test2.jpg',
          inventoryStatus: 'Out of Stock'
        }
      ]
    },
    loading: false,
    networkStatus: 7
  };

  beforeEach(async () => {
    const inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        MessageService,
        { provide: InventoryService, useValue: inventoryServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    }).compileComponents();

    messageService = TestBed.inject(MessageService);
    spyOn(messageService, 'add');
    inventoryService = TestBed.inject(InventoryService) as jasmine.SpyObj<InventoryService>;
    inventoryService.getProducts.and.returnValue(of(mockProducts));

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title "Jackson"', () => {
    expect(component.title).toEqual('Jackson');
  });

  it('should initialize with correct default values', () => {
    expect(component.currentView).toBe('home');
    expect(component.currentIndex).toBe(0);
    expect(component.itemInCart).toEqual([]);
    expect(component.titles).toEqual(["We create", "We build", "We innovate", "We are Jackson Store"]);
    expect(component.currentTitle).toBe("We create");
  });

  describe('ngOnInit', () => {
    it('should fetch products on initialization', () => {
      fixture.detectChanges(); // triggers ngOnInit
      
      expect(inventoryService.getProducts).toHaveBeenCalled();
      expect(component.productsInfo).toEqual(mockProducts.data.products);
    });

    it('should handle error when fetching products', () => {
      inventoryService.getProducts.and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'log');
      
      fixture.detectChanges();
      
      expect(console.log).toHaveBeenCalledWith('error: ', jasmine.any(Error));
    });

    it('should rotate titles every 2 seconds', fakeAsync(() => {
      fixture.detectChanges();
      
      expect(component.currentTitle).toBe(component.titles[0]);
      
      tick(2000);
      expect(component.currentTitle).toBe(component.titles[1]);
      
      tick(2000);
      expect(component.currentTitle).toBe(component.titles[2]);
      
      tick(2000);
      expect(component.currentTitle).toBe(component.titles[3]);
      
      tick(2000);
      expect(component.currentTitle).toBe(component.titles[0]);
    }));
  });

  describe('changeView', () => {
    it('should change current view', () => {
      component.changeView('product');
      expect(component.currentView).toBe('product');
      
      component.changeView('checkout');
      expect(component.currentView).toBe('checkout');
    });
  });

  describe('getSeverity', () => {
    it('should return "success" for "In Stock"', () => {
      expect(component.getSeverity('In Stock')).toBe('success');
    });

    it('should return "danger" for "Out of Stock"', () => {
      expect(component.getSeverity('Out of Stock')).toBe('danger');
    });

    it('should return "warning" for "Limited Stock"', () => {
      expect(component.getSeverity('Limited Stock')).toBe('warning');
    });

    it('should return "info" for unknown status', () => {
      expect(component.getSeverity('Unknown')).toBe('info');
    });
  });

  describe('getPreviosPriceAfterDiscount', () => {
    it('should calculate previous price correctly', () => {
      expect(component.getPreviosPriceAfterDiscount(90, 10)).toBe(100);
      expect(component.getPreviosPriceAfterDiscount(80, 20)).toBe(100);
      expect(component.getPreviosPriceAfterDiscount(75, 25)).toBe(100);
    });

    it('should round to nearest integer', () => {
      expect(component.getPreviosPriceAfterDiscount(99, 10)).toBe(110);
    });
  });

  describe('formDiscount', () => {
    it('should format discount with percentage sign', () => {
      expect(component.formDiscount(10)).toBe('10% off');
      expect(component.formDiscount(25)).toBe('25% off');
      expect(component.formDiscount(50)).toBe('50% off');
    });
  });

  describe('openProductView', () => {
    it('should set current product and change view to product', () => {
      const testProduct = { id: '1', name: 'Test Product' };
      spyOn(console, 'log');
      
      component.openProductView(testProduct);
      
      expect(component.currentProduct).toEqual(testProduct);
      expect(component.currentView).toBe('product');
      expect(console.log).toHaveBeenCalledWith('product: ', testProduct);
    });
  });

  describe('newCartItemSelected', () => {
    it('should add item to cart and show success message', () => {
      const testItem = { 
        product: { name: 'Test Product', price: 100 }, 
        quantity: 2 
      };
      spyOn(console, 'log');
      
      component.newCartItemSelected(testItem);
      
      expect(component.itemInCart.length).toBe(1);
      expect(component.itemInCart[0]).toEqual(testItem);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Product Test Product added to cart'
      });
      expect(component.currentView).toBe('home');
    });

    it('should add multiple items to cart', () => {
      const item1 = { product: { name: 'Product 1' }, quantity: 1 };
      const item2 = { product: { name: 'Product 2' }, quantity: 2 };
      
      component.newCartItemSelected(item1);
      component.newCartItemSelected(item2);
      
      expect(component.itemInCart.length).toBe(2);
      expect(component.itemInCart).toContain(item1);
      expect(component.itemInCart).toContain(item2);
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item from cart by index', () => {
      component.itemInCart = [
        { product: { name: 'Product 1' } },
        { product: { name: 'Product 2' } },
        { product: { name: 'Product 3' } }
      ];
      
      component.removeItemFromCart(1);
      
      expect(component.itemInCart.length).toBe(2);
      expect(component.itemInCart[0].product.name).toBe('Product 1');
      expect(component.itemInCart[1].product.name).toBe('Product 3');
    });

    it('should handle removing first item', () => {
      component.itemInCart = [
        { product: { name: 'Product 1' } },
        { product: { name: 'Product 2' } }
      ];
      
      component.removeItemFromCart(0);
      
      expect(component.itemInCart.length).toBe(1);
      expect(component.itemInCart[0].product.name).toBe('Product 2');
    });
  });

  describe('openProductViewFromCategories', () => {
    it('should set current product and change view to product', () => {
      const testProduct = { id: '2', name: 'Category Product' };
      
      component.openProductViewFromCategories(testProduct);
      
      expect(component.currentProduct).toEqual(testProduct);
      expect(component.currentView).toBe('product');
    });
  });

  describe('checkoutSuccess', () => {
    it('should clear cart items', () => {
      component.itemInCart = [
        { product: { name: 'Product 1' } },
        { product: { name: 'Product 2' } }
      ];
      
      component.checkoutSuccess({});
      
      expect(component.itemInCart).toEqual([]);
      expect(component.itemInCart.length).toBe(0);
    });
  });

  describe('products array', () => {
    it('should have 6 products defined', () => {
      expect(component.products.length).toBe(6);
    });

    it('should have products with correct properties', () => {
      component.products.forEach(product => {
        expect(product.name).toBeDefined();
        expect(product.price).toBeDefined();
        expect(product.image).toBeDefined();
        expect(product.inventoryStatus).toBeDefined();
      });
    });
  });

  describe('responsiveOptions', () => {
    it('should have responsive options for different breakpoints', () => {
      expect(component.responsiveOptions.length).toBe(3);
      expect(component.responsiveOptions[0].breakpoint).toBe('1024px');
      expect(component.responsiveOptions[1].breakpoint).toBe('768px');
      expect(component.responsiveOptions[2].breakpoint).toBe('560px');
    });
  });

  describe('Simple Funs', () => {
    it('should return correct severity based on inventory status', () => {
      expect(component.getSeverity('In Stock')).toBe('success');
      expect(component.getSeverity('Out of Stock')).toBe('danger');
      expect(component.getSeverity('Limited Stock')).toBe('warning');
      expect(component.getSeverity('Unknown Status')).toBe('info');
    });
  });
});
