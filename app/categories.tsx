import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreMap } from "effector-react";
import _ from "lodash";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Screens } from "./_layout";
import { categories } from "../store";

import Select from "~/components/Select";
import { useTheme } from "~/components/Themed";
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
      return navigation.navigate(Screens.Modal as never);
    }

    const nested = _categories[category];
    incomeExpenseForm.selectCategory(`${currentCategory}.${category}`);

    if (nested !== null) {
      return navigation.navigate(`${route.name}/${category}` as never); // TODO
    }

    return navigation.navigate(Screens.Modal as never);
  };

  return (
    <View>
      {currentCategory && (
        <Select
          title={currentCategory}
          onPress={() => onPress(currentCategory, "select")}
          emoji="👍"
        />
      )}
      <View style={styles.separator} />
      {Object.keys(_categories).map((c) => (
        <Select
          key={c}
          title={c}
          onPress={() => onPress(c, "dive")}
          emoji="👀"
        />
      ))}
    </View>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    separator: {
      width: "100%",
      height: 1,
      backgroundColor: "grey",
      display: "flex",
      // marginTop: 50,
      marginBottom: 50,
    },
  });

export default Categories;
