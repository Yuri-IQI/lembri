import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { Splash } from '@/components/splash';

const CHAVE_ABERTURA_VISTA = 'abertura-vista';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  // null enquanto lê o armazenamento; a splash nativa continua na tela até lá.
  const [mostrarAbertura, setMostrarAbertura] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_ABERTURA_VISTA)
      .then((vista) => setMostrarAbertura(vista === null))
      .catch(() => setMostrarAbertura(false));
  }, []);

  useEffect(() => {
    if (mostrarAbertura === false) SplashScreen.hideAsync();
  }, [mostrarAbertura]);

  const entrar = () => {
    setMostrarAbertura(false);
    AsyncStorage.setItem(CHAVE_ABERTURA_VISTA, '1');
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      {mostrarAbertura && <Splash onEntrar={entrar} />}
    </ThemeProvider>
  );
};

export default RootLayout;
