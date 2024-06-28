import React, { useState } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";

import CardComponent from "~/components/Card";
import { useTheme } from "~/components/Themed";
import Typography from "~/components/Typography";
import { Theme } from "~/constants/theme";
import { Balances, Accounts } from "~/entities/types";

interface Props {
  accounts: Accounts;
  balances: Balances;
}

const sizes = {
  width: 300,
  height: 300,
};

export const Card: React.FC<Props> = ({ accounts, balances }) => {
  const [cardWidth, setCardWidth] = useState(0);
  const theme = useTheme();
  const styles = withTheme(theme, cardWidth);

  return (
    <View style={styles.root}>
      {Object.values(accounts).map((account) => (
        <CardComponent style={styles.card}>
          <ImageBackground
            source={{
              uri: "https://img.freepik.com/free-vector/gradient-blue-background_23-2149331346.jpg",
              ...sizes,
            }}
            imageStyle={styles.background}
            resizeMode="cover"
            onLayout={({
              nativeEvent: {
                layout: { width },
              },
            }) => setCardWidth(width)}
          >
            <View style={styles.content}>
              <Typography variant="text" color="white" style={styles.name}>
                {account.name}
              </Typography>
              <Typography variant="text" color="white" style={styles.balance}>
                {balances[account.id]} {account.currency}
              </Typography>
            </View>
          </ImageBackground>
        </CardComponent>
      ))}
    </View>
  );
};

const withTheme = (t: Theme, cardWidth: number) => {
  return StyleSheet.create({
    root: {
      flex: 1,
      width: "100%",
      padding: t.spacing,
    },
    card: {
      width: "100%",
      height: cardWidth / 1.75,
      flex: 1,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderRadius: t.borderRadius,
    },
    background: {
      borderRadius: t.borderRadius,
    },
    content: {
      padding: 15,
      height: "100%",
      width: "100%",
    },
    name: {
      fontWeight: "bold",
    },
    balance: {
      fontWeight: "bold",
      fontSize: 40,
      marginTop: 20,
    },
  });
};
