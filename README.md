# TestApp - Account Setup Mobile Application

A React Native mobile application replicating the account setup experience with secure local authentication, form validation, and persistent state management.

## About

A React Native app with user registration, login, and profile screens. Everything runs locally - no backend needed. Features secure storage, form validation, and session management.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or Yarn
- React Native development environment set up
- For iOS: Xcode, CocoaPods
- For Android: Android Studio, JDK 17

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide.

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd TestApp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Install iOS dependencies (iOS only)**
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### Running the Application

#### Start Metro Bundler
```bash
npm start
# or
yarn start
```

#### Run on Android
```bash
npm run android
# or
yarn android
```

#### Run on iOS
```bash
npm run ios
# or
yarn ios
```

### Testing

Run all tests:
```bash
npm test
# or
yarn test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

### Linting

Check code quality:
```bash
npm run lint
# or
yarn lint
```

Fix linting issues:
```bash
npm run lint -- --fix
```

## Architecture & Project Structure

### Design Patterns & State Management

- **Component Architecture**: Functional components with React Hooks
- **State Management**: React Context API for auth state, local component state for forms
- **Form Handling**: React Hook Form with Yup validation schemas
- **Navigation**: React Navigation v6 with stack navigator
- **Storage**: Encrypted storage using `react-native-encrypted-storage` for sensitive data

## Security Approach

### Credential Storage

- **Library**: `react-native-encrypted-storage`
- **Encryption**: Hardware-backed encryption
  - iOS: Keychain Services with kSecAttrAccessibleAfterFirstUnlock
  - Android: EncryptedSharedPreferences with AES-256-GCM encryption
- **No plaintext storage**: All sensitive data encrypted at rest

### Password Security

- Passwords hashed before storage (simulated in local environment)
- Password strength validation enforced
- Confirm password matching required
- No password visible by default (toggleable)

### Session Management

- Session tokens generated on successful login
- Tokens stored securely in encrypted storage
- Auto-login on app restart if valid session exists
- Complete session clearing on logout
- Token expiration handling (future enhancement)

### Additional Security Features

- **Failed Login Lockout**: Optional 5-attempt limit (configurable)

## State Persistence

### Registration Draft Saving

- Form state automatically saved to secure storage
- Survives app restarts and crashes
- Restored on return to registration screen
- Cleared after successful registration

### Session Persistence

- User authentication state persists across app restarts
- Automatic login if valid session exists
- Secure token validation
- Graceful fallback to login if session invalid

### Data Storage Strategy

```typescript
SecureStorage {
  'user_credentials': encrypted_credentials,
  'session_token': encrypted_token,
  'user_data': encrypted_user_profile,
  'registration_draft': encrypted_form_state
}
```

## Testing Coverage

### Unit Tests

- **Auth Service** (7 tests)
  - User registration flow
  - Duplicate email detection
  - Login validation
  - Password verification
  - Case-insensitive email matching

- **Validation Utils** (17 tests)
  - Password strength scoring (5 levels)
  - Email format validation
  - Phone number validation
  - Password confirmation matching
  - All validation rules covered

### Test Strategy

- Jest + React Native Testing Library
- Mock secure storage service
- Isolated unit tests for business logic
- Type-safe test implementations
- 100% coverage for validation and auth logic

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch        # Watch mode
```
## License

This project is created for assessment purposes.

## Development Notes

- All form data is local-only
- No actual network calls made
- Country data sourced from local JSON file
- CAPTCHA intentionally skipped as per requirements
- Focus on security, validation, and user experience

## Contributing

This is an assessment project. For any questions or clarifications, please reach out to the development team.

---

**Built with using React Native & TypeScript**