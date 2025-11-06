import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RegistrationState, RegistrationFormData } from '../../types';
import authService from '../../services/authService';
import storageService from '../../services/storageService';

const initialState: RegistrationState = {
  formData: {},
  currentStep: 0,
  isSubmitting: false,
  error: null,
};

// 🔹 Load Draft
export const loadRegistrationDraft = createAsyncThunk('registration/loadDraft', async () => {
  const draft = await storageService.getRegistrationDraft();
  return draft || {};
});

// 🔹 Save Draft
export const saveRegistrationDraft = createAsyncThunk('registration/saveDraft', async (formData: any) => {
  await storageService.storeRegistrationDraft(formData);
  return formData;
});

// 🔹 Submit Registration
export const submitRegistration = createAsyncThunk(
  'registration/submit',
  async (formData: RegistrationFormData, { rejectWithValue }) => {
    try {
      const result = await authService.register(formData);
      if (!result.token) throw new Error('Registration failed');
      await storageService.clearRegistrationDraft();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<RegistrationFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    resetRegistration: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(loadRegistrationDraft.fulfilled, (state, action) => {
        state.formData = action.payload;
      })
      .addCase(saveRegistrationDraft.fulfilled, (state, action) => {
        state.formData = action.payload;
      })
      .addCase(submitRegistration.pending, state => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitRegistration.fulfilled, state => {
        state.isSubmitting = false;
        state.formData = {};
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFormData, setCurrentStep, resetRegistration } = registrationSlice.actions;
export default registrationSlice.reducer;
