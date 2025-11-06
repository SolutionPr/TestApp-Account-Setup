import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import {RootState, AppDispatch} from '../redux/store';
import { registerUser } from '../redux/slices/authSlices';
import {
  loadRegistrationDraft,
  saveRegistrationDraft,
  resetRegistration,
} from '../redux/slices/registrationSlice';
import CustomInput from '../components/CustomInput';
import CustomPicker from '../components/CustomPicker';
import CustomButton from '../components/CustomButton';
import {registrationValidationSchema} from '../utils/validation';
import {COLORS, SPACING} from '../utils/constants';
import {RegistrationFormData} from '../types';
import countriesData from '../data/countries.json';

const RegistrationScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {formData} = useSelector((state: RootState) => state.registration);
  const {isLoading} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadRegistrationDraft());
  }, [dispatch]);

  const initialValues: RegistrationFormData = {
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    email: formData.email || '',
    phone: formData.phone || '',
    password: '',
    confirmPassword: '',
    country: formData.country || '',
    dateOfBirth: formData.dateOfBirth || '',
    gender: formData.gender || '',
    address: formData.address || '',
    city: formData.city || '',
    postalCode: formData.postalCode || '',
    agreeToTerms: false,
  };

  const handleSubmit = async (values: RegistrationFormData) => {
    try {
      const result = await dispatch(registerUser(values)).unwrap();
      dispatch(resetRegistration());
      Alert.alert(
        'Success!',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error || 'Please try again.',
        [{text: 'OK'}],
      );
    }
  };

  const handleDraftSave = (values: Partial<RegistrationFormData>) => {
    dispatch(saveRegistrationDraft(values));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Please fill in the form to register
          </Text>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isValid,
          }) => {
            // Auto-save draft
            React.useEffect(() => {
              const timer = setTimeout(() => {
                handleDraftSave(values);
              }, 1000);
              return () => clearTimeout(timer);
            }, [values]);

            return (
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <CustomInput
                  label="First Name"
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  error={errors.firstName}
                  touched={touched.firstName}
                  required
                  placeholder="Enter your first name"
                  autoCapitalize="words"
                />

                <CustomInput
                  label="Last Name"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  error={errors.lastName}
                  touched={touched.lastName}
                  required
                  placeholder="Enter your last name"
                  autoCapitalize="words"
                />

                <CustomPicker
                  label="Gender"
                  value={values.gender}
                  onValueChange={value => setFieldValue('gender', value)}
                  items={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                    {label: 'Other', value: 'other'},
                  ]}
                  error={errors.gender}
                  touched={touched.gender}
                  required
                />

                <CustomInput
                  label="Date of Birth"
                  value={values.dateOfBirth}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  error={errors.dateOfBirth}
                  touched={touched.dateOfBirth}
                  required
                  placeholder="YYYY-MM-DD"
                  keyboardType="numeric"
                />

                <Text style={styles.sectionTitle}>Contact Information</Text>

                <CustomInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  required
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <CustomInput
                  label="Phone Number"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={errors.phone}
                  touched={touched.phone}
                  required
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />

                <CustomPicker
                  label="Country"
                  value={values.country}
                  onValueChange={value => setFieldValue('country', value)}
                  items={countriesData.map((c:any) => ({
                    label: c.name,
                    value: c.code,
                  }))}
                  error={errors.country}
                  touched={touched.country}
                  required
                />

                <Text style={styles.sectionTitle}>Address</Text>

                <CustomInput
                  label="Street Address"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  error={errors.address}
                  touched={touched.address}
                  required
                  placeholder="Enter your street address"
                  multiline
                  numberOfLines={2}
                />

                <CustomInput
                  label="City"
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  error={errors.city}
                  touched={touched.city}
                  required
                  placeholder="Enter your city"
                />

                <CustomInput
                  label="Postal Code"
                  value={values.postalCode}
                  onChangeText={handleChange('postalCode')}
                  onBlur={handleBlur('postalCode')}
                  error={errors.postalCode}
                  touched={touched.postalCode}
                  required
                  placeholder="Enter postal code"
                  keyboardType="numeric"
                />

                <Text style={styles.sectionTitle}>Security</Text>

                <CustomInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  required
                  placeholder="Create a password"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                />

                <CustomInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  required
                  placeholder="Confirm your password"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                />

                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() =>
                      setFieldValue('agreeToTerms', !values.agreeToTerms)
                    }
                    accessible={true}
                    accessibilityLabel="Agree to terms and conditions"
                    accessibilityRole="checkbox"
                    accessibilityState={{checked: values.agreeToTerms}}>
                    <View
                      style={[
                        styles.checkboxBox,
                        values.agreeToTerms && styles.checkboxChecked,
                      ]}>
                      {values.agreeToTerms && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.termsText}>
                      I agree to the Terms and Conditions
                    </Text>
                  </TouchableOpacity>
                  {touched.agreeToTerms && errors.agreeToTerms && (
                    <Text style={styles.errorText}>{errors.agreeToTerms}</Text>
                  )}
                </View>

                <CustomButton
                  title="Register"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={!isValid || isLoading}
                />

                <TouchableOpacity
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLinkText}>
                    Already have an account? Login
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  termsContainer: {
    marginVertical: SPACING.md,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
    marginLeft: 32,
  },
  loginLink: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  loginLinkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegistrationScreen;