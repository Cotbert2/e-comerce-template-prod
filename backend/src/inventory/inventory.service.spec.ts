import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService, ProviderService, ProductsService } from './inventory.service';
import { getModelToken } from '@nestjs/mongoose';
import { Category, Product, Provider } from '../core/domain/schemas/invetory.schema';
import { Model } from 'mongoose';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryModel: Model<Category>;

  const mockCategoryModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    exec: jest.fn(),
  };

  const mockCategoryConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'newCategoryId' }),
  }));

  const mockCategoryData = {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: Object.assign(mockCategoryConstructor, mockCategoryModel),
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createCategory(mockCategoryData);

      expect(mockCategoryConstructor).toHaveBeenCalledWith(mockCategoryData);
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should return false when save fails', async () => {
      const failingSave = jest.fn().mockResolvedValue(null);
      const failingConstructor = jest.fn().mockImplementation(() => ({
        save: failingSave,
      }));

      (service as any).catalogRepository = failingConstructor;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.createCategory(mockCategoryData);

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should log category data before and after saving', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.createCategory(mockCategoryData);

      expect(consoleSpy).toHaveBeenCalledWith(mockCategoryData);
      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { _id: '1', name: 'Electronics', description: 'Electronic devices' },
        { _id: '2', name: 'Clothing', description: 'Apparel and accessories' },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockCategories);
      mockCategoryModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(mockCategoryModel.find).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no categories exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockCategoryModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});

