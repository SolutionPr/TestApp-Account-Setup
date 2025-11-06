import authService from '../src/services/authService';
import storageService from '../src/services/storageService';
import {RegistrationFormValues} from '../src/types';

// Mock the storage service with ALL functions
jest.mock('../src/services/storageService', () => ({
  __esModule: true,
  default: {
    storeCredentials: jest.fn().mockResolvedValue(undefined),
    storeToken: jest.fn().mockResolvedValue(undefined),
    storeUserData: jest.fn().mockResolvedValue(undefined),
    storeSessionToken: jest.fn().mockResolvedValue(undefined),
    clearRegistrationDraft: jest.fn().mockResolvedValue(undefined),
    getStoredCredentials: jest.fn().mockResolvedValue(null),
    getStoredToken: jest.fn().mockResolvedValue(null),
    getStoredUser: jest.fn().mockResolvedValue(null),
    clearAllStorage: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockRegistrationData: RegistrationFormValues = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  password: 'Password1!',
  confirmPassword: 'Password1!',
  country: 'US',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  address: '123 Main St',
  city: 'New York',
  postalCode: '10001',
  agreeToTerms: true,
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the users Map to ensure test isolation
    (authService as any).users.clear();
  });

  afterEach(() => {
    (authService as any).users.clear();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const result = await authService.register(mockRegistrationData);
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(mockRegistrationData.email.toLowerCase());
      expect(result.user.firstName).toBe(mockRegistrationData.firstName);
    });

    it('should throw error for duplicate email', async () => {
      await authService.register(mockRegistrationData);
      
      await expect(authService.register(mockRegistrationData)).rejects.toThrow(
        'User with this email already exists',
      );
    });

    it('should create user with all required fields', async () => {
      const uniqueEmail = `test${Date.now()}@example.com`;
      const result = await authService.register({
        ...mockRegistrationData,
        email: uniqueEmail,
      });
      
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('firstName');
      expect(result.user).toHaveProperty('lastName');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('phone');
      expect(result.user).toHaveProperty('country');
      expect(result.user).toHaveProperty('createdAt');
    });
  });

  describe('login', () => {
    const loginEmail = `login${Date.now()}@example.com`;
    
    beforeEach(async () => {
      await authService.register({
        ...mockRegistrationData,
        email: loginEmail,
      });
    });

    it('should successfully login with valid credentials', async () => {
      const credentials = {
        email: loginEmail,
        password: mockRegistrationData.password,
      };
      
      const result = await authService.login(credentials);
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.token).toMatch(/^session_/);
    });

    it('should throw error for invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password1!',
      };
      
      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw error for invalid password', async () => {
      const credentials = {
        email: loginEmail,
        password: 'WrongPassword1!',
      };
      
      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should be case-insensitive for email', async () => {
      const credentials = {
        email: loginEmail.toUpperCase(),
        password: mockRegistrationData.password,
      };
      
      const result = await authService.login(credentials);
      expect(result).toHaveProperty('user');
    });
  });
});