import { NavigationContainer } from "@react-navigation/native";
import { HoldMenuProvider } from "react-native-hold-menu";

// import { GestureHandlerRootView } from "react-native-gesture-handler";

import Layout from "./_layout";
import { useLinking } from "./navigation";

const App: React.FC = () => {
  const linking = useLinking();
  return (
    <NavigationContainer linking={linking}>
      {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
        {/* <HoldMenuProvider
        theme="light"
        safeAreaInsets={{ bottom: 0, left: 0, right: 0, top: 0 }}
      > */}
        <Layout />
        {/* </HoldMenuProvider> */}
      {/* </GestureHandlerRootView> */}
    </NavigationContainer>
  );
};

export default App;
