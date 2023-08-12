import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  Link,
  NavigationContainer,
  ThemeProvider,
  useRoute,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabOneScreen from "./(tabs)";
import TabTwoScreen from "./(tabs)/two";
import Modal from "./modal";
import { Header as ModalHeader } from "../components/Modal";
import { Theme } from "../constants/theme";
import { useTheme } from "../components/Themed";
import Categories from "./categories";

export const Stack = createNativeStackNavigator();

export enum Screens {
  Home = "Home",
  Second = "Second",
  Modal = "Modal",
  Categories = "Categories",
}

const screensWithTabs = new Set<string>([Screens.Home, Screens.Second]);

const linking = {
  config: {
    screens: {
      [Screens.Home]: "/",
      [Screens.Modal]: "/modal",
      [Screens.Second]: "two",
      [Screens.Categories]: "categories",
    },
  },
  prefixes: [],
};

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

export const Tabs = () => {
  const theme = useTheme();
  const styles = withTheme(theme);

  return (
    <View style={styles.navbar}>
      <Link
        to={{ screen: Screens.Second }}
        style={[styles.navbar__button, styles.navbar__button_bordered]}
      >
        <Text>Two</Text>
      </Link>
      <Link to={{ screen: Screens.Home }} style={styles.navbar__button}>
        <Text>Home</Text>
      </Link>
    </View>
  );
};

function withTabs<T>(
  Component: () => React.ReactElement
): (props: T) => React.ReactElement {
  const theme = useTheme();
  const styles = withTheme(theme);

  return (_: T) => {
    const route = useRoute();
    return (
      <View style={styles.root}>
        <Component />
        {screensWithTabs.has(route.name) && <Tabs />}
      </View>
    );
  };
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const styles = withTheme(theme);

  console.log('RootLayoutNav')

  return (
    <NavigationContainer linking={linking}>
      <View style={styles.root}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator>
            <Stack.Screen
              name={Screens.Home}
              // options={{ headerShown: false }}
              component={withTabs(TabOneScreen)}
            />
            <Stack.Screen
              name={Screens.Second}
              // options={{ headerShown: false }}
              component={withTabs(TabTwoScreen)}
            />
            <Stack.Screen
              name={Screens.Modal}
              options={{
                presentation: "modal",
                header: () => <ModalHeader text="Add operation" />,
              }}
              component={Modal}
            />
            <Stack.Screen
              name={Screens.Categories}
              // options={{
              //   presentation: "modal",
              //   header: () => <ModalHeader text="Select a category" />,
              // }}
              component={Categories}
            />
          </Stack.Navigator>
        </ThemeProvider>
      </View>
    </NavigationContainer>
  );
}

const withTheme = (t: Theme) =>
  StyleSheet.create({
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
      backgroundColor: "white",
    },
    navbar__button: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: "100%",
      textAlign: "center",
      textAlignVertical: "center",
    },
    navbar__button_bordered: {
      borderRightWidth: 1,
      borderRightColor: t.colors.surface,
    },
  });
