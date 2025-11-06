import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {COLORS, SIZES, SPACING} from '../utils/constants';

interface CustomPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{label: string; value: string}>;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  value,
  onValueChange,
  items,
  error,
  touched,
  required,
}) => {
  const hasError = touched && error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.pickerContainer, hasError && styles.pickerError]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          accessible={true}
          accessibilityLabel={label}>
          <Picker.Item label="Select..." value="" />
          {items.map(item => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: COLORS.error,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginTop: SPACING.xs,
  },
});

export default CustomPicker;