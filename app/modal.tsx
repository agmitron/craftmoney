import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Screens } from "./_layout";
import Button from "../components/Button";
import Card from "../components/Card";
import Select from "../components/Select";
import TextField from "../components/TextField";
import { useTheme } from "../components/Themed";
import Typography from "../components/Typography";
import { Theme } from "../constants/theme";

import DatePicker from "~/components/DatePicker";
import * as form from "~/store/form";
import { isFailed } from "~/utils/validation";

interface ActionComponentProps {
  key: string | number;
}

interface Action {
  Component: (props: ActionComponentProps) => React.ReactElement;
}

// TODO: move to a separate component
export default function Modal() {
  const [isButtonHidden, setButtonHidden] = useState(false);
  const theme = useTheme();
  const styles = withTheme(theme);
  const navigation = useNavigation();
  const category = useStore(form.$category);
  const account = useStore(form.$account);
  const type = useStore(form.$type);
  const difference = useStore(form.$difference);
  const isDisabled = useStoreMap(form.$validationResults, isFailed);

  const onTypeChange = (newType: form.TransactionType) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    form.selectType(newType);
  };

  // TODO: make dynamic
  const additionalActions: Action[] = [
    {
      Component: (key) => {
        const [isOpen, setOpen] = useState(false);

        const date = useStoreMap(
          form.$additional,
          ({ timestamp }) => new Date(timestamp)
        );

        return (
          <View key={key} style={styles["additional__list-item"]}>
            <DatePicker
              isOpen={isOpen}
              date={date}
              onConfirm={(date) => {
                form.setAdditional({ timestamp: date.getTime() });
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          </View>
        );
      },
    },
    {
      Component: (key) => {
        return (
          <View
            key={key}
            style={[
              styles["additional__list-item"],
              styles["additional__list-item_last"],
            ]}
          >
            <TextField
              placeholder="Note"
              variant="plain"
              size="small"
              returnKeyLabel="done"
              returnKeyType="done"
              onChangeText={(note) => form.setAdditional({ note })}
            />
          </View>
        );
      },
    },
  ];

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => setButtonHidden(true));
    Keyboard.addListener("keyboardWillHide", () => setButtonHidden(false));

    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  const onSubmit = () => {
    form.submit();
    navigation.navigate(Screens.Home as never); // TODO
    form.reset();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.main}>
            <Typography variant="title">Amount</Typography>
            <TextField
              placeholder="100$"
              size="large"
              decorations={{
                left: (
                  <View style={styles.operation}>
                    <Typography color={theme.colors.typography.secondary}>
                      {type === form.TransactionType.Income ? "+" : "-"}
                    </Typography>
                  </View>
                ),
              }}
              keyboardType="number-pad"
              returnKeyType="done"
              style={styles.input}
              onChangeText={form.setDifference}
              value={difference.toString()}
            />
            <View style={styles.types}>
              <Button
                variant={
                  type === form.TransactionType.Transfer
                    ? "contained"
                    : "outlined"
                }
                onPress={() => onTypeChange(form.TransactionType.Transfer)}
                style={styles.type}
              >
                Transfer
              </Button>
              <Button
                variant={
                  type === form.TransactionType.Income
                    ? "contained"
                    : "outlined"
                }
                onPress={() => onTypeChange(form.TransactionType.Income)}
                style={styles.type}
              >
                Income
              </Button>
              <Button
                variant={
                  type === form.TransactionType.Expense
                    ? "contained"
                    : "outlined"
                }
                onPress={() => onTypeChange(form.TransactionType.Expense)}
                style={styles.type}
              >
                Expense
              </Button>
            </View>
            <Select
              title="Category"
              description={category ?? "Tap to select"}
              style={styles.select}
              onPress={
                () => navigation.navigate(Screens.Categories as never) // TODO: ????
              }
            />
            <Select
              title="Account"
              description={account?.name ?? "Tap to select"}
              style={styles.select}
              onPress={
                () => navigation.navigate(Screens.Accounts as never) // TODO: ????
              }
            />
          </View>
          <View style={styles.additional}>
            <Typography
              color={theme.colors.typography.primary}
              style={styles.additional__title}
            >
              Additional
            </Typography>
            <Card style={styles.card}>
              {additionalActions.map(({ Component }, key) => (
                <Component key={key} />
              ))}
            </Card>
          </View>
        </ScrollView>
        {!isButtonHidden && (
          <View style={{ paddingHorizontal: 17, paddingBottom: 20 }}>
            <Button size="large" onPress={onSubmit} disabled={isDisabled}>
              Add
            </Button>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {},
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
    select: {
      marginTop: 38,
    },
    additional: {
      paddingHorizontal: 17,
      paddingVertical: 30,
      display: "flex",
      flexDirection: "column",
      rowGap: 15,
      flex: 1,
    },
    additional__title: {
      marginLeft: 15,
    },
    card: {
      paddingVertical: 0,
      paddingHorizontal: 15,
    },
    "additional__list-item": {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.surface,
    },
    "additional__list-item_last": {
      borderBottomWidth: 0,
    },
  });
