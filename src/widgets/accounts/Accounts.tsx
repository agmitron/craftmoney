import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import CardComponent from "../../components/Card";
import { useTheme } from "../../components/Themed";
import Typography from "../../components/Typography";

import { Screens } from "~/app/navigation";
import { PlusImage } from "~/assets";
import Slider from "~/components/Slider/Slider";
import { Theme } from "~/constants/theme";
import { accounts, appearance } from "~/entities";
import { Account, Accounts, Balances } from "~/entities/types";
import { takeRange } from "~/shared/utils/range";

namespace Views {
  interface Props {
    accounts: Accounts;
    balances: Balances;
    emoji: appearance.Emoji.EmojiStore["accounts"];
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

    const _accounts = Object.values(accounts);

    const pagesCount = Math.ceil(
      (Object.keys(accounts).length + 1) / theme.layout.plates.perPage,
    );
    const lastPage = pagesCount - 1;

    const pages = new Array(pagesCount).fill(null).map((_, page) => {
      const maxPlatesOnPage = theme.layout.plates.perPage;

      return takeRange(_accounts, maxPlatesOnPage, page);
    });

    return (
      <View style={styles.container}>
        <Slider
          pages={pages.map((accountsOnPage, page) => (
            <View style={[styles.container_plates__page]}>
              {accountsOnPage.map((account) => (
                <CardComponent
                  style={styles.container_plates__plate}
                  key={account.id}
                >
                  <Pressable onPress={() => edit(account)}>
                    <Typography variant="text" style={{ fontSize: 25 }}>
                      {emoji[account.id]}
                    </Typography>
                    <Typography variant="text">{account.name}</Typography>
                    <Typography variant="text" style={{ fontWeight: "bold" }}>
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
                        source={PlusImage}
                        style={{
                          // TODO
                          width: 40,
                          height: 45,
                          margin: 0,
                        }}
                      />
                    </Button>
                    <Typography variant="text">Add an account</Typography>
                  </Pressable>
                </CardComponent>
              )}
            </View>
          ))}
        />
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
    ({ accounts }) => accounts,
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
const withTheme = (t: Theme) => {
  const maxContainerHeight =
    (t.layout.plates.perPage / t.layout.plates.rows) *
      Number(t.layout.plates.height) +
    50;

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignSelf: "flex-start",
      maxHeight: maxContainerHeight,
    },
    container_card: {},
    container_plates__page: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      flexWrap: "wrap",
      padding: 5,
      gap: 5,
    },
    container_plates__plate: {
      width: "49%",
      height: 100,
    },
    container_plates__plate_add: {
      backgroundColor: "rgba(255, 255, 255, .5)",
    },
  });
};

export default AccountsWidget;
