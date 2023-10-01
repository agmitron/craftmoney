import { useNavigation } from "@react-navigation/native";
import { Store } from "effector";
import { useStore, useStoreMap } from "effector-react";
import * as Haptics from "expo-haptics";
import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Keyboard,
  StyleSheet,
} from "react-native";

import { Screens } from "./navigation";

import Button from "~/components/Button";
import Card from "~/components/Card";
import DatePicker from "~/components/DatePicker";
import Select from "~/components/Select";
import TextField from "~/components/TextField";
import { useTheme } from "~/components/Themed";
import Typography from "~/components/Typography";
import { Theme } from "~/constants/theme";
import { appearance, categories } from "~/store";
import {
  $type,
  TransactionType,
  incomeExpenseForm,
  selectType,
  transferForm,
} from "~/store/forms/transaction";
import { Additional } from "~/store/types";
import { flattenCategories } from "~/utils/categories";
import { isFailed } from "~/utils/validation";

interface ActionComponentProps {
  key: string | number;
}

interface Action {
  Component: (props: ActionComponentProps) => React.ReactElement;
}

// TODO: make dynamic
const useAdditionalActions = (
  setAdditional: (value: Omit<Additional, "timestamp">) => void,
  $additional: Store<Additional>
) => {
  const theme = useTheme();
  const styles = withTheme(theme);

  const additionalActions: Action[] = [
    {
      Component: () => {
        const [isOpen, setOpen] = useState(false);

        const date = useStoreMap(
          $additional,
          ({ timestamp }) => new Date(timestamp)
        );

        return (
          <View style={styles["additional__list-item"]}>
            <DatePicker
              isOpen={isOpen}
              date={date}
              onConfirm={(date) => {
                setAdditional({ timestamp: date.getTime() });
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          </View>
        );
      },
    },
    {
      Component: () => {
        const note = useStoreMap($additional, ({ note }) => note);

        return (
          <View
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
              onChangeText={(note) => setAdditional({ note })}
              value={note}
            />
          </View>
        );
      },
    },
  ];

  return additionalActions;
};

export const TransferForm = () => {
  const [isButtonHidden, setButtonHidden] = useState(false);
  const theme = useTheme();
  const styles = withTheme(theme);
  const navigation = useNavigation();
  const from = useStore(transferForm.$from);
  const to = useStore(transferForm.$to);
  const type = useStore($type);
  const amount = useStore(transferForm.$amount);
  const isDisabled = useStoreMap(transferForm.$validation, isFailed);
  const validation = useStore(transferForm.$validation);

  const onTypeChange = (newType: TransactionType) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    selectType(newType);
  };

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => setButtonHidden(true));
    Keyboard.addListener("keyboardWillHide", () => setButtonHidden(false));

    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  const onSubmit = () => {
    transferForm.submit();
    navigation.navigate(Screens.Home as never); // TODO
    transferForm.reset();
  };

  const additionalActions = useAdditionalActions(
    transferForm.setAdditional,
    transferForm.$additional
  );

  return (
    <>
      <View style={styles.main}>
        <Typography variant="title">Amount</Typography>
        <TextField
          placeholder="100$"
          size="large"
          decorations={{
            left: (
              <View style={styles.operation}>
                <Typography color={theme.colors.typography.secondary}>
                  {type === TransactionType.Income ? "+" : "-"}
                </Typography>
              </View>
            ),
            right: (
              <>
                {!validation.amount && (
                  <Typography color="red" style={{ marginRight: 20 }}>
                    {transferForm.errorMessages.amount}
                  </Typography>
                )}
              </>
            ),
          }}
          keyboardType="number-pad"
          returnKeyType="done"
          style={styles.input}
          onChangeText={transferForm.setAmount}
          value={amount.toString()}
        />

        <View style={styles.types}>
          <Button
            variant={
              type === TransactionType.Transfer ? "contained" : "outlined"
            }
            onPress={() => onTypeChange(TransactionType.Transfer)}
            style={styles.type}
          >
            Transfer
          </Button>
          <Button
            variant={type === TransactionType.Income ? "contained" : "outlined"}
            onPress={() => onTypeChange(TransactionType.Income)}
            style={styles.type}
          >
            Income
          </Button>
          <Button
            variant={
              type === TransactionType.Expense ? "contained" : "outlined"
            }
            onPress={() => onTypeChange(TransactionType.Expense)}
            style={styles.type}
          >
            Expense
          </Button>
        </View>

        <Select
          title="From"
          description={from?.name ?? "Tap to select"}
          style={styles.select}
          onPress={
            () =>
              navigation.navigate(`${Screens.Accounts}/transfer/from` as never) // TODO: ????
          }
          decoration={
            <>
              {!validation.from && (
                <Typography color="red">
                  {transferForm.errorMessages.from}
                </Typography>
              )}
            </>
          }
        />

        <Select
          title="To"
          description={to?.name ?? "Tap to select"}
          style={styles.select}
          onPress={
            () =>
              navigation.navigate(`${Screens.Accounts}/transfer/to` as never) // TODO: ????
          }
          decoration={
            <>
              {!validation.to && (
                <Typography color="red">
                  {transferForm.errorMessages.to}
                </Typography>
              )}
            </>
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
      {!validation.additional && (
        <Typography color="red">
          {transferForm.errorMessages.additional}
        </Typography>
      )}

      {!isButtonHidden && (
        <View style={{ paddingHorizontal: 17, paddingBottom: 20 }}>
          <Button size="large" onPress={onSubmit} disabled={isDisabled}>
            Add
          </Button>
        </View>
      )}
    </>
  );
};

export const IncomeExpenseForm = () => {
  const [isButtonHidden, setButtonHidden] = useState(false);
  const theme = useTheme();
  const styles = withTheme(theme);
  const navigation = useNavigation();
  const category = useStore(incomeExpenseForm.$category);
  const account = useStore(incomeExpenseForm.$account);
  const emoji = useStore(appearance.Emoji.$emoji);
  const type = useStore($type);
  const amount = useStore(incomeExpenseForm.$amount);
  const isDisabled = useStoreMap(incomeExpenseForm.$validation, isFailed);
  const validation = useStore(incomeExpenseForm.$validation);

  // const categoriesScreens = useStoreMap(categories.$categories, (categories) =>
  //   Object.keys(flattenCategories(categories, "", {}, "/")),
  // );

  const onTypeChange = (newType: TransactionType) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    selectType(newType);
  };

  const additionalActions = useAdditionalActions(
    incomeExpenseForm.setAdditional,
    incomeExpenseForm.$additional
  );

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => setButtonHidden(true));
    Keyboard.addListener("keyboardWillHide", () => setButtonHidden(false));

    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  const onSubmit = () => {
    incomeExpenseForm.submit();
    navigation.navigate(Screens.Home as never); // TODO
    incomeExpenseForm.reset();
  };

  return (
    <>
      <View style={styles.main}>
        <Typography variant="title">Amount</Typography>
        <TextField
          placeholder="100$"
          size="large"
          decorations={{
            left: (
              <View style={styles.operation}>
                <Typography color={theme.colors.typography.secondary}>
                  {type === TransactionType.Income ? "+" : "-"}
                </Typography>
              </View>
            ),
            right: (
              <>
                {!validation.amount && (
                  <Typography color="red" style={{ marginRight: 20 }}>
                    {incomeExpenseForm.errorsMessages.amount}
                  </Typography>
                )}
              </>
            ),
          }}
          keyboardType="number-pad"
          returnKeyType="done"
          style={styles.input}
          onChangeText={incomeExpenseForm.setAmount}
          value={amount.toString()}
        />

        <View style={styles.types}>
          <Button
            variant={
              type === TransactionType.Transfer ? "contained" : "outlined"
            }
            onPress={() => onTypeChange(TransactionType.Transfer)}
            style={styles.type}
          >
            Transfer
          </Button>
          <Button
            variant={type === TransactionType.Income ? "contained" : "outlined"}
            onPress={() => onTypeChange(TransactionType.Income)}
            style={styles.type}
          >
            Income
          </Button>
          <Button
            variant={
              type === TransactionType.Expense ? "contained" : "outlined"
            }
            onPress={() => onTypeChange(TransactionType.Expense)}
            style={styles.type}
          >
            Expense
          </Button>
        </View>
        <Select
          title="Category"
          description={category ?? "Tap to select"}
          emoji={emoji.categories?.[category ?? ""] ?? "❔"}
          style={styles.select}
          onPress={
            () => navigation.navigate(Screens.Categories as never) // TODO: ????
          }
          decoration={
            <>
              {!validation.category && (
                <Typography color="red">
                  {incomeExpenseForm.errorsMessages.category}
                </Typography>
              )}
            </>
          }
        />

        <Select
          title="Account"
          description={account?.name ?? "Tap to select"}
          emoji={emoji.accounts?.[account?.id ?? ""] ?? "❔"}
          style={styles.select}
          onPress={
            () => navigation.navigate(Screens.Accounts as never) // TODO: ????
          }
          decoration={
            <>
              {!validation.account && (
                <Typography color="red">
                  {incomeExpenseForm.errorsMessages.account}
                </Typography>
              )}
            </>
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
      {!validation.additional && (
        <Typography color="red">
          {incomeExpenseForm.errorsMessages.additional}
        </Typography>
      )}

      {!isButtonHidden && (
        <View style={{ paddingHorizontal: 17, paddingBottom: 20 }}>
          <Button size="large" onPress={onSubmit} disabled={isDisabled}>
            Add
          </Button>
        </View>
      )}
    </>
  );
};

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

const CreateTransaction = () => {
  const type = useStore($type);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          {type === TransactionType.Transfer ? (
            <TransferForm />
          ) : (
            <IncomeExpenseForm />
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateTransaction;
