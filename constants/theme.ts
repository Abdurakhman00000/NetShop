/**
 * Design tokens for NetShopDev.
 * Keep UI styles token-driven so screens stay consistent and easy to theme later.
 */

export const Colors = {
  brand: '#8B1A2A',
  brandDark: '#6E1420',
  brandSoft: '#F8EBEE',
  brandMuted: 'rgba(139, 26, 42, 0.12)',

  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#9A9A9A',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.85)',

  background: '#FFFFFF',
  surface: '#F3F3F5',
  surfaceElevated: '#FFFFFF',
  border: '#E8E8EC',

  overlayDark: 'rgba(0,0,0,0.35)',
  overlayStrong: 'rgba(0,0,0,0.55)',

  tabInactive: '#9A9A9A',
  avatarBg: '#EDE7F6',
  avatarIcon: '#7E57C2',

  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  hero: 34,
  display: 40,
} as const;

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const Layout = {
  screenPadding: Spacing.lg,
  sectionGap: Spacing.xxl,
  cardGap: Spacing.md,
} as const;
