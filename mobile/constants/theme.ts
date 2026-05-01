export const theme = {
  colors: {
    primary:        '#4A90A4', // calming teal
    primaryLight:   '#7BBCCF',
    primaryDark:    '#2E6B7E',
    primarySoft:    '#E8F4F8', // very light teal tint for backgrounds
    secondary:      '#D4956A', // warm terracotta (nod to India)
    secondaryLight: '#FAE8DC', // light terracotta for accents
    background:     '#F7F4EF', // warm cream
    surface:        '#FFFFFF',
    surfaceAlt:     '#F2EFE9', // slightly tinted surface for nested cards
    text:           '#1E2A2E',
    textSecondary:  '#5A6870',
    textLight:      '#A8B5BB',
    border:         '#E4E0D9',
    error:          '#C0392B',
    errorLight:     '#FDECEA',
    success:        '#27AE60',
    warning:        '#E07B39',
    gold:           '#C9963A', // warm gold for streaks / achievements
    // Mood scale — matches backend 1–5
    mood: {
      1: '#E05555', // Very Low  — deep red
      2: '#E07B39', // Low       — amber-orange
      3: '#D4A017', // Okay      — warm gold
      4: '#3BAD6E', // Good      — green
      5: '#1E9B5A', // Great     — deep green
    } as Record<number, string>,
  },

  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },

  borderRadius: {
    xs:   6,
    sm:   8,
    md:   12,
    lg:   16,
    xl:   24,
    xxl:  32,
    full: 9999,
  },

  typography: {
    h1:      { fontSize: 30, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 36 },
    h2:      { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 28 },
    h3:      { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body:    { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    small:   { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  },

  shadows: {
    small: {
      shadowColor: '#2D3436',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 2,
    },
    medium: {
      shadowColor: '#2D3436',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.10,
      shadowRadius: 10,
      elevation: 5,
    },
    large: {
      shadowColor: '#2D3436',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 18,
      elevation: 10,
    },
    colored: {
      shadowColor: '#4A90A4',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
