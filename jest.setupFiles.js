// jest.setupFiles.js
// This file runs before the test environment is set up

// Mock the NativeAnimatedHelper module
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  __esModule: true,
  default: {
    nativeEventEmitter: {
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  },
}));