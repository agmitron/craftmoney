import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "~/pages/home";
import Add from "~/pages/operations/add";
import { Pages, RootStackParamList } from "~/shared/navigation";

const RootStack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name={Pages.Home} component={HomePage} />
      <RootStack.Group screenOptions={{ presentation: "modal" }}>
        <RootStack.Screen name={Pages.AddOperation} component={Add} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default Navigation;
