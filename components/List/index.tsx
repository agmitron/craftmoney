import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Item from "./Item";

interface Props {
  style?: StyleProp<ViewStyle>;
}

type List = React.FC<PropsWithChildren<Props>> & { Item: typeof Item };

const List: List = ({ children, style }) => (
  <View style={style}>{children}</View>
);

List.Item = Item;

export default List;
