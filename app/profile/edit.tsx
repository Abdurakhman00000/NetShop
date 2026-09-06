import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton, AuthTextField } from '@/components/auth';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { clearAuthError, updateProfile } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const LOGIN_HREF = '/(auth)/login' as Href;

function firstFieldError(
  fields: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fields?.[key]?.[0];
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user, loading, error, fieldErrors, status } = useAppSelector((s) => s.auth);

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace(LOGIN_HREF);
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  const onSave = useCallback(async () => {
    dispatch(clearAuthError());
    const result = await dispatch(
      updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
      }),
    );
    if (updateProfile.fulfilled.match(result)) {
      router.back();
    }
  }, [dispatch, fullName, phone]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Редактировать профиль</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.hint}>
          Можно изменить имя и телефон. E-mail меняется отдельным флоу и пока недоступен.
        </Text>

        <AuthTextField
          label="Имя"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Анна Смирнова"
          autoCapitalize="words"
          textContentType="name"
          error={firstFieldError(fieldErrors, 'full_name')}
        />
        <AuthTextField
          label="Телефон"
          value={phone}
          onChangeText={setPhone}
          placeholder="+996700123456"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          error={firstFieldError(fieldErrors, 'phone')}
        />

        <View style={styles.readonly}>
          <Text style={styles.readonlyLabel}>E-mail</Text>
          <Text style={styles.readonlyValue}>{user?.email ?? '—'}</Text>
        </View>

        {error && !fieldErrors.full_name && !fieldErrors.phone ? (
          <Text style={styles.formError}>{error}</Text>
        ) : null}

        <AuthButton label="Сохранить" loading={loading} onPress={onSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  topSpacer: { width: 24 },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  hint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  readonly: {
    gap: Spacing.xs,
  },
  readonlyLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  readonlyValue: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textMuted,
    paddingVertical: Spacing.md,
  },
  formError: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.error,
  },
});
