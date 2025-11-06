import * as Yup from 'yup';

export const passwordStrengthRegex = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const validatePasswordStrength = (password: string): boolean => {
  return (
    password.length >= 8 &&
    passwordStrengthRegex.lowercase.test(password) &&
    passwordStrengthRegex.uppercase.test(password) &&
    passwordStrengthRegex.number.test(password) &&
    passwordStrengthRegex.special.test(password)
  );
};

export const getPasswordStrengthScore = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (passwordStrengthRegex.lowercase.test(password)) score++;
  if (passwordStrengthRegex.uppercase.test(password)) score++;
  if (passwordStrengthRegex.number.test(password)) score++;
  if (passwordStrengthRegex.special.test(password)) score++;
  return Math.min(score, 5);
};

export const getPasswordStrengthLabel = (score: number): string => {
  if (score <= 1) return 'Very Weak';
  if (score === 2) return 'Weak';
  if (score === 3) return 'Fair';
  if (score === 4) return 'Good';
  return 'Strong';
};

export const registrationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase()
    .trim(),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^[\d\s\-\+\(\)]+$/,
      'Please enter a valid phone number',
    )
    .min(10, 'Phone number must be at least 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('password-strength', 'Password is too weak', ((value:any) => {
      return value ? validatePasswordStrength(value) : false;
    })),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  country: Yup.string().required('Please select your country'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'You must be at least 18 years old', ((value:any) => {
      if (!value) return false;
      const age = new Date().getFullYear() - value.getFullYear();
      return age >= 18;
    })),
  gender: Yup.string().required('Please select your gender'),
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(/^[0-9]{5,10}$/, 'Please enter a valid postal code'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});