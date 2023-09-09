import { useNavigation } from "@react-navigation/native";
import { combine } from "effector";
import { useStore, useStoreMap } from "effector-react";
import {
  Image,
  ImageBackground,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import Button from "./Button";
import CardComponent from "./Card";
import { useTheme } from "./Themed";
import Typography from "./Typography";

import { Screens } from "~/app/_layout";
import { Theme } from "~/constants/theme";
import { accounts, appearance } from "~/store";
import { Account, Accounts, Balances } from "~/store/types";

namespace Views {
  interface Props {
    accounts: Accounts;
    balances: Balances;
    emoji: appearance.Emoji.Emoji[keyof appearance.Emoji.Emoji];
    edit: (account: Account) => void;
    create: () => void;
  }

  export const Card: React.FC<Props> = ({ accounts, balances }) => {
    const theme = useTheme();
    const styles = withTheme(theme);

    const sizes = {
      width: 300,
      height: 300,
    };

    return (
      <>
        {Object.values(accounts).map((account) => (
          <View style={[styles.container, styles.container_card]}>
            {/* TODO: refactor styles */}
            <CardComponent
              style={{
                width: "100%",
                padding: 0,
                position: "relative",
                height: sizes.height,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                  position: "absolute",
                  borderRadius: 20,
                  height: sizes.height,
                  width: "100%",
                }}
              />
              <Image
                source={{
                  uri: "https://i.pinimg.com/originals/7a/0d/c2/7a0dc24f568b81a39ba1ce797f65d355.jpg",
                  ...sizes,
                }}
                style={{
                  width: "100%",
                  borderRadius: 20,
                  zIndex: -1,
                  opacity: 0.8,
                  position: "absolute",
                }}
                blurRadius={1.5}
              />

              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  zIndex: 2,
                  height: "100%",
                }}
              >
                <Typography
                  variant="text"
                  color="white"
                  style={{ fontWeight: "bold", fontSize: 40 }}
                >
                  {balances[account.id]} {account.currency}
                </Typography>
                <Typography
                  variant="text"
                  color="white"
                  style={{
                    fontWeight: "bold",
                    marginBottom: 30,
                    marginTop: "auto",
                  }}
                >
                  {account.name}
                </Typography>
              </View>
            </CardComponent>
          </View>
        ))}
      </>
    );
  };

  export const List: React.FC<Props> = () => {
    return <></>;
  };

  export const Plates: React.FC<Props> = ({
    accounts,
    balances,
    emoji,
    edit,
    create,
  }) => {
    const theme = useTheme();
    const styles = withTheme(theme);

    const pressableStyles: StyleProp<ViewStyle> = {
      maxWidth: `${100 / theme.layout.plates - 1}%`,
      minWidth: 160,
      width: "100%",
      alignItems: "center",
    };

    return (
      <View style={[styles.container, styles.container_plates]}>
        {Object.values(accounts).map((account, key) => (
          <Pressable
            key={key}
            onPress={() => edit(account)}
            style={pressableStyles}
          >
            <CardComponent style={styles.container_plates__plate}>
              <Typography variant="text" style={{ fontSize: 25 }}>
                {emoji[account.id]}
              </Typography>
              <Typography variant="subtitle">{account.name}</Typography>
              <Typography variant="title">
                {balances[account.id]} {account.currency}
              </Typography>
            </CardComponent>
          </Pressable>
        ))}
        <Pressable onPress={create} style={pressableStyles}>
          <CardComponent
            style={[
              styles.container_plates__plate,
              styles.container_plates__plate_add,
            ]}
          >
            <Button
              variant="icon"
              onPress={create}
              style={{ marginTop: "auto", marginBottom: "auto" }}
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
            <Typography variant="subtitle">Add account</Typography>
          </CardComponent>
        </Pressable>
      </View>
    );
  };
}

// TODO: FSD
const AccountsWidget: React.FC = () => {
  const _view = useStore(appearance.Accounts.$view);
  const _accounts = useStore(accounts.$accounts);
  const _balances = useStore(accounts.$balances);
  const _emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ accounts }) => accounts
  );

  const { navigate } = useNavigation();

  const create = () => navigate(Screens.AccountsCreate as never); // TODO: Types
  const edit = (account: Account) =>
    navigate(...([`accounts/edit`, { id: account.id }] as never));

  const props = {
    accounts: _accounts,
    balances: _balances,
    emoji: _emoji,
    create,
    edit,
  };

  switch (_view) {
    case appearance.Accounts.View.Card:
      return <Views.Card {...props} />;
    case appearance.Accounts.View.List:
      return <Views.List {...props} />;
    case appearance.Accounts.View.Plates:
      return <Views.Plates {...props} />;
  }
};

// TODO: refactor and reuse
const withTheme = (t: Theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginHorizontal: "auto",
    },
    container_card: {},
    container_plates: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
      rowGap: 15,
      columnGap: 5,
    },
    container_plates__plate: {
      rowGap: 5,
      alignItems: "flex-start",
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
      minHeight: 100,
    },
    container_plates__plate_add: {
      backgroundColor: "rgba(255, 255, 255, .5)",
      alignItems: "center",
    },
  });

export default AccountsWidget;