describe('ProviderService', () => {
  let service: ProviderService;
  let providerModel: Model<Provider>;

  const mockProviderModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    exec: jest.fn(),
  };

  const mockProviderConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'newProviderId' }),
  }));

  const mockProviderData = {
    name: 'Tech Supplies Inc.',
    email: 'contact@techsupplies.com',
    phone: '+1234567890',
    description: 'Leading tech supplier',
    country: '507f1f77bcf86cd799439011',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderService,
        {
          provide: getModelToken(Provider.name),
          useValue: Object.assign(mockProviderConstructor, mockProviderModel),
        },
      ],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
    providerModel = module.get<Model<Provider>>(getModelToken(Provider.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertProvider', () => {
    it('should insert a provider successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.insertProvider(mockProviderData);

      expect(mockProviderConstructor).toHaveBeenCalledWith(mockProviderData);
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should return false when save fails', async () => {
      const failingSave = jest.fn().mockResolvedValue(null);
      const failingConstructor = jest.fn().mockImplementation(() => ({
        save: failingSave,
      }));

      (service as any).providerRepository = failingConstructor;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.insertProvider(mockProviderData);

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should log provider data before and after saving', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.insertProvider(mockProviderData);

      expect(consoleSpy).toHaveBeenCalledWith(mockProviderData);
      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all providers', async () => {
      const mockProviders = [
        { _id: '1', name: 'Provider 1', email: 'p1@example.com' },
        { _id: '2', name: 'Provider 2', email: 'p2@example.com' },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockProviders);
      mockProviderModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(mockProviderModel.find).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockProviders);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no providers exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockProviderModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<Product>;
  let providerModel: Model<Provider>;
  let categoryModel: Model<Category>;

  const mockProductModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    exec: jest.fn(),
  };

  const mockProviderModel = {
    findOne: jest.fn(),
  };

  const mockCategoryModel = {
    findOne: jest.fn(),
  };

  const mockProductConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'newProductId' }),
  }));

  const mockProductData = {
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

  const mockProvider = {
    _id: '507f1f77bcf86cd799439012',
    name: 'Tech Supplies Inc.',
  };

  const mockCategory = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Electronics',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: Object.assign(mockProductConstructor, mockProductModel),
        },
        {
          provide: getModelToken(Provider.name),
          useValue: mockProviderModel,
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
    providerModel = module.get<Model<Provider>>(getModelToken(Provider.name));
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertProduct', () => {
    it('should insert a product successfully', async () => {
      mockProviderModel.findOne.mockResolvedValue(mockProvider);
      mockCategoryModel.findOne.mockResolvedValue(mockCategory);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.insertProduct(mockProductData);

      expect(mockProviderModel.findOne).toHaveBeenCalledWith({ _id: mockProductData.provider });
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({ _id: mockProductData.category });
      expect(mockProductConstructor).toHaveBeenCalledWith(mockProductData);
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should return false when provider is not found', async () => {
      mockProviderModel.findOne.mockResolvedValue(null);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.insertProduct(mockProductData);

      expect(mockProviderModel.findOne).toHaveBeenCalledWith({ _id: mockProductData.provider });
      expect(consoleSpy).toHaveBeenCalledWith('provider not found');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should return false when category is not found', async () => {
      mockProviderModel.findOne.mockResolvedValue(mockProvider);
      mockCategoryModel.findOne.mockResolvedValue(null);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.insertProduct(mockProductData);

      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({ _id: mockProductData.category });
      expect(consoleSpy).toHaveBeenCalledWith('category not found');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should return false when save fails', async () => {
      mockProviderModel.findOne.mockResolvedValue(mockProvider);
      mockCategoryModel.findOne.mockResolvedValue(mockCategory);

      const failingSave = jest.fn().mockResolvedValue(null);
      const failingConstructor = jest.fn().mockImplementation(() => ({
        save: failingSave,
      }));

      (service as any).productRepository = failingConstructor;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.insertProduct(mockProductData);

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should log provider and category selected', async () => {
      mockProviderModel.findOne.mockResolvedValue(mockProvider);
      mockCategoryModel.findOne.mockResolvedValue(mockCategory);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.insertProduct(mockProductData);

      expect(consoleSpy).toHaveBeenCalledWith('provider selected', mockProvider);
      expect(consoleSpy).toHaveBeenCalledWith('category selected', mockCategory);

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all products with populated relations', async () => {
      const mockProducts = [
        {
          _id: '1',
          name: 'Product 1',
          provider: mockProvider,
          category: mockCategory,
        },
        {
          _id: '2',
          name: 'Product 2',
          provider: mockProvider,
          category: mockCategory,
        },
      ];

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue(mockProducts);

      mockProductModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.findAll();

      expect(mockProductModel.find).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith('provider');
      expect(mockPopulate).toHaveBeenCalledWith('category');
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(consoleSpy).toHaveBeenCalledWith('products', mockProducts);

      consoleSpy.mockRestore();
    });

    it('should return empty array when no products exist', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue([]);

      mockProductModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.findAll();

      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe('findByCategory', () => {
    it('should return products filtered by category', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      const mockProducts = [
        {
          _id: '1',
          name: 'Product 1',
          category: categoryId,
          provider: mockProvider,
        },
      ];

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue(mockProducts);

      mockProductModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.findByCategory(categoryId);

      expect(mockProductModel.find).toHaveBeenCalledWith({ category: categoryId });
      expect(mockPopulate).toHaveBeenCalledWith('provider');
      expect(mockPopulate).toHaveBeenCalledWith('category');
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(consoleSpy).toHaveBeenCalledWith('products', mockProducts);

      consoleSpy.mockRestore();
    });

    it('should return empty array when no products in category', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue([]);

      mockProductModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.findByCategory(categoryId);

      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('should populate provider and category relations', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue([]);

      mockProductModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.findByCategory(categoryId);

      expect(mockPopulate).toHaveBeenCalledTimes(2);
      expect(mockPopulate).toHaveBeenNthCalledWith(1, 'provider');
      expect(mockPopulate).toHaveBeenNthCalledWith(2, 'category');

      consoleSpy.mockRestore();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const productId = '507f1f77bcf86cd799439013';
      mockProductModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.deleteProduct(productId);

      expect(mockProductModel.deleteOne).toHaveBeenCalledWith({ _id: productId });
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should return false when product is not found', async () => {
      const productId = '507f1f77bcf86cd799439013';
      mockProductModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.deleteProduct(productId);

      expect(mockProductModel.deleteOne).toHaveBeenCalledWith({ _id: productId });
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should log deletion response', async () => {
      const productId = '507f1f77bcf86cd799439013';
      const deleteResponse = { deletedCount: 1 };
      mockProductModel.deleteOne.mockResolvedValue(deleteResponse);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.deleteProduct(productId);

      expect(consoleSpy).toHaveBeenCalledWith(deleteResponse);

      consoleSpy.mockRestore();
    });
  });
});
