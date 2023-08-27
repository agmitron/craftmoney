import { StyleSheet, View } from "react-native";

// import { useStore } from "effector-react";
import { useTheme } from "./Themed";
import Typography from "./Typography";
import { Theme } from "../constants/theme";

interface HeaderProps {
  text: string;
}

export const Header: React.FC<HeaderProps> = ({ text }) => {
  const theme = useTheme();
  const styles = withTheme(theme);

  // const categories = useStore($categories)

  return (
    <View style={styles.root}>
      <Typography color={theme.colors.typography.primary} align="center">
        {text}
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
