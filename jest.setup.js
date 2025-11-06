import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock EncryptedStorage
jest.mock('react-native-encrypted-storage', () => ({
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock Keychain - FIXED to return proper response
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn((username, password, options) => 
    Promise.resolve({
      service: 'com.testapp',
      storage: 'keychain',
    })
  ),
  getGenericPassword: jest.fn((options) => 
    Promise.resolve({
      username: 'testuser',
      password: 'testpassword',
      service: 'com.testapp',
      storage: 'keychain',
    })
  ),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  SECURITY_LEVEL: {
    ANY: 'ANY',
    SECURE_SOFTWARE: 'SECURE_SOFTWARE',
    SECURE_HARDWARE: 'SECURE_HARDWARE',
  },
}));

// Mock Storage Service - FIXED method names
jest.mock('./src/services/storageService', () => {
  return {
    __esModule: true,
    default: {
      storeCredentials: jest.fn(() => Promise.resolve()),
      getCredentials: jest.fn(() => Promise.resolve(null)),
      removeCredentials: jest.fn(() => Promise.resolve(true)),
      storeToken: jest.fn(() => Promise.resolve()),
      getToken: jest.fn(() => Promise.resolve(null)),
      removeToken: jest.fn(() => Promise.resolve()),
      storeUserData: jest.fn(() => Promise.resolve()),  // FIXED: was storeUser
      getUserData: jest.fn(() => Promise.resolve(null)),  // FIXED: was getUser
      removeUserData: jest.fn(() => Promise.resolve()),  // FIXED: was removeUser
      clearAll: jest.fn(() => Promise.resolve()),
    },
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    NavigationContainer: ({ children }) => children,
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Suppress console warnings during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};