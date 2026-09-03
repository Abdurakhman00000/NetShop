import type { ImageSource } from 'expo-image';

/**
 * Local mock assets. When API arrives, remote URLs replace these
 * while component props stay MediaSource-compatible.
 */
export const HomeImages = {
  hero: require('@/assets/images/home/hero-home.webp') as ImageSource,
  marketplace: require('@/assets/images/home/eco-marketplace.webp') as ImageSource,
  services: require('@/assets/images/home/eco-services.webp') as ImageSource,
  premium: require('@/assets/images/home/eco-premium.webp') as ImageSource,
  constructor: require('@/assets/images/home/eco-constructor.webp') as ImageSource,
  visualization: require('@/assets/images/home/eco-3d.webp') as ImageSource,
  living: require('@/assets/images/home/insp-living.webp') as ImageSource,
  dining: require('@/assets/images/home/insp-dining.webp') as ImageSource,
  office: require('@/assets/images/home/insp-office.webp') as ImageSource,
} as const;

export const WelcomeImages = {
  background: require('@/assets/images/welcome/welcome-bg.webp') as ImageSource,
  polaroid1: require('@/assets/images/welcome/polaroid-1.webp') as ImageSource,
  polaroid2: require('@/assets/images/welcome/polaroid-2.webp') as ImageSource,
  polaroid3: require('@/assets/images/welcome/polaroid-3.webp') as ImageSource,
} as const;
