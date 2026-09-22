import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, type ReactNode } from 'react';
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

import { AppLogo } from '@/components/ui/AppLogo';
import { Colors, FontSize, Spacing } from '@/constants/theme';

type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

function AuthScreenShellComponent({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenShellProps) {
  const insets = useSafeAreaInsets();
  const keyboardOffset = Platform.OS === 'ios' ? insets.top + 8 : 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.md,
            paddingBottom: insets.bottom + Spacing.xxl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          hitSlop={12}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>

        <View style={styles.header}>
          <AppLogo size="sm" />
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        <View style={styles.body}>{children}</View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const AuthScreenShell = memo(AuthScreenShellComponent);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  title: {
    marginTop: Spacing.sm,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  body: {
    gap: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
});
