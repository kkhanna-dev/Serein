export const theme = {
  colors: {
    primary:       '#4A90A4', // calming teal
    primaryLight:  '#7BBCCF',
    primaryDark:   '#2E6B7E',
    secondary:     '#D4956A', // warm terracotta (nod to India)
    background:    '#F7F4EF', // warm cream
    surface:       '#FFFFFF',
    text:          '#2D3436',
    textSecondary: '#636E72',
    textLight:     '#B2BEC3',
    border:        '#E4E0D9',
    error:         '#C0392B',
    success:       '#27AE60',
    warning:       '#F39C12',
    // Mood scale — matches backend 1–5
    mood: {
      1: '#E74C3C', // Very Low
      2: '#E67E22', // Low
      3: '#F1C40F', // Neutral
      4: '#2ECC71', // Good
      5: '#27AE60', // Great
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
    sm:   8,
    md:   12,
    lg:   16,
    xl:   24,
    full: 9999,
  },

  typography: {
    h1:      { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
    h2:      { fontSize: 22, fontWeight: '700' as const },
    h3:      { fontSize: 18, fontWeight: '600' as const },
    body:    { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    small:   { fontSize: 12, fontWeight: '400' as const },
  },

  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
