import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Screens } from "./_layout";

import Button from "~/components/Button";
import TextField from "~/components/TextField";
import { useTheme } from "~/components/Themed";
import { Theme } from "~/constants/theme";
import * as form from "~/store/forms/account.create";
import { isFailed } from "~/utils/validation";

const CreateAccount = () => {
  const theme = useTheme();
  const styles = withTheme(theme);
  const navigation = useNavigation();

  const name = useStore(form.$name);
  const currency = useStore(form.$currency);
  const isDisabled = useStoreMap(form.$validation, isFailed);

  const onSubmit = () => {
    form.submit();
    navigation.navigate(Screens.Home as never);
    form.clear();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.root}>
            <TextField
              variant="filled"
              placeholder="Account's name"
              size="large"
              keyboardType="number-pad"
              returnKeyType="done"
              onChangeText={form.setName}
              value={name}
            />
            <TextField
              placeholder="Account's currency"
              size="large"
              onChangeText={form.setCurrency}
              value={currency}
            />

            <Button size="large" onPress={onSubmit} disabled={isDisabled}>
              Create
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      backgroundColor: t.colors.background,
      rowGap: 20,
      height: "100%",
      padding: 20,
    },
  });

export default CreateAccount;
