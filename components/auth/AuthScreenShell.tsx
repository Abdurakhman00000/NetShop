import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/ui/AppLogo';
import { Colors, FontSize, Spacing } from '@/constants/theme';

type AuthScreenShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

function AuthScreenShellComponent({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
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
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.body}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

export const AuthScreenShell = memo(AuthScreenShellComponent);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  title: {
    marginTop: Spacing.md,
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
    marginTop: 'auto',
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
});
