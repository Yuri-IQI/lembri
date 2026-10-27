import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { BarFrame } from '@/components/app-bar/bar-frame';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TopBarProps = {
  onVoltar?: () => void;
  onAjuda?: () => void;
  onAudio?: () => void;
};

const ICONE = 32;

export const TopBar = ({ onVoltar, onAjuda, onAudio }: TopBarProps) => {
  const theme = useTheme();
  const acoes = [
    onAjuda && { icone: 'help' as const, rotulo: 'Ajuda', onPress: onAjuda },
    onAudio && { icone: 'mic' as const, rotulo: 'Áudio', onPress: onAudio },
  ].filter((acao) => !!acao);

  return (
    <BarFrame posicao="top" style={styles.barra}>
      {onVoltar ? (
        <Pressable
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={Spacing.two}>
          <SymbolView name={{ android: 'arrow_back' }} size={ICONE} tintColor={theme.text} />
        </Pressable>
      ) : (
        <View />
      )}

      <View style={styles.acoes}>
        {acoes.map((acao) => (
          <Pressable
            key={acao.rotulo}
            onPress={acao.onPress}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botao,
              { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
            ]}>
            <View style={[styles.circulo, { borderColor: theme.text }]}>
              <SymbolView name={{ android: acao.icone }} size={20} tintColor={theme.text} />
            </View>
            <ThemedText>{acao.rotulo}</ThemedText>
          </Pressable>
        ))}
      </View>
    </BarFrame>
  );
};

const styles = StyleSheet.create({
  barra: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  acoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderWidth: 1,
    borderRadius: 18,
  },
  circulo: {
    width: ICONE,
    height: ICONE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: ICONE / 2,
  },
});
