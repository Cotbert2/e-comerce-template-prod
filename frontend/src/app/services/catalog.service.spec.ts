import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';
import {
  ApolloTestingModule,
  ApolloTestingController
} from 'apollo-angular/testing';
import { CountryQuery } from './graphql/queries/catalog.query';

describe('CatalogService', () => {
  let service: CatalogService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [CatalogService]
    });

    service = TestBed.inject(CatalogService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch country catalog', () => {
    const mockResponse = {
      countries: [
        {
          id: 1,
          name: 'Ecuador',
          code: 'EC'
        },
        {
          id: 2,
          name: 'Colombia',
          code: 'CO'
        }
      ]
    };

    service.getCountryCatalog().subscribe(result => {

      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(CountryQuery);

    expect(op.operation.variables).toEqual({});

    op.flush({
      data: mockResponse
    });
  });
});
