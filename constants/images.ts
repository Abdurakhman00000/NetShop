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

/** Top-level product category tiles, keyed by category slug from the API. */
export const CatalogCategoryImages: Record<string, ImageSource> = {
  'мебель': require('@/assets/images/catalog/cat-furniture.webp'),
  'освещение': require('@/assets/images/catalog/cat-lighting.webp'),
  'текстиль': require('@/assets/images/catalog/cat-textile.webp'),
  'посуда-и-кухня': require('@/assets/images/catalog/cat-kitchen.webp'),
  'декор': require('@/assets/images/catalog/cat-decor.webp'),
  'сантехника': require('@/assets/images/catalog/cat-plumbing.webp'),
  'инструменты': require('@/assets/images/catalog/cat-tools.webp'),
  'бытовая-техника': require('@/assets/images/catalog/cat-appliances.webp'),
  'стройматериалы': require('@/assets/images/catalog/cat-building.webp'),
  'хозтовары': require('@/assets/images/catalog/cat-household.webp'),
  'сад-и-двор': require('@/assets/images/catalog/cat-garden.webp'),
  'детская': require('@/assets/images/catalog/cat-kids.webp'),
};

/** Service category tiles, keyed by category slug from the API. */
export const ServiceCategoryImages: Record<string, ImageSource> = {
  'сантехника': require('@/assets/images/services/svc-plumbing.webp'),
  'электрика': require('@/assets/images/services/svc-electric.webp'),
  'уборка': require('@/assets/images/services/svc-cleaning.webp'),
  'ремонт-квартир': require('@/assets/images/services/svc-renovation.webp'),
  'сборка-мебели': require('@/assets/images/services/svc-assembly.webp'),
  'установка-техники': require('@/assets/images/services/svc-install.webp'),
  'ремонт-бытовой-техники': require('@/assets/images/services/svc-repair.webp'),
  'кондиционеры-и-вентиляция': require('@/assets/images/services/svc-aircon.webp'),
  'малярные-работы': require('@/assets/images/services/svc-painting.webp'),
  'плиточные-работы': require('@/assets/images/services/svc-tiling.webp'),
  'натяжные-потолки': require('@/assets/images/services/svc-ceiling.webp'),
  'окна-и-двери': require('@/assets/images/services/svc-windows.webp'),
  'грузчики-и-переезд': require('@/assets/images/services/svc-moving.webp'),
  'дизайн-интерьера': require('@/assets/images/services/svc-design.webp'),
  'другое': require('@/assets/images/services/svc-other.webp'),
};

export const WelcomeImages = {
  background: require('@/assets/images/welcome/welcome-bg.webp') as ImageSource,
  polaroid1: require('@/assets/images/welcome/polaroid-1.webp') as ImageSource,
  polaroid2: require('@/assets/images/welcome/polaroid-2.webp') as ImageSource,
  polaroid3: require('@/assets/images/welcome/polaroid-3.webp') as ImageSource,
} as const;
