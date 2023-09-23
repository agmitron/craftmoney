import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import Button from "./Button";
import CardComponent from "./Card";
import { useTheme } from "./Themed";
import Typography from "./Typography";

import { Screens } from "~/app/navigation";
import { Theme } from "~/constants/theme";
import { accounts, appearance } from "~/store";
import { Account, Accounts, Balances } from "~/store/types";
import { useMemo, useState } from "react";
import { takeRange } from "~/utils/range";
import Swiper from "react-native-swiper";

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
    const [maxHeight, setMaxHeight] = useState<number | null>(null);

    const _accounts = Object.values(accounts);

    const pagesCount = Math.ceil(
      Object.keys(accounts).length / theme.layout.plates
    );
    const lastPage = pagesCount - 1;

    const pages = new Array(pagesCount).fill(null).map((_, page) => {
      const maxPlatesOnPage =
        page === lastPage ? theme.layout.plates - 1 : theme.layout.plates;

      return takeRange(_accounts, maxPlatesOnPage, page);
    });

    return (
      <Swiper
        style={{ maxHeight }}
        dotStyle={{ marginTop: "auto", marginBottom: 0 }}
        activeDotStyle={{ marginTop: "auto", marginBottom: 0 }}
      >
        {pages.map((accountsOnPage, page) => (
          <View
            key={page}
            style={[styles.container_plates__page]}
            onLayout={(e) => setMaxHeight(e.nativeEvent.layout.height + 30)}
          >
            {accountsOnPage.map((account) => (
              <CardComponent
                style={styles.container_plates__plate}
                key={account.id}
              >
                <Pressable onPress={() => edit(account)}>
                  <Typography variant="text" style={{ fontSize: 25 }}>
                    {emoji[account.id]}
                  </Typography>
                  <Typography variant="subtitle">{account.name}</Typography>
                  <Typography variant="subtitle">
                    {balances[account.id]} {account.currency}
                  </Typography>
                </Pressable>
              </CardComponent>
            ))}
            {page === lastPage && (
              <CardComponent
                style={[
                  styles.container_plates__plate,
                  styles.container_plates__plate_add,
                ]}
              >
                <Pressable
                  onPress={create}
                  style={{ alignItems: "center", rowGap: 10 }}
                >
                  <Button
                    variant="icon"
                    onPress={create}
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
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
                  <Typography variant="subtitle">Add account</Typography>
                </Pressable>
              </CardComponent>
            )}
          </View>
        ))}
      </Swiper>
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
    navigate(...([Screens.AccountsEdit, { id: account.id }] as never));

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
      flexDirection: "row",
      alignSelf: "flex-start",
    },
    container_card: {},
    container_plates: {},
    container_plates__page: {
      // flex: 1,
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignContent: "flex-start",
      gap: 5,
      padding: 15,
    },
    container_plates__plate: {
      flexBasis: "49%",
      height: 100,
    },
    container_plates__plate_add: {
      backgroundColor: "rgba(255, 255, 255, .5)",
    },
  });

export default AccountsWidget;
