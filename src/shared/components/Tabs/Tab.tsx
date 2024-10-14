import { View, StyleSheet, Pressable, Text } from "react-native";

import { useTheme } from "../Themed";

import { Theme } from "~/shared/constants/theme";

interface TabProps {
  title: string;
  isActive: boolean;
  Content: React.ReactNode;
  onPress: () => void;
}

const Tab: React.FC<TabProps> = ({ isActive, title, onPress }) => {
  const t = useTheme();
  const styles = makeStyles(t, isActive);

  return (
    <Pressable style={styles.root} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </Pressable>
  );
};

const makeStyles = (t: Theme, isActive: boolean) =>
  StyleSheet.create({
    root: {
      paddingTop: 12,
      paddingLeft: 12,
      paddingRight: 12,
    },
    title: {
      color: isActive ? t.colors.typography.primary : "black", // TODO:
    },
    line: {
      display: "flex",
      backgroundColor: isActive ? t.colors.typography.primary : "transparent",
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      marginTop: 8,
      height: 2,
      width: "100%",
    },
  });

export default Tab;
