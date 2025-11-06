import { User, Credentials } from '../types';
import storageService from './storageService';
import { v4 as uuidv4 } from 'uuid';

interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
}
class AuthService {
  private generateUniqueId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private users: Map<string, User & { passwordHash: string }> = new Map();

  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // Generate session token
  private generateSessionToken(): string {
    return `session_${this.generateUniqueId()}_${Date.now()}`; // yahan bhi
  }

  // Save user to JSON file
  private async saveUserToJSON(user: User & { passwordHash: string }): Promise<void> {
    try {
      console.log('User saved to JSON:', JSON.stringify(user, null, 2));

      // Store in memory
      this.users.set(user.email.toLowerCase(), user);

      // You could use RNFS to write to actual file:
      // const RNFS = require('react-native-fs');
      // const filePath = `${RNFS.DocumentDirectoryPath}/users.json`;
      // const usersArray = Array.from(this.users.values());
      // await RNFS.writeFile(filePath, JSON.stringify(usersArray, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving user to JSON:', error);
    }
  }

  // Register new user
  async register(formData: RegistrationFormValues): Promise<{ user: User; token: string }> {
    try {
      const email = formData.email.toLowerCase().trim();

      // Check if user already exists
      if (this.users.has(email)) {
        throw new Error('User with this email already exists');
      }

      // Create user object
      const user: User = {
        id: this.generateUniqueId(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: email,
        phone: formData.phone,
        phoneNumber: formData.phone,
        country: formData.country,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        createdAt: new Date().toISOString(),
      };

      const passwordHash = this.hashPassword(formData.password);
      const userWithPassword = { ...user, passwordHash };

      // Save user to JSON
      await this.saveUserToJSON(userWithPassword);

      // Store credentials securely
      await storageService.storeCredentials({
        email: email,
        password: formData.password,
      });

      // Store user data
      await storageService.storeUserData(user);

      // Generate and store session token
      const token = this.generateSessionToken();
      await storageService.storeSessionToken(token);

      // Clear registration draft
      await storageService.clearRegistrationDraft();

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async checkSession(): Promise<{ valid: boolean; user?: User }> {
    try {
      // Retrieve session token and user data (from secure storage or memory)
      const token = await storageService.getSessionToken();
      const user = await storageService.getUserData();

      if (token && user) {
        // Session token found, user data available
        return { valid: true, user };
      }
      // No session found
      return { valid: false };
    } catch (error) {
      // Any errors imply session can't be validated
      return { valid: false };
    }
  }

  // Login user
  async login(credentials: Credentials): Promise<{ user: User; token: string }> {
    try {
      const email = credentials.email.toLowerCase().trim();
      const user = this.users.get(email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const passwordHash = this.hashPassword(credentials.password);
      if (user.passwordHash !== passwordHash) {
        throw new Error('Invalid email or password');
      }

      // Store credentials
      await storageService.storeCredentials(credentials);

      // Generate and store session token
      const token = this.generateSessionToken();
      await storageService.storeSessionToken(token);

      // Store user data without password
      const { passwordHash: _, ...userWithoutPassword } = user;
      await storageService.storeUserData(userWithoutPassword);

      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Verify session
  async verifySession(): Promise<{ user: User; token: string } | null> {
    try {
      const token = await storageService.getSessionToken();
      const user = await storageService.getUserData();

      if (token && user) {
        return { user, token };
      }

      return null;
    } catch (error) {
      console.error('Session verification error:', error);
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await storageService.clearAllData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default new AuthService();