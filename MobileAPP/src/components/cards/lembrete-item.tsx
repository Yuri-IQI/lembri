import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import IconeLembrete from '@/assets/home/lembrete-icone.svg';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lembrete } from '@/mocks/lembretes';

type LembreteItemProps = {
  lembrete: Lembrete;
  onPress: () => void;
};

/** Item de lista de lembrete: ícone do sino, título, dia/horário/estado e seta. */
export const LembreteItem = ({ lembrete, onPress }: LembreteItemProps) => {
  const theme = useTheme();
  const estado = lembrete.concluido ? 'Feito' : 'Pendente';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${lembrete.titulo}, ${lembrete.dia} às ${lembrete.horario}, ${estado}`}
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
      ]}>
      <IconeLembrete width={56} height={56} />
      <View style={styles.textos}>
        <ThemedText type="subheading" numberOfLines={1}>
          {lembrete.titulo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          <ThemedText type="smallBold" themeColor="textSecondary">
            {lembrete.dia.toUpperCase()}
          </ThemedText>
          {` - ${lembrete.horario} · ${estado}`}
        </ThemedText>
      </View>
      <SymbolView name={{ android: 'chevron_right' }} size={32} tintColor={theme.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.lg,
  },
  textos: {
    flex: 1,
    padding: Spacing.two,
  },
});
