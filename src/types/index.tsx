export interface User {
  phoneNumber: any;
  id: any;
  firstName: string;
  lastName: string;
  email: string;
  phone: any;
  country: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;
  error: string | null;
  failedAttempts: number;
  isLocked: boolean;
  lockoutEndTime: number | null;
}

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  dateOfBirth: string;
  gender : string;  
  address: string;
  city: string;
  postalCode: string;
  agreeToTerms: boolean;
}

export interface RegistrationState {
  formData: Partial<RegistrationFormData>;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

export interface Country {
  name: string;
  code: string;
  dialCode: string;
}

export interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (data: RegistrationFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}
export interface RegistrationContextType {
  registrationState: RegistrationState;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  submitRegistration: () => Promise<boolean>;
}