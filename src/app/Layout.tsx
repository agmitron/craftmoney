import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { useStore, useStoreMap } from "effector-react";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

import { useTheme } from "../components/Themed";
import { Theme } from "../constants/theme";
import { accounts, categories, currencies } from "../entities";
import TabOneScreen from "../pages/Home";
import SettingsPage from "../pages/Settings";
import Accounts from "../pages/accounts";
import Categories from "../pages/categories";
import { Screens, screensWithTabs, Stack } from "./navigation";
import { flattenCategories } from "../shared/utils/categories";

import Button from "~/components/Button";
import Typography from "~/components/Typography";
import { incomeExpenseForm, transferForm } from "~/entities/forms/transaction";
import CreateAccount from "~/features/accounts/create";
import EditAccount from "~/features/accounts/edit";
import CreateCategory from "~/features/categories/create";
import CreateTransaction from "~/features/transactions/create";

export default function Layout() {
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
      {loaded && <Routing />}
    </>
  );
}

export const Tabs = () => {
  const theme = useTheme();
  const styles = withTheme(theme);

  const balance = useStoreMap(accounts.$totalBalance, (b) => b.toFixed(2));
  const currency = useStore(currencies.$primary);
  const { navigate } = useNavigation();

  return (
    <View style={styles.tabs}>
      {/* TODO: Typings, styles */}
      <View style={{ rowGap: 10 }}>
        <Typography variant="text">Total balance</Typography>
        <Typography variant="title">
          {balance} {currency}
        </Typography>
      </View>
      {/* TODO: reuse */}
      <Button
        variant="icon"
        onPress={() => navigate(Screens.TransactionsCreate as never)} // TODO: typings
      >
        <Image
          source={require("../assets/images/plus.png")}
          style={{
            // TODO
            width: 40,
            height: 45,
            margin: 0,
          }}
        />
      </Button>
    </View>
  );
};

function useTabs<T>(
  Component: () => React.ReactElement
): (props: T) => React.ReactElement {
  const theme = useTheme();
  const styles = withTheme(theme);

  const Container = (_: T) => {
    const route = useRoute();
    return (
      <View style={styles.screen}>
        <Component />
        {screensWithTabs.has(route.name) && <Tabs />}
      </View>
    );
  };

  return Container;
}

function Routing() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const styles = withTheme(theme);

  const categoriesScreens = useStoreMap(categories.$categories, (categories) =>
    Object.keys(flattenCategories(categories, "", {}, "/"))
  );

  const tabOne = useTabs(TabOneScreen);
  const tabTwo = useTabs(SettingsPage);

  // TODO
  const categoriesScreenOptions =
    ({ parent = "" }) =>
    ({ navigation }) => ({
      presentation: "modal",
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: (_) => (
        <Pressable
          style={{
            // TODO
            borderColor: theme.colors.surface,
            borderWidth: 1,
            width: 25,
            height: 25,
            borderRadius: 25 / 2,
            alignItems: "center",
            marginRight: 10,
          }}
          onPress={() =>
            navigation.navigate(Screens.CategoriesCreate, { parent })
          }
        >
          <Typography>+</Typography>
        </Pressable>
      ),
    });

  return (
    <NavigationContainer>
      <View style={styles.root}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen
                name={Screens.Home}
                options={{ headerTitle: "Finance" }}
                component={tabOne}
              />
              <Stack.Screen
                name={Screens.Settings}
                options={{ headerTitle: "Settings" }}
                component={tabTwo}
              />
            </Stack.Group>

            <Stack.Group
              screenOptions={{
                presentation: "modal",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            >
              <Stack.Screen
                name={Screens.TransactionsCreate}
                options={{
                  presentation: "modal",
                  headerTitle: "Add a transaction",
                }}
                component={CreateTransaction}
              />

              <Stack.Screen
                name={Screens.Accounts}
                options={{
                  headerTitle: "Choose an account",
                }}
                children={() => (
                  <Accounts onChange={incomeExpenseForm.selectAccount} />
                )}
              />

              <Stack.Screen
                name={Screens.AccountsTransferFrom}
                options={{
                  headerTitle: "Transfer from",
                }}
                children={() => <Accounts onChange={transferForm.selectFrom} />}
              />

              <Stack.Screen
                name={Screens.AccountsTransferTo}
                options={{
                  headerTitle: "Transfer to",
                }}
                children={() => <Accounts onChange={transferForm.selectTo} />}
              />

              <Stack.Screen
                name={Screens.AccountsCreate}
                options={{
                  headerTitle: "Add an account",
                }}
                component={CreateAccount}
              />

              <Stack.Screen
                name={Screens.AccountsEdit}
                component={EditAccount}
              />

              <Stack.Screen
                name={Screens.Categories}
                component={Categories}
                options={categoriesScreenOptions({ parent: "" })}
              />
              <Stack.Screen
                name={Screens.CategoriesCreate}
                component={CreateCategory}
              />

              {categoriesScreens.map((cs) => (
                <Stack.Screen
                  key={cs}
                  name={`categories/${cs}`}
                  component={Categories}
                  options={categoriesScreenOptions({ parent: cs })}
                />
              ))}
            </Stack.Group>
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
      height: "100%",
      flex: 1,
    },
    screen: {
      flex: 1,
      justifyContent: "space-between",
      height: "100%",
    },
    tabs: {
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: "rgb(217 217 220)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
    },
  });
