import { Link, router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthButton, AuthScreenShell, AuthTextField } from '@/components/auth';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { clearAuthError, login } from '@/store/authSlice';
import { loadCart } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const REGISTER_HREF = '/(auth)/register' as Href;

function firstFieldError(
  fields: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fields?.[key]?.[0];
}

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, fieldErrors } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = useCallback(async () => {
    dispatch(clearAuthError());
    const result = await dispatch(
      login({ email: email.trim().toLowerCase(), password }),
    );
    if (login.fulfilled.match(result)) {
      void dispatch(loadCart());
      router.replace('/(tabs)/profile' as Href);
    }
  }, [dispatch, email, password]);

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
          title="Вход"
          subtitle="Войдите, чтобы сохранять избранное, оформлять заказы и оставлять заявки."
          footer={
            <Text style={styles.footerText}>
              Нет аккаунта?{' '}
              <Link href={REGISTER_HREF} style={styles.link}>
                Регистрация
              </Link>
            </Text>
          }
        >
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
            textContentType="password"
            autoComplete="password"
            error={firstFieldError(fieldErrors, 'password')}
          />

          {error && !fieldErrors.email && !fieldErrors.password ? (
            <Text style={styles.formError}>{error}</Text>
          ) : null}

          <AuthButton
            label="Войти"
            loading={loading}
            onPress={onSubmit}
            disabled={!email.trim() || password.length < 8}
          />

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Вход через Google появится после настройки OAuth на устройстве.
            </Text>
          </View>
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
  hint: {
    marginTop: Spacing.sm,
  },
  hintText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
