import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;

export { colors, spacing, typography, borderRadius, shadows };

