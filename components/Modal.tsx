import { View, StyleSheet } from "react-native";
import Typography from "./Typography";
import { useTheme } from "./Themed";
import { Theme } from "../constants/theme";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const theme = useTheme();
  const styles = withTheme(theme);

  return (
    <View style={styles.root}>
      <Typography color={theme.colors.typography.primary} align="center">
        Add operation
      </Typography>
    </View>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      backgroundColor: t.colors.background,
      display: "flex",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.surface,
    },
  });
