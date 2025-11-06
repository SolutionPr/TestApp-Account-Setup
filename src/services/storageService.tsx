import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';
import {STORAGE_KEYS} from '../utils/constants';
import {User, Credentials} from '../types';

class StorageService {
  removeData: any;
  // Store credentials securely in Keychain
  async storeCredentials(credentials: Credentials): Promise<void> {
    try {
      await Keychain.setGenericPassword(
        credentials.email,
        credentials.password,
        {
          service: 'com.visaregistrationapp',
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        },
      );
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw new Error('Failed to store credentials securely');
    }
  }

  // Retrieve credentials from Keychain
  async getCredentials(): Promise<Credentials | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'com.visaregistrationapp',
      });
      if (credentials) {
        return {
          email: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }

  // Remove credentials from Keychain
  async removeCredentials(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({
        service: 'com.visaregistrationapp',
      });
    } catch (error) {
      console.error('Error removing credentials:', error);
    }
  }

  // Store user data in encrypted storage
  async storeUserData(user: User): Promise<void> {
    try {
      await EncryptedStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(user),
      );
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  // Get user data from encrypted storage
  async getUserData(): Promise<User | null> {
    try {
      const userData = await EncryptedStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Store session token
  async storeSessionToken(token: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
    } catch (error) {
      console.error('Error storing session token:', error);
      throw new Error('Failed to store session token');
    }
  }

  // Get session token
  async getSessionToken(): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    } catch (error) {
      console.error('Error retrieving session token:', error);
      return null;
    }
  }

  // Store registration draft (AsyncStorage - not sensitive)
  async storeRegistrationDraft(data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.REGISTRATION_DRAFT,
        JSON.stringify(data),
      );
    } catch (error) {
      console.error('Error storing registration draft:', error);
    }
  }

  // Get registration draft
  async getRegistrationDraft(): Promise<any | null> {
    try {
      const draft = await AsyncStorage.getItem(
        STORAGE_KEYS.REGISTRATION_DRAFT,
      );
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error retrieving registration draft:', error);
      return null;
    }
  }

  // Clear registration draft
  async clearRegistrationDraft(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REGISTRATION_DRAFT);
    } catch (error) {
      console.error('Error clearing registration draft:', error);
    }
  }

  // Store failed login attempts
  async storeFailedAttempts(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAILED_ATTEMPTS,
        count.toString(),
      );
    } catch (error) {
      console.error('Error storing failed attempts:', error);
    }
  }

  // Get failed login attempts
  async getFailedAttempts(): Promise<number> {
    try {
      const attempts = await AsyncStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      return attempts ? parseInt(attempts, 10) : 0;
    } catch (error) {
      console.error('Error retrieving failed attempts:', error);
      return 0;
    }
  }

  // Store lockout time
  async storeLockoutTime(time: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LOCKOUT_TIME,
        time.toString(),
      );
    } catch (error) {
      console.error('Error storing lockout time:', error);
    }
  }

  // Get lockout time
  async getLockoutTime(): Promise<number | null> {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LOCKOUT_TIME);
      return time ? parseInt(time, 10) : null;
    } catch (error) {
      console.error('Error retrieving lockout time:', error);
      return null;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await this.removeCredentials();
      await EncryptedStorage.clear();
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.REGISTRATION_DRAFT,
        STORAGE_KEYS.FAILED_ATTEMPTS,
        STORAGE_KEYS.LOCKOUT_TIME,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

export default new StorageService();