import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  ApolloTestingModule,
  ApolloTestingController
} from 'apollo-angular/testing';
import { SINGUP } from './graphql/mutations/autho.mutation';
import { Login } from './graphql/queries/auth.query';

describe('AuthService', () => {
  let service: AuthService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute signup mutation', () => {
    const mockInput = {
      email: 'test@test.com',
      password: '123456'
    };

    const mockResponse = {
      signup: {
        id: 1,
        email: 'test@test.com'
      }
    };

    service.singup(mockInput).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(SINGUP);

    expect(op.operation.variables['data']).toEqual(mockInput);

    op.flush({
      data: mockResponse
    });
  });

  it('should execute login query', () => {
    const mockInput = {
      email: 'test@test.com',
      password: '123456'
    };

    const mockResponse = {
      login: {
        id: 1,
        name: 'Mateo'
      }
    };

    service.login(mockInput).subscribe(result => {
      expect(result['data']).toEqual(mockResponse);
    });

    const op = controller.expectOne(Login);

    expect(op.operation.variables['data']).toEqual(mockInput);

    op.flush({
      data: mockResponse
    });
  });
});
