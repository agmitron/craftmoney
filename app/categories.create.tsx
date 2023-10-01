import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
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
import * as form from "~/store/forms/categories.create";
import { isFailed } from "~/utils/validation";

const CreateCategory = () => {
  const theme = useTheme();
  const styles = withTheme(theme);
  const navigation = useNavigation();

  const name = useStore(form.$name);
  const parent = useStore(form.$parent);
  const emoji = useStore(form.$emoji);
  const isDisabled = useStoreMap(form.$validation, isFailed);

  const route =
    useRoute<RouteProp<RootStackParamList, Screens.CategoriesCreate>>();

  useEffect(() => {
    if (route?.params?.parent) {
      const parent = route?.params?.parent.replaceAll("/", ".");
      form.setParent(parent);
    }
  }, [route.params]);

  const onSubmit = () => {
    form.submit();
    navigation.navigate(Screens.Categories as never);
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
              placeholder="Name"
              size="large"
              keyboardType="default"
              returnKeyType="done"
              onChangeText={form.setName}
              value={name}
            />
            {/* TODO: Make select */}
            <TextField
              placeholder="Parent category"
              size="large"
              onChangeText={form.setParent}
              value={parent}
            />

            <TextField
              placeholder="Emoji"
              size="large"
              onChangeText={form.setEmoji}
              value={emoji}
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

export default CreateCategory;
