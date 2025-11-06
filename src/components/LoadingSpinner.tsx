import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {COLORS, SIZES} from '../utils/constants';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({message}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: 16,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
});

export default LoadingSpinner;