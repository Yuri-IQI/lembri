import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BotaoProps = Omit<PressableProps, 'style' | 'children'> & {
  titulo: string;
  style?: StyleProp<ViewStyle>;
};

/** Botão primário preto do protótipo ("Ver", "SALVAR", "COMEÇAR"). */
export const Botao = ({ titulo, style, ...rest }: BotaoProps) => {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
        style,
      ]}
      {...rest}>
      <ThemedText type="button" themeColor="onPrimary">
        {titulo}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  botao: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
});
