import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import {
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
import { AccountsView, Emoji } from "~/store/appearance";
import { Account, Accounts, Balances } from "~/store/types";

namespace Views {
  interface Props {
    accounts: Accounts;
    balances: Balances;
    emoji: Emoji[keyof Emoji];
    edit: (account: Account) => void;
    create: () => void;
  }

  export const Card: React.FC<Props> = () => {
    return <></>;
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
    // TODO: probably put in store to make dynamic

    const theme = useTheme();
    const styles = withTheme(theme);

    const pressableStyles: StyleProp<ViewStyle> = {
      maxWidth: `${100 / theme.layout.plates - 1}%`,
      minWidth: 160,
      width: "100%",
      alignItems: "center",
    };

    return (
      <View style={styles.accounts_plates}>
        {Object.values(accounts).map((account, key) => (
          <Pressable
            key={key}
            onPress={() => edit(account)}
            style={pressableStyles}
          >
            <CardComponent style={styles.accounts_plates__plate}>
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
              styles.accounts_plates__plate,
              styles.accounts_plates__plate_add,
            ]}
          >
            <Button
              variant="icon"
              onPress={create}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            >
              +
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
  const _appearance = useStore(appearance.$accounts);
  const _accounts = useStore(accounts.$accounts);
  const _balances = useStore(accounts.$balances);
  const _emoji = useStoreMap(appearance.$emoji, ({ accounts }) => accounts);

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

  switch (_appearance) {
    case AccountsView.Card:
      return <Views.Card {...props} />;
    case AccountsView.List:
      return <Views.List {...props} />;
    case AccountsView.Plates:
      return <Views.Plates {...props} />;
  }
};

// TODO: refactor and reuse
const withTheme = (t: Theme) =>
  StyleSheet.create({
    accounts_plates: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-around",
      rowGap: 15,
      columnGap: 5,
      width: "100%",
    },
    accounts_plates__plate: {
      rowGap: 5,
      alignItems: "flex-start",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
      minHeight: 100,
    },
    accounts_plates__plate_add: {
      backgroundColor: "rgba(255, 255, 255, .5)",
      alignItems: "center",
    },
  });

export default AccountsWidget;
