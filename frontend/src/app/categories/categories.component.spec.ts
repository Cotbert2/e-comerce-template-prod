import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { InventoryService } from '../services/inventory.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockInventoryService {
  getCategories() {
    return of({
      data: {
        categories: [
          { id: '1', name: 'Phones' },
          { id: '2', name: 'Laptops' }
        ]
      },
      loading: false,
      networkStatus: 7
    });
  }

  getProductsByCategory(categoryId: string) {
    return of({
      data: {
        productsByCategory: [
          { id: 10, name: 'iPhone', price: 999 },
          { id: 11, name: 'Samsung Galaxy', price: 899 }
        ]
      },
      loading: false,
      networkStatus: 7
    });
  }
}


describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        { provide: InventoryService, useClass: MockInventoryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService);
  });

  it('should create the CategoriesComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should inject InventoryService through constructor', () => {
    expect(inventoryService).toBeDefined();
    expect(component['inventoryService']).toBeDefined();
  });

  describe('Component initialization', () => {
    it('should initialize with empty arrays', () => {
      expect(component.categories).toEqual([]);
      expect(component.products).toEqual([]);
      expect(component.currentCategory).toEqual({});
    });

    it('should have openProductViewEvent EventEmitter', () => {
      expect(component.openProductViewEvent).toBeDefined();
    });
  });

  // describe('ngOnInit', () => {
  //   it('should load categories on init and map them correctly', () => {
  //     spyOn(console, 'log');
      
  //     fixture.detectChanges(); // triggers ngOnInit

  //     expect(component.categories.length).toBe(2);
  //     expect(component.categories[0]).toEqual({
  //       name: 'Phones',
  //       value: '1'
  //     });
  //     expect(component.categories[1]).toEqual({
  //       name: 'Laptops',
  //       value: '2'
  //     });
  //     expect(console.log).toHaveBeenCalledWith('categories: ', jasmine.any(Object));
  //   });

  //   it('should map categories correctly with all properties', () => {
  //     fixture.detectChanges();

  //     // Verificar que el mapeo se ejecutó correctamente
  //     component.categories.forEach((category: any) => {
  //       expect(category.name).toBeDefined();
  //       expect(category.value).toBeDefined();
  //       expect(category.name).toBeTruthy();
  //       expect(category.value).toBeTruthy();
  //     });
  //   });

  //   it('should handle error when loading categories', () => {
  //     const errorService = TestBed.inject(InventoryService);
  //     const testError = new Error('Test error');
  //     spyOn(errorService, 'getCategories').and.returnValue(throwError(() => testError));
  //     spyOn(console, 'log');

  //     component.ngOnInit();

  //     expect(console.log).toHaveBeenCalledWith('error: ', testError);
  //     expect(component.categories).toEqual([]);
  //   });

  //   it('should call getCategories service method', () => {
  //     spyOn(inventoryService, 'getCategories').and.callThrough();

  //     component.ngOnInit();

  //     expect(inventoryService.getCategories).toHaveBeenCalled();
  //   });

  //   it('should execute success callback when categories are loaded', () => {
  //     const categoriesData = {
  //       data: {
  //         categories: [
  //           { id: 'cat1', name: 'Category 1' },
  //           { id: 'cat2', name: 'Category 2' },
  //           { id: 'cat3', name: 'Category 3' }
  //         ]
  //       },
  //       loading: false,
  //       networkStatus: 7
  //     };
      
  //     spyOn(inventoryService, 'getCategories').and.returnValue(of(categoriesData));
  //     spyOn(console, 'log');
      
  //     component.ngOnInit();

  //     expect(component.categories.length).toBe(3);
  //     expect(component.categories[2]).toEqual({ name: 'Category 3', value: 'cat3' });
  //     expect(console.log).toHaveBeenCalledWith('categories: ', categoriesData);
  //   });

  //   it('should map each category in the success callback', () => {
  //     const categoriesData = {
  //       data: {
  //         categories: [
  //           { id: 'id1', name: 'Name 1' },
  //           { id: 'id2', name: 'Name 2' }
  //         ]
  //       },
  //       loading: false,
  //       networkStatus: 7
  //     };
      
  //     spyOn(inventoryService, 'getCategories').and.returnValue(of(categoriesData));
      
  //     component.ngOnInit();

  //     // Verificar que la función map se ejecutó para cada categoría
  //     expect(component.categories).toEqual([
  //       { name: 'Name 1', value: 'id1' },
  //       { name: 'Name 2', value: 'id2' }
  //     ]);
  //   });
  // });

  describe('getProductsByCategory', () => {
    beforeEach(() => {
      fixture.detectChanges(); // initialize component
    });

    it('should call getProductsByCategory and update products list', () => {
      spyOn(inventoryService, 'getProductsByCategory').and.callThrough();
      spyOn(console, 'log');

      component.currentCategory = { value: '1', name: 'Phones' };
      component.getProductsByCategory();

      expect(console.log).toHaveBeenCalledWith('currentCategory: ', component.currentCategory);
      expect(inventoryService.getProductsByCategory).toHaveBeenCalledWith('1');
      expect(component.products.length).toBe(2);
      expect(component.products[0]).toEqual({ id: 10, name: 'iPhone', price: 999 });
      expect(console.log).toHaveBeenCalledWith('sproducts: ', component.products);
    });

    it('should execute success callback and set products correctly', () => {
      const productsData = {
        data: {
          productsByCategory: [
            { id: 1, name: 'Product A', price: 100 },
            { id: 2, name: 'Product B', price: 200 },
            { id: 3, name: 'Product C', price: 300 }
          ]
        },
        loading: false,
        networkStatus: 7
      };
      
      spyOn(inventoryService, 'getProductsByCategory').and.returnValue(of(productsData));
      spyOn(console, 'log');

      component.currentCategory = { value: '2' };
      component.getProductsByCategory();

      expect(component.products.length).toBe(3);
      expect(component.products).toEqual(productsData.data.productsByCategory);
      expect(console.log).toHaveBeenCalledWith('sproducts: ', component.products);
      expect(console.log).toHaveBeenCalledWith('currentCategory: ', { value: '2' });
    });

    it('should assign products array in success callback', () => {
      const productsData = {
        data: {
          productsByCategory: [
            { id: 99, name: 'Test Product', price: 50 }
          ]
        },
        loading: false,
        networkStatus: 7
      };
      
      spyOn(inventoryService, 'getProductsByCategory').and.returnValue(of(productsData));

      component.currentCategory = { value: 'test' };
      component.getProductsByCategory();

      // Verificar que el callback de éxito asignó los productos
      expect(component.products).toBe(productsData.data.productsByCategory);
      expect(component.products[0]).toEqual({ id: 99, name: 'Test Product', price: 50 });
    });

    it('should handle error when loading products by category', () => {
      const testError = new Error('Category error');
      spyOn(inventoryService, 'getProductsByCategory').and.returnValue(throwError(() => testError));
      spyOn(console, 'log');

      component.currentCategory = { value: '1' };
      component.getProductsByCategory();

      expect(console.log).toHaveBeenCalledWith('error: ', testError);
    });

    it('should execute error callback when service fails', () => {
      const networkError = new Error('Network failure');
      spyOn(inventoryService, 'getProductsByCategory').and.returnValue(throwError(() => networkError));
      spyOn(console, 'log');

      component.currentCategory = { value: 'test-cat' };
      component.getProductsByCategory();

      expect(console.log).toHaveBeenCalledWith('currentCategory: ', { value: 'test-cat' });
      expect(console.log).toHaveBeenCalledWith('error: ', networkError);
    });

    it('should update products when different category is selected', () => {
      component.currentCategory = { value: '1' };
      component.getProductsByCategory();
      expect(component.products.length).toBe(2);

      // Cambiar categoría
      component.currentCategory = { value: '2' };
      component.getProductsByCategory();
      expect(component.products.length).toBe(2);
    });

    it('should handle empty category value', () => {
      spyOn(inventoryService, 'getProductsByCategory').and.callThrough();

      component.currentCategory = { value: '' };
      component.getProductsByCategory();

      expect(inventoryService.getProductsByCategory).toHaveBeenCalledWith('');
    });
  });

  describe('openProductView', () => {
    it('should emit openProductViewEvent when openProductView is called', () => {
      spyOn(component.openProductViewEvent, 'emit');
      spyOn(console, 'log');

      const product = { id: 10, name: 'iPhone', price: 999 };
      component.openProductView(product);

      expect(console.log).toHaveBeenCalledWith('open product view');
      expect(component.openProductViewEvent.emit).toHaveBeenCalledWith(product);
    });

    it('should emit event with complete product object', () => {
      spyOn(component.openProductViewEvent, 'emit');

      const product = { 
        id: 11, 
        name: 'Samsung Galaxy', 
        price: 899,
        description: 'Test description',
        image: 'test.jpg'
      };
      component.openProductView(product);

      expect(component.openProductViewEvent.emit).toHaveBeenCalledWith(product);
    });

    it('should handle opening product view multiple times', () => {
      spyOn(component.openProductViewEvent, 'emit');

      const product1 = { id: 10, name: 'iPhone' };
      const product2 = { id: 11, name: 'Samsung' };

      component.openProductView(product1);
      component.openProductView(product2);

      expect(component.openProductViewEvent.emit).toHaveBeenCalledTimes(2);
      expect(component.openProductViewEvent.emit).toHaveBeenCalledWith(product1);
      expect(component.openProductViewEvent.emit).toHaveBeenCalledWith(product2);
    });
  });

  describe('Integration tests', () => {
    it('should load categories and then products for selected category', () => {
      fixture.detectChanges(); // load categories

      expect(component.categories.length).toBe(2);

      component.currentCategory = component.categories[0];
      component.getProductsByCategory();

      expect(component.products.length).toBe(2);
    });

    it('should maintain state after multiple operations', () => {
      fixture.detectChanges();

      const initialCategories = component.categories;
      component.currentCategory = { value: '1' };
      component.getProductsByCategory();

      expect(component.categories).toEqual(initialCategories);
      expect(component.products.length).toBeGreaterThan(0);
    });
  });
});
