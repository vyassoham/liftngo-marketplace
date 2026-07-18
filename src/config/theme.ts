/**
 * Design tokens: single source of truth for colors, sizes, radii, shadows.
 * Use these constants instead of hardcoded values.
 *
 * Usage:
 * - Inline styles: import { theme } from '@/config/theme'; style={{ color: theme.colors.primary }}
 * - Tailwind/CSS: globals.css :root defines the same values as CSS variables; keep in sync.
 */

export const colors = {
  // Brand
  primary: '#1E1F3D', // Darker, more corporate navy
  primaryHover: '#16172D',
  primaryLight: '#2C2D5B',
  accent: '#D95C20', // Less saturated orange
  accentLight: '#FFF4ED',
  accentHover: '#B94B18',
  /** LiftnGo landing accent — sync with --landing-primary in globals.css */
  landingPrimary: '#2C2D5B',
  whatsappGreen: '#25D366',

  // Neutrals
  white: '#FFFFFF',
  black: '#111827',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2',

  // UI
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  surface: '#F9FAFB',
  surfaceMuted: '#FAFAFA',
  primaryTint: '#ECECF4',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
} as const;

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.8125rem',  // 13px
  base: '0.875rem', // 14px
  md: '0.9375rem',  // 15px
  lg: '1rem',       // 16px
  xl: '1.125rem',   // 18px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  '4xl': '2rem',    // 32px
} as const;

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
  /** Alias for common card/input use. */
  standard: '6px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
  elevated: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03)',
  overlay: '0 8px 16px rgba(0, 0, 0, 0.08), 0 20px 40px rgba(0, 0, 0, 0.06)',
} as const;

export const spacing = {
  sectionY: '3.5rem',       // py-14
  sectionYSm: '5rem',       // sm:py-20
  sectionYLg: '6rem',       // lg:py-24
  cardPadding: '1.25rem',   // p-5
  cardPaddingSm: '1.5rem',  // sm:p-6
} as const;

/** For inline styles: theme.colors.primary, theme.fontSizes.md, theme.radius.standard */
export const theme = {
  colors,
  fontSizes,
  radius,
  shadows,
  spacing,
} as const;

export default theme;
