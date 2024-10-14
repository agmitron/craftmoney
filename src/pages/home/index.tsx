import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import Tabs, { Page } from "~/shared/components/Tabs/Tabs";
import { Pages, RootStackParamList } from "~/shared/navigation";
import Accounts from "~/widgets/accounts";
import Actions from "~/widgets/actions";
import Currencies from "~/widgets/currencies";
import Operations from "~/widgets/operations";

const tabPages: Page[] = [
  {
    content: <Operations />,
    title: "Operations",
  },
  {
    content: <Currencies />,
    title: "Currencies",
  },
];

type Props = StackScreenProps<RootStackParamList, Pages.Home>;

const HomePage: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);

  const addOperation = () => {
    navigation.navigate(Pages.AddOperation);
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.top}>
        <Accounts />
        <Actions
          receive={addOperation}
          spend={addOperation}
          transfer={addOperation}
        />
      </View>
      <View style={styles.bottom}>
        <Tabs pages={tabPages} activeTab={activeTab} select={setActiveTab} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {},
  top: {
    backgroundColor: "#f2f4f8", // TODO: theme
    padding: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    rowGap: 20,
  },
  bottom: {
    alignItems: "center",
  },
});

export default HomePage;
