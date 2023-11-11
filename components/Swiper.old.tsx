import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import RNSwiper from "react-native-swiper";

interface Props {
  pages: React.ReactNode[];
}

const items = [
  {
    title: "USD",
    description: "100 USD",
    icon: "✅",
  }
]

const IOSSwiper: React.FC<Props> = ({ pages }) => {
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  return (
    <RNSwiper
      style={{ maxHeight }}
      contentContainerStyle={{ maxHeight }}
      dotStyle={{ marginTop: "auto", marginBottom: 0 }}
      activeDotStyle={{ marginTop: "auto", marginBottom: 0 }}
    >
      {pages.map((page) => (
        <View
          style={[iosSwiperStyles.page, { maxHeight }]}
          onLayout={(e) =>
            setMaxHeight((prev) =>
              prev === null ? e.nativeEvent.layout.height + 30 : prev
            )
          }
        >
          {page}
        </View>
      ))}
    </RNSwiper>
  );
};

const WebSwiper: React.FC<Props> = ({ pages }) => {
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  // TODO
  return pages.map((page) => (
    <View
      style={[iosSwiperStyles.page, { maxHeight }]}
      onLayout={(e) =>
        setMaxHeight((prev) =>
          prev === null ? e.nativeEvent.layout.height + 30 : prev
        )
      }
    >
      {page}
    </View>
  ));
};

const Swiper: React.FC<Props> = (props) => {
  switch (Platform.OS) {
    case "ios":
      return <IOSSwiper {...props} />;
    case "web":
      return <WebSwiper {...props} />;
  }
};

const iosSwiperStyles = StyleSheet.create({
  page: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "flex-start",
    paddingBottom: 30,
    gap: 5,
  },
});

export default Swiper;
