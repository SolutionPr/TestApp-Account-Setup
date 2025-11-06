import {
  validatePasswordStrength,
  getPasswordStrengthScore,
  getPasswordStrengthLabel,
} from '../src/utils/validation';

describe('Password Validation', () => {
  describe('validatePasswordStrength', () => {
    it('should return false for weak passwords', () => {
      expect(validatePasswordStrength('12345')).toBe(false);
      expect(validatePasswordStrength('password')).toBe(false);
      expect(validatePasswordStrength('Password')).toBe(false);
      expect(validatePasswordStrength('Password1')).toBe(false);
    });

    it('should return true for strong passwords', () => {
      expect(validatePasswordStrength('Password1!')).toBe(true);
      expect(validatePasswordStrength('MyP@ssw0rd')).toBe(true);
      expect(validatePasswordStrength('Str0ng!Pass')).toBe(true);
    });

    it('should require minimum 8 characters', () => {
      expect(validatePasswordStrength('Pass1!')).toBe(false);
      expect(validatePasswordStrength('Password1!')).toBe(true);
    });

    it('should require at least one lowercase letter', () => {
      expect(validatePasswordStrength('PASSWORD1!')).toBe(false);
      expect(validatePasswordStrength('Password1!')).toBe(true);
    });

    it('should require at least one uppercase letter', () => {
      expect(validatePasswordStrength('password1!')).toBe(false);
      expect(validatePasswordStrength('Password1!')).toBe(true);
    });

    it('should require at least one number', () => {
      expect(validatePasswordStrength('Password!')).toBe(false);
      expect(validatePasswordStrength('Password1!')).toBe(true);
    });

    it('should require at least one special character', () => {
      expect(validatePasswordStrength('Password1')).toBe(false);
      expect(validatePasswordStrength('Password1!')).toBe(true);
    });
  });

  describe('getPasswordStrengthScore', () => {
    it('should return 0-1 for very weak passwords', () => {
      expect(getPasswordStrengthScore('pass')).toBeLessThanOrEqual(1);
      expect(getPasswordStrengthScore('12345')).toBeLessThanOrEqual(1);
    });

    it('should return 2 for weak passwords', () => {
      expect(getPasswordStrengthScore('password')).toBe(2);
    });

    it('should return 3 for fair passwords', () => {
      expect(getPasswordStrengthScore('Password')).toBe(3);
    });

    it('should return 4 for good passwords', () => {
      expect(getPasswordStrengthScore('Password1')).toBe(4);
    });

    it('should return 5 for strong passwords', () => {
      expect(getPasswordStrengthScore('Password1!')).toBe(5);
      expect(getPasswordStrengthScore('MyStr0ng!Password')).toBe(5);
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return correct labels for scores', () => {
      expect(getPasswordStrengthLabel(0)).toBe('Very Weak');
      expect(getPasswordStrengthLabel(1)).toBe('Very Weak');
      expect(getPasswordStrengthLabel(2)).toBe('Weak');
      expect(getPasswordStrengthLabel(3)).toBe('Fair');
      expect(getPasswordStrengthLabel(4)).toBe('Good');
      expect(getPasswordStrengthLabel(5)).toBe('Strong');
    });
  });
});

describe('Form Validation Schemas', () => {
  it('should validate email format', async () => {
    const {registrationValidationSchema} = require('../src/utils/validation');
    
    await expect(
      registrationValidationSchema.validateAt('email', {
        email: 'invalid-email',
      }),
    ).rejects.toThrow();

    await expect(
      registrationValidationSchema.validateAt('email', {
        email: 'valid@email.com',
      }),
    ).resolves.toBe('valid@email.com');
  });

  it('should validate phone number format', async () => {
    const {registrationValidationSchema} = require('../src/utils/validation');
    
    await expect(
      registrationValidationSchema.validateAt('phone', {
        phone: '123',
      }),
    ).rejects.toThrow();

    await expect(
      registrationValidationSchema.validateAt('phone', {
        phone: '1234567890',
      }),
    ).resolves.toBeTruthy();
  });

  it('should validate password confirmation match', async () => {
    const {registrationValidationSchema} = require('../src/utils/validation');
    
    await expect(
      registrationValidationSchema.validate({
        password: 'Password1!',
        confirmPassword: 'DifferentPass1!',
      }),
    ).rejects.toThrow();
  });
});