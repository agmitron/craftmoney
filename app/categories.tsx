import { View } from "react-native";
import _ from "lodash";
import { categories } from "../store";
import Select from "~/components/Select";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreMap } from "effector-react";
import { selectCategory } from "~/store/form";
import { Screens } from "./_layout";
import { useEffect, useMemo } from "react";

const Categories: React.FC = () => {
  const route = useRoute();
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

  const onPress = (category: string) => {
    const nested = _categories[category];
    selectCategory(`${currentCategory}.${category}`)

    if (nested !== null) {
      return navigation.navigate(`${route.name}/${category}` as never); // TODO
    }

    return navigation.navigate(Screens.Modal as never);
  };

  const navigation = useNavigation();

  return (
    <View>
      {Object.keys(_categories).map((c) => (
        <Select key={c} title={c} onPress={() => onPress(c)} emoji={"👀"} />
      ))}
    </View>
  );
};

export default Categories;
