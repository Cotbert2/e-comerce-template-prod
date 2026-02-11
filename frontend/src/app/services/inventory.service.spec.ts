import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';
import {
  ApolloTestingModule,
  ApolloTestingController
} from 'apollo-angular/testing';
import { ProductsQuery, CategoryQuery, ProductsByCategoryQuery } from './graphql/queries/inventory.query';

describe('InventoryService', () => {
  let service: InventoryService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [InventoryService]
    });

    service = TestBed.inject(InventoryService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify(); // Verifica que no queden operaciones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockResponse = {
      products: [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ]
    };

    service.getProducts().subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(ProductsQuery);
    expect(op.operation.variables).toEqual({}); // sin variables
    op.flush({ data: mockResponse });
  });

  it('should fetch categories', () => {
    const mockResponse = {
      categories: [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ]
    };

    service.getCategories().subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(CategoryQuery);
    expect(op.operation.variables).toEqual({}); // sin variables
    op.flush({ data: mockResponse });
  });

  it('should fetch products by category', () => {
    const category = 'Electronics';
    const mockResponse = {
      productsByCategory: [
        { id: 1, name: 'Laptop' },
        { id: 2, name: 'Phone' }
      ]
    };

    service.getProductsByCategory(category).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(ProductsByCategoryQuery);
    expect(op.operation.variables['category']).toEqual(category); // acceso seguro TS4111
    op.flush({ data: mockResponse });
  });
});
