import "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useStore } from "effector-react";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { RootStackParamList, Screens } from "./navigation";

import Button from "~/components/Button";
import TextField from "~/components/TextField";
import { useTheme } from "~/components/Themed";
import { Theme } from "~/constants/theme";
import { accounts } from "~/store";
import * as form from "~/store/forms/account.edit";

const EditAccount = () => {
  const theme = useTheme();
  const styles = withTheme(theme);
  const navigation = useNavigation();

  const name = useStore(form.$name);
  const currency = useStore(form.$currency);

  const route = useRoute<RouteProp<RootStackParamList, Screens.AccountsEdit>>();

  useEffect(() => {
    if (route.params?.id === undefined) {
      throw new Error(`Account id is not provided`);
    }

    form.init(route.params.id);
  }, [route.params]);

  const save = () => {
    if (route.params?.id === undefined) {
      throw new Error(`Account id is not provided`);
    }

    form.submit(route.params.id);
    navigation.navigate(Screens.Home as never);
  };

  const remove = () => {
    if (!route.params?.id) {
      throw new Error(`Account id is not provided`);
    }

    accounts.remove(route.params.id);
    navigation.navigate(Screens.Home as never);
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

            <Button size="large" variant="outlined" onPress={remove}>
              Delete
            </Button>

            <Button size="large" onPress={save}>
              Save
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

export default EditAccount;
