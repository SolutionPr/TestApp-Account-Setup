import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import {COLORS, SIZES, SPACING} from '../utils/constants';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  touched,
  icon,
  showPasswordToggle,
  required,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasError = touched && error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputContainer, hasError && styles.inputError]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          accessible={true}
          accessibilityLabel={label}
          accessibilityHint={error || undefined}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.toggleButton}
            accessible={true}
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }>
            <Text style={styles.toggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    minHeight: 50,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  iconContainer: {
    paddingLeft: SPACING.md,
  },
  toggleButton: {
    paddingHorizontal: SPACING.md,
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginTop: SPACING.xs,
  },
});

export default CustomInput;