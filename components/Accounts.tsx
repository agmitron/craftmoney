import { useState } from "react";
import Card from "./Card";
import Typography from "./Typography";
import { FlatList, StyleSheet, View } from "react-native";
import { useStore } from "effector-react";
import { $accounts, $balances } from "~/store";
import { Theme } from "~/constants/theme";
import { useTheme } from "./Themed";
import List from "./List";

type Variant = "card" | "grid" | "list";

interface Props {}

const Accounts: React.FC<Props> = () => {
  const [variant, setVariant] = useState<Variant>("list");

  const accounts = useStore($accounts);
  const balances = useStore($balances);

  const theme = useTheme();
  const styles = withTheme(theme);

  let content = null;

  switch (variant) {
    case "card": {
      content = <></>;
      break;
    }

    case "grid": {
      content = <></>;
      break;
    }

    case "list": {
      content = (
        <>
          <Typography variant="title">Accounts</Typography>
          <FlatList
            data={Object.values(accounts)}
            renderItem={({ item: { id, name, currency } }) => (
              <List.Item
                style={{
                  flexDirection: "row",
                  columnGap: 50,
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle">{name}</Typography>
                <Typography>
                  {balances[id]} {currency}
                </Typography>
              </List.Item>
            )}
          />
        </>
      );
    }
  }

  return <Card style={{ ...styles.root, ...styles.root_list }}>
    {content}
  </Card>;
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: "auto",
      width: "100%",
    },
    root_list: {},
  });

export default Accounts;
