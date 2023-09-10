import {
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  createStackNavigator,
} from "@react-navigation/stack";
import { useMemo } from "react";
import { Animated } from "react-native";

import { AccountID, Category } from "~/store/types";

export const enum Screens {
  Home = "home",
  Settings = "settings",
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

export const Stack = createStackNavigator<RootStackParamList>();

export const screensWithTabs = new Set<string>([
  Screens.Home,
  Screens.Settings,
]);

export function forHorizontalModal({
  current,
  next,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateFocused = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.width, 0],
      extrapolate: "clamp",
    }),
    inverted
  );

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: "clamp",
  });

  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: "clamp",
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card in back
        { translateX: 0 },
      ],
    },
    overlayStyle: { opacity: overlayOpacity },
    shadowStyle: { shadowOpacity },
  };
}

export const useLinking = (categoriesScreens: string[] = []) => {
  const linking = useMemo(() => {
    const result = {
      config: {
        screens: {
          [Screens.Home]: "/",
          [Screens.TransactionsCreate]: Screens.TransactionsCreate,
          [Screens.Settings]: Screens.Settings,
          [Screens.Categories]: Screens.Categories,
          [Screens.Accounts]: Screens.Accounts,
          [Screens.AccountsTransferFrom]: Screens.AccountsTransferFrom,
          [Screens.AccountsTransferTo]: Screens.AccountsTransferTo,
          [Screens.AccountsCreate]: Screens.AccountsCreate,
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
