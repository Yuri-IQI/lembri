import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamily, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
  | 'default'
  | 'defaultBold'
  | 'display'
  | 'title'
  | 'headline'
  | 'subheading'
  | 'small'
  | 'smallBold'
  | 'label'
  | 'button'
  | 'link';
  themeColor?: ThemeColor;
};

export const ThemedText = ({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) => {
  const theme = useTheme();
  const color = theme[themeColor ?? (type === 'label' ? 'textSecondary' : 'text')];

  return <Text style={[{ color }, styles.base, styles[type], style]} {...rest} />;
};

// Escala do protótipo no Figma (lembri_proto).
const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily,
  },
  default: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 500,
  },
  defaultBold: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
  },
  display: {
    fontSize: 64,
    lineHeight: 76,
    fontWeight: 400,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700,
  },
  headline: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: 700,
  },
  subheading: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 700,
  },
  small: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 400,
  },
  smallBold: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 700,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700,
  },
  link: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
});
