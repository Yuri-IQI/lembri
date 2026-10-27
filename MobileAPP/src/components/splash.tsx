import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FADE = 400;
const AVANCO_AUTOMATICO = 4000;
const LOGO_MAX = 400;

type SplashProps = {
  onEntrar: () => void;
};

/** Tela de abertura (frame `inicial`), mostrada só na primeira vez que o app é aberto. */
export const Splash = ({ onEntrar }: SplashProps) => {
  const theme = useTheme();
  const [opacidade] = useState(() => new Animated.Value(1));
  const { width } = useWindowDimensions();
  const ladoLogo = Math.min(LOGO_MAX, width - Spacing.four * 2);

  const saindo = useRef(false);

  const entrar = () => {
    if (saindo.current) return;
    saindo.current = true;
    Animated.timing(opacidade, { toValue: 0, duration: FADE, useNativeDriver: true }).start(onEntrar);
  };

  useEffect(() => {
    const timer = setTimeout(entrar, AVANCO_AUTOMATICO);
    return () => clearTimeout(timer);
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.background, opacity: opacidade }]}
      onLayout={() => SplashScreen.hideAsync()}>
      <Pressable
        style={styles.toque}
        onPress={entrar}
        accessibilityRole="button"
        accessibilityLabel="Entrar no Lembri">
        <SafeAreaView style={styles.conteudo}>
          <Image
            source={require('@/assets/splash/splash-logo.png')}
            style={[styles.logo, { width: ladoLogo, height: ladoLogo }]}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessibilityLabel="Lembri!"
          />
          <View style={styles.textos}>
            <ThemedText type="title">Bem Vindo ao Lembri!</ThemedText>
            <ThemedText themeColor="textSecondary">
              Organize seus lembretes e treine sua memória de uma forma simples.
            </ThemedText>
          </View>
        </SafeAreaView>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toque: {
    flex: 1,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  logo: {
    alignSelf: 'center',
  },
  textos: {
    gap: Spacing.two,
  },
});
