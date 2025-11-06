const mockStorageService = {
  storeCredentials: jest.fn(async (email: string, password: string) => {
    return Promise.resolve();
  }),
  
  getCredentials: jest.fn(async () => {
    return Promise.resolve({
      username: 'test@example.com',
      password: 'Password1!',
    });
  }),
  
  removeCredentials: jest.fn(async () => {
    return Promise.resolve(true);
  }),
  
  storeToken: jest.fn(async (token: string) => {
    return Promise.resolve();
  }),
  
  getToken: jest.fn(async () => {
    return Promise.resolve('mock-token');
  }),
  
  removeToken: jest.fn(async () => {
    return Promise.resolve();
  }),
  
  storeUser: jest.fn(async (user: any) => {
    return Promise.resolve();
  }),
  
  getUser: jest.fn(async () => {
    return Promise.resolve(null);
  }),
  
  removeUser: jest.fn(async () => {
    return Promise.resolve();
  }),
  
  clearAll: jest.fn(async () => {
    return Promise.resolve();
  }),
};

export default mockStorageService;