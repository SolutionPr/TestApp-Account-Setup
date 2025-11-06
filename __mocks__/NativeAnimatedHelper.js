// __mocks__/NativeAnimatedHelper.js
module.exports = {
  __esModule: true,
  default: {
    nativeEventEmitter: {
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  },
};