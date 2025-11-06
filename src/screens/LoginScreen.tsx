import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import {RootState, AppDispatch} from '../redux/store';
import {
  loginUser,
  incrementFailedAttempts,
  checkLockoutStatus,
  unlockAccount,
  clearError,
} from '../redux/slices/authSlices';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {loginValidationSchema} from '../utils/validation';
import {COLORS, SPACING, MAX_LOGIN_ATTEMPTS} from '../utils/constants';
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoading,
    error,
    failedAttempts,
    isLocked,
    lockoutEndTime,
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkLockoutStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const remainingTime = lockoutEndTime - Date.now();
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          dispatch(unlockAccount());
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        dispatch(unlockAccount());
      }
    }
  }, [isLocked, lockoutEndTime, dispatch]);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const handleSubmit = async (values: LoginFormValues) => {
    if (isLocked) {
      const remainingTime = lockoutEndTime
        ? Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)
        : 0;
      Alert.alert(
        'Account Locked',
        `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
      );
      return;
    }

    try {
      await dispatch(loginUser(values)).unwrap();
      dispatch(clearError());
    } catch (err) {
      dispatch(incrementFailedAttempts());
      const attemptsLeft = MAX_LOGIN_ATTEMPTS - (failedAttempts + 1);
      if (attemptsLeft > 0) {
        Alert.alert(
          'Login Failed',
          `Invalid credentials. ${attemptsLeft} attempts remaining.`,
        );
      } else {
        Alert.alert(
          'Account Locked',
          'Too many failed attempts. Your account is locked for 15 minutes.',
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {isLocked && (
          <View style={styles.lockoutBanner}>
            <Text style={styles.lockoutText}>
              Account locked due to multiple failed attempts
            </Text>
          </View>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <View style={styles.formContainer}>
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
                editable={!isLocked}
              />

              <CustomInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                touched={touched.password}
                required
                placeholder="Enter your password"
                secureTextEntry
                showPasswordToggle
                autoCapitalize="none"
                editable={!isLocked}
              />

              <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    setFieldValue('rememberMe', !values.rememberMe)
                  }
                  accessible={true}
                  accessibilityLabel="Remember me"
                  accessibilityRole="checkbox"
                  accessibilityState={{checked: values.rememberMe}}
                  disabled={isLocked}>
                  <View
                    style={[
                      styles.checkboxBox,
                      values.rememberMe && styles.checkboxChecked,
                    ]}>
                    {values.rememberMe && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <CustomButton
                title={isLocked ? 'Account Locked' : 'Login'}
                onPress={handleSubmit}
                loading={isLoading}
                disabled={!isValid || isLoading || isLocked}
              />

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.registerLinkText}>
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
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
  lockoutBanner: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  lockoutText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
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
  rememberMeContainer: {
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
  rememberMeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  registerLink: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  registerLinkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;