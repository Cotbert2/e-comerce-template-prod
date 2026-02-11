import { Test, TestingModule } from '@nestjs/testing';
import { InventoryResolver } from './inventory.resolver';
import { CategoryService, ProductsService, ProviderService } from './inventory.service';
import { CategoryInput, ProductInput, ProviderInput } from '../core/domain/inputs/invetory.input';

describe('InventoryResolver', () => {
  let resolver: InventoryResolver;
  let categoryService: CategoryService;
  let providerService: ProviderService;
  let productsService: ProductsService;

  const mockCategoryService = {
    createCategory: jest.fn(),
    findAll: jest.fn(),
  };

  const mockProviderService = {
    insertProvider: jest.fn(),
    findAll: jest.fn(),
  };

  const mockProductsService = {
    insertProduct: jest.fn(),
    deleteProduct: jest.fn(),
    findAll: jest.fn(),
    findByCategory: jest.fn(),
  };

  const mockCategoryInput: CategoryInput = {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
  };

  const mockProviderInput: ProviderInput = {
    name: 'Tech Supplies Inc.',
    email: 'contact@techsupplies.com',
    phone: '+1234567890',
    description: 'Leading tech supplier',
    country: '507f1f77bcf86cd799439011',
  };

  const mockProductInput: ProductInput = {
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop',
    stock: 50,
    category: '507f1f77bcf86cd799439011',
    provider: '507f1f77bcf86cd799439012',
    rating: 4.5,
    discount: 10,
    image: 'laptop.jpg',
  };

  const mockCategories = [
    { _id: '1', name: 'Electronics', description: 'Electronic devices' },
    { _id: '2', name: 'Clothing', description: 'Apparel and accessories' },
  ];

  const mockProviders = [
    { _id: '1', name: 'Provider 1', email: 'p1@example.com' },
    { _id: '2', name: 'Provider 2', email: 'p2@example.com' },
  ];

  const mockProducts = [
    {
      _id: '1',
      name: 'Laptop',
      price: 999.99,
      category: mockCategories[0],
      provider: mockProviders[0],
    },
    {
      _id: '2',
      name: 'Mouse',
      price: 29.99,
      category: mockCategories[0],
      provider: mockProviders[0],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryResolver,
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
        {
          provide: ProviderService,
          useValue: mockProviderService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    resolver = module.get<InventoryResolver>(InventoryResolver);
    categoryService = module.get<CategoryService>(CategoryService);
    providerService = module.get<ProviderService>(ProviderService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      mockCategoryService.createCategory.mockResolvedValue(true);

      const result = await resolver.createCategory(mockCategoryInput);

      expect(categoryService.createCategory).toHaveBeenCalledWith(mockCategoryInput);
      expect(result).toBe(true);
      expect(categoryService.createCategory).toHaveBeenCalledTimes(1);
    });

    it('should return false when category creation fails', async () => {
      mockCategoryService.createCategory.mockResolvedValue(false);

      const result = await resolver.createCategory(mockCategoryInput);

      expect(categoryService.createCategory).toHaveBeenCalledWith(mockCategoryInput);
      expect(result).toBe(false);
      expect(categoryService.createCategory).toHaveBeenCalledTimes(1);
    });

    it('should pass all category data to service', async () => {
      mockCategoryService.createCategory.mockResolvedValue(true);

      const result = await resolver.createCategory(mockCategoryInput);

      expect(categoryService.createCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCategoryInput.name,
          description: mockCategoryInput.description,
        })
      );
      expect(result).toBe(true);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to create category');
      mockCategoryService.createCategory.mockRejectedValue(error);

      await expect(resolver.createCategory(mockCategoryInput)).rejects.toThrow('Failed to create category');
      expect(categoryService.createCategory).toHaveBeenCalledWith(mockCategoryInput);
    });

    it('should return boolean value from service', async () => {
      mockCategoryService.createCategory.mockResolvedValue(true);
      const result = await resolver.createCategory(mockCategoryInput);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('insertProvider', () => {
    it('should insert a provider successfully', async () => {
      mockProviderService.insertProvider.mockResolvedValue(true);

      const result = await resolver.insertProvider(mockProviderInput);

      expect(providerService.insertProvider).toHaveBeenCalledWith(mockProviderInput);
      expect(result).toBe(true);
      expect(providerService.insertProvider).toHaveBeenCalledTimes(1);
    });

    it('should return false when provider insertion fails', async () => {
      mockProviderService.insertProvider.mockResolvedValue(false);

      const result = await resolver.insertProvider(mockProviderInput);

      expect(providerService.insertProvider).toHaveBeenCalledWith(mockProviderInput);
      expect(result).toBe(false);
      expect(providerService.insertProvider).toHaveBeenCalledTimes(1);
    });

    it('should pass all provider data to service', async () => {
      mockProviderService.insertProvider.mockResolvedValue(true);

      const result = await resolver.insertProvider(mockProviderInput);

      expect(providerService.insertProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockProviderInput.name,
          email: mockProviderInput.email,
          phone: mockProviderInput.phone,
          description: mockProviderInput.description,
          country: mockProviderInput.country,
        })
      );
      expect(result).toBe(true);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to insert provider');
      mockProviderService.insertProvider.mockRejectedValue(error);

      await expect(resolver.insertProvider(mockProviderInput)).rejects.toThrow('Failed to insert provider');
      expect(providerService.insertProvider).toHaveBeenCalledWith(mockProviderInput);
    });
  });

  describe('insertProduct', () => {
    it('should insert a product successfully', async () => {
      mockProductsService.insertProduct.mockResolvedValue(true);

      const result = await resolver.insertProduct(mockProductInput);

      expect(productsService.insertProduct).toHaveBeenCalledWith(mockProductInput);
      expect(result).toBe(true);
      expect(productsService.insertProduct).toHaveBeenCalledTimes(1);
    });

    it('should return false when product insertion fails', async () => {
      mockProductsService.insertProduct.mockResolvedValue(false);

      const result = await resolver.insertProduct(mockProductInput);

      expect(productsService.insertProduct).toHaveBeenCalledWith(mockProductInput);
      expect(result).toBe(false);
      expect(productsService.insertProduct).toHaveBeenCalledTimes(1);
    });

    it('should pass all product data to service', async () => {
      mockProductsService.insertProduct.mockResolvedValue(true);

      const result = await resolver.insertProduct(mockProductInput);

      expect(productsService.insertProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockProductInput.name,
          price: mockProductInput.price,
          description: mockProductInput.description,
          stock: mockProductInput.stock,
          category: mockProductInput.category,
          provider: mockProductInput.provider,
          rating: mockProductInput.rating,
          discount: mockProductInput.discount,
          image: mockProductInput.image,
        })
      );
      expect(result).toBe(true);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to insert product');
      mockProductsService.insertProduct.mockRejectedValue(error);

      await expect(resolver.insertProduct(mockProductInput)).rejects.toThrow('Failed to insert product');
      expect(productsService.insertProduct).toHaveBeenCalledWith(mockProductInput);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const productId = '507f1f77bcf86cd799439013';
      mockProductsService.deleteProduct.mockResolvedValue(true);

      const result = await resolver.deleteProduct(productId);

      expect(productsService.deleteProduct).toHaveBeenCalledWith(productId);
      expect(result).toBe(true);
      expect(productsService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    it('should return false when product deletion fails', async () => {
      const productId = '507f1f77bcf86cd799439013';
      mockProductsService.deleteProduct.mockResolvedValue(false);

      const result = await resolver.deleteProduct(productId);

      expect(productsService.deleteProduct).toHaveBeenCalledWith(productId);
      expect(result).toBe(false);
      expect(productsService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    it('should handle different product IDs', async () => {
      mockProductsService.deleteProduct.mockResolvedValue(true);

      await resolver.deleteProduct('id1');
      await resolver.deleteProduct('id2');

      expect(productsService.deleteProduct).toHaveBeenNthCalledWith(1, 'id1');
      expect(productsService.deleteProduct).toHaveBeenNthCalledWith(2, 'id2');
    });

    it('should handle errors thrown by service', async () => {
      const productId = '507f1f77bcf86cd799439013';
      const error = new Error('Failed to delete product');
      mockProductsService.deleteProduct.mockRejectedValue(error);

      await expect(resolver.deleteProduct(productId)).rejects.toThrow('Failed to delete product');
      expect(productsService.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });

  describe('categories', () => {
    it('should retrieve all categories', async () => {
      mockCategoryService.findAll.mockResolvedValue(mockCategories);

      const result = await resolver.categories();

      expect(categoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(2);
      expect(categoryService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no categories exist', async () => {
      mockCategoryService.findAll.mockResolvedValue([]);

      const result = await resolver.categories();

      expect(categoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Database query failed');
      mockCategoryService.findAll.mockRejectedValue(error);

      await expect(resolver.categories()).rejects.toThrow('Database query failed');
      expect(categoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('providers', () => {
    it('should retrieve all providers', async () => {
      mockProviderService.findAll.mockResolvedValue(mockProviders);

      const result = await resolver.providers();

      expect(providerService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProviders);
      expect(result).toHaveLength(2);
      expect(providerService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no providers exist', async () => {
      mockProviderService.findAll.mockResolvedValue([]);

      const result = await resolver.providers();

      expect(providerService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Database query failed');
      mockProviderService.findAll.mockRejectedValue(error);

      await expect(resolver.providers()).rejects.toThrow('Database query failed');
      expect(providerService.findAll).toHaveBeenCalled();
    });
  });

  describe('products', () => {
    it('should retrieve all products', async () => {
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await resolver.products();

      expect(productsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
      expect(productsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      mockProductsService.findAll.mockResolvedValue([]);

      const result = await resolver.products();

      expect(productsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return products with populated relations', async () => {
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await resolver.products();

      expect(result[0]).toHaveProperty('category');
      expect(result[0]).toHaveProperty('provider');
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Database query failed');
      mockProductsService.findAll.mockRejectedValue(error);

      await expect(resolver.products()).rejects.toThrow('Database query failed');
      expect(productsService.findAll).toHaveBeenCalled();
    });
  });

  describe('productsByCategory', () => {
    it('should retrieve products filtered by category', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      const filteredProducts = [mockProducts[0]];
      mockProductsService.findByCategory.mockResolvedValue(filteredProducts);

      const result = await resolver.productsByCategory(categoryId);

      expect(productsService.findByCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(filteredProducts);
      expect(result).toHaveLength(1);
      expect(productsService.findByCategory).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products in category', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      mockProductsService.findByCategory.mockResolvedValue([]);

      const result = await resolver.productsByCategory(categoryId);

      expect(productsService.findByCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle different category IDs', async () => {
      mockProductsService.findByCategory.mockResolvedValue([]);

      await resolver.productsByCategory('category1');
      await resolver.productsByCategory('category2');

      expect(productsService.findByCategory).toHaveBeenNthCalledWith(1, 'category1');
      expect(productsService.findByCategory).toHaveBeenNthCalledWith(2, 'category2');
    });

    it('should return products with populated relations', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      mockProductsService.findByCategory.mockResolvedValue([mockProducts[0]]);

      const result = await resolver.productsByCategory(categoryId);

      expect(result[0]).toHaveProperty('category');
      expect(result[0]).toHaveProperty('provider');
    });

    it('should handle errors thrown by service', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      const error = new Error('Database query failed');
      mockProductsService.findByCategory.mockRejectedValue(error);

      await expect(resolver.productsByCategory(categoryId)).rejects.toThrow('Database query failed');
      expect(productsService.findByCategory).toHaveBeenCalledWith(categoryId);
    });
  });
});
