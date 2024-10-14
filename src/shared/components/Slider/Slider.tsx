import { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";

import Pagination from "./Pagination";
import Slide from "./Slide";
import { useTheme } from "../Themed";

import { Theme } from "~/shared/constants/theme";

interface Props {
  pages: React.ReactNode[];
}

const Slider: React.FC<Props> = (props) => {
  const [activePage, setActivePage] = useState<number | null>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(e);
  };

  const onViewableItemsChanged = useRef(
    (event: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const [first] = event.viewableItems;

      setActivePage(first?.index);
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const theme = useTheme();
  const styles = withTheme(theme);

  return (
    <View style={styles.root}>
      <FlatList
        data={props.pages}
        renderItem={({ item }) => <Slide page={item} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        onScroll={onScroll}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination
        pages={props.pages.map((_, i) => i === activePage)}
        scrollX={scrollX}
      />
    </View>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {},
  });

export default Slider;
