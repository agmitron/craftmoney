import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  Link,
  NavigationContainer,
  ThemeProvider,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useStore, useStoreMap } from "effector-react";
import { useFonts } from "expo-font";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

import TabOneScreen from "./(tabs)";
import TabTwoScreen from "./(tabs)/two";
import Accounts from "./accounts";
import CreateAccount from "./accounts.create";
import EditAccount from "./accounts.edit";
import Categories from "./categories";
import CreateCategory from "./categories.create";
import CreateTransaction from "./transactions.create";
import { useTheme } from "../components/Themed";
import { Theme } from "../constants/theme";
import { accounts, categories } from "../store";
import { flattenCategories } from "../utils/categories";

import Button from "~/components/Button";
import Typography from "~/components/Typography";
import { incomeExpenseForm, transferForm } from "~/store/forms/transaction";
import { AccountID, Category } from "~/store/types";

export const enum Screens {
  Home = "home",
  Second = "second",
  TransactionsCreate = "transactions/create",
  Categories = "categories",
  CategoriesCreate = "categories/create",
  Accounts = "accounts",
  AccountsTransferTo = "accounts/transfer/to",
  AccountsTransferFrom = "accounts/transfer/from",
  AccountsCreate = "accounts/create",
  AccountsEdit = "accounts/edit",
}

export type RootStackParamList = {
  [Screens.AccountsEdit]: { id: AccountID };
  [Screens.CategoriesCreate]: { parent: Category };
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

const screensWithTabs = new Set<string>([Screens.Home, Screens.Second]);

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

  const totalBalance = useStoreMap(accounts.$totalBalance, (b) => b.toFixed(2));
  const { navigate } = useNavigation();

  return (
    <View style={styles.navbar}>
      {/* TODO: Typings, styles */}
      <View style={{ rowGap: 10 }}>
        <Typography variant="text">Total balance</Typography>
        <Typography variant="title">{totalBalance}</Typography>
      </View>
      {/* TODO: reuse */}
      <Button
        variant="icon"
        onPress={() => navigate(Screens.TransactionsCreate as never)} // TODO: typings
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: 22,
            height: 3,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: 3,
            height: 22,
            borderRadius: 3,
          }}
        />
      </Button>
    </View>
  );
};

function useTabs<T>(
  Component: () => React.ReactElement,
): (props: T) => React.ReactElement {
  const theme = useTheme();
  const styles = withTheme(theme);

  const Container = (_: T) => {
    const route = useRoute();
    return (
      <View style={styles.root}>
        <Component />
        {screensWithTabs.has(route.name) && <Tabs />}
      </View>
    );
  };

  return Container;
}

const useLinking = (categoriesScreens: string[] = []) => {
  const linking = useMemo(() => {
    const result = {
      config: {
        screens: {
          [Screens.Home]: "/",
          [Screens.TransactionsCreate]: "transactions/create",
          [Screens.Second]: "two",
          [Screens.Categories]: "categories",
          [Screens.Accounts]: "accounts",
          [Screens.AccountsTransferFrom]: "accounts/transfer/from",
          [Screens.AccountsTransferTo]: "accounts/transfer/to",
          [Screens.AccountsCreate]: "accounts/create",
        } as Record<string, string>,
      },
      prefixes: [],
    };

    for (const cs of categoriesScreens) {
      const route = `${Screens.Categories}/${cs}`;
      result.config.screens[route] = route;
    }

    return result;
  }, []);

  return linking;
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const styles = withTheme(theme);

  const categoriesScreens = useStoreMap(categories.$categories, (categories) =>
    Object.keys(flattenCategories(categories, "", {}, "/")),
  );

  const linking = useLinking(categoriesScreens);

  const tabOne = useTabs(TabOneScreen);
  const tabTwo = useTabs(TabTwoScreen);

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
              component={tabOne}
            />
            <Stack.Screen
              name={Screens.Second}
              // options={{ headerShown: false }}
              component={tabTwo}
            />
            <Stack.Screen
              name={Screens.TransactionsCreate}
              options={{
                presentation: "modal",
              }}
              component={CreateTransaction}
            />

            <Stack.Screen
              name={Screens.Accounts}
              component={() => (
                <Accounts onChange={incomeExpenseForm.selectAccount} />
              )}
            />

            <Stack.Screen
              name={Screens.AccountsTransferFrom}
              component={() => <Accounts onChange={transferForm.selectFrom} />}
            />

            <Stack.Screen
              name={Screens.AccountsTransferTo}
              component={() => <Accounts onChange={transferForm.selectTo} />}
            />

            <Stack.Screen
              name={Screens.AccountsCreate}
              component={CreateAccount}
            />

            <Stack.Screen name={Screens.AccountsEdit} component={EditAccount} />

            <Stack.Screen name={Screens.Categories} component={Categories} />
            <Stack.Screen
              name={Screens.CategoriesCreate}
              component={CreateCategory}
            />

            {categoriesScreens.map((cs) => (
              <Stack.Screen
                key={cs}
                name={`categories/${cs}`}
                component={Categories}
              />
            ))}
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
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: "rgb(217 217 220)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      backgroundColor: "white",
    },
    navbar__button_bordered: {
      borderRightWidth: 1,
      borderRightColor: t.colors.surface,
    },
  });
