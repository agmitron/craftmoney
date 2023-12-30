import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import RNGHSwipeable from "react-native-gesture-handler/Swipeable";

interface Props {
  onDelete: () => void;
}

interface RightActionsProps {
  onDelete: () => void;
  swipeableRef: React.RefObject<RNGHSwipeable>;
}

const RightActions: React.FC<RightActionsProps> = ({
  onDelete,
  swipeableRef,
}) => {
  const onPress = () => {
    swipeableRef.current?.close();
    onDelete?.();

    console.log({ swipeableRef });
  };

  return (
    <RectButton style={styles.rightAction} onPress={onPress}>
      <Animated.Text style={styles.actionText}>Delete</Animated.Text>
    </RectButton>
  );
};

const Swipeable: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onDelete,
}) => {
  const swipeableRef = useRef<RNGHSwipeable | null>(null);

  return (
    <RNGHSwipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <RightActions onDelete={onDelete} swipeableRef={swipeableRef} />
      )}
    >
      {children}
    </RNGHSwipeable>
  );
};

// TODO: make it more beautiful
const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  actionText: {
    color: "white",
    fontSize: 16,
  },
});

export default Swipeable;
