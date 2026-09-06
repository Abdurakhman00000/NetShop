import { Link, router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import { AuthButton, AuthScreenShell, AuthTextField } from '@/components/auth';
import { Colors, FontSize } from '@/constants/theme';
import { clearAuthError, register } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const LOGIN_HREF = '/(auth)/login' as Href;

function firstFieldError(
  fields: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fields?.[key]?.[0];
}

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, fieldErrors } = useAppSelector((s) => s.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = useCallback(async () => {
    dispatch(clearAuthError());
    const result = await dispatch(
      register({
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim() || undefined,
      }),
    );
    if (register.fulfilled.match(result)) {
      router.replace('/(tabs)/profile' as Href);
    }
  }, [dispatch, email, fullName, password]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <AuthScreenShell
          title="Регистрация"
          subtitle="Создайте аккаунт — токены придут сразу, отдельный вход не нужен."
          footer={
            <Text style={styles.footerText}>
              Уже есть аккаунт?{' '}
              <Link href={LOGIN_HREF} style={styles.link}>
                Войти
              </Link>
            </Text>
          }
        >
          <AuthTextField
            label="Имя"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Айбек"
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            error={firstFieldError(fieldErrors, 'full_name')}
          />
          <AuthTextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="user@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            error={firstFieldError(fieldErrors, 'email')}
          />
          <AuthTextField
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            placeholder="Минимум 8 символов"
            isPassword
            textContentType="newPassword"
            autoComplete="new-password"
            error={firstFieldError(fieldErrors, 'password')}
          />

          {error && !fieldErrors.email && !fieldErrors.password && !fieldErrors.full_name ? (
            <Text style={styles.formError}>{error}</Text>
          ) : null}

          <AuthButton
            label="Создать аккаунт"
            loading={loading}
            onPress={onSubmit}
            disabled={!email.trim() || password.length < 8}
          />
        </AuthScreenShell>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1 },
  formError: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  footerText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  link: {
    fontFamily: 'DMSans_700Bold',
    color: Colors.brand,
  },
});
