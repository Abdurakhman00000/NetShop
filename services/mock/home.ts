import { Brand } from '@/constants/brand';
import { HomeImages } from '@/constants/images';
import type { HomeFeed } from '@/types/home';

/**
 * Mock payload shaped like a future GET /home (or /feed) response body.
 * Swap this module for axios/RTK Query without changing screen components.
 */
export const mockHomeFeed: HomeFeed = {
  location: {
    city: 'Бишкек',
    cityId: 'bishkek',
  },
  user: {
    id: null,
    displayName: null,
    avatarUrl: null,
  },
  hero: {
    id: 'hero-home',
    title: 'Всё для вашего дома — в одном месте',
    subtitle: 'Покупайте, создавайте, ремонтируйте и воплощайте идеи',
    image: HomeImages.hero,
  },
  ecosystem: {
    title: `Экосистема ${Brand.name}`,
    directionsLabel: '5 направлений',
    items: [
      {
        id: 'marketplace',
        title: 'Всё для ремонта',
        description: 'Материалы, мебель и всё необходимое для дома',
        badge: 'МАРКЕТПЛЕЙС',
        icon: 'hammer',
        image: HomeImages.marketplace,
        overlayColor: 'rgba(139, 26, 42, 0.55)',
        size: 'featured',
        href: '/(tabs)/catalog',
      },
      {
        id: 'services',
        title: 'Услуги',
        description: 'Найдите специалиста для вашего проекта',
        badge: 'СПЕЦИАЛИСТЫ',
        icon: 'settings',
        image: HomeImages.services,
        overlayColor: 'rgba(15, 90, 100, 0.58)',
        size: 'grid',
        href: '/(tabs)/services',
      },
      {
        id: 'premium',
        title: 'Дизайнерские вещи',
        description: 'Уникальные предметы для интерьера',
        badge: 'ПРЕМИУМ',
        icon: 'sparkles',
        image: HomeImages.premium,
        overlayColor: 'rgba(92, 58, 36, 0.58)',
        size: 'grid',
        href: '/(tabs)/catalog',
      },
      {
        id: 'constructor',
        title: 'Конструктор',
        description: 'Спроектируйте своё пространство',
        badge: 'ИНСТРУМЕНТ',
        icon: 'hexagon',
        image: HomeImages.constructor,
        overlayColor: 'rgba(45, 55, 72, 0.6)',
        size: 'grid',
      },
      {
        id: 'visualization',
        title: '3D-Визуализация',
        description: 'Увидьте будущий интерьер до ремонта',
        badge: 'ТЕХНОЛОГИЯ',
        icon: 'diamond',
        image: HomeImages.visualization,
        overlayColor: 'rgba(76, 29, 120, 0.58)',
        size: 'grid',
      },
    ],
  },
  inspiration: {
    title: 'Вдохновение',
    seeAllLabel: 'Смотреть все',
    items: [
      {
        id: 'living',
        title: 'Гостиная',
        image: HomeImages.living,
      },
      {
        id: 'dining',
        title: 'Столовая',
        image: HomeImages.dining,
      },
      {
        id: 'office',
        title: 'Кабинет',
        image: HomeImages.office,
      },
    ],
  },
  projectCta: {
    title: 'Начать проект с нуля?',
    subtitle: 'Используйте Конструктор и 3D-Визуализацию',
    buttonLabel: 'Начать',
  },
};
