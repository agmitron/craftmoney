import "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreMap } from "effector-react";
import _ from "lodash";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Screens } from "./navigation";
import { appearance, categories } from "../store";

import Button from "~/components/Button";
import Select from "~/components/Select";
import { useTheme } from "~/components/Themed";
import Typography from "~/components/Typography";
import { Theme } from "~/constants/theme";
import { incomeExpenseForm } from "~/store/forms/transaction";

const Categories: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = withTheme(theme);
  const currentCategory = useMemo(() => {
    const [root, ...rest] = route.name.split("/");
    if (root === "categories") {
      return rest.join(".");
    }

    return [root, ...rest].join(".") || null;
  }, [route]);

  const emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ categories }) => categories
  );

  const _categories = useStoreMap(categories.$categories, (categories) => {
    if (!currentCategory) {
      return categories;
    }

    const result = _.get(categories, currentCategory);
    return result ?? {};
  });

  const onPress = (category: string, action: "select" | "dive") => {
    if (action === "select") {
      incomeExpenseForm.selectCategory(category);
      return navigation.navigate(Screens.TransactionsCreate as never);
    }

    const nested = _categories[category];
    incomeExpenseForm.selectCategory(`${currentCategory}.${category}`);

    if (nested !== null) {
      return navigation.navigate(`${route.name}/${category}` as never); // TODO
    }

    return navigation.navigate(Screens.TransactionsCreate as never);
  };

  return (
    <View style={styles.root}>
      {currentCategory && (
        <Select
          title={currentCategory}
          onPress={() => onPress(currentCategory, "select")}
          emoji={emoji[currentCategory] ?? "⚠️"}
          style={{ backgroundColor: "white", borderRadius: 10 }} // TODO
        />
      )}
      {currentCategory && <Typography>Subcategories</Typography>}
      {Object.keys(_categories).map((c) => {
        const subcategories = Object.keys(_categories?.[c] ?? {});
        return (
          <Select
            key={c}
            title={c}
            onPress={() => onPress(c, "dive")}
            emoji={emoji[c] ?? "⚠️"}
            style={{ backgroundColor: "white", borderRadius: 10 }} // TODO
            description={subcategories.join("•")}
          />
        );
      })}
    </View>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      rowGap: 20,
      paddingHorizontal: 15,
      paddingVertical: 15,
    },
    separator: {
      width: "100%",
      height: 1,
      backgroundColor: "grey",
      display: "flex",
      marginBottom: 50,
    },
  });

export default Categories;
