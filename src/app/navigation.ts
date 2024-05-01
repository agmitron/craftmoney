import {
  CardStyleInterpolators,
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  createStackNavigator,
} from "@react-navigation/stack";
import { useMemo } from "react";
import { Animated } from "react-native";

import { AccountID, Category } from "~/entities/types";

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

const { multiply } = Animated;
export function forHorizontalModal({
  closing,
  current,
  index,
  insets,
  inverted,
  layouts,
  swiping,
  next,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const iOSStandardModal = CardStyleInterpolators.forModalPresentationIOS({
    closing,
    current,
    index,
    insets,
    inverted,
    layouts,
    swiping,
    next,
  });

  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0],
      extrapolate: "clamp",
    }),
    inverted,
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, layouts.screen.width * -0.3],
          extrapolate: "clamp",
        }),
        inverted,
      )
    : 0;

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: "clamp",
  });

  // const shadowOpacity = current.progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 0.3],
  //   extrapolate: "clamp",
  // });

  iOSStandardModal.cardStyle.transform = [
    // Translation for the animation of the current card
    { translateX: translateFocused },
    // Translation for the animation of the card on top of this
    { translateX: translateUnfocused },
  ];

  iOSStandardModal.overlayStyle.opacity = overlayOpacity;
  // iOSStandardModal.shadowStyle.shadowOpacity = shadowOpacity;

  return iOSStandardModal;

  // return {
  //   cardStyle: {
  //     ...iOSStandardModal.cardStyle,
  //     transform: [
  //       // Translation for the animation of the current card
  //       { translateX: translateFocused },
  //       // Translation for the animation of the card on top of this
  //       { translateX: translateUnfocused },
  //     ],
  //   },
  //   overlayStyle: { ...iOSStandardModal.overlayStyle },
  //   // shadowStyle: { shadowOpacity },
  //   shadowStyle: iOSStandardModal.shadowStyle,
  //   containerStyle: iOSStandardModal.containerStyle,
  // };
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
