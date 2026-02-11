import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let messageService: jasmine.SpyObj<MessageService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', ['add'])
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['login', 'singup'])
        },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;

    authService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  // =========================
  // CREATION & INIT
  // =========================

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load logged user from localStorage on init', () => {
    const mockUser = { id: 1, name: 'Mateo' };
    localStorage.setItem('loggedUser', JSON.stringify(mockUser));

    component.ngOnInit();

    expect(component.logedUserData).toEqual(mockUser);
  });

  // =========================
  // SWITCH VIEW
  // =========================

  it('should toggle isLogin when switchToSignUp is called', () => {
    component.isLogin = true;

    component.switchToSignUp();

    expect(component.isLogin).toBeFalse();
  });

  // =========================
  // SIGN UP
  // =========================

  it('should show error if sign up fields are empty', () => {
    component.handleSignUp();

    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });

  it('should show error if email does not contain @', () => {
    component.email = 'invalidemail';
    component.password = '123456';
    component.confirmPassword = '123456';
    component.name = 'Test';
    component.phone = '123';

    component.handleSignUp();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid email'
    });
  });

  it('should show error if password is less than 6 characters', () => {
    component.email = 'test@test.com';
    component.password = '12345';
    component.confirmPassword = '12345';
    component.name = 'Test';
    component.phone = '123';

    component.handleSignUp();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Password must be at least 6 characters'
    });
  });

  it('should show error if passwords do not match', () => {
    component.email = 'test@test.com';
    component.password = '123456';
    component.confirmPassword = '654321';
    component.name = 'Test';
    component.phone = '123';

    component.handleSignUp();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Passwords do not match'
    });
  });

  it('should call signup service when sign up data is valid', () => {
    component.email = 'test@test.com';
    component.password = '123456';
    component.confirmPassword = '123456';
    component.name = 'Test';
    component.phone = '123';

    authService.singup.and.returnValue(of({}));

    component.handleSignUp();

    expect(authService.singup).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success' })
    );
    expect(component.isLogin).toBeTrue();
  });

  it('should handle signup service error', () => {
    component.email = 'test@test.com';
    component.password = '123456';
    component.confirmPassword = '123456';
    component.name = 'Test';
    component.phone = '123';

    authService.singup.and.returnValue(throwError(() => 'error'));

    component.handleSignUp();

    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });

  // =========================
  // LOGIN
  // =========================

  it('should show error if login fields are empty', () => {
    component.handleLogIn();

    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });

  it('should login and save user to localStorage', () => {
    component.email = 'test@test.com';
    component.password = '123456';

const response: ApolloQueryResult<any> = {
  data: {
    login: {
      id: 1,
      name: 'Mateo'
    }
  },
  loading: false,
  networkStatus: 7
};


    authService.login.and.returnValue(of(response));

    component.handleLogIn();

    expect(authService.login).toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('loggedUser')!)).toEqual(
      response.data.login
    );
  });

it('should show error if login response has no id', () => {
  component.email = 'test@test.com';
  component.password = '123456';

  const response: ApolloQueryResult<any> = {
    data: {
      login: {}
    },
    loading: false,
    networkStatus: 7
  };

  authService.login.and.returnValue(of(response));

  component.handleLogIn();

  expect(messageService.add).toHaveBeenCalledWith(
    jasmine.objectContaining({ severity: 'error' })
  );
});



  it('should clear localStorage and logout user', () => {
    localStorage.setItem('loggedUser', JSON.stringify({ id: 1 }));

    component.isLogged = true;
    component.handleLogOut();

    expect(localStorage.getItem('loggedUser')).toBeNull();
    expect(component.isLogged).toBeFalse();
  });
});
