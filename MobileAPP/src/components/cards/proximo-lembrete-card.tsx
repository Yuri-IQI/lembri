import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lembrete } from '@/mocks/lembretes';

type ProximoLembreteCardProps = {
  lembrete: Lembrete;
  onVer: () => void;
};

export const ProximoLembreteCard = ({ lembrete, onVer }: ProximoLembreteCardProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundImage: `linear-gradient(-59.4deg, ${theme.accent} 18.9%, ${theme.surface} 114.5%)`,
        },
      ]}>
      <View style={styles.textos}>
        <ThemedText type="label">Próximo lembrete</ThemedText>
        <ThemedText type="display">{lembrete.horario}</ThemedText>
        <View>
          <ThemedText type="headline" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {lembrete.titulo}
          </ThemedText>
          <ThemedText style={styles.dia}>{lembrete.dia}</ThemedText>
        </View>
      </View>
      <Botao
        titulo="Ver"
        onPress={onVer}
        accessibilityLabel={`Ver lembrete ${lembrete.titulo}`}
        style={styles.ver}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: 12,
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.lg,
  },
  textos: {
    gap: Spacing.two,
  },
  dia: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 400,
  },
  ver: {
    alignSelf: 'flex-end',
    width: 196,
  },
});
