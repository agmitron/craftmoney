import { StyleSheet, View } from "react-native";

import ArrowDown from "~/assets/images/arrow_down.svg";
import ArrowUp from "~/assets/images/arrow_up.svg";
import Exchange from "~/assets/images/exchange.svg";
import Button from "~/shared/components/Button";

interface Props {
  receive: () => void;
  transfer: () => void;
  spend: () => void;
}

const Actions: React.FC<Props> = ({ receive, transfer, spend }) => {
  return (
    <View style={styles.root}>
      <Button variant="icon" onPress={receive} icon={<ArrowDown />}>
        Receive
      </Button>
      <Button variant="icon" onPress={transfer} icon={<Exchange />}>
        Transfer
      </Button>
      <Button variant="icon" onPress={spend} icon={<ArrowUp />}>
        Spend
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  icon: {
    flexDirection: "column",
  },
});

export default Actions;
