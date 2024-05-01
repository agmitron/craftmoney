import { useEffect, useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "./Themed";
import Typography from "./Typography";
import { Theme } from "../constants/theme";
import { assertStyle } from "../utils/style";

interface Props {
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  emoji?: string;
  decoration?: React.ReactNode;
}

const Select: React.FC<Props> = ({
  title,
  description,
  style,
  onPress,
  emoji,
  decoration,
}) => {
  const [isActive, setActive] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const theme = useTheme();
  const styles = withTheme(theme);

  useEffect(() => {
    if (isActive) {
      Animated.timing(scaleAnimation, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  const animatedStyles = {
    transform: [
      {
        scale: scaleAnimation,
      },
    ],
  };

  return (
    <Pressable
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      onPress={onPress}
    >
      <Animated.View style={[styles.root, assertStyle(style), animatedStyles]}>
        <Typography style={styles.icon}>{emoji}</Typography>

        <View>
          <Typography variant="title" style={styles.title}>
            {title}
          </Typography>
          <Typography variant="text" style={styles.description}>
            {description}
          </Typography>
        </View>
        <View style={styles.decoration}>{decoration}</View>
      </Animated.View>
    </Pressable>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      backgroundColor: t.colors.surface,
      borderRadius: t.borderRadius,
      padding: 20,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      columnGap: 20,
    },
    root_active: {
      transform: [{ scale: 0.985 }],
    },
    title: {
      color: t.colors.typography.primary,
      fontSize: 19,
    },
    description: {
      color: t.colors.typography.secondary,
      fontSize: 14,
      marginTop: 5,
    },
    icon: {
      fontSize: 40,
    },
    decoration: {
      marginLeft: "auto",
      marginRight: 0,
    },
  });

export default Select;
