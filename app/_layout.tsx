import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  Link,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabOneScreen from "./(tabs)";
import TabTwoScreen from "./(tabs)/two";
import Modal from "./modal";
import { Header as ModalHeader } from "../components/Modal";
import TabLayout from "./(tabs)/_layout";

export const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

enum Screens {
  Home = "Home",
  Second = "Second",
  Modal = "Modal",
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {/* {!loaded && <SplashScreen />} */}
      {loaded && <RootLayoutNav />}
    </>
  );
}

const linking = {
  config: {
    screens: {
      [Screens.Home]: "/",
      [Screens.Modal]: "/modal",
      [Screens.Second]: "two",
    },
  },
  prefixes: ["http"],
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer linking={linking}>
      <View style={styles.root}>
        {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
        <Stack.Navigator>
          <Stack.Screen
            name={Screens.Home}
            // options={{ headerShown: false }}
            component={TabOneScreen}
          />
          <Stack.Screen
            name={Screens.Second}
            // options={{ headerShown: false }}
            component={TabTwoScreen}
          />
          <Stack.Screen
            name={Screens.Modal}
            options={{
              presentation: "modal",
              header: ModalHeader,
            }}
            component={Modal}
          />
        </Stack.Navigator>

        <View style={styles.navbar}>
          <Link to={{ screen: Screens.Second }} style={styles.navbar__button}>
            <Text>Two</Text>
          </Link>
          <Link to={{ screen: Screens.Home }} style={styles.navbar__button}>
            <Text>Home</Text>
          </Link>
        </View>
        {/* </ThemeProvider> */}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  navbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
  },
  navbar__button: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
