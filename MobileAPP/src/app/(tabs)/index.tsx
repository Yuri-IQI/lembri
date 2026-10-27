import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LembreteItem } from '@/components/cards/lembrete-item';
import { ProximoLembreteCard } from '@/components/cards/proximo-lembrete-card';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { LEMBRETES } from '@/mocks/lembretes';

// Enquanto a tela de detalhe não existe, os lembretes abrem a aba Lembretes.
const abrirLembrete = () => router.navigate('/lembretes');

const HomeScreen = () => {
  const proximo = LEMBRETES.find((lembrete) => !lembrete.concluido);
  const deHoje = LEMBRETES.filter((lembrete) => lembrete.dia === 'Hoje');

  return (
    <MainContainer rolagem>
      {proximo && <ProximoLembreteCard lembrete={proximo} onVer={abrirLembrete} />}

      <View style={styles.secao}>
        <ThemedText type="label">Lembretes de hoje</ThemedText>
        <View style={styles.lista}>
          {deHoje.length > 0 ? (
            deHoje.map((lembrete) => (
              <LembreteItem key={lembrete.id} lembrete={lembrete} onPress={abrirLembrete} />
            ))
          ) : (
            <ThemedText themeColor="textSecondary">Nenhum lembrete para hoje.</ThemedText>
          )}
        </View>
      </View>
    </MainContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  secao: {
    gap: 6,
  },
  lista: {
    gap: Spacing.two,
  },
});
