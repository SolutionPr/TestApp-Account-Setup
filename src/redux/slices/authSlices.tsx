import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, Credentials, RegistrationFormData } from '../../types';
import authService from '../../services/authService';
import storageService from '../../services/storageService';
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from '../../utils/constants';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionToken: null,
  isLoading: false,
  error: null,
  failedAttempts: 0,
  isLocked: false,
  lockoutEndTime: null,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: RegistrationFormData, { rejectWithValue }) => {
    try {
      // Remove agreeToTerms and confirmPassword before calling the service
      const { agreeToTerms, confirmPassword, ...cleaned } = formData;
      const result = await authService.register(cleaned);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials);
      if (!result.token) throw new Error( 'Login failed');
      await storageService.storeFailedAttempts(0);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const verifySession = createAsyncThunk(
  'auth/verifySession',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.verifySession();
      if (!result) return rejectWithValue('No valid session found');
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Session verification failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const checkLockoutStatus = createAsyncThunk('auth/checkLockout', async () => {
  const attempts = await storageService.getFailedAttempts();
  const lockoutTime = await storageService.getLockoutTime();
  return { attempts, lockoutTime };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    incrementFailedAttempts: state => {
      state.failedAttempts += 1;
      if (state.failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        state.isLocked = true;
        state.lockoutEndTime = Date.now() + LOCKOUT_DURATION;
        storageService.storeLockoutTime(state.lockoutEndTime);
      }
      storageService.storeFailedAttempts(state.failedAttempts);
    },
    clearError: state => {
      state.error = null;
    },
    unlockAccount: state => {
      state.isLocked = false;
      state.lockoutEndTime = null;
      state.failedAttempts = 0;
      storageService.storeFailedAttempts(0);
      storageService.storeLockoutTime(0);
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.sessionToken = action.payload.token;
        state.failedAttempts = 0;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify Session
      .addCase(verifySession.pending, state => {
        state.isLoading = true;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.sessionToken = action.payload.token;
      })
      .addCase(verifySession.rejected, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, () => ({ ...initialState }))
      // Check Lockout
      .addCase(checkLockoutStatus.fulfilled, (state, action) => {
        const { attempts, lockoutTime } = action.payload;
        state.failedAttempts = attempts;
        if (lockoutTime && Date.now() < lockoutTime) {
          state.isLocked = true;
          state.lockoutEndTime = lockoutTime;
        } else {
          state.isLocked = false;
          state.lockoutEndTime = null;
        }
      });
  },
});

export const { incrementFailedAttempts, clearError, unlockAccount } = authSlice.actions;
export default authSlice.reducer;
