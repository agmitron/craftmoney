import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../Themed";

import { Theme } from "~/constants/theme";

interface TabProps {
  title: string;
  isActive: boolean;
  Content: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ isActive }) => {
  const t = useTheme();
  const styles = makeStyles(t, isActive);

  return (
    <View>
      <Text style={styles.title} />
      <View style={styles.line} />
    </View>
  );
};

const makeStyles = (t: Theme, isActive: boolean) =>
  StyleSheet.create({
    title: {
      color: isActive
        ? t.colors.typography.primary
        : t.colors.typography.secondary,
    },
    line: {
      display: isActive ? "flex" : "none",
      color: t.colors.primary,
    },
  });

export default Tab;
