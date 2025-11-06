import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import {logoutUser} from '../redux/slices/authSlices';
import CustomButton from '../components/CustomButton';
import {COLORS, SPACING} from '../utils/constants';

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (!user) {
    return null;
  }

  const userFields = [
    {label: 'User ID', value: user.id},
    {label: 'Name', value: `${user.firstName} ${user.lastName}`},
    {label: 'Email', value: user.email},
    {label: 'Phone', value: user.phone},
    {label: 'Country', value: user.country},
    {label: 'Date of Birth', value: user.dateOfBirth},
    {label: 'Gender', value: user.gender},
    {label: 'Address', value: user.address},
    {label: 'City', value: user.city},
    {label: 'Postal Code', value: user.postalCode},
    {
      label: 'Account Created',
      value: new Date(user.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Welcome back, {user.firstName}!</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Text>
            </View>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {userFields.map((field, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{field.label}:</Text>
                <Text style={styles.infoValue}>{field.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.jsonSection}>
            <Text style={styles.sectionTitle}>User Data (JSON)</Text>
            <View style={styles.jsonContainer}>
              <ScrollView horizontal>
                <Text style={styles.jsonText}>
                  {JSON.stringify(user, null, 2)}
                </Text>
              </ScrollView>
            </View>
            <Text style={styles.jsonHint}>
              This data is auto-generated and stored locally
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton title="Logout" onPress={handleLogout} variant="outline" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: 12,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.lg,
  },
  infoSection: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    width: '40%',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  jsonSection: {
    marginTop: SPACING.md,
  },
  jsonContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    maxHeight: 200,
  },
  jsonText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: COLORS.text,
  },
  jsonHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default HomeScreen;