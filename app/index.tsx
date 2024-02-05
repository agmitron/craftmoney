import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

import Layout from "./_layout";
import { useLinking } from "./navigation";

const App: React.FC = () => {
  const linking = useLinking();
  return (
    <NavigationContainer linking={linking}>
      <Layout />
    </NavigationContainer>
  );
};

export default App;
