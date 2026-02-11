import { Test, TestingModule } from '@nestjs/testing';
import { CatalogResolver } from './catalog.resolver';
import { CatalogService } from './catalog.service';
import { CountryInput } from '../core/domain/inputs/country.input';

describe('CatalogResolver', () => {
  let resolver: CatalogResolver;
  let service: CatalogService;

  const mockCatalogService = {
    insertCountries: jest.fn(),
    findAll: jest.fn(),
  };

  const mockCountryInput: CountryInput = {
    name: 'United States',
    states: [
      {
        name: 'California',
        cities: [
          { name: 'Los Angeles' },
          { name: 'San Francisco' },
        ],
      },
      {
        name: 'Texas',
        cities: [
          { name: 'Houston' },
          { name: 'Austin' },
        ],
      },
    ],
  };

  const mockCountries = [
    {
      _id: '1',
      name: 'United States',
      states: [
        {
          name: 'California',
          cities: [{ name: 'Los Angeles' }, { name: 'San Francisco' }],
        },
        {
          name: 'Texas',
          cities: [{ name: 'Houston' }, { name: 'Austin' }],
        },
      ],
    },
    {
      _id: '2',
      name: 'Canada',
      states: [
        {
          name: 'Ontario',
          cities: [{ name: 'Toronto' }, { name: 'Ottawa' }],
        },
        {
          name: 'Quebec',
          cities: [{ name: 'Montreal' }, { name: 'Quebec City' }],
        },
      ],
    },
    {
      _id: '3',
      name: 'Mexico',
      states: [
        {
          name: 'Jalisco',
          cities: [{ name: 'Guadalajara' }, { name: 'Puerto Vallarta' }],
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogResolver,
        {
          provide: CatalogService,
          useValue: mockCatalogService,
        },
      ],
    }).compile();

    resolver = module.get<CatalogResolver>(CatalogResolver);
    service = module.get<CatalogService>(CatalogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('insertCountries', () => {
    it('should insert countries successfully', async () => {
      mockCatalogService.insertCountries.mockResolvedValue(true);

      const result = await resolver.insertCountries(mockCountryInput);

      expect(service.insertCountries).toHaveBeenCalledWith(mockCountryInput);
      expect(result).toBe(true);
    });

    it('should return false when insertion fails', async () => {
      mockCatalogService.insertCountries.mockResolvedValue(false);

      const result = await resolver.insertCountries(mockCountryInput);

      expect(service.insertCountries).toHaveBeenCalledWith(mockCountryInput);
      expect(result).toBe(false);
    });

    it('should pass country data with states and cities to service', async () => {
      mockCatalogService.insertCountries.mockResolvedValue(true);

      await resolver.insertCountries(mockCountryInput);

      expect(service.insertCountries).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCountryInput.name,
          states: expect.arrayContaining([
            expect.objectContaining({
              name: 'California',
              cities: expect.any(Array),
            }),
          ]),
        })
      );
    });

    it('should handle country with multiple states', async () => {
      mockCatalogService.insertCountries.mockResolvedValue(true);

      await resolver.insertCountries(mockCountryInput);

      const callArgs = mockCatalogService.insertCountries.mock.calls[0][0];
      expect(callArgs.states).toHaveLength(2);
      expect(callArgs.states[0].name).toBe('California');
      expect(callArgs.states[1].name).toBe('Texas');
    });

    it('should handle states with multiple cities', async () => {
      mockCatalogService.insertCountries.mockResolvedValue(true);

      await resolver.insertCountries(mockCountryInput);

      const callArgs = mockCatalogService.insertCountries.mock.calls[0][0];
      expect(callArgs.states[0].cities).toHaveLength(2);
      expect(callArgs.states[0].cities[0].name).toBe('Los Angeles');
      expect(callArgs.states[0].cities[1].name).toBe('San Francisco');
    });

    it('should handle country with single state', async () => {
      const singleStateCountry: CountryInput = {
        name: 'Monaco',
        states: [
          {
            name: 'Monaco',
            cities: [{ name: 'Monte Carlo' }],
          },
        ],
      };

      mockCatalogService.insertCountries.mockResolvedValue(true);

      const result = await resolver.insertCountries(singleStateCountry);

      expect(service.insertCountries).toHaveBeenCalledWith(singleStateCountry);
      expect(result).toBe(true);
    });

    it('should handle country with empty states array', async () => {
      const emptyStatesCountry: CountryInput = {
        name: 'Vatican City',
        states: [],
      };

      mockCatalogService.insertCountries.mockResolvedValue(true);

      const result = await resolver.insertCountries(emptyStatesCountry);

      expect(service.insertCountries).toHaveBeenCalledWith(emptyStatesCountry);
      expect(result).toBe(true);
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Failed to insert countries');
      mockCatalogService.insertCountries.mockRejectedValue(error);

      await expect(resolver.insertCountries(mockCountryInput)).rejects.toThrow('Failed to insert countries');
      expect(service.insertCountries).toHaveBeenCalledWith(mockCountryInput);
    });
  });

  describe('countries', () => {
    it('should retrieve all countries', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCountries);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no countries exist', async () => {
      mockCatalogService.findAll.mockResolvedValue([]);

      const result = await resolver.countries();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return countries with nested states', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(result[0]).toHaveProperty('states');
      expect(result[0].states).toBeInstanceOf(Array);
      expect(result[0].states).toHaveLength(2);
    });

    it('should return countries with nested cities in states', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(result[0].states[0]).toHaveProperty('cities');
      expect(result[0].states[0].cities).toBeInstanceOf(Array);
      expect(result[0].states[0].cities).toHaveLength(2);
    });

    it('should return all country details including names', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(result[0].name).toBe('United States');
      expect(result[1].name).toBe('Canada');
      expect(result[2].name).toBe('Mexico');
    });

    it('should return correct state names for countries', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(result[0].states[0].name).toBe('California');
      expect(result[0].states[1].name).toBe('Texas');
      expect(result[1].states[0].name).toBe('Ontario');
      expect(result[1].states[1].name).toBe('Quebec');
    });

    it('should return correct city names for states', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(result[0].states[0].cities[0].name).toBe('Los Angeles');
      expect(result[0].states[0].cities[1].name).toBe('San Francisco');
      expect(result[1].states[0].cities[0].name).toBe('Toronto');
      expect(result[1].states[0].cities[1].name).toBe('Ottawa');
    });

    it('should handle errors thrown by service', async () => {
      const error = new Error('Database query failed');
      mockCatalogService.findAll.mockRejectedValue(error);

      await expect(resolver.countries()).rejects.toThrow('Database query failed');
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should not modify the data returned from service', async () => {
      mockCatalogService.findAll.mockResolvedValue(mockCountries);

      const result = await resolver.countries();

      expect(result).toBe(mockCountries);
    });
  });
});
