const mockKeychain = {
  SECURITY_LEVEL: {
    ANY: 'ANY',
    SECURE_SOFTWARE: 'SECURE_SOFTWARE',
    SECURE_HARDWARE: 'SECURE_HARDWARE',
  },
  
  setGenericPassword: jest.fn((username, password, options) => {
    return Promise.resolve({
      service: options?.service || 'com.testapp',
      storage: 'keychain',
    });
  }),
  
  getGenericPassword: jest.fn((options) => {
    return Promise.resolve({
      username: 'testuser',
      password: 'testpassword',
      service: options?.service || 'com.testapp',
      storage: 'keychain',
    });
  }),
  
  resetGenericPassword: jest.fn((options) => {
    return Promise.resolve(true);
  }),
};

module.exports = mockKeychain;