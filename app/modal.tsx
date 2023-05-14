import { SafeAreaView, StyleSheet, Vibration, View } from "react-native";
import { useState } from "react";
import Typography from "../components/Typography";
import * as Haptics from 'expo-haptics';
import Input from "../components/Input";
import { useTheme } from "../components/Themed";
import Button from "../components/Button";
import { Theme } from "../constants/theme";

type TransactionType = "income" | "expense" | "transfer";

// TODO: move to a separate component
export default function Modal() {
  const [type, setType] = useState<TransactionType>("expense");
  const theme = useTheme();
  const styles = withTheme(theme);

  const onTypeChange = (newType: TransactionType) => {
    Haptics.selectionAsync()
    setType(newType);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.main}>
          <Typography variant="title">Amount</Typography>
          <Input
            placeholder="100$"
            decorations={{
              left: (
                <View style={styles.operation}>
                  <Typography color={theme.colors.typography.secondary}>
                    {type === "income" ? "+" : "-"}
                  </Typography>
                </View>
              ),
            }}
            keyboardType="number-pad"
            returnKeyType="done"
            style={styles.input}
          />
          <View style={styles.types}>
            <Button
              variant={type === "transfer" ? "contained" : "outlined"}
              onPress={() => onTypeChange("transfer")}
              style={styles.type}
            >
              Transfer
            </Button>
            <Button
              variant={type === "income" ? "contained" : "outlined"}
              onPress={() => onTypeChange("income")}
              style={styles.type}
            >
              Income
            </Button>
            <Button
              variant={type === "expense" ? "contained" : "outlined"}
              onPress={() => onTypeChange("expense")}
              style={styles.type}
            >
              Expense
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const withTheme = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    operation: {
      marginLeft: 23,
    },
    input: {
      marginTop: 13,
    },
    types: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 18,
      columnGap: 4,
    },
    type: {
      flex: 1,
    },
    main: {
      backgroundColor: t.colors.background,
      paddingHorizontal: 17,
      paddingVertical: 28,
    },
  });
