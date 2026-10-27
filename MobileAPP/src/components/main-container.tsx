import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MainContainerProps = ViewProps & {
  rolagem?: boolean;
};

export const MainContainer = ({ rolagem, style, children, ...rest }: MainContainerProps) => {
  const theme = useTheme();

  if (rolagem) {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[styles.container, styles.rolagem, style]}
        {...rest}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  rolagem: {
    flex: 0,
    flexGrow: 1,
    paddingBottom: Spacing.four,
  },
});
