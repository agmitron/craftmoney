import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Theme } from "~/constants/theme";
import { useTheme } from "../Themed";
import { PropsWithChildren } from "react";
import { assertStyle } from "~/utils/style";

interface Props {
  last?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Item: React.FC<PropsWithChildren<Props>> = ({
  last,
  children,
  style,
}) => {
  const theme = useTheme();
  const styles = withTheme(theme);

  return (
    <View
      style={{
        ...styles.root,
        ...(last ? styles.root_last : {}),
        ...assertStyle(style),
      }}
    >
      {children}
    </View>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.surface,
    },
    root_last: {
      borderBottomWidth: 0,
    },
  });

export default Item;
